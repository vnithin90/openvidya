/**
 * The predicted-against-observed panel.
 *
 * This is the one component that speaks to a student at the moment their
 * expectation meets a result, so what it says there is a charter question, not
 * a styling one. Three things must hold, and none of them is about wording:
 *
 *  1. A MATCH MUST NOT READ AS "DONE". One agreement is not evidence, and E1,
 *     E2 and E3 each spend a screen making that point. If this panel says
 *     "correct", the panel undoes them.
 *
 *  2. "I CANNOT SAY" IS NOT A MISS. Several screens offer it deliberately.
 *     Colouring it like a wrong answer teaches that refusing to guess is
 *     punished, which is the opposite of what the course is for.
 *
 *  3. NO SCORING VOCABULARY ANYWHERE. Not "right", not "wrong", not "correct".
 *     The charter allows only: you predicted X, the experiment produced Y.
 *
 * Tested by rendering and reading the emitted text, so the assertions are about
 * what a student sees. Checking the source for a phrase would pass on a
 * component that never renders it.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Contrast } from '../src/components/investigate/runtime';

const text = (el: React.ReactElement) =>
  renderToStaticMarkup(el).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const cls = (el: React.ReactElement) =>
  renderToStaticMarkup(el).match(/class="contrast ([a-z]+)"/)?.[1];

const MATCH = <Contrast predicted="a" observed="a" predictedLabel="PULLED" observedLabel="PULLED" />;
const MISS = <Contrast predicted="a" observed="b" predictedLabel="PUSHED" observedLabel="PULLED" />;
const OPEN = <Contrast predicted={undefined} observed="b" predictedLabel="I cannot say" observedLabel="PULLED" />;

describe('what the student is shown', () => {
  it('shows both labels in all three cases', () => {
    expect(text(MATCH)).toContain('PULLED');
    expect(text(MISS)).toContain('PUSHED');
    expect(text(MISS)).toContain('PULLED');
    expect(text(OPEN)).toContain('I cannot say');
    expect(text(OPEN)).toContain('PULLED');
  });

  it('separates the three outcomes so they can be styled differently', () => {
    expect(cls(MATCH)).toBe('agree');
    expect(cls(MISS)).toBe('mismatch');
    expect(cls(OPEN)).toBe('open');
  });
});

describe('a match does not end the enquiry', () => {
  it('tells the student to carry on', () => {
    expect(text(MATCH).toLowerCase()).toMatch(/keep going|not enough/);
  });

  it('says in words that one agreement is not sufficient', () => {
    /* The property: the match verdict must qualify itself. A verdict that is
       purely congratulatory fails, however it is phrased. */
    const v = text(MATCH).toLowerCase();
    expect(v, 'a match must carry a caveat, not just praise').toMatch(
      /not enough|one match|does not (prove|settle)|keep going/,
    );
  });
});

describe('no scoring vocabulary reaches the student', () => {
  for (const [name, el] of [['match', MATCH], ['mismatch', MISS], ['no prediction', OPEN]] as const) {
    it(`${name} avoids right/wrong/correct`, () => {
      /* Word boundaries: "incorrect" and "correct" both banned, but "corrected"
         in a label a lesson passes in is the lesson's business, not ours —
         these fixtures use neutral labels so any hit is the component's. */
      expect(text(el)).not.toMatch(/\b(correct|incorrect|right|wrong|score|marks?)\b/i);
    });
  }

  it('never claims the student failed when they declined to predict', () => {
    const v = text(OPEN).toLowerCase();
    expect(v).not.toContain('not what you expected');
    expect(v, 'must acknowledge there was nothing to compare').toMatch(/nothing to compare|could not tell/);
  });
});

describe('the mismatch is a fact, not a judgment', () => {
  it('reports a difference and asks for an explanation', () => {
    const v = text(MISS).toLowerCase();
    expect(v).toMatch(/not what you expected/);
    expect(v).toMatch(/explain/);
  });
});
