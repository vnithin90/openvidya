# Backlog

Ordered by value over effort, not by enthusiasm. Rough sizes: **S** an hour or
two · **M** a day · **L** several days · **?** unknown until someone tries.

Defects live in `ISSUES.md`. This file is for work that adds something.

---

## 1 · Source the four ⚠ empirical values — **S, highest value**

Lightning charge transfer, peak stroke current, cell capacity, age of the
universe. All four are rendered to readers with an ⚠ marker.

Why first: it is the cheapest item on the list and the only one blocking anyone
being pointed at the site. A project whose central argument is that claims must
be verifiable cannot publish four uncited numbers, however honestly labelled.

Each needs value **or range**, uncertainty, conditions, and source. Cell capacity
needs a datasheet **with a load condition** — rated capacity is not "the charge
sitting in the battery."

## 2 · Test Module 1 and 2 on four to six students — **M, and nothing substitutes for it**

The one thing no test and no reviewer can settle. Protocol is written:
`docs/specs/module-1-acceptance-questions.md`, plus the design in
`charge-and-current.md` §6.4 — matched item forms counterbalanced, a comparison
group, think-aloud scored on reasoning, delayed retest at two weeks.

Six students cannot measure a learning gain and must not be reported as if they
could. They can surface failure modes nobody predicted, which is the point,
because at least six design assumptions are currently guesses. The sharpest
open question: **can a student hold the drift and random-motion pictures
together**, given Module 2 now shows drift?

## 2a · Build the E2 apparatus — blocker **B3**, **S to build, and it may invalidate a shipped lesson**

Same class as §2: only physical reality settles it. Two threads, two light
conducting balls, a charging rod, a timer.

**The decisive question is whether the pair settles faster than it leaks.** If
the separation is still drifting when the charge has already gone, the halving
sequence measures nothing and E2's central experiment does not work — as
deployed, to students.

Pre-register the pass criterion **before the first measurement**, and derive it
rather than choosing it: settling must be short enough that the charge lost
during it is small compared with the precision to which r can be read, which the
apparatus already fixes. A threshold chosen after seeing the timings is not a
test, and it is the exact move E2 forbids its own students.

Depends on nothing in this repository. Can start today. Everything in §3a is
downstream of the answer.

## ~~3 · Commit `scripts/mutate.sh`~~ — **DONE 11 Aug**

Committed in `217b50d` and re-run on a fresh install: 15 mutants, 15 caught,
0 survived. `ISSUES.md` #6 closed.

## 3a · Port E2 into this repository — **L, and it unblocks retiring the second tree**

E2 (*what decides how hard they push*) is 16 screens and is the only lesson
currently deployed. It lives in the archived static tree and must move here, or
the project keeps two implementations of the same curriculum. See
`docs/D1_REPOSITORY_DECISION.md` §5 Option 1 and §7.

What moves and how:

| Piece | Route |
|---|---|
| 16 screens, `e2.js` 1,163 lines | → React component + `model.yaml`. Content ports readily; it is mostly prose and SVG |
| physics assertions in `check-e2.js` — `predicted(n,k)`, `ballPositions`, geometry | → vitest, near-directly. These are pure functions |
| content rules — no `F = k` on screen, no result before prediction, `BENCH_ACTIONS` §B | → vitest against rendered output. **Do not port as prose** (hard rule 10) |
| `verify-finite-sphere.py` | **already moved**, `scripts/`, runs unchanged and passes |
| `preview-figures.js` | does not port — it extracts paint rules from `style.css`. Rework or drop |

Closes `ISSUES.md` #11 (E1 built twice) as a side effect: once E2 is here, the
static tree is archived for good and `e1.js` stops being a second source of truth.

**Not started, and it should not start before `BACKLOG.md` §1 and §2.** Porting a
lesson nobody has tested on a student, whose apparatus has never been built, is
work done in the wrong order.

## 4 · Extract `analytical.ts`, document the softening, fix the licence — **S**

`ISSUES.md` #1, #3, #7 together. Small, mechanical, and they are the three items
where the repository currently contradicts its own stated rules — which matters
disproportionately for a project asking a co-creator to follow those rules.

## 5 · Module 3 — "What are electrons doing?" — **L**

Thermal motion, drift as a small bias, repair of the crawling-electron picture.
Declared as conceptual debt in `module-1-what-is-current.md`.

**Precondition, not optional:** Module 2's representation of drift velocity must
pass scene-level review first. If it draws individual carriers gliding at drift
speed, it has already installed the model Module 3 exists to remove — deferring
a fix delays repair, it does not avoid injury. If Module 2 instead uses an
aggregate representation (density as a bar, drift as a labelled net arrow, no
carriers in motion), the dependency may dissolve and Module 3 becomes optional
enrichment rather than a debt being called in.

