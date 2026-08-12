/**
 * E3 figures.
 *
 * The six-position map is the lesson's instrument, and it is deliberately the
 * same instrument as M2 — put a compass at six places around a magnet, predict
 * before probing. Neither was written with the other in view; the convergence is
 * recorded in LESSON_E3 §18.
 *
 * POSITION GEOMETRY IS NOT DECORATIVE. §5a requires two positions at equal
 * distance in different directions, and two in the same direction at different
 * distances. Without the first pair the student cannot see that direction does
 * *not* matter; without the second, that distance does. The layout below is the
 * smallest symmetric set that provides both:
 *
 *     four at radius R1, at 0° 90° 180° 270°   — equal distance, four directions
 *     two  at radius R2, at 0° and 90°         — same directions, further out
 *
 * The source is drawn as a small sphere, never a rod. A 30 cm rod at these
 * distances misaligns from radial by up to 10.4° and varies 1.82× in magnitude
 * around a circle of constant radius — enough to masquerade as the distance
 * dependence the lesson is trying to show. See §5a.
 */

export type Dir = 'out' | 'in' | 'side';

/** The six probe positions, in SVG units about the source at (CX, CY). */
export const CX = 170;
export const CY = 128;
const R1 = 62;
const R2 = 104;

export const POSITIONS: { id: string; deg: number; r: number; label: string }[] = [
  { id: 'a', deg: 0, r: R1, label: 'right, near' },
  { id: 'b', deg: 90, r: R1, label: 'below, near' },
  { id: 'c', deg: 180, r: R1, label: 'left, near' },
  { id: 'd', deg: 270, r: R1, label: 'above, near' },
  { id: 'e', deg: 0, r: R2, label: 'right, far' },
  { id: 'f', deg: 90, r: R2, label: 'below, far' },
];

export function posXY(p: { deg: number; r: number }) {
  const a = (p.deg * Math.PI) / 180;
  return { x: CX + p.r * Math.cos(a), y: CY + p.r * Math.sin(a) };
}

/** The pairs the geometry exists to create — exported so a test can assert
 *  they survive any future rearrangement. */
export const EQUAL_DISTANCE = ['a', 'b', 'c', 'd'];
export const SAME_DIRECTION = [['a', 'e'], ['b', 'f']];

/**
 * The map. Draws whatever the student has committed and nothing else — with no
 * choices made it shows six empty positions, which is the honest starting state.
 */
export function MapScene({
  choices = {},
  showSource = true,
  caption,
}: {
  choices?: Record<string, Dir>;
  showSource?: boolean;
  caption?: string;
}) {
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 340 260"
        role="img"
        aria-label={
          Object.keys(choices).length
            ? 'A charged ball with arrows drawn at six positions around it, showing which way a test charge would be pushed'
            : 'A charged ball with six empty positions marked around it, waiting for the student to mark a direction at each'
        }
      >
        <defs>
          <marker id="e3-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead" />
          </marker>
        </defs>

        {/* the two radii, so "equal distance" is visible rather than asserted */}
        <circle className="guide" cx={CX} cy={CY} r={R1} />
        <circle className="guide" cx={CX} cy={CY} r={R2} />

        {showSource && (
          <>
            <circle className="sphere source" cx={CX} cy={CY} r={11} />
            <text x={CX} y={CY + 30} textAnchor="middle" className="scene-label-txt">
              charged ball
            </text>
          </>
        )}

        {POSITIONS.map((p) => {
          const { x, y } = posXY(p);
          const d = choices[p.id];
          const a = (p.deg * Math.PI) / 180;
          const L = 26;
          let dx = 0;
          let dy = 0;
          if (d === 'out') { dx = L * Math.cos(a); dy = L * Math.sin(a); }
          if (d === 'in') { dx = -L * Math.cos(a); dy = -L * Math.sin(a); }
          if (d === 'side') { dx = -L * Math.sin(a); dy = L * Math.cos(a); }
          return (
            <g key={p.id}>
              <circle className={`probe ${d ? 'set' : ''}`} cx={x} cy={y} r={5} />
              {d && (
                <line
                  className="probe-arrow"
                  x1={x}
                  y1={y}
                  x2={x + dx}
                  y2={y + dy}
                  markerEnd="url(#e3-tip)"
                />
              )}
              <text x={x} y={y - 10} textAnchor="middle" className="probe-lab">
                {p.id}
              </text>
            </g>
          );
        })}

        {caption && (
          <text x={CX} y={252} textAnchor="middle" className="scene-label-txt">
            {caption}
          </text>
        )}
      </svg>
    </div>
  );
}

/**
 * Two objects, nothing between them, and a force. The point of the picture is
 * the emptiness, so the gap is labelled and left conspicuously bare.
 */
export function GapScene() {
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 340 150"
        role="img"
        aria-label="Two charged balls held apart, with the empty space between them marked and nothing drawn in it"
      >
        <defs>
          <marker id="e3-push" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead" />
          </marker>
        </defs>
        <circle className="sphere" cx={70} cy={70} r={13} />
        <circle className="sphere" cx={270} cy={70} r={13} />
        <line className="force" x1={56} y1={70} x2={24} y2={70} markerEnd="url(#e3-push)" />
        <line className="force" x1={284} y1={70} x2={316} y2={70} markerEnd="url(#e3-push)" />
        <line className="gapline" x1={88} y1={70} x2={252} y2={70} />
        <text x={170} y={62} textAnchor="middle" className="dim-txt">
          nothing here
        </text>
        <text x={170} y={112} textAnchor="middle" className="scene-label-txt">
          no string, no rod, no contact — and still a push
        </text>
      </svg>
    </div>
  );
}

/**
 * The timing question, as a picture. Jiggle the left charge; when does the right
 * one find out? Drawn with a deliberate question mark rather than a wavefront —
 * a travelling disturbance is exactly the ontology E3 refuses to assert.
 */
export function TimingScene() {
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 340 130"
        role="img"
        aria-label="One charged ball being shaken, the other still, with a question mark over the space between them"
      >
        <circle className="sphere" cx={64} cy={62} r={13} />
        <path className="shake" d="M40 40 q8 -10 16 0 q8 10 16 0" />
        <text x={64} y={104} textAnchor="middle" className="scene-label-txt">
          you shake this one
        </text>
        <circle className="sphere" cx={276} cy={62} r={13} />
        <text x={276} y={104} textAnchor="middle" className="scene-label-txt">
          when does this one know?
        </text>
        <text x={170} y={70} textAnchor="middle" className="bigq">
          ?
        </text>
      </svg>
    </div>
  );
}
