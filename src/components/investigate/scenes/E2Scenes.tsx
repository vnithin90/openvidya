/**
 * E2 figures.
 *
 * Ported from the static tree's e2.js, faithfully — these drawings were fixed
 * several times against real defects and the corrections are worth keeping:
 *
 *   · drawn to scale at a/r₀ = 1/20, because the lesson later depends on the
 *     spheres being small compared with their separation and the picture must
 *     not flatter that;
 *   · the sequence panels do NOT print the predicted fractions by default. An
 *     earlier version showed 0.630 / 0.397 / 0.250 on the very screen where the
 *     student is about to record their own numbers, with a line saying "do not
 *     look at them yet". An instruction not to look is not a fix;
 *   · the null-test figure draws the WRONG placement too, because a spare held
 *     off the line joining the pair has no sensitivity and passes everything.
 *
 * All geometry comes from src/physics/coulomb-force/model.ts. AGENTS.md hard
 * rule 1 — no equations here, and nothing the tests cannot reach.
 */

import { DRAWN, LAWS, ballPositions, predicted } from '../../../physics/coulomb-force/model';

const { susX, susY, thread, r0: R0, ballR } = { ...DRAWN, ballR: DRAWN.ballR };

interface StandProps {
  y?: number;
  x1?: number;
  x2?: number;
  cx?: number;
  r?: number;
}

function Stand({ y = susY, x1 = 120, x2 = 280, cx = susX, r = 3.5 }: StandProps) {
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} className="rail" />
      <circle cx={cx} cy={y} r={r} className="pivot" />
    </>
  );
}

/** The pair, hanging. `r` is the drawn separation. */
export function PairFigure({
  r = R0,
  showRule = false,
  ruleLabel = 'separation r',
  caption,
}: {
  r?: number;
  showRule?: boolean;
  ruleLabel?: string;
  caption?: string;
}) {
  const p = ballPositions(r);
  const alt =
    'Two small balls hanging from one point on threads, ' +
    (r > R0 * 0.8 ? 'held well apart' : 'much closer together') +
    ' by their mutual push';
  const ruleY = 236;
  return (
    <div className="stage">
      <svg className="scene" viewBox="0 0 400 262" role="img" aria-label={alt}>
        <Stand />
        <line className="thread" x1={susX} y1={susY} x2={p.leftX} y2={p.y} />
        <line className="thread" x1={susX} y1={susY} x2={p.rightX} y2={p.y} />
        {/* identical, because you cannot see charge */}
        <circle className="sphere" cx={p.leftX} cy={p.y} r={ballR} />
        <circle className="sphere" cx={p.rightX} cy={p.y} r={ballR} />
        {showRule && (
          <>
            <line className="dim" x1={p.leftX} y1={p.y + ballR + 4} x2={p.leftX} y2={ruleY + 6} />
            <line className="dim" x1={p.rightX} y1={p.y + ballR + 4} x2={p.rightX} y2={ruleY + 6} />
            <line className="dim-arrow" x1={p.leftX} y1={ruleY} x2={p.rightX} y2={ruleY} />
            <text x={susX} y={ruleY - 6} textAnchor="middle" className="dim-txt">
              {ruleLabel}
            </text>
          </>
        )}
        {caption && (
          <text x={susX} y={258} textAnchor="middle" className="scene-label-txt">
            {caption}
          </text>
        )}
      </svg>
    </div>
  );
}

/** Halving by contact with a fresh uncharged sphere. */
export function HalvingFigure() {
  const p = ballPositions(R0);
  const sx = p.leftX - 34;
  const sy = p.y;
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 400 250"
        role="img"
        aria-label="A fresh uncharged sphere on an insulating handle is touched to one of the two hanging balls"
      >
        <Stand />
        <line className="thread" x1={susX} y1={susY} x2={p.leftX} y2={p.y} />
        <line className="thread" x1={susX} y1={susY} x2={p.rightX} y2={p.y} />
        <circle className="sphere" cx={p.leftX} cy={p.y} r={ballR} />
        <circle className="sphere" cx={p.rightX} cy={p.y} r={ballR} />
        <line className="handle" x1={sx - 52} y1={sy + 16} x2={sx - 4} y2={sy} />
        <circle className="sphere" cx={sx} cy={sy} r={ballR} />
        <text x={78} y={148} textAnchor="middle" className="scene-label-txt">
          a fresh sphere
        </text>
        <text x={78} y={161} textAnchor="middle" className="scene-label-txt">
          touches this ball
        </text>
        <text x={316} y={148} textAnchor="middle" className="scene-label-txt">
          then a second one
        </text>
        <text x={316} y={161} textAnchor="middle" className="scene-label-txt">
          touches this ball
        </text>
        <text x={200} y={244} textAnchor="middle" className="scene-label-txt">
          one round = both hanging balls, each with its own fresh sphere
        </text>
      </svg>
    </div>
  );
}

