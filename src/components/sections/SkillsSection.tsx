"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, useInView } from "framer-motion";
import { skillCategories } from "@/data/skills";

interface SkillNode3D {
  name: string;
  category: string;
  color: string;
  x3d: number;
  y3d: number;
  z3d: number;
}

// ─── Hoisted to module level — built once, never rebuilt ───────────────────
function build3DNodes(): SkillNode3D[] {
  const nodes: SkillNode3D[] = [];

  const categoryCenters: Record<string, { x: number; y: number; z: number }> = {
    frontend: { x: 0.577, y: 0.577, z: 0.577 },
    backend: { x: -0.577, y: -0.577, z: 0.577 },
    database: { x: -0.577, y: 0.577, z: -0.577 },
    tools: { x: 0.577, y: -0.577, z: -0.577 },
  };

  skillCategories.forEach((cat) => {
    const center = categoryCenters[cat.id] || { x: 0, y: 0, z: 1 };
    const cz = center;
    const temp = Math.abs(cz.x) > 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };

    const cx = {
      x: cz.y * temp.z - cz.z * temp.y,
      y: cz.z * temp.x - cz.x * temp.z,
      z: cz.x * temp.y - cz.y * temp.x,
    };
    const cxLen = Math.sqrt(cx.x * cx.x + cx.y * cx.y + cx.z * cx.z);
    cx.x /= cxLen; cx.y /= cxLen; cx.z /= cxLen;

    const cy = {
      x: cz.y * cx.z - cz.z * cx.y,
      y: cz.z * cx.x - cz.x * cx.z,
      z: cz.x * cx.y - cz.y * cx.x,
    };

    cat.skills.forEach((skill, si) => {
      const angle = (si / cat.skills.length) * Math.PI * 2;
      const radius = 0.35 + (si % 2) * 0.12;

      const nodeX = cz.x + (cx.x * Math.cos(angle) + cy.x * Math.sin(angle)) * radius;
      const nodeY = cz.y + (cx.y * Math.cos(angle) + cy.y * Math.sin(angle)) * radius;
      const nodeZ = cz.z + (cx.z * Math.cos(angle) + cy.z * Math.sin(angle)) * radius;

      const len = Math.sqrt(nodeX * nodeX + nodeY * nodeY + nodeZ * nodeZ);

      nodes.push({
        name: skill.name,
        category: cat.id,
        color: cat.color,
        x3d: nodeX / len,
        y3d: nodeY / len,
        z3d: nodeZ / len,
      });
    });
  });

  return nodes;
}

// Compute connection pairs once at module load
const STATIC_NODES = build3DNodes();
const CONNECTION_PAIRS: Array<{ a: number; b: number; color: string }> = [];
for (let i = 0; i < STATIC_NODES.length; i++) {
  for (let j = i + 1; j < STATIC_NODES.length; j++) {
    if (STATIC_NODES[i].category === STATIC_NODES[j].category) {
      CONNECTION_PAIRS.push({ a: i, b: j, color: STATIC_NODES[i].color });
    }
  }
}

const R = 34;
const D = 2.2;