## 6 · Decide what `byoPhysics` and OpenVidya are to each other — **?, and it gets more expensive with delay**

Two projects, same course, same author, overlapping subject matter, opposite
architectures: single-file ES5 with no build and no automated tests, versus
Astro/React/TypeScript with 78. Nothing reconciles them and both are growing.

Each holds half of something. The bench has an operational layer OpenVidya
lacks — calibration to physical kit and printed slides, a named list of things
not to change without asking. OpenVidya has a reasoning layer and a verification
layer the bench lacks. The obvious trades:

- *Bench → OpenVidya:* the discipline of binding numbers to a physical artefact
  a student holds. OpenVidya has no equivalent and is poorer for it.
- *OpenVidya → bench:* executable tests. The bench's flux calibration table and
  its manual checklist are a test suite written in prose, and its handover
  already contains one instance of documentation silently drifting from code.

This is a decision, not a task. Make it before either grows further.

## 7 · Third concept from a fourth category to settle the schema — **M**

`docs/SCHEMA-COMPARISON.md` deferred the general schema pending a third
dissimilar concept. Charge/current supplied it and forced the quantity and
statement taxonomies into existence. A boundary-value problem — standing waves —
would test whether "evolution vs field vs definition" is the real axis or an
artefact of what has been built so far.

Still: **do not write a schema validator** until a key has earned its place in
three dissimilar examples.

## 8 · Concrete anchor in the scenes — **M, unresolved**

All scenes use abstract shapes on neutral channels; no wire, no lamp, no people
walking past a mark. The MDX text uses the counting-people analogy but no visual
does. Reported directly as "a bit abstract" for the target age.

Deliberately not actioned: adding a wire risks implying claims about carriers
that Module 1 explicitly refuses to make. This needs a design decision about how
much concreteness can be bought without importing scope.

## 9 · Git, remote, Deploy Previews — **S, blocked**

Blocked on `ISSUES.md` #10. Until the repo commits and pushes, the collaboration
model is configuration rather than practice, and pull-request previews do not
exist.

## 10 · Accessibility pass — **M, not started**

Every simulation is pointer-only. Sliders are keyboard-reachable; canvas
interactions are not. No live regions on readouts that change. Not audited.

---

## Deliberately not doing

- A schema validator (see §7).
- Fixing `g = 9.81`'s typing in isolation — it lands with the taxonomy pass across all modules, or not at all.
- `npm audit fix --force`, which wants a major Astro upgrade to patch build-time-only advisories.
- Adding scenes to cover mental models discovered during review. A discovered model does not automatically belong in the current lesson.

## 11 · A smoke test that loads a page in a real browser — **S, and it would have caught a shipped break**

Every check in this repository operates on source or on static markup. None of
them loads a page. On 12 Aug an Astro 7 upgrade left `@astrojs/react` two majors
behind, hydration failed on every route, and **the build passed and all 184
tests passed** while nothing on the site was clickable. `ISSUES.md` #12.

The gap is precise: the build emits islands, `component-url` and `renderer-url`
for a renderer that will throw in the browser, and is satisfied. A green build
is not a working page.

Smallest thing that closes it — for each route:

1. serve the built `dist/`,
2. load it in a headless browser,
3. assert the console is free of errors,
4. click one control and assert the DOM changed.

Step 4 is the one that matters. Steps 1–3 would pass on a page whose buttons do
nothing, which is exactly what shipped.

## 12 · E2 morsel redesign — **M, and it needs D-a settled first**

Dr. Vadaparty's review: E2 is excellent and demands too much attention at once.
Labelling pass done — `docs/specs/E2-morsel-pass.md`. **Not started.**

The diagnosis is concurrency, not length: ten open questions live at the peak,
every screen individually understandable, working memory saturating anyway. The
target is **less simultaneous physics, not less physics**.

Ten of seventeen screens are already one student-sized thought. The work is
concentrated in five screens holding 44% of the lesson:

| Screen | Action |
|---|---|
| `entry` 321w | split framing from equipment; keep B3 before any commitment |
| `encounter` 178w | split; delay "never touch a charged ball" to `method` |
| `method` 376w | split ×3; delay the three-kinds-of-"same" table to `judge2` |
| `model` 430w | split ×3; make the student derive P1 and P3 rather than be told |
| `ledger` 243w | student sorts the claims before the answer is shown |

Highest value first: **`ledger` and `model`**. Between them they are the
1,001-word passive tail that lands after the bench work, when attention is
spent, and both convert to activities rather than needing to be cut.

**Do not merge `observe` and `compare`** despite both being under 70 words. The
split is what stops the chart appearing before the data is committed.

Blocked on **D-a**: whether the equilibrium insight moves after the charge
insight. Physics-authority decision, stated in the spec.
