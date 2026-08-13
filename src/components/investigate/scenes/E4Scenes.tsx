/**
 * E4 figures.
 *
 * THE RULE THAT GOVERNS ALL OF THEM, from the model spec's
 * `representation_choices`: the paper is drawn with BOTH kinds still inside it,
 * shifted. It must never be drawn as having acquired net charge, because that
 * is the student misconception the lesson exists to defeat.
 *
 * `GradientScene` is the one that carries the physics. A net force on a neutral
 * scrap needs the field to be NON-UNIFORM, and that is invisible in every
 * comb-and-paper picture ever drawn. Here it is the whole subject: the same
 * scrap, same field strength at its centre, once with a gradient and once
 * without.
 */

const POS = '#3a72c9';
const NEG = '#d8452f';

function Bits({ lifted }: { lifted: boolean }) {
  const bits = [
    { x: 150, w: 16, h: 7 },
    { x: 178, w: 13, h: 6 },
    { x: 205, w: 18, h: 7 },
    { x: 236, w: 12, h: 6 },
  ];
  return (
    <>
      {bits.map((b, i) => (
        <rect
          key={i}
          className="paperbit"
          x={b.x}
          y={lifted ? 118 - i * 9 - 14 : 150}
          width={b.w}
          height={b.h}
          rx={1.5}
          transform={lifted ? `rotate(${-14 + i * 9} ${b.x + b.w / 2} 130)` : undefined}
        />
      ))}
    </>
  );
}

/** What you need, before you start. */
export function KitScene() {
  return (
    <div className="stage tight">
      <svg className="scene narrow" viewBox="0 0 320 110" role="img" aria-label="A comb, some torn bits of paper, and a second comb">
        <g transform="translate(52,20)">
          <rect className="comb" x={-8} y={0} width={16} height={44} rx={3} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} className="comb-tooth" x1={-6 + i * 2.4} y1={44} x2={-6 + i * 2.4} y2={62} />
          ))}
          <text x={0} y={82} textAnchor="middle" className="scene-label-txt">a comb</text>
        </g>
        <g transform="translate(160,0)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} className="paperbit" x={-30 + i * 14} y={44 + (i % 2) * 7} width={11} height={6} rx={1.5} />
          ))}
          <text x={0} y={82} textAnchor="middle" className="scene-label-txt">torn paper</text>
        </g>
        <g transform="translate(262,20)">
          <rect className="comb alt" x={-8} y={0} width={16} height={44} rx={3} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} className="comb-tooth" x1={-6 + i * 2.4} y1={44} x2={-6 + i * 2.4} y2={62} />
          ))}
          <text x={0} y={82} textAnchor="middle" className="scene-label-txt">and a second one</text>
        </g>
      </svg>
    </div>
  );
}

/** The comb held over the paper. `lifted` shows the bits jumping. */
export function CombPaperScene({ lifted = false, kind = 'plus' }: { lifted?: boolean; kind?: 'plus' | 'minus' }) {
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 340 190"
        role="img"
        aria-label={
          lifted
            ? 'A comb held above torn paper, with the bits lifting up towards it'
            : 'A comb held above torn paper, with the bits lying flat on the table'
        }
      >
        <g transform="translate(190,18)">
          <rect className={`comb ${kind === 'minus' ? 'alt' : ''}`} x={-10} y={0} width={20} height={52} rx={3} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} className="comb-tooth" x1={-7.5 + i * 2.5} y1={52} x2={-7.5 + i * 2.5} y2={74} />
          ))}
          <text x={0} y={-6} textAnchor="middle" className="scene-label-txt">
            {kind === 'plus' ? 'comb, one kind' : 'comb, the other kind'}
          </text>
        </g>
        <line className="table" x1={20} y1={158} x2={320} y2={158} />
        <Bits lifted={lifted} />
        <text x={170} y={180} textAnchor="middle" className="scene-label-txt">
          {lifted ? 'the bits jump up' : 'nobody rubbed the paper'}
        </text>
      </svg>
    </div>
  );
}