// ─── Category Legend is static — wrap in memo so it never re-renders ────────
const CategoryLegend = memo(function CategoryLegend({
  hoveredCategory,
  onHover,
}: {
  hoveredCategory: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="font-mono text-[8px] tracking-[0.3em] text-white/60 uppercase mb-8">
        Categories
      </div>
      {skillCategories.map((cat) => (
        <div
          key={cat.id}
          onMouseEnter={() => onHover(cat.id)}
          onMouseLeave={() => onHover(null)}
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
              {cat.skills.map((skill, i) => (
                <span key={skill.name} className="font-mono text-[8px] text-white/75 group-hover:text-white/95 transition-colors">
                  {skill.name}{i < cat.skills.length - 1 ? ",\u00a0" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// ─── Imperative Globe — zero React state in the animation loop ───────────────
function GlobeCanvas({
  hoveredCategory,
  hoveredNode,
  onNodeHover,
}: {
  hoveredCategory: string | null;
  hoveredNode: string | null;
  onNodeHover: (node: string | null, cat: string | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineEls = useRef<SVGLineElement[]>([]);
  const circleEls = useRef<SVGCircleElement[]>([]);
  const glowEls = useRef<SVGCircleElement[]>([]);
  const textEls = useRef<SVGTextElement[]>([]);
  const groupEls = useRef<SVGGElement[]>([]);

  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const rotX = useRef(0.35);
  const rotY = useRef(0.45);
  const rotVelocity = useRef({ x: 0.0004, y: 0.0016 });
  const frameId = useRef(0);

  // Expose interaction state via refs to avoid closing over stale state
  const hoveredCatRef = useRef(hoveredCategory);
  const hoveredNodeRef = useRef(hoveredNode);
  useEffect(() => { hoveredCatRef.current = hoveredCategory; }, [hoveredCategory]);
  useEffect(() => { hoveredNodeRef.current = hoveredNode; }, [hoveredNode]);

  // Build SVG DOM imperatively once on mount
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // ── Lines ──────────────────────────────────────────────────────────────
    const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    CONNECTION_PAIRS.forEach(({ color }) => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", "0.1");
      line.setAttribute("stroke-opacity", "0.1");
      lineGroup.appendChild(line);
      lineEls.current.push(line);
    });
    svg.appendChild(lineGroup);

    // ── Nodes ──────────────────────────────────────────────────────────────
    const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    STATIC_NODES.forEach((node, i) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.style.cursor = "pointer";

      const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      glow.setAttribute("fill", "none");
      glow.setAttribute("stroke", node.color);
      glow.setAttribute("stroke-width", "0.25");
      glow.setAttribute("stroke-opacity", "0");
      g.appendChild(glow);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("fill", node.color);
      g.appendChild(circle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-family", "monospace");
      text.style.pointerEvents = "none";
      text.style.userSelect = "none";
      text.textContent = node.name;
      g.appendChild(text);

      // Hover events on the group
      g.addEventListener("mouseenter", () => onNodeHover(node.name, node.category));
      g.addEventListener("mouseleave", () => onNodeHover(null, null));

      nodeGroup.appendChild(g);
      groupEls.current.push(g);
      glowEls.current.push(glow);
      circleEls.current.push(circle);
      textEls.current.push(text);
    });
    svg.appendChild(nodeGroup);

    // ── Animation loop — writes directly to DOM, zero React state ─────────
    const tick = () => {
      if (!isDragging.current) {
        rotY.current += rotVelocity.current.y;
        rotX.current += rotVelocity.current.x;
        rotVelocity.current.y += (0.0016 - rotVelocity.current.y) * 0.05;
        rotVelocity.current.x += (0.0004 - rotVelocity.current.x) * 0.05;
      }

      const cosX = Math.cos(rotX.current);
      const sinX = Math.sin(rotX.current);
      const cosY = Math.cos(rotY.current);
      const sinY = Math.sin(rotY.current);

      const hCat = hoveredCatRef.current;
      const hNode = hoveredNodeRef.current;
      const hasHover = !!(hCat || hNode);

      // Project all nodes
      const px = new Float32Array(STATIC_NODES.length);
      const py = new Float32Array(STATIC_NODES.length);
      const pz = new Float32Array(STATIC_NODES.length);
      const pscale = new Float32Array(STATIC_NODES.length);
      const popacity = new Float32Array(STATIC_NODES.length);

      for (let i = 0; i < STATIC_NODES.length; i++) {
        const n = STATIC_NODES[i];
        const y1 = n.y3d * cosX - n.z3d * sinX;
        const z1 = n.y3d * sinX + n.z3d * cosX;
        const x2 = n.x3d * cosY + z1 * sinY;
        const z2 = -n.x3d * sinY + z1 * cosY;

        const factor = D / (D - z2);
        px[i] = 50 + x2 * R * factor;
        py[i] = 50 + y1 * R * factor;
        pz[i] = z2;
        pscale[i] = factor;
        popacity[i] = 0.15 + 0.85 * ((z2 + 1) / 2);
      }

      // Update lines
      for (let li = 0; li < CONNECTION_PAIRS.length; li++) {
        const { a, b } = CONNECTION_PAIRS[li];
        const line = lineEls.current[li];
        line.setAttribute("x1", px[a].toFixed(2));
        line.setAttribute("y1", py[a].toFixed(2));
        line.setAttribute("x2", px[b].toFixed(2));
        line.setAttribute("y2", py[b].toFixed(2));

        const nodeA = STATIC_NODES[a];
        const avgZ = (pz[a] + pz[b]) / 2;
        const depthOpacity = 0.15 + 0.85 * ((avgZ + 1) / 2);
        const isActive = hCat === nodeA.category || hNode === nodeA.name || hNode === STATIC_NODES[b].name;
        const isDimmed = hasHover && !isActive;
        const baseOpacity = isActive ? (hNode ? 0.7 : 0.4) : 0.1;
        line.setAttribute("stroke-opacity", (isDimmed ? 0.02 : baseOpacity * depthOpacity).toFixed(3));
        line.setAttribute("stroke-width", isActive ? "0.2" : "0.1");
      }

      // Sort indices by depth for painter's algorithm
      const sortedIdx = Array.from({ length: STATIC_NODES.length }, (_, i) => i)
        .sort((a, b) => pz[a] - pz[b]);

      // Reorder node DOM elements by depth
      const nodeGroup = groupEls.current[0]?.parentElement;
      if (nodeGroup) {
        sortedIdx.forEach(i => nodeGroup.appendChild(groupEls.current[i]));
      }

      // Update node DOM attributes
      for (let i = 0; i < STATIC_NODES.length; i++) {
        const node = STATIC_NODES[i];
        const isNodeHovered = hNode === node.name;
        const isCatHovered = hCat === node.category;
        const isActive = isNodeHovered || isCatHovered;
        const isDimmed = hasHover && !isActive;
        const dotRadius = (isNodeHovered ? 1.4 : isActive ? 1.0 : 0.7) * pscale[i];
        const finalOpacity = isDimmed ? 0.15 : popacity[i];
        const showLabel = isNodeHovered || (pz[i] > 0.15 && !isDimmed);

        const circle = circleEls.current[i];
        circle.setAttribute("cx", px[i].toFixed(2));
        circle.setAttribute("cy", py[i].toFixed(2));
        circle.setAttribute("r", dotRadius.toFixed(3));
        circle.setAttribute("fill-opacity", finalOpacity.toFixed(3));

        const glow = glowEls.current[i];
        glow.setAttribute("cx", px[i].toFixed(2));
        glow.setAttribute("cy", py[i].toFixed(2));
        glow.setAttribute("r", (dotRadius * 1.8).toFixed(3));
        glow.setAttribute("stroke-opacity", isActive ? (isNodeHovered ? "0.5" : "0.25") : "0");

        const text = textEls.current[i];
        if (showLabel) {
          text.setAttribute("x", px[i].toFixed(2));
          text.setAttribute("y", (py[i] - dotRadius - 1.2).toFixed(2));
          text.setAttribute("font-size", isNodeHovered ? "2.2" : "1.7");
          text.setAttribute("fill-opacity", isNodeHovered ? "1" : (0.7 * ((pz[i] + 1) / 2)).toFixed(3));
          text.style.display = "";
        } else {
          text.style.display = "none";
        }
      }

      frameId.current = requestAnimationFrame(tick);
    };

    frameId.current = requestAnimationFrame(tick);

    // Drag handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      rotVelocity.current = { x: -dy * 0.0003, y: dx * 0.0003 };
      rotX.current = startRot.current.x - dy * 0.005;
      rotY.current = startRot.current.y + dx * 0.005;
    };
    const handleMouseUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      // Clear DOM refs
      lineEls.current = [];
      circleEls.current = [];
      glowEls.current = [];
      textEls.current = [];
      groupEls.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isDragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startRot.current = { x: rotX.current, y: rotY.current };
  };

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full p-4"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      onMouseDown={handleMouseDown}
    />
  );
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleNodeHover = useCallback((node: string | null, cat: string | null) => {
    setHoveredNode(node);
    setHoveredCategory(cat);
  }, []);

  const handleCategoryHover = useCallback((id: string | null) => {
    setHoveredCategory(id);
  }, []);

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
          {/* Interactive 3D Globe — imperative SVG, zero state in animation loop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ cursor: dragging ? "grabbing" : "grab" }}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
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

            <GlobeCanvas
              hoveredCategory={hoveredCategory}
              hoveredNode={hoveredNode}
              onNodeHover={handleNodeHover}
            />

            {/* Drag tip */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-40">
              <span className="font-mono text-[6px] tracking-[0.25em] uppercase text-white">Interactive 3D Sphere</span>
              <span className="font-mono text-[6px] tracking-[0.25em] uppercase text-white">Click &amp; Drag to Spin</span>
            </div>
          </motion.div>

          {/* Category legend — memoized, never re-renders from the animation loop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CategoryLegend
              hoveredCategory={hoveredCategory}
              onHover={handleCategoryHover}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
