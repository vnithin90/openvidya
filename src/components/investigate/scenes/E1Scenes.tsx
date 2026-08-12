/**
 * E1 figures.
 *
 * The Astro port of E1 shipped with a single CSS `div` balloon where the static
 * tree had seven SVG scenes across nineteen call sites. This restores them.
 *
 * Each carries a correction that cost real time to find:
 *
 *  · pairScene's SIGN CONVENTION was inverted once and drew repulsion as
 *    attraction. It is derived in the comment on `balloonLimb`, and `pairGap`
 *    exists so a test can catch it flipping back.
 *  · the swinging groups rely on `transform-box: fill-box`. Without it the
 *    percentage in `transform-origin` resolves against the whole viewBox and the
 *    threads tear away from the rail when they rotate.
 *  · `hairCap` draws hair as a covering MASS with strands pulled out of it. An
 *    earlier version drew a bare scalp with spikes, which reads as a cartoon
 *    electrocution — the wrong idea entirely, since the hair is being pulled.
 *  · the three miniatures put the SAME rubbed balloon on the left every time.
 *    Rows 1 and 3 are near-identical pictures with opposite outcomes, which is
 *    the point: nothing visible distinguishes a rubbed balloon from an unrubbed
 *    one, so the captions must carry it and the drawing must not.
 */

/* ------------------------------------------------------------------ balloons */

/**
 * One balloon hanging from the rail, plus its caption.
 *
 * The caption sits OUTSIDE the swinging group on purpose: a label that tilts
 * with the balloon reads as decoration. It stays level so it keeps saying which
 * balloon this is while the balloon moves.
 *
 * Sign convention, derived rather than guessed:
 *   SVG rotate(t) sends (x,y) -> (x cos t − y sin t, …).
 *   The balloon hangs below the pivot, lever vector (0, +110).
 *   So its horizontal shift is dx = −110 sin(t).
 *   LEFT balloon must move left  (dx < 0) => needs t = +a
 *   RIGHT balloon must move right (dx > 0) => needs t = −a
 */
function BalloonLimb({
  sign, angle, label, faded = false,
}: { sign: 1 | -1; angle: number; label?: string; faded?: boolean }) {
  return (
    <>
      <g className="swing" style={{ transform: `rotate(${sign * angle}deg)` }}>
        <line className="thread" x1={0} y1={14} x2={0} y2={86} />
        <path className="knot" d="M0 84 l5 9 h-10 z" />
        <path
          className={faded ? 'balloon-plain faded' : 'balloon-plain'}
          d="M0 92 C 24 92, 30 112, 30 124 C 30 142, 16 154, 0 154 C -16 154, -30 142, -30 124 C -30 112, -24 92, 0 92 Z"
        />
      </g>
      {label && (
        <text x={0} y={182} textAnchor="middle" className="scene-label-txt">{label}</text>
      )}
    </>
  );
}

/** Gap between balloon centres, from the same trigonometry the renderer uses.
 *  Exported so a test can assert repulsion is drawn as repulsion. */
export function pairGap(angle: number): number {
  const t = (angle * Math.PI) / 180;
  return (210 - 110 * Math.sin(-t)) - (130 - 110 * Math.sin(t));
}

