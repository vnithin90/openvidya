/**
 * E1 figures, checked by rendering them.
 *
 * The first test below is the important one. An earlier version of these scenes
 * had the rotation sign inverted and drew REPULSION AS ATTRACTION — the two
 * balloons moved together on the screen where the student had just reported
 * them flying apart. It looked plausible for days.
 *
 * A picture that contradicts the caption is worse than no picture, so the
 * geometry is asserted rather than admired.
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ApparatusScene,
  CancellationScene,
  FranklinExperiment,
  FranklinPortrait,
  HairScene,
  MiniScene,
  PairScene,
  miniGap,
  pairGap,
} from '../src/components/investigate/scenes/E1Scenes';

const figures: Record<string, string> = {
  pair_rest: renderToStaticMarkup(<PairScene angle={0} leftLabel="rubbed" rightLabel="rubbed" />),
  pair_repel: renderToStaticMarkup(<PairScene angle={17} leftLabel="rubbed" rightLabel="rubbed" />),
  pair_attract: renderToStaticMarkup(<PairScene angle={-11} leftLabel="rubbed" rightLabel="from the packet" />),
  hair_down: renderToStaticMarkup(<HairScene lift={0} />),
  hair_up: renderToStaticMarkup(<HairScene lift={1} />),
  mini_pair: renderToStaticMarkup(<MiniScene kind="pair" />),
  mini_hair: renderToStaticMarkup(<MiniScene kind="hair" />),
  mini_plain: renderToStaticMarkup(<MiniScene kind="plain" />),
  cancellation: renderToStaticMarkup(<CancellationScene />),
  apparatus: renderToStaticMarkup(<ApparatusScene />),
  franklin: renderToStaticMarkup(<FranklinPortrait />),
  experiment: renderToStaticMarkup(<FranklinExperiment />),
};

describe('1. THE SIGN CONVENTION — repulsion must be drawn as repulsion', () => {
  it('a positive angle pushes the balloons further apart than at rest', () => {
    expect(pairGap(17)).toBeGreaterThan(pairGap(0));
  });

  it('a negative angle draws them closer together', () => {
    expect(pairGap(-11)).toBeLessThan(pairGap(0));
  });

  it('and the rendered markup agrees with the trigonometry', () => {
    // rotate(+a) on the left group, rotate(-a) on the right. Getting these the
    // same way round is exactly the bug this file exists to prevent.
    expect(figures.pair_repel).toContain('rotate(17deg)');
    expect(figures.pair_repel).toContain('rotate(-17deg)');
  });

  it('the miniatures use the same convention', () => {
    expect(miniGap(21)).toBeGreaterThan(miniGap(0));
    expect(miniGap(-9)).toBeLessThan(miniGap(0));
  });

  it('so the pair miniature is drawn apart and the plain one together', () => {
    expect(figures.mini_pair).toContain('rotate(21deg)');
    expect(figures.mini_plain).toContain('rotate(-9deg)');
  });
});

describe('2. the swinging groups can rotate about the rail', () => {
  // Without transform-box: fill-box the origin resolves against the whole
  // viewBox and the threads tear away from the rail. The class must be present
  // for the stylesheet rule to reach them.
  it('every rotated group carries the swing class', () => {
    for (const name of ['pair_repel', 'mini_pair']) {
      const rotations = [...figures[name].matchAll(/rotate\(-?[\d.]+deg\)/g)].length;
      const swings = [...figures[name].matchAll(/class="swing"/g)].length;
      expect(swings, name).toBeGreaterThanOrEqual(rotations);
    }
  });
});

describe('3. the hair responds to lift, and only to lift', () => {
  it('lift changes where the strands end', () => {
    expect(figures.hair_down).not.toBe(figures.hair_up);
  });

  it('nine strands either way — the count is not the variable', () => {
    const count = (s: string) => [...s.matchAll(/class="hair"/g)].length;
    expect(count(figures.hair_down)).toBe(9);
    expect(count(figures.hair_up)).toBe(9);
  });

  it('hair is drawn as a mass in the miniature, not a bare scalp', () => {
    expect(figures.mini_hair).toContain('hair-mass');
  });
});

describe('4. the cancellation scene stays visibly full while reading zero', () => {
  it('draws ten pairs', () => {
    expect([...figures.cancellation.matchAll(/class="kind-pos"/g)]).toHaveLength(10);
    expect([...figures.cancellation.matchAll(/class="kind-neg"/g)]).toHaveLength(10);
  });

  it('equal numbers of each kind, which is the whole point', () => {
    const pos = [...figures.cancellation.matchAll(/class="kind-pos"/g)].length;
    const neg = [...figures.cancellation.matchAll(/class="kind-neg"/g)].length;
    expect(pos).toBe(neg);
  });

  it('and says nothing was taken out', () => {
    expect(figures.cancellation).toContain('nothing has been taken out of it');
  });
});

describe('5. Franklin', () => {
  it('the experiment names A, B and C, which the quotation does not', () => {
    for (const s of ['rubs the tube', 'draws the spark', 'on the floor']) {
      expect(figures.experiment).toContain(s);
    }
  });

  it('the fire path is B to C to A, drawn as two arcs', () => {
    expect(figures.experiment).toContain('B gives a spark to C');
    expect(figures.experiment).toContain('C gives one to A');
  });

  it('the portrait ships no binary asset and makes no network request', () => {
    expect(figures.franklin).not.toMatch(/<image|href="http|src=/);
  });
});

describe('6. every figure is well formed and described', () => {
  for (const [name, svg] of Object.entries(figures)) {
    it(`${name} — tags balanced`, () => {
      for (const tag of ['g', 'svg', 'defs', 'marker', 'text']) {
        const open = (svg.match(new RegExp(`<${tag}[ >]`, 'g')) || []).length;
        const close = (svg.match(new RegExp(`</${tag}>`, 'g')) || []).length;
        expect(open, `${tag} in ${name}`).toBe(close);
      }
    });

    it(`${name} — carries a real aria-label`, () => {
      expect(svg).toMatch(/aria-label="[^"]{20,}"/);
    });
  }
});

describe('7. the alt text says what the picture says', () => {
  it('repelling and attracting are described differently', () => {
    const alt = (s: string) => /aria-label="([^"]+)"/.exec(s)![1];
    expect(alt(figures.pair_repel)).toContain('apart');
    expect(alt(figures.pair_attract)).toContain('towards each other');
    expect(alt(figures.pair_rest)).toContain('straight down');
  });
});
