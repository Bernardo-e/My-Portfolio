export interface Point2D {
  x: number;
  y: number;
}

export type LetterSegment = Point2D[];

export interface LetterDefinition {
  char: string;
  segments: LetterSegment[];
}

export const LETTERS_DATA: LetterDefinition[] = [
  {
    char: "B",
    segments: [
      [{ x: 0, y: 1 }, { x: 0, y: 0 }],
      [{ x: 0, y: 0 }, { x: 0.7, y: 0 }, { x: 1, y: 0.25 }, { x: 0.7, y: 0.5 }, { x: 0, y: 0.5 }],
      [{ x: 0, y: 0.5 }, { x: 0.8, y: 0.5 }, { x: 1, y: 0.75 }, { x: 0.8, y: 1 }, { x: 0, y: 1 }]
    ]
  },
  {
    char: "E",
    segments: [
      [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
      [{ x: 0, y: 0.5 }, { x: 0.7, y: 0.5 }]
    ]
  },
  {
    char: "R",
    segments: [
      [{ x: 0, y: 1 }, { x: 0, y: 0 }],
      [{ x: 0, y: 0 }, { x: 0.8, y: 0 }, { x: 1, y: 0.25 }, { x: 0.8, y: 0.5 }, { x: 0, y: 0.5 }],
      [{ x: 0.3, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 1, y: 1 }]
    ]
  },
  {
    char: "N",
    segments: [
      [{ x: 0, y: 1 }, { x: 0, y: 0 }],
      [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      [{ x: 1, y: 1 }, { x: 1, y: 0 }]
    ]
  },
  {
    char: "A",
    segments: [
      [{ x: 0, y: 1 }, { x: 0.5, y: 0 }, { x: 1, y: 1 }],
      [{ x: 0.22, y: 0.65 }, { x: 0.78, y: 0.65 }]
    ]
  },
  {
    char: "R",
    segments: [
      [{ x: 0, y: 1 }, { x: 0, y: 0 }],
      [{ x: 0, y: 0 }, { x: 0.8, y: 0 }, { x: 1, y: 0.25 }, { x: 0.8, y: 0.5 }, { x: 0, y: 0.5 }],
      [{ x: 0.3, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 1, y: 1 }]
    ]
  },
  {
    char: "D",
    segments: [
      [{ x: 0, y: 1 }, { x: 0, y: 0 }],
      [{ x: 0, y: 0 }, { x: 0.7, y: 0 }, { x: 1, y: 0.5 }, { x: 0.7, y: 1 }, { x: 0, y: 1 }]
    ]
  },
  {
    char: "O",
    segments: [
      [
        { x: 0.5, y: 0 },
        { x: 0.9, y: 0.1 },
        { x: 1, y: 0.5 },
        { x: 0.9, y: 0.9 },
        { x: 0.5, y: 1 },
        { x: 0.1, y: 0.9 },
        { x: 0, y: 0.5 },
        { x: 0.1, y: 0.1 },
        { x: 0.5, y: 0 }
      ]
    ]
  }
];

// Helper to interpolate a point on a line segment strip at progress t (0 to 1)
export function sampleSegment(segment: LetterSegment, t: number): Point2D {
  if (segment.length === 0) return { x: 0, y: 0 };
  if (segment.length === 1) return { ...segment[0] };

  const numSubSegments = segment.length - 1;
  const rawIdx = t * numSubSegments;
  const idx = Math.min(Math.floor(rawIdx), numSubSegments - 1);
  const factor = rawIdx - idx;

  const p0 = segment[idx];
  const p1 = segment[idx + 1];

  return {
    x: p0.x + factor * (p1.x - p0.x),
    y: p0.y + factor * (p1.y - p0.y)
  };
}

export interface FlattenedSegment {
  letterIndex: number;
  segmentIndex: number;
  points: LetterSegment;
}

// Flat array of all segments for easier mapping
export const FLATTENED_SEGMENTS: FlattenedSegment[] = (() => {
  const list: FlattenedSegment[] = [];
  LETTERS_DATA.forEach((letter, letterIndex) => {
    letter.segments.forEach((seg, segmentIndex) => {
      list.push({
        letterIndex,
        segmentIndex,
        points: seg
      });
    });
  });
  return list;
})();