/** Inside one scrap: both kinds, balanced or shifted. Never net-charged. */
export function InsideScene({ state, kind = 'plus' }: { state: 'balanced' | 'shifted'; kind?: 'plus' | 'minus' }) {
  const shifted = state === 'shifted';
  // The near end is always UNLIKE the comb — that is the whole explanation.
  const nearIsPos = kind === 'minus';
  const off = shifted ? 13 : 0;
  return (
    <div className="stage">
      <svg
        className="scene"
        viewBox="0 0 340 150"
        role="img"
        aria-label={
          shifted
            ? 'Inside one scrap of paper: both kinds of charge are still there, but shifted, so the end nearer the comb is the unlike kind'
            : 'Inside one scrap of paper: both kinds of charge, evenly mixed and balanced'
        }
      >
        {shifted && (
          <g transform="translate(34,42)">
            <rect className={`comb ${kind === 'minus' ? 'alt' : ''}`} x={-9} y={0} width={18} height={40} rx={3} />
            <text x={0} y={-8} textAnchor="middle" className="scene-label-txt">comb</text>
          </g>
        )}
        <rect className="scrap" x={110} y={44} width={190} height={62} rx={6} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx={140 + i * 42 - off} cy={68} r={9} fill={nearIsPos ? POS : NEG} />
            <text x={140 + i * 42 - off} y={72} textAnchor="middle" className="glyph">{nearIsPos ? '+' : '−'}</text>
            <circle cx={140 + i * 42 + off} cy={90} r={9} fill={nearIsPos ? NEG : POS} />
            <text x={140 + i * 42 + off} y={94} textAnchor="middle" className="glyph">{nearIsPos ? '−' : '+'}</text>
          </g>
        ))}
        <text x={205} y={126} textAnchor="middle" className="scene-label-txt">
          {shifted
            ? 'both kinds still here · the near side is the unlike kind'
            : 'both kinds, evenly mixed · leftover zero'}
        </text>
        {shifted && (
          <text x={205} y={36} textAnchor="middle" className="scene-label-txt">
            nothing has left the paper
          </text>
        )}
      </svg>
    </div>
  );
}

/**
 * THE PHYSICS FIGURE. Same scrap, same field strength at its centre. On the
 * left the field gets weaker further away, so the near pull beats the far push.
 * On the right every arrow is the same length, the two cancel exactly, and the
 * scrap does not move however strong the field is.
 */
export function GradientScene() {
  const arrow = (x: number, y: number, len: number, key: string) => (
    <line key={key} className="fieldarrow" x1={x} y1={y} x2={x + len} y2={y} markerEnd="url(#e4-tip)" />
  );
  return (
    <div className="stage">
      <svg
        className="scene wide"
        viewBox="0 0 400 200"
        role="img"
        aria-label="Two cases side by side. On the left the push gets weaker with distance and the scrap is pulled in. On the right the push is the same everywhere and the scrap does not move at all."
      >
        <defs>
          <marker id="e4-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="arrowhead" />
          </marker>
        </defs>

        <text x={100} y={16} textAnchor="middle" className="fig-head">push weaker further away</text>
        {[0, 1, 2, 3].map((i) => arrow(28 + i * 40, 44, 30 - i * 6, `a${i}`))}
        <rect className="scrap" x={58} y={68} width={92} height={40} rx={5} />
        <circle cx={74} cy={88} r={8} fill={NEG} /><text x={74} y={92} textAnchor="middle" className="glyph">−</text>
        <circle cx={134} cy={88} r={8} fill={POS} /><text x={134} y={92} textAnchor="middle" className="glyph">+</text>
        <line className="netforce" x1={104} y1={126} x2={62} y2={126} markerEnd="url(#e4-tip)" />
        <text x={100} y={150} textAnchor="middle" className="good-txt">it moves</text>
        <text x={100} y={168} textAnchor="middle" className="scene-label-txt">near pull beats far push</text>

        <line x1={200} y1={26} x2={200} y2={182} className="divider" />

        <text x={300} y={16} textAnchor="middle" className="fig-head">push the same everywhere</text>
        {[0, 1, 2, 3].map((i) => arrow(228 + i * 40, 44, 24, `b${i}`))}
        <rect className="scrap" x={258} y={68} width={92} height={40} rx={5} />
        <circle cx={274} cy={88} r={8} fill={NEG} /><text x={274} y={92} textAnchor="middle" className="glyph">−</text>
        <circle cx={334} cy={88} r={8} fill={POS} /><text x={334} y={92} textAnchor="middle" className="glyph">+</text>
        <text x={300} y={132} textAnchor="middle" className="bad-txt">nothing happens</text>
        <text x={300} y={150} textAnchor="middle" className="scene-label-txt">the two ends cancel</text>
        <text x={300} y={168} textAnchor="middle" className="scene-label-txt">however strong the push is</text>
      </svg>
    </div>
  );
}