/**
 * Why a ruler reading stands in for a force. Three arrows on one ball.
 * Without this, the three predicted ratios are numbers handed down.
 */
export function BalanceFigure() {
  const sx = 130;
  const sy = 24;
  const L = 150;
  const th = (19.9 * Math.PI) / 180;
  const bx = sx + L * Math.sin(th);
  const by = sy + L * Math.cos(th);
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 380 250"
        role="img"
        aria-label="One hanging ball with three arrows: the electric push sideways, the weight straight down, and the thread pulling back along the thread"
      >
        <defs>
          <marker id="e2-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead" />
          </marker>
        </defs>
        <Stand x1={70} x2={190} cx={sx} y={sy} r={3.5} />
        <line className="axis" x1={sx} y1={sy} x2={sx} y2={by + 22} />
        <line className="thread" x1={sx} y1={sy} x2={bx} y2={by} />
        <circle className="sphere" cx={bx} cy={by} r={7} />

        <line className="force" x1={bx + 9} y1={by} x2={bx + 68} y2={by} markerEnd="url(#e2-ar)" />
        <text x={bx + 40} y={by - 9} textAnchor="middle" className="force-lab">
          the push
        </text>

        <line className="force" x1={bx} y1={by + 9} x2={bx} y2={by + 52} markerEnd="url(#e2-ar)" />
        <text x={bx + 4} y={by + 44} className="force-lab">
          weight
        </text>

        <line className="force" x1={bx - 6} y1={by - 7} x2={bx - 38} y2={by - 45} markerEnd="url(#e2-ar)" />
        <text x={bx - 52} y={by - 46} textAnchor="middle" className="force-lab">
          thread pulls back
        </text>

        <line className="dim" x1={sx} y1={by + 62} x2={bx} y2={by + 62} />
        <line className="dim-arrow" x1={sx} y1={by + 62} x2={bx} y2={by + 62} />
        <text x={(sx + bx) / 2} y={by + 76} textAnchor="middle" className="dim-txt">
          how far out it hangs
        </text>
      </svg>
    </div>
  );
}

/**
 * Charging. Uncharged, the two balls hang vertically and therefore TOUCHING —
 * so the same symmetry that justifies halving does the work here: identical
 * objects in contact share what arrives. Separating breaks contact and locks
 * the split in.
 */
export function ChargingFigure() {
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 400 210"
        role="img"
        aria-label="Left: uncharged, the two balls hang together touching, and a rubbed rod is stroked across them. Right: now charged, they have swung apart."
      >
        <defs>
          <marker id="e2-tip2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead-warm" />
          </marker>
        </defs>

        <text x={100} y={18} textAnchor="middle" className="fig-head">
          uncharged — they touch
        </text>
        <Stand x1={52} x2={148} cx={100} y={32} r={3} />
        <line className="thread" x1={100} y1={32} x2={94} y2={140} />
        <line className="thread" x1={100} y1={32} x2={106} y2={140} />
        <circle className="sphere" cx={94} cy={140} r={6} />
        <circle className="sphere" cx={106} cy={140} r={6} />
        <rect className="rod" x={24} y={150} width={62} height={9} rx={4.5} transform="rotate(-18,55,154)" />
        <text x={46} y={182} textAnchor="middle" className="scene-label-txt">
          rubbed rod
        </text>
        <text x={100} y={200} textAnchor="middle" className="scene-label-txt">
          stroke it across both
        </text>

        <path className="flowarrow" d="M172 96 L228 96" markerEnd="url(#e2-tip2)" />

        <text x={300} y={18} textAnchor="middle" className="fig-head">
          charged — they swing apart
        </text>
        <Stand x1={252} x2={348} cx={300} y={32} r={3} />
        <line className="thread" x1={300} y1={32} x2={265} y2={136} />
        <line className="thread" x1={300} y1={32} x2={335} y2={136} />
        <circle className="sphere" cx={265} cy={136} r={6} />
        <circle className="sphere" cx={335} cy={136} r={6} />
        <text x={300} y={200} textAnchor="middle" className="scene-label-txt">
          contact breaks, split fixed
        </text>
      </svg>
    </div>
  );
}

