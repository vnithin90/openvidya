import type React from 'react';
/**
 * Screen jumper — development only.
 *
 * Reviewing presentation means looking at a screen, changing a word, and looking
 * again. With sixteen screens and locked predictions in the way, that loop costs
 * more than the edit does, so figures at the end of a lesson get reviewed once
 * and then not again.
 *
 * WHY THIS IS SAFE TO SHIP IN THE SOURCE
 * --------------------------------------
 * `import.meta.env.DEV` is a literal that Vite replaces at build time — `true`
 * for `astro dev`, `false` for `astro build`. The `false` branch is then dead
 * code and is removed entirely, so nothing below reaches a student's browser.
 *
 * That is a claim, and claims in this repository get checked: see
 * tests/no-dev-tools-in-build.test.ts, which greps the production output.
 *
 * It sets state directly, which means it can put a lesson into a combination the
 * student journey would never produce — an unlocked prediction on a late screen,
 * say. That is the point. It is a viewing tool, not a simulator, and it must
 * never be used to decide that a flow works.
 */

/**
 * Styles are inline rather than in the global stylesheet, deliberately.
 *
 * They lived in InvestigateLayout at first, and the build check caught it: CSS
 * is not tree-shaken by usage, so `.devjump-btn` shipped to every student even
 * though the component that used it had been eliminated. Harmless, but it meant
 * the build could not honestly claim the dev tool left no trace — and it forced
 * the check to carve out an exception, which is how checks rot.
 *
 * Inline styles travel with the component, so when the component goes, they go.
 */
const S = {
  bar: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.25rem',
    padding: '.4rem .5rem', margin: '0 0 1rem', border: '1px dashed #c7b8e0',
    borderRadius: 8, background: '#faf7ff', fontSize: '.74rem',
  },
  tag: {
    fontWeight: 700, color: '#6b4e94', letterSpacing: '.05em',
    textTransform: 'uppercase', marginRight: '.2rem',
  },
  btn: {
    font: 'inherit', minWidth: '1.6rem', padding: '.12rem .3rem', cursor: 'pointer',
    border: '1px solid #d8cceb', background: '#fff', color: '#6b4e94', borderRadius: 5,
  },
  btnOn: { background: '#6b4e94', color: '#fff', borderColor: '#6b4e94', fontWeight: 700 },
  seed: {
    font: 'inherit', padding: '.12rem .45rem', cursor: 'pointer', borderRadius: 5,
    border: '1px solid #d8cceb', background: '#fff', color: '#6b4e94', marginRight: '.3rem',
  },
  now: { marginLeft: 'auto', color: '#8b7aa8', fontFamily: 'ui-monospace, monospace' },
} as const;

interface Props<T extends string> {
  steps: readonly T[];
  current: T;
  onJump: (step: T) => void;
  /** Optional: fills in a plausible run so late screens have something to show. */
  onSeed?: () => void;
  label?: string;
}

export default function DevJump<T extends string>({
  steps, current, onJump, onSeed, label = 'dev',
}: Props<T>) {
  if (!import.meta.env.DEV) return null;
  return (
    <div style={S.bar as React.CSSProperties} role="navigation" aria-label="Development screen jumper">
      <span style={S.tag as React.CSSProperties}>{label}</span>
      {onSeed && (
        <button type="button" style={S.seed as React.CSSProperties} onClick={onSeed}>
          seed a run
        </button>
      )}
      {steps.map((s, i) => (
        <button
          key={s}
          type="button"
          style={{ ...S.btn, ...(s === current ? S.btnOn : {}) } as React.CSSProperties}
          onClick={() => onJump(s)}
          title={`${i + 1}. ${s}`}
        >
          {i + 1}
        </button>
      ))}
      <span style={S.now as React.CSSProperties}>{current}</span>
    </div>
  );
}
