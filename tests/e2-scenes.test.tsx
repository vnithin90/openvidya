/**
 * E2 figures, checked by rendering them rather than by looking at them.
 *
 * The static tree learned this the hard way: three captions were caught clipping
 * the frame edge by eye, one at a time, and a sign convention was inverted for
 * days because the drawing looked plausible. Eyes are the wrong instrument.
 *
 * Everything here recomputes what a figure claims. Nothing asserts a coordinate
 * copied out of the component.
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  BalanceFigure,
  ChargingFigure,
  ConductionFigure,
  HalvingFigure,
  LawChart,
  NullTestFigure,
  PairFigure,
  ProductFigure,
  SequenceFigure,
} from '../src/components/investigate/scenes/E2Scenes';
import { DRAWN, predicted } from '../src/physics/coulomb-force/model';

const figures: Record<string, string> = {
  pair: renderToStaticMarkup(<PairFigure showRule caption="two identical spheres on threads" />),
  pair_close: renderToStaticMarkup(<PairFigure r={29} showRule ruleLabel="r after 3 halvings" />),
  halving: renderToStaticMarkup(<HalvingFigure />),
  balance: renderToStaticMarkup(<BalanceFigure />),
  charging: renderToStaticMarkup(<ChargingFigure />),
  nullTest_right: renderToStaticMarkup(<NullTestFigure />),
  nullTest_wrong: renderToStaticMarkup(<NullTestFigure wrong />),
  sequence: renderToStaticMarkup(<SequenceFigure />),
  sequence_fractions: renderToStaticMarkup(<SequenceFigure showFractions />),
  conduction: renderToStaticMarkup(<ConductionFigure />),
  product: renderToStaticMarkup(<ProductFigure />),
  chart: renderToStaticMarkup(<LawChart k={3} measured={0.262} />),
  chart_blank: renderToStaticMarkup(<LawChart k={1} />),
};

describe('1. every figure is well formed and described', () => {
  for (const [name, svg] of Object.entries(figures)) {
    it(`${name} — tags balanced`, () => {
      for (const tag of ['g', 'svg', 'defs', 'marker', 'text']) {
        const open = (svg.match(new RegExp(`<${tag}[ >]`, 'g')) || []).length;
        const close = (svg.match(new RegExp(`</${tag}>`, 'g')) || []).length;
        expect(open, `${tag} in ${name}`).toBe(close);
      }
    });

    it(`${name} — carries a real aria-label`, () => {
      expect(svg).toMatch(/aria-label="[^"]{25,}"/);
    });

    it(`${name} — declares a viewBox with positive extent`, () => {
      const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
      expect(m, name).not.toBeNull();
      expect(Number(m![1])).toBeGreaterThan(0);
      expect(Number(m![2])).toBeGreaterThan(0);
    });
  }
});

describe('2. nothing is drawn outside its own frame', () => {
  // Crude but it catches the case that matters: geometry escaping the viewBox.
  for (const [name, svg] of Object.entries(figures)) {
    it(`${name} stays inside its viewBox`, () => {
      const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg)!;
      const W = Number(vb[1]);
      const H = Number(vb[2]);
      // Only elements not inside a <g transform> can be checked naively.
      const flat = svg.replace(/<g transform[\s\S]*?<\/g>/g, '');
      for (const attr of ['cx', 'x1', 'x2'] as const) {
        for (const m of flat.matchAll(new RegExp(`${attr}="(-?[\\d.]+)"`, 'g'))) {
          expect(Number(m[1]), `${name} ${attr}`).toBeGreaterThanOrEqual(-20);
          expect(Number(m[1]), `${name} ${attr}`).toBeLessThanOrEqual(W + 20);
        }
      }
      for (const attr of ['cy', 'y1', 'y2'] as const) {
        for (const m of flat.matchAll(new RegExp(`${attr}="(-?[\\d.]+)"`, 'g'))) {
          expect(Number(m[1]), `${name} ${attr}`).toBeGreaterThanOrEqual(-20);
          expect(Number(m[1]), `${name} ${attr}`).toBeLessThanOrEqual(H + 20);
        }
      }
    });
  }
});

describe('3. the pair figure is drawn to the scale it claims', () => {
  it('ball radius really is 1/20 of the drawn separation', () => {
    const r = /r="([\d.]+)"/g;
    const radii = [...figures.pair.matchAll(r)].map((m) => Number(m[1]));
    expect(radii).toContain(DRAWN.ballR);
  });

  it('a closer pair really is drawn closer', () => {
    const xs = (svg: string) =>
      [...svg.matchAll(/<circle class="sphere" cx="([\d.]+)"/g)].map((m) => Number(m[1]));
    const wide = xs(figures.pair);
    const close = xs(figures.pair_close);
    expect(Math.abs(wide[1] - wide[0])).toBeGreaterThan(Math.abs(close[1] - close[0]));
  });
});

describe('4. the sequence figure does not print the answer', () => {
  // An earlier version showed 0.630 / 0.397 / 0.250 on the screen where the
  // student is about to record their own numbers, captioned "do not look at
  // them yet". Removing the numbers is the fix; an instruction is not.
  it('hides the predicted fractions by default', () => {
    for (const k of [1, 2, 3]) {
      expect(figures.sequence).not.toContain(predicted(2, k).toFixed(3));
    }
  });

  it('shows them only when explicitly asked', () => {
    expect(figures.sequence_fractions).toContain(predicted(2, 1).toFixed(3));
  });
});

describe('5. the null-test figure draws the wrong placement too', () => {
  it('the correct one sits on the line joining the pair', () => {
    expect(figures.nullTest_right).toContain('on the line joining');
    expect(figures.nullTest_right).not.toContain('no signal');
  });

  it('the wrong one says why it is useless', () => {
    expect(figures.nullTest_wrong).toContain('passes anything');
  });

  it('and they place the spare in genuinely different spots', () => {
    const spare = (svg: string) =>
      /<circle class="sphere (?:good|bad)" cx="([\d.]+)" cy="([\d.]+)"/.exec(svg)!;
    const good = spare(figures.nullTest_right);
    const bad = spare(figures.nullTest_wrong);
    expect(good[1]).not.toBe(bad[1]);
    expect(good[2]).not.toBe(bad[2]);
  });
});

describe('6. the law chart', () => {
  it('marks all three candidate laws', () => {
    for (const n of [1, 2, 3]) expect(figures.chart).toContain(`lawtick n${n}`);
  });

  it('prints the ratios the physics module gives, not hand-typed ones', () => {
    for (const n of [1, 2, 3]) expect(figures.chart).toContain(predicted(n, 3).toFixed(3));
  });

  it('shows the student mark only once there is a measurement', () => {
    expect(figures.chart).toContain('youmark');
    expect(figures.chart_blank).not.toContain('youmark');
  });
});
