/**
 * SELF-CHECK · the acceptance questions, on the page
 *
 * These are the same items as docs/specs/module-1-acceptance-questions.md,
 * reworded for students. Putting them here closes the loop: the criteria the
 * module was specified against are the criteria the reader is held to.
 *
 * Deliberately NOT multiple choice. Each asks for reasoning, then shows what a
 * good answer contains — and, just as importantly, what a plausible-sounding
 * wrong answer looks like, because the wrong answers here often get the number
 * right.
 */

import { useState } from 'react';

interface Item {
  q: string;
  good: string;
  trap: string;
  trapLabel: string;
}

const ITEMS: Item[] = [
  {
    q: 'An object contains 500 protons and 500 electrons. What is its net charge? Does it contain any charged particles?',
    good:
      'Net charge zero — it is neutral. But it contains a thousand charged particles. Neutral means the two kinds balance, not that there is nothing there. Only the difference N₊ − N₋ shows up as charge.',
    trapLabel: 'The answer to watch for',
    trap:
      '"Zero charge, so no charged particles." This is the picture that makes later electricity confusing: it leaves no way for an object to become charged, since there would be nothing to move.',
  },
  {
    q: 'You are told that 6 C of charge crossed a point. Can you state the current? If not, what else do you need — and why?',
    good:
      'No. Current is charge per unit time, so you need the time interval as well. 6 C in 6 s is 1 A; 6 C in 0.1 s is 60 A. The charge on its own fixes neither.',
    trapLabel: 'The answer to watch for',
    trap:
      '"No — I need to know how fast the charges are moving." This asks for the wrong quantity. Nothing on this page has told you how fast anything moves, and you can still work out the current the moment you know the time.',
  },
  {
    q: 'Two runs move the same charge, one of them in half the time. Which has the larger current, and why? Answer without using the word "faster" about the charges.',
    good:
      'The shorter run. The same amount of charge crossed, but it crossed in less time, so more charge crossed per second. That quotient is what current means.',
    trapLabel: 'The answer to watch for',
    trap:
      '"The second one, because the electrons are moving faster." The number is right and the reason is not — and that reasoning will give wrong answers later, when the same current is produced by very different arrangements of carriers.',
  },
  {
    q: 'If the counting line in Scene 2 had been drawn somewhere else along the channel, would the amount of charge in the packet change?',
    good:
      'No. The line marks where you chose to stand and count; it does not affect what passes. The same charge goes past every point along the way.',
    trapLabel: 'The answer to watch for',
    trap:
      '"Yes, it would catch different particles." This reads the dashed line as an object in the channel. It is not — nothing is intercepted, blocked, or collected there.',
  },
  {
    q: 'A AA cell delivers hundreds of times more total charge over its life than a lightning stroke transfers, yet lightning\'s current is tens of thousands of times larger. How can both be true?',
    good:
      'Because they are answers to different questions. Total charge is a count; current is a rate. The cell spreads a large amount over hours, the stroke concentrates a smaller amount into microseconds.',
    trapLabel: 'The answer to watch for',
    trap:
      '"One of those figures must be wrong." Both are right. Ranking two situations by amount and by rate can put them in opposite orders — which is the entire point of this module.',
  },
];

export default function SelfCheck() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="selfcheck">
      <h2>Check yourself</h2>
      <p className="sc-intro">
        Try each one out loud before opening it. Getting the number right is not the same as
        getting it right — every one of these has a wrong answer that lands on the correct
        figure.
      </p>

      {ITEMS.map((item, i) => (
        <div key={i} className={`sc-item ${open === i ? 'open' : ''}`}>
          <p className="sc-q">
            <span className="sc-n">{i + 1}</span>
            {item.q}
          </p>
          <button onClick={() => setOpen(open === i ? null : i)}>
            {open === i ? 'Hide' : 'What a good answer contains'}
          </button>
          {open === i && (
            <div className="sc-body">
              <p className="sc-good">
                <b>A good answer:</b> {item.good}
              </p>
              <p className="sc-trap">
                <b>{item.trapLabel}:</b> {item.trap}
              </p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
