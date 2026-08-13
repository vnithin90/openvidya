# What the Astro build took from the parallel plain-JS tree

Reviewed `openvidya-grok/js/core.js` in full on 13 Aug 2026 after the E4 review,
looking for anything worth adopting **across the whole build** rather than in one
lesson. Three things were, and one of them was a real defect on our side.

```text
STATUS:   IMPLEMENTED — src/components/investigate/runtime.tsx, all four lessons
SCOPE:    storage, the predicted-vs-observed panel, prerequisites
EVIDENCE: 469 tests pass; the shipped dist/ contains zero calls to localStorage;
          five mutations of the new module were each caught by the new tests
```

---

## 1. `sessionStorage`, not `localStorage` — this was a bug, not a preference

Every lesson stored its run in `localStorage`. The reasoning in the other tree's
README is short and correct:

> survives refresh (so a locked prediction cannot be escaped) and dies when the
> tab closes (shared lab machines stay clean)

**A school computer is shared.** With `localStorage`, the next student sits down,
opens E2, and finds the previous student's predictions already locked, their
judgments already committed, and the reveals already open. They are shown the
answers to questions they were never asked.

The lock is the mechanism the entire course rests on. Making it *somebody else's*
lock does not weaken it slightly; it inverts what it is for. We had it wrong for
four lessons and did not notice, because every machine we tested on had one user.

`sessionStorage` keeps the property we needed (a refresh cannot escape a
commitment) and drops the one we never wanted.

### The necessary counterpart

Session storage alone would be **worse** than what it replaced. E2 spans a bench
session that may not happen in one sitting — charge the balls, wait for a dry
day, come back. Losing everything at tab close would punish exactly the students
doing the experiment properly.

So the record is downloadable, as it is in the other tree: a JSON file the
student keeps and re-opens, and can hand to a teacher. `RecordBar` appears at the
end of every lesson, which is when there is something worth keeping and the tab
is about to close. Nothing is sent anywhere. `tests/runtime.test.ts` asserts the
export carries five keys and no sixth — there is no field for a name.

## 2. `Contrast` — a verdict line, not two bare boxes

E1 had a local `Mismatch` component. E4 had two `.then-now` panels with no
verdict at all — the student saw the two values and was left to draw the
conclusion, which is fine for a strong reader and invisible to a weak one.

The other tree's `contrast()` includes the match case, and its wording is better
than ours was:

> *"That matches what you expected. One match is not enough to stop. Keep
> going."*

That sentence is doing curriculum work. A match must not read as *correct, you
may stop* — the course spends three lessons establishing that one agreement is
not evidence, and a panel saying "correct" would quietly undo all three.

One component now serves all four lessons. `tests/contrast.test.tsx` renders it
and asserts the properties: a match carries a caveat, a mismatch reports a
difference rather than a failure, and no outcome uses scoring vocabulary.

### One thing added beyond what was taken

Both trees had **two** outcomes. Several of our screens offer *"I cannot say"* as
a prediction, and we mean it — refusing to guess is a legitimate answer. Scored
against an observation it can never match, so it always rendered as a miss:
*"that is not what you expected."* That is false, and it teaches that saying *I
don't know* is punished, which is the opposite of the point.

`Contrast` now has a third state. No prediction, no comparison, neutral colour,
and the verdict asks what they would predict next time.

## 3. `PrereqNote` — soft, not a gate

Taken from their E4 entry: check the earned-models list, and if the prerequisite
is missing, say so and let the student continue.

A hard gate would be worse. A student arriving from a teacher's link is not
helped by a locked door, and with session storage the earned list only records
what happened in **this tab** — so a returning student would be locked out of a
lesson they have already earned the prerequisite for.

## What was deliberately **not** unified

`.then-now` in E2 and E3 stays as it is. Those panels show what the student
believed at the start against what they believe now — a change of mind, with no
experiment in between. Giving them a verdict line would be a lie about where the
second column came from. The distinction is recorded in `runtime.tsx` so the next
person does not "finish the job" by merging them.

## Verification

Implementation was by editing source; the check was against the built artifact,
which shares no code path with the edit:

```
grep -r localStorage dist/     →  no matches (34 built files, 11 pages)
grep -r sessionStorage dist/   →  models/index.html, _astro/runtime.*.js
```

Five mutations of `runtime.tsx` — praise-only match verdict, "I cannot say"
scored as a miss, `importRecord` accepting any file, `saveRun` dropping the
lesson key, `earnModel` duplicating — were each caught.

`tests/runtime.test.ts` parses lesson sources with comments and strings stripped
before searching, so `localStorage` can still be *named* in the comment that
explains why it is not used. Grepping for the identifier would have failed on
that comment, and the usual repair — weakening the pattern until it passes — is
how a check stops catching the thing it was written for.

The Storage stub in that test is a stub, not jsdom, and the file says so: adding
jsdom for four methods would slow every test file and put a dependency in the
manifest for one file's benefit. Its first case pins the two behaviours that
bite — values coerced to strings, absent keys giving `null`. If the runtime ever
needs more of the Storage API, the honest move is jsdom, not a fatter stub.
