"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { skillCategories } from "@/data/skills";

interface SkillNode3D {
  name: string;
  category: string;
  color: string;
  x3d: number;
  y3d: number;
  z3d: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface ProjectedNode extends SkillNode3D {
  x: number;
  y: number;
  z3d: number;
  scale: number;
  opacity: number;
}

// Spatially clusters technologies around category centers on a unit 3D sphere
function build3DNodes(): SkillNode3D[] {
  const nodes: SkillNode3D[] = [];

  // Spaced category coordinates on unit sphere
  const categoryCenters: Record<string, { x: number; y: number; z: number }> = {
    frontend: { x: 0.577, y: 0.577, z: 0.577 },
    backend: { x: -0.577, y: -0.577, z: 0.577 },
    database: { x: -0.577, y: 0.577, z: -0.577 },
    tools: { x: 0.577, y: -0.577, z: -0.577 },
  };

  skillCategories.forEach((cat) => {
    const center = categoryCenters[cat.id] || { x: 0, y: 0, z: 1 };
    
    // Orthogonal vectors tangent to the sphere surface at category center
    const cz = center;
    const temp = Math.abs(cz.x) > 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
    
    const cx = {
      x: cz.y * temp.z - cz.z * temp.y,
      y: cz.z * temp.x - cz.x * temp.z,
      z: cz.x * temp.y - cz.y * temp.x,
    };
    const cxLen = Math.sqrt(cx.x * cx.x + cx.y * cx.y + cx.z * cx.z);
    cx.x /= cxLen;
    cx.y /= cxLen;
    cx.z /= cxLen;

    const cy = {
      x: cz.y * cx.z - cz.z * cx.y,
      y: cz.z * cx.x - cz.x * cx.z,
      z: cz.x * cx.y - cz.y * cx.x,
    };

    cat.skills.forEach((skill, si) => {
      const angle = (si / cat.skills.length) * Math.PI * 2;
      const radius = 0.35 + (si % 2) * 0.12;

      // Displacement around cluster center
      const nodeX = cz.x + (cx.x * Math.cos(angle) + cy.x * Math.sin(angle)) * radius;
      const nodeY = cz.y + (cx.y * Math.cos(angle) + cy.y * Math.sin(angle)) * radius;
      const nodeZ = cz.z + (cx.z * Math.cos(angle) + cy.z * Math.sin(angle)) * radius;

      // Project back onto unit sphere surface
      const len = Math.sqrt(nodeX * nodeX + nodeY * nodeY + nodeZ * nodeZ);
      
      nodes.push({
        name: skill.name,
        category: cat.id,
        color: cat.color,
        x3d: nodeX / len,
        y3d: nodeY / len,
        z3d: nodeZ / len,
        x: 50,
        y: 50,
        scale: 1,
        opacity: 1
      });
    });
  });

  return nodes;
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // Refs for tracking 3D rotation coordinates
  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const rotX = useRef(0.35); // initial default tilt
  const rotY = useRef(0.45); // initial default spin
  const rotVelocity = useRef({ x: 0.0004, y: 0.0016 });
  const initialNodes = useRef<SkillNode3D[]>([]);

  // Setup client-side 3D render state
  const [renderedNodes, setRenderedNodes] = useState<ProjectedNode[]>([]);

  // Perspective parameters
  const R = 34; // Sphere radius in SVG space
  const D = 2.2; // Camera distance

  useEffect(() => {
    initialNodes.current = build3DNodes();

    let frameId: number;

    const tick = () => {
      // Automatic drift rotation in background
      if (!isDragging.current) {
        rotY.current += rotVelocity.current.y;
        rotX.current += rotVelocity.current.x;
        // Slowly ease velocity back to dynamic drift speed
        rotVelocity.current.y += (0.0016 - rotVelocity.current.y) * 0.05;
        rotVelocity.current.x += (0.0004 - rotVelocity.current.x) * 0.05;
      }

      const cosX = Math.cos(rotX.current);
      const sinX = Math.sin(rotX.current);
      const cosY = Math.cos(rotY.current);
      const sinY = Math.sin(rotY.current);

      const projected = initialNodes.current.map((node) => {
        // Rotate around X-axis
        const y1 = node.y3d * cosX - node.z3d * sinX;
        const z1 = node.y3d * sinX + node.z3d * cosX;
        const x1 = node.x3d;

        // Rotate around Y-axis
        const x2 = x1 * cosY + z1 * sinY;
        const z2 = -x1 * sinY + z1 * cosY;
        const y2 = y1;

        // 3D Perspective Projection
        const factor = D / (D - z2);
        const x = 50 + x2 * R * factor;
        const y = 50 + y2 * R * factor;

        const scale = factor;
        const opacity = 0.15 + 0.85 * ((z2 + 1) / 2);

        return {
          ...node,
          x,
          y,
          z3d: z2,
          scale,
          opacity
        };
      });

      setRenderedNodes(projected);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - startMouse.current.x;
      const deltaY = e.clientY - startMouse.current.y;

      rotVelocity.current = {
        x: -deltaY * 0.0003,
        y: deltaX * 0.0003
      };

      rotX.current = startRot.current.x - deltaY * 0.005;
      rotY.current = startRot.current.y + deltaX * 0.005;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    setDragging(true);
    startMouse.current = { x: e.clientX, y: e.clientY };
    startRot.current = { x: rotX.current, y: rotY.current };
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative bg-transparent py-32 px-8"
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[1px] bg-secondary/60" />
            <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
              03 — Skills
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
          >
            Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="font-sans text-sm text-white/70 mt-3 max-w-md"
          >
            The technologies I use to build products that scale.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-16 items-center">
          {/* Interactive Constellation 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
            onMouseDown={handleMouseDown}
            style={{ cursor: dragging ? "grabbing" : "grab" }}
            className="relative aspect-square max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden select-none"
          >
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
            />

            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* 3D Depth-sorted Connection Lines */}
              {renderedNodes.map((node) =>
                renderedNodes
                  .filter((other) => other.category === node.category && other.name > node.name)
                  .map((other) => {
                    const isGroupHovered = hoveredCategory === node.category;
                    const isNodeHovered = hoveredNode === node.name || hoveredNode === other.name;
                    const isActive = isGroupHovered || isNodeHovered;
                    const isDimmed = (hoveredCategory || hoveredNode) && !isActive;

                    const avgZ = (node.z3d + other.z3d) / 2;
                    const depthOpacity = 0.15 + 0.85 * ((avgZ + 1) / 2);

                    const baseOpacity = isNodeHovered ? 0.7 : isGroupHovered ? 0.4 : 0.1;
                    const finalOpacity = isDimmed ? 0.02 : baseOpacity * depthOpacity;

                    return (
                      <line
                        key={`line-${node.name}-${other.name}`}
                        x1={node.x}
                        y1={node.y}
                        x2={other.x}
                        y2={other.y}
                        stroke={node.color}
                        strokeWidth={isActive ? "0.2" : "0.1"}
                        strokeOpacity={finalOpacity}
                        style={{
                          transition: "stroke-opacity 0.3s, stroke-width 0.3s",
                        }}
                      />
                    );
                  })
              )}

              {/* 3D Depth-sorted Nodes */}
              {[...renderedNodes]
                .sort((a, b) => a.z3d - b.z3d)
                .map((node) => {
                  const isCatHovered = hoveredCategory === node.category;
                  const isNodeHovered = hoveredNode === node.name;
                  const isActive = isCatHovered || isNodeHovered;
                  const isDimmed = (hoveredCategory || hoveredNode) && !isActive;

                  const dotRadius = (isNodeHovered ? 1.4 : isActive ? 1.0 : 0.7) * node.scale;
                  const finalOpacity = isDimmed ? 0.15 : node.opacity;

                  return (
                    <g
                      key={`node-${node.name}`}
                      onMouseEnter={() => {
                        setHoveredNode(node.name);
                        setHoveredCategory(node.category);
                      }}
                      onMouseLeave={() => {
                        setHoveredNode(null);
                        setHoveredCategory(null);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Outer glow ring on hover */}
                      {isActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={dotRadius * 1.8}
                          fill="none"
                          stroke={node.color}
                          strokeWidth="0.25"
                          strokeOpacity={isNodeHovered ? 0.5 : 0.25}
                        />
                      )}
                      {/* Core dot */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={dotRadius}
                        fill={node.color}
                        fillOpacity={finalOpacity}
                        style={{ transition: "fill-opacity 0.3s" }}
                      />
                      {/* Label - fade and scale with depth */}
                      {(isNodeHovered || (node.z3d > 0.15 && !isDimmed)) && (
                        <text
                          x={node.x}
                          y={node.y - dotRadius - 1.2}
                          textAnchor="middle"
                          fontSize={isNodeHovered ? "2.2" : "1.7"}
                          fill="white"
                          fillOpacity={isNodeHovered ? 1.0 : 0.7 * ((node.z3d + 1) / 2)}
                          fontFamily="monospace"
                          style={{
                            pointerEvents: "none",
                            userSelect: "none",
                            transition: "fill-opacity 0.3s, font-size 0.2s"
                          }}
                        >
                          {node.name}
                        </text>
                      )}
                    </g>
                  );
                })}
            </svg>

            {/* Drag to spin tip overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-40">
              <span className="font-mono text-[6px] tracking-[0.25em] uppercase text-white">Interactive 3D Sphere</span>
              <span className="font-mono text-[6px] tracking-[0.25em] uppercase text-white">Click & Drag to Spin</span>
            </div>
          </motion.div>

          {/* Category legend */}
          <div className="space-y-4">
            <div className="font-mono text-[8px] tracking-[0.3em] text-white/60 uppercase mb-8">
              Categories
            </div>
            {skillCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08 }}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between py-4 border-b border-white/[0.05] hover:border-white/10 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                      style={{
                        background: cat.color,
                        boxShadow: hoveredCategory === cat.id ? `0 0 8px ${cat.color}` : "none"
                      }}
                    />
                    <span
                      className="font-sans text-sm transition-colors duration-300 font-medium"
                      style={{ color: hoveredCategory === cat.id ? cat.color : "rgba(255,255,255,0.85)" }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[160px]">
                    {cat.skills.map(skill => (
                      <span
                        key={skill.name}
                        className="font-mono text-[8px] text-white/75 group-hover:text-white/95 transition-colors"
                      >
                        {skill.name}
                      </span>
                    )).reduce((acc, el, i, arr) => (
                      i < arr.length - 1
                        ? [...acc, el, <span key={`sep-${i}`} className="text-white/15">,&nbsp;</span>]
                        : [...acc, el]
                    ), [] as React.ReactNode[])}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