/** Two balloons side by side. angle > 0 swings them APART, < 0 draws them together. */
export function PairScene({
  angle = 0, leftLabel, rightLabel,
}: { angle?: number; leftLabel?: string; rightLabel?: string }) {
  const alt =
    angle > 0 ? 'Two balloons hanging on threads, swung apart from each other'
    : angle < 0 ? 'Two balloons hanging on threads, leaning in towards each other'
    : 'Two balloons hanging straight down on threads, side by side';
  return (
    <div className="stage">
      <svg className="scene" viewBox="0 0 340 200" role="img" aria-label={alt}>
        <line x1={50} y1={14} x2={290} y2={14} className="stand-bar thin" />
        <g transform="translate(130,0)"><BalloonLimb sign={1} angle={angle} label={leftLabel} /></g>
        <g transform="translate(210,0)"><BalloonLimb sign={-1} angle={angle} label={rightLabel} /></g>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------------- hair */

/** Hair as a covering mass, not a bare scalp with spikes. */
function hairCapPath(cx: number, cy: number, r: number): string {
  return `M${cx - r - 1} ${cy} C ${cx - r - 1} ${cy - r * 1.25}, ${cx + r + 1} ${cy - r * 1.25}, ${cx + r + 1} ${cy} C ${cx + r * 0.55} ${cy - r * 0.62}, ${cx - r * 0.55} ${cy - r * 0.62}, ${cx - r - 1} ${cy} Z`;
}

/** A head in profile with a balloon above it.
 *  lift = 0 → hair hangs naturally. lift = 1 → hair reaches toward the balloon. */
export function HairScene({
  lift = 0, headLabel = 'your hair', balloonLabel = 'rubbed balloon',
}: { lift?: number; headLabel?: string; balloonLabel?: string }) {
  const cx = 118, cy = 150, r = 40;
  const bx = 232, by = 74;
  const N = 9;
  const strands: string[] = [];
  for (let i = 0; i < N; i++) {
    const a = ((-168 + i * (138 / (N - 1))) * Math.PI) / 180;
    const rx = cx + r * Math.cos(a);
    const ry = cy + r * Math.sin(a);
    const len = 30 + (i % 2) * 5;
    const natX = rx + len * Math.cos(a) * 0.55;
    const natY = ry + len * Math.sin(a) * 0.55 + 16;
    const dx = bx - rx, dy = by - ry;
    const d = Math.hypot(dx, dy) || 1;
    const pullX = rx + (dx / d) * len;
    const pullY = ry + (dy / d) * len;
    const tipX = natX + (pullX - natX) * lift;
    const tipY = natY + (pullY - natY) * lift;
    const ctrlX = rx + (tipX - rx) * 0.45 + lift * 5;
    const ctrlY = ry + (tipY - ry) * 0.45 + (1 - lift) * 7;
    strands.push(`M${rx.toFixed(1)} ${ry.toFixed(1)} Q${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`);
  }
  return (
    <div className="stage">
      <svg className="scene" viewBox="0 0 340 200" role="img" aria-label="A balloon held above someone’s head, with hair rising toward it">
        <g transform={`translate(${bx},${by - 46})`}>
          <line className="thread" x1={0} y1={-16} x2={0} y2={-2} />
          <path className="knot" d="M0 -4 l5 9 h-10 z" />
          <path className="balloon-plain" d="M0 4 C 22 4, 28 22, 28 34 C 28 50, 15 61, 0 61 C -15 61, -28 50, -28 34 C -28 22, -22 4, 0 4 Z" />
        </g>
        <g className="head">
          <path className="skin" d="M78 200 C 78 172, 96 162, 118 162 C 140 162, 158 172, 158 200 Z" />
          <circle className="skin" cx={cx} cy={cy} r={r} />
          <circle className="eye" cx={134} cy={146} r={2.6} />
        </g>
        <g className="hairset">
          {strands.map((d, i) => <path key={i} className="hair" d={d} />)}
        </g>
        <text x={118} y={196} textAnchor="middle" className="scene-label-txt">{headLabel}</text>
        <text x={232} y={20} textAnchor="middle" className="scene-label-txt">{balloonLabel}</text>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- miniatures */

const MINI_LEVER = 68, MINI_L = 58, MINI_R = 112;

function MiniLimb({ sign, angle }: { sign: 1 | -1; angle: number }) {
  return (
    <g className="swing" style={{ transform: `rotate(${sign * angle}deg)` }}>
      <line className="thread" x1={0} y1={10} x2={0} y2={60} />
      <ellipse className="balloon-plain" cx={0} cy={78} rx={14} ry={17} />
    </g>
  );
}

function MiniHead() {
  const hx = 130, hy = 76, hr = 20;
  const strands: string[] = [];
  for (let i = 0; i < 7; i++) {
    const a = ((-176 + i * 17) * Math.PI) / 180;
    const rx = hx + hr * Math.cos(a), ry = hy + hr * Math.sin(a);
    const tx = rx - 20 - i * 0.8, ty = ry - 3 - i;
    strands.push(`M${rx.toFixed(1)} ${ry.toFixed(1)} Q${((rx + tx) / 2 - 1).toFixed(1)} ${((ry + ty) / 2 - 5).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`);
  }
  return (
    <>
      <g>
        <path className="skin" d="M104 120 C 104 102, 116 96, 130 96 C 144 96, 156 102, 156 120 Z" />
        <circle className="skin" cx={hx} cy={hy} r={hr} />
        <path className="hair-mass" d={hairCapPath(hx, hy, hr)} />
        <circle className="eye" cx={119} cy={74} r={1.7} />
      </g>
      <g className="hairset">
        {strands.map((d, i) => <path key={i} className="hair thin" d={d} />)}
      </g>
    </>
  );
}

/** Gap between mini balloon centres — same trig, exported for the tests. */
export function miniGap(angle: number): number {
  const t = (angle * Math.PI) / 180;
  return (MINI_R - MINI_LEVER * Math.sin(-t)) - (MINI_L - MINI_LEVER * Math.sin(t));
}

export function MiniScene({ kind }: { kind: 'pair' | 'hair' | 'plain' }) {
  const a = kind === 'pair' ? 21 : -9; // + swings apart, − draws together
  const alt =
    kind === 'pair' ? 'Two balloons swung apart'
    : kind === 'hair' ? 'Hair rising toward a balloon'
    : 'Two balloons leaning together';
  return (
    <svg className="mini" viewBox="0 0 176 125" role="img" aria-label={alt}>
      <line x1={20} y1={10} x2={150} y2={10} className="stand-bar thin" />
      <g transform={`translate(${MINI_L},0)`}><MiniLimb sign={1} angle={a} /></g>
      {kind === 'hair'
        ? <MiniHead />
        : <g transform={`translate(${MINI_R},0)`}><MiniLimb sign={-1} angle={a} /></g>}
    </svg>
  );
}

/* --------------------------------------------- full of charge, showing none */

/** Ten pairs standing in for 500 of each kind. Every pair cancels and nothing is
 *  removed, so the box stays visibly full while the net reads zero. */
export function CancellationScene() {
  const cells = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const x = 52 + c * 58, y = 48 + r * 42;
      cells.push(
        <g key={`${r}-${c}`}>
          <line x1={x - 12} y1={y} x2={x + 12} y2={y} className="pairline" />
          <circle cx={x - 12} cy={y} r={11} className="kind-pos" />
          <text x={x - 12} y={y + 5} textAnchor="middle" className="glyph">+</text>
          <circle cx={x + 12} cy={y} r={11} className="kind-neg" />
          <text x={x + 12} y={y + 5} textAnchor="middle" className="glyph">−</text>
        </g>,
      );
    }
  }
  return (
    <div className="stage">
      <svg className="scene" viewBox="0 0 340 140" role="img" aria-label="An object holding equal amounts of both kinds of charge, paired up and cancelling">
        <rect x={16} y={18} width={308} height={104} rx={14} className="boxframe" />
        <text x={170} y={136} textAnchor="middle" className="scene-label-txt">
          one object · nothing has been taken out of it
        </text>
        {cells}
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------- apparatus */

export function ApparatusScene() {
  const bal = (x: number) => (
    <g key={x} transform={`translate(${x},0)`}>
      <line className="thread" x1={0} y1={14} x2={0} y2={40} />
      <ellipse className="balloon-plain" cx={0} cy={58} rx={15} ry={18} />
    </g>
  );
  return (
    <div className="stage tight">
      <svg className="scene narrow" viewBox="0 0 320 118" role="img" aria-label="Two balloons, a reel of thread, and hair">
        <line x1={34} y1={14} x2={126} y2={14} className="stand-bar thin" />
        {bal(58)}{bal(102)}
        <g transform="translate(176,0)">
          <rect x={-20} y={34} width={40} height={10} rx={3} className="reel" />
          <rect x={-20} y={72} width={40} height={10} rx={3} className="reel" />
          <rect x={-14} y={42} width={28} height={32} className="reel-core" />
          <line className="thread" x1={14} y1={52} x2={30} y2={66} />
        </g>
        <g>
          <path className="skin" d="M226 100 C 226 86, 236 80, 250 80 C 264 80, 274 86, 274 100 Z" />
          <circle className="skin" cx={250} cy={62} r={19} />
          <path className="hair-mass" d={hairCapPath(250, 62, 19)} />
        </g>
        <text x={80} y={113} textAnchor="middle" className="scene-label-txt">two balloons</text>
        <text x={176} y={113} textAnchor="middle" className="scene-label-txt">thread</text>
        <text x={250} y={113} textAnchor="middle" className="scene-label-txt">dry hair</text>
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- Franklin */

/** Drawn, not photographed: the site ships no binary assets and makes no network
 *  requests. An illustration in the site's own flat line style. Not a likeness,
 *  and the caption says so. */
export function FranklinPortrait() {
  const wisps = [];
  for (let i = 0; i < 3; i++) {
    const y = 116 + i * 20;
    wisps.push(
      <path key={`l${i}`} className="fr-strand" d={`M62 ${y} C 52 ${y + 8}, 48 ${y + 16}, 50 ${y + 26}`} />,
      <path key={`r${i}`} className="fr-strand" d={`M138 ${y} C 148 ${y + 8}, 152 ${y + 16}, 150 ${y + 26}`} />,
    );
  }
  return (
    <svg className="portrait" viewBox="0 0 200 240" role="img" aria-label="Illustration of Benjamin Franklin: a high bald forehead, thin long hair at the sides, small oval spectacles and a fur-collared coat">
      <path className="fr-coat" d="M26 240 C 30 202, 58 184, 100 184 C 142 184, 170 202, 174 240 Z" />
      <path className="fr-fur" d="M44 200 C 56 190, 62 206, 74 196 C 84 188, 88 202, 100 202 C 112 202, 116 188, 126 196 C 138 206, 144 190, 156 200 C 142 186, 122 178, 100 178 C 78 178, 58 186, 44 200 Z" />
      <path className="skin" d="M87 150 h26 v24 c0 5 -26 5 -26 0 Z" />
      <path className="fr-hair" d="M63 96 C 46 106, 40 140, 44 174 C 54 182, 70 180, 74 170 C 66 146, 64 118, 72 100 Z" />
      <path className="fr-hair" d="M137 96 C 154 106, 160 140, 156 174 C 146 182, 130 180, 126 170 C 134 146, 136 118, 128 100 Z" />
      <g className="fr-strandset">{wisps}</g>
      <path className="skin" d="M100 40 C 128 40, 141 62, 141 92 C 141 114, 138 130, 130 142 C 122 154, 112 160, 100 160 C 88 160, 78 154, 70 142 C 62 130, 59 114, 59 92 C 59 62, 72 40, 100 40 Z" />
      <path className="fr-line" d="M70 92 C 76 88, 86 88, 92 91" />
      <path className="fr-line" d="M108 91 C 114 88, 124 88, 130 92" />
      <g className="fr-spec">
        <ellipse cx={81} cy={104} rx={11} ry={8.5} />
        <ellipse cx={119} cy={104} rx={11} ry={8.5} />
        <line x1={92} y1={104} x2={108} y2={104} />
        <line x1={70} y1={101} x2={61} y2={98} />
        <line x1={130} y1={101} x2={139} y2={98} />
      </g>
      <path className="fr-line" d="M100 108 C 103 118, 106 126, 98 129" />
      <path className="fr-line" d="M88 140 C 94 144, 106 144, 112 140" />
      <path className="fr-line" d="M76 128 C 78 140, 82 148, 89 152" />
      <path className="fr-line" d="M124 128 C 122 140, 118 148, 111 152" />
    </svg>
  );
}

/**
 * Franklin's three-person experiment.
 *
 * The prose alone made the quotation unreadable: it says "B … positively; A
 * negatively" while the text never says who A and B are. The diagram names them.
 * Fire leaves A (the rubber), collects in B (who draws it off), and the person
 * on the floor passes it along: B → C → A.
 *
 * The sign goes in a named pill under each figure, not a floating coloured circle
 * beside the head — in a lesson about balloons, a red circle hanging in the air
 * beside someone reads as a balloon.
 */
export function FranklinExperiment() {
  const person = (x: number, drop: number, name: string, sign: '' | '+' | '-', note?: string) => {
    const hy = 66 + drop, feet = 182 + drop;
    const pillY = feet + 24, w = sign ? 84 : 46;
    const cls = sign === '+' ? 'plus' : sign === '-' ? 'minus' : 'none';
    const txt = sign ? `${name}   ${sign === '+' ? '+ plus' : '− minus'}` : name;
    return (
      <g key={name}>
        <circle className="skin" cx={x} cy={hy} r={13} />
        <path className="fr-coat" d={`M${x - 13} ${hy + 13} h26 v52 h-26 Z`} />
        <line className="limb" x1={x - 11} y1={feet - 43} x2={x - 10} y2={feet} />
        <line className="limb" x1={x + 11} y1={feet - 43} x2={x + 10} y2={feet} />
        <rect className={`pill ${cls}`} x={x - w / 2} y={pillY} width={w} height={21} rx={10.5} />
        <text x={x} y={pillY + 15} textAnchor="middle" className={`pill-txt ${cls}`}>{txt}</text>
        {note && <text x={x} y={pillY + 36} textAnchor="middle" className="scene-label-txt">{note}</text>}
      </g>
    );
  };
  const wax = (x: number) => (
    <g key={`wax${x}`}>
      <rect x={x - 26} y={182} width={52} height={14} rx={3} className="wax" />
      <text x={x} y={192} textAnchor="middle" className="wax-txt">wax</text>
    </g>
  );
  return (
    <div className="stage">
      <svg className="scene wide" viewBox="0 0 400 276" role="img" aria-label="Three people: two standing on wax blocks, one rubbing a glass tube and one drawing a spark off it, and a third standing on the floor passing sparks between them">
        <defs>
          <marker id="e1-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead-warm" />
          </marker>
        </defs>
        <line x1={8} y1={196} x2={392} y2={196} className="floorline" />
        {wax(200)}{wax(320)}
        {person(70, 14, 'C', '', 'on the floor')}
        {person(200, 0, 'A', '-', 'rubs the tube')}
        {person(320, 0, 'B', '+', 'draws the spark')}
        <rect x={218} y={100} width={76} height={13} rx={6.5} className="tube" />
        <text x={256} y={92} textAnchor="middle" className="scene-label-txt">glass tube</text>
        <line className="limb" x1={211} y1={82} x2={224} y2={104} />
        <line className="limb" x1={312} y1={82} x2={303} y2={105} />
        <path className="spark" d="M294 108 L296 99 L300 111 L304 101" />
        {/* Two arcs at clearly different heights, so the long one is not read as
            B handing something straight to A. */}
        <path className="flow" d="M334 44 Q 205 2 74 42" markerEnd="url(#e1-ah)" />
        <text x={205} y={16} textAnchor="middle" className="flow-txt">B gives a spark to C</text>
        <path className="flow" d="M82 60 Q 132 40 182 56" markerEnd="url(#e1-ah)" />
        <text x={132} y={78} textAnchor="middle" className="flow-txt">C gives one to A</text>
      </svg>
    </div>
  );
}
