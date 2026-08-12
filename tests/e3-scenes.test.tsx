/**
 * E3's figures and the geometry the lesson's argument rests on.
 *
 * §5a is explicit that the six positions are not decorative: without two at
 * equal distance in different directions the student cannot see that direction
 * does NOT matter, and without two in the same direction at different distances
 * they cannot see that distance does. A future tidy-up that spaces the six
 * evenly around one circle would look neater and destroy the lesson.
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  CX, CY, EQUAL_DISTANCE, GapScene, MapScene, POSITIONS, SAME_DIRECTION, TimingScene, posXY,
} from '../src/components/investigate/scenes/E3Scenes';

describe('1. the six positions provide both comparisons §5a requires', () => {
  it('there are exactly six', () => {
    expect(POSITIONS).toHaveLength(6);
  });

  it('four sit at equal distance in different directions', () => {
    const set = POSITIONS.filter((p) => EQUAL_DISTANCE.includes(p.id));
    expect(set).toHaveLength(4);
    const radii = new Set(set.map((p) => p.r));
    expect(radii.size, 'they must share one radius').toBe(1);
    const angles = new Set(set.map((p) => p.deg));
    expect(angles.size, 'and point in four different directions').toBe(4);
  });

  it('two pairs sit in the same direction at different distances', () => {
    expect(SAME_DIRECTION).toHaveLength(2);
    for (const [near, far] of SAME_DIRECTION) {
      const a = POSITIONS.find((p) => p.id === near)!;
      const b = POSITIONS.find((p) => p.id === far)!;
      expect(a.deg, 'same direction').toBe(b.deg);
      expect(b.r, 'genuinely further out').toBeGreaterThan(a.r);
    }
  });

  it('the layout is symmetric — no probe sits on top of another', () => {
    const seen = new Set(POSITIONS.map((p) => `${p.deg}:${p.r}`));
    expect(seen.size).toBe(POSITIONS.length);
  });
});

describe('2. the map draws only what the student has committed', () => {
  const empty = renderToStaticMarkup(<MapScene />);
  const full = renderToStaticMarkup(
    <MapScene choices={{ a: 'out', b: 'out', c: 'out', d: 'out', e: 'out', f: 'out' }} />,
  );

  it('with no choices, no arrows', () => {
    expect(empty).not.toContain('probe-arrow');
  });

  it('with six choices, six arrows', () => {
    expect([...full.matchAll(/probe-arrow/g)]).toHaveLength(6);
  });

  it('an empty map says so in its alt text, rather than describing arrows', () => {
    expect(/aria-label="([^"]+)"/.exec(empty)![1]).toContain('waiting');
    expect(/aria-label="([^"]+)"/.exec(full)![1]).toContain('arrows');
  });

  it('"out" really points away from the source', () => {
    // Direction is the entire content of this map. If the sign flips, the lesson
    // draws attraction while the student reported repulsion — E1's oldest bug.
    const p = POSITIONS.find((x) => x.id === 'a')!;
    const { x, y } = posXY(p);
    const m = new RegExp(`x1="${x}" y1="${y}" x2="([\\d.]+)" y2="([\\d.]+)"`).exec(full);
    expect(m, 'arrow at position a').not.toBeNull();
    const before = Math.hypot(x - CX, y - CY);
    const after = Math.hypot(Number(m![1]) - CX, Number(m![2]) - CY);
    expect(after, 'the tip must be further from the source than the tail').toBeGreaterThan(before);
  });

  it('and "in" points back at it', () => {
    const one = renderToStaticMarkup(<MapScene choices={{ a: 'in' }} />);
    const p = POSITIONS.find((x) => x.id === 'a')!;
    const { x, y } = posXY(p);
    const m = new RegExp(`x1="${x}" y1="${y}" x2="([\\d.]+)" y2="([\\d.]+)"`).exec(one)!;
    expect(Math.hypot(Number(m[1]) - CX, Number(m[2]) - CY)).toBeLessThan(Math.hypot(x - CX, y - CY));
  });
});

describe('3. the source is a sphere, never a rod', () => {
  const svg = renderToStaticMarkup(<MapScene />);
  it('drawn as a circle', () => {
    expect(svg).toContain('class="sphere source"');
  });
  it('and there is no rod anywhere in E3s figures', () => {
    for (const s of [svg, renderToStaticMarkup(<GapScene />), renderToStaticMarkup(<TimingScene />)]) {
      expect(s).not.toContain('class="rod"');
    }
  });
});

describe('4. every figure is well formed and described', () => {
  const figures = {
    map: renderToStaticMarkup(<MapScene choices={{ a: 'out' }} />),
    gap: renderToStaticMarkup(<GapScene />),
    timing: renderToStaticMarkup(<TimingScene />),
  };
  for (const [name, svg] of Object.entries(figures)) {
    it(`${name} — tags balanced`, () => {
      for (const tag of ['g', 'svg', 'defs', 'marker', 'text']) {
        const o = (svg.match(new RegExp(`<${tag}[ >]`, 'g')) || []).length;
        const c = (svg.match(new RegExp(`</${tag}>`, 'g')) || []).length;
        expect(o, `${tag} in ${name}`).toBe(c);
      }
    });
    it(`${name} — carries a real aria-label`, () => {
      expect(svg).toMatch(/aria-label="[^"]{25,}"/);
    });
  }

  it('the gap scene labels the emptiness, which is its whole point', () => {
    expect(figures.gap).toContain('nothing here');
  });

  it('the timing scene asks rather than answers — no wavefront is drawn', () => {
    // A drawn travelling disturbance would assert the ontology E3 refuses to.
    expect(figures.timing).toContain('when does this one know?');
    expect(figures.timing).not.toMatch(/wave|ripple|front/i);
  });
});