/**
 * The null test. Geometry is the whole point, so the figure shows the wrong
 * placement as well: a spare held below the pair rather than on the line
 * joining them has no sensitivity, and a test that passes everything is worse
 * than no test.
 */
export function NullTestFigure({ wrong = false }: { wrong?: boolean }) {
  const p = ballPositions(R0);
  const s = wrong ? { x: susX, y: p.y + 44 } : { x: p.leftX - 58, y: p.y };
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 400 262"
        role="img"
        aria-label={
          wrong
            ? 'A spare sphere held below the pair, off the line joining them — the wrong place'
            : 'A spare sphere held on the line joining the two balls, outside the pair — the correct place'
        }
      >
        <Stand />
        <line className="thread" x1={susX} y1={susY} x2={p.leftX} y2={p.y} />
        <line className="thread" x1={susX} y1={susY} x2={p.rightX} y2={p.y} />
        <line className="axis" x1={p.leftX - 74} y1={p.y} x2={p.rightX + 20} y2={p.y} />
        <circle className="sphere" cx={p.leftX} cy={p.y} r={ballR} />
        <circle className="sphere" cx={p.rightX} cy={p.y} r={ballR} />
        <circle className={`sphere ${wrong ? 'bad' : 'good'}`} cx={s.x} cy={s.y} r={ballR} />
        {wrong ? (
          <>
            <text x={s.x} y={s.y + 22} textAnchor="middle" className="bad-txt">
              off the line — no signal
            </text>
            <text x={s.x} y={s.y + 35} textAnchor="middle" className="bad-txt">
              this test passes anything
            </text>
          </>
        ) : (
          <>
            <text x={76} y={150} textAnchor="middle" className="good-txt">
              on the line joining
            </text>
            <text x={76} y={163} textAnchor="middle" className="good-txt">
              them, 5 cm outside
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

/** Four separations side by side. Fractions are opt-in — see the file header. */
export function SequenceFigure({ showFractions = false }: { showFractions?: boolean }) {
  const W = 96;
  return (
    <div className="stage">
      <svg
        className="scene wide"
        viewBox="0 0 400 142"
        role="img"
        aria-label="Four pictures of the hanging pair, each closer together than the last as the charge is halved"
      >
        {[0, 1, 2, 3].map((k) => {
          const frac = predicted(2, k);
          const w = R0 * frac * 0.62;
          const cx = W / 2 - 2;
          return (
            <g key={k} transform={`translate(${12 + k * W},0)`}>
              <circle cx={cx} cy={14} r={2.5} className="pivot" />
              <line className="thread" x1={cx} y1={14} x2={cx - w / 2} y2={96} />
              <line className="thread" x1={cx} y1={14} x2={cx + w / 2} y2={96} />
              <circle className="sphere" cx={cx - w / 2} cy={96} r={4} />
              <circle className="sphere" cx={cx + w / 2} cy={96} r={4} />
              <text x={cx} y={118} textAnchor="middle" className="scene-label-txt">
                {k === 0 ? 'start' : `${k} halving${k > 1 ? 's' : ''}`}
              </text>
              {showFractions && (
                <text x={cx} y={132} textAnchor="middle" className="seq-frac">
                  {k === 0 ? 'r₀' : `${frac.toFixed(3)} r₀`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Conductor / insulator contrast — the two-minute demonstration, ruling 6. */
export function ConductionFigure() {
  return (
    <div className="stage">
      <svg
        className="scene wide"
        viewBox="0 0 400 190"
        role="img"
        aria-label="Left: touching a charged metal sphere makes the pair collapse together. Right: touching one patch of a rubbed balloon leaves the rest still charged."
      >
        <defs>
          <marker id="e2-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead" />
          </marker>
        </defs>

        <g>
          <text x={100} y={18} textAnchor="middle" className="fig-head">
            metal sphere
          </text>
          <circle cx={100} cy={34} r={2.5} className="pivot" />
          <line className="thread" x1={100} y1={34} x2={94} y2={112} />
          <line className="thread" x1={100} y1={34} x2={106} y2={112} />
          <circle className="sphere" cx={93.5} cy={112} r={5.5} />
          <circle className="sphere" cx={106.5} cy={112} r={5.5} />
          <path className="touch-arrow" d="M46 130 L82 116" markerEnd="url(#e2-tip)" />
          <text x={44} y={126} textAnchor="end" className="scene-label-txt">
            finger
          </text>
          <text x={100} y={152} textAnchor="middle" className="scene-label-txt">
            touch it once —
          </text>
          <text x={100} y={166} textAnchor="middle" className="scene-label-txt">
            it collapses completely
          </text>
        </g>

        <line x1={200} y1={16} x2={200} y2={176} className="divider" />

        <g>
          <text x={300} y={18} textAnchor="middle" className="fig-head">
            rubbed balloon
          </text>
          <line className="thread" x1={300} y1={30} x2={300} y2={64} />
          <path className="knot" d="M300 62 l4 7 h-8 z" />
          <g transform="translate(300,-2) scale(0.72)">
            <path
              className="balloon-plain"
              d="M0 92 C 24 92, 30 112, 30 124 C 30 142, 16 154, 0 154 C -16 154, -30 142, -30 124 C -30 112, -24 92, 0 92 Z"
            />
          </g>
          <path className="touch-arrow" d="M240 118 L272 104" markerEnd="url(#e2-tip)" />
          <text x={238} y={114} textAnchor="end" className="scene-label-txt">
            finger
          </text>
          <text x={300} y={152} textAnchor="middle" className="scene-label-txt">
            touch one patch —
          </text>
          <text x={300} y={166} textAnchor="middle" className="scene-label-txt">
            the rest stays charged
          </text>
        </g>
      </svg>
    </div>
  );
}

/** The product test: two very different splits, one separation. Ruling 4. */
export function ProductFigure() {
  const mini = (x: number, q1: number, q2: number, lab: string) => {
    const prod = q1 * q2;
    const w = 74 * Math.pow(prod / 0.25, 1 / 3); // r ∝ (q₁q₂)^(1/(n+1)), n = 2
    return (
      <g key={lab} transform={`translate(${x},0)`}>
        <circle cx={0} cy={16} r={2.5} className="pivot" />
        <line className="thread" x1={0} y1={16} x2={-w / 2} y2={96} />
        <line className="thread" x1={0} y1={16} x2={w / 2} y2={96} />
        <circle className="sphere" cx={-w / 2} cy={96} r={5} />
        <circle className="sphere" cx={w / 2} cy={96} r={5} />
        <text x={0} y={120} textAnchor="middle" className="scene-label-txt">
          {lab}
        </text>
        <text x={0} y={136} textAnchor="middle" className="seq-frac">
          product {prod.toFixed(2)} q₀²
        </text>
      </g>
    );
  };
  return (
    <div className="stage">
      <svg
        className="scene wide"
        viewBox="0 0 360 148"
        role="img"
        aria-label="Two arrangements: a balanced pair and a lopsided four-to-one pair, hanging at the same separation"
      >
        {mini(96, 0.5, 0.5, 'both halved once')}
        {mini(264, 1.0, 0.25, 'one halved twice')}
        <line className="axis" x1={150} y1={96} x2={210} y2={96} />
        <text x={180} y={88} textAnchor="middle" className="dim-txt">
          same
        </text>
      </svg>
    </div>
  );
}

/** Where a measurement sits against the three candidate laws. */
export function LawChart({ k, measured }: { k: number; measured?: number | null }) {
  const W = 360;
  const X0 = 54;
  const X1 = 330;
  const Y = 62;
  const lo = predicted(1, k);
  const hi = predicted(3, k);
  const pad = (hi - lo) * 0.28;
  const a = lo - pad;
  const b = hi + pad;
  const px = (v: number) => X0 + ((v - a) / (b - a)) * (X1 - X0);
  const xm = measured != null ? Math.max(X0 - 6, Math.min(X1 + 6, px(measured))) : 0;
  return (
    <div className="stage">
      <svg
        className="scene wide"
        viewBox={`0 0 ${W} 142`}
        role="img"
        aria-label={
          'A number line showing what each candidate law predicts for the separation ratio' +
          (measured != null ? ', with your measurement marked' : '')
        }
      >
        <line className="axisline" x1={X0} y1={Y} x2={X1} y2={Y} />
        {LAWS.map((l) => {
          const v = predicted(l.n, k);
          const x = px(v);
          return (
            <g key={l.n}>
              <line className={`lawtick n${l.n}`} x1={x} y1={Y - 18} x2={x} y2={Y + 18} />
              <text x={x} y={Y - 24} textAnchor="middle" className={`lawlab n${l.n}`}>
                {l.name}
              </text>
              <text x={x} y={Y + 32} textAnchor="middle" className="lawnum">
                {v.toFixed(3)}
              </text>
            </g>
          );
        })}
        {measured != null && (
          <>
            <polygon className="youmark" points={`${xm},${Y + 42} ${xm - 6},${Y + 54} ${xm + 6},${Y + 54}`} />
            <text x={xm} y={Y + 68} textAnchor="middle" className="youlab">
              your {measured.toFixed(3)}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
