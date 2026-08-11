# Question map — the prerequisite spine

**Layer 1 only.** Activity specifications and model specifications are added when
an entry moves from `proposed` to `specified`. Schema frozen in
`QUESTION_MAP_SCHEMA_TEST.md`; governed by `PROJECT_CHARTER.md` v2.4.

**This is the spine, not the whole curriculum.** Peripheral questions are added
only after the topology is agreed. The graph was allowed to determine its own
size: **28 nodes**, not the "~two dozen" guessed in the charter.

---

# The headline finding

> **Lenz's law, as this curriculum formulates it, requires Oersted — and
> Chapter 3 currently teaches it without.**

Stated carefully, because the unqualified version is false. Lenz's law *can* be
introduced by other routes — through energy conservation, or through the
mechanical resistance you feel pushing a magnet into a coil. Those routes do not
need Oersted.

But **this** curriculum takes the physical-model route, where *"opposes the
change"* refers to **the magnetic field produced by the induced current**. On
that route a student who has never been shown that a current produces a magnetic
field has no referent for the sentence. They can memorise the direction rule;
they cannot reconstruct it from the model.

The missing Oersted branch is therefore not a gap *beside* the curriculum. It is
a **prerequisite of material already being taught**. That is a stronger and more
urgent finding than "half the interplay is missing," and only the graph exposed
it. A linear list would have placed Oersted somewhere after induction, as
enrichment.

Two further structural results are below the map.

---

# The graph

```
   E1 charge ──┬── E2 force between charges ── E3 field ──┬── E4 polarisation
               │                                          └── E5 potential ── E6 capacitor
               │
               └── C1 current ── C2 what determines it ── C3 what electrons do
                        │              │
                        │              └── C4 heating ──┐
                        └── C5 battery ─────────────────┴── C6 RC discharge
                        │
                        │        ┌─────────────────────────────────┐
                        └────────┤  O1 compass near a wire         │  ← THE MISSING BRANCH
                                 │  O2 field shape around a wire    │
   M1 magnet ── M2 compass ──────┤  O3 coil / electromagnet         │
        │            │           │  O5 force on a current           │
        │            ├── M3 is the field real?                      │
        │            └── M4 strength vs distance                    │
        │                        └──────────┬──────────────────────┘
        └───────────────── O4 is a coil the same as a magnet? ◄─ JOIN · repairs the pole debt
                                            │
              M2,M4 ── F1 flux ── F2 what changes flux ──┐
                                                         │
                                    O1,O2 ───────────────┴── I1 Faraday ── I2 Lenz
                                                                  │
                                                                  ├── I3 magnet vs coil (summit)
                                                                  └── A2 inductor
                                            C6 ────────────────────── A1 capacitor in AC
```

---

# Entries

`✅ built · 📄 document exists · 🎞 deck exists · ⬜ nothing · ⛔ blocked`

**Assets carry their location.** Until 11 Aug 2026 this map tracked one repository
while a second one served the only deployed lesson, and the map did not know E2
existed. `(astro)` means this repository, which is canonical. `(static)` means
`../openvidya-repo/`, the plain-JS tree that currently serves the live site and is
retired once E2 is ported — `BACKLOG.md` §3a, `docs/D1_REPOSITORY_DECISION.md`.

## Electrostatics

| ID | Question | Prereq | Context | Formula-proof rationale | Asset |
|---|---|---|---|---|---|
| **E1** | What is charge, and how much of it is there? | — | everyday | Q = Ne with N = N₊ − N₋; the count is the answer, no formula applies | ✅ **built twice** — `E1Investigation.tsx` (astro) and `e1.js` (static). ⚠ duplicate, see ISSUES |
| **E2** | Two charged objects are near each other. What decides how hard they push? | E1 | laboratory | Asks *what decides*, not *compute F*. Coulomb's law is the answer, not the method | ✅ **built and deployed** (static), 16 screens. ⛔ **B3 open** — apparatus never built |
| **E3** | How does one charge know the other is there? | E2 | internal_to_theory | ⚠ **first use of `internal_to_theory`** — the field concept has no honest everyday anchor. **Formula-proof by *kind*:** the central question is not a quantity, so no rearrangement answers it | 📄 **spec written** — `LESSON_E3_how-does-it-know.md`, awaiting physics review. Simulation prototype `electric-field` exists, 18 tests |
| **E4** | Why does a charged comb attract *neutral* paper — and why doesn't reversing the comb change it? | E1, E3 | everyday | `F = qE` with q = 0 predicts **zero force**; the paper moves | ⬜ (Q-E01, specified) |
| **E5** | Why does it take effort to push a charge closer to another? | E2 | laboratory | Energy before volts; V is named after the work is felt | ⬜ |
| **E6** | How can we store separated charge without an enormous voltage? | E5, E1 | everyday | Opens with the *failure* of a single conductor — no formula addresses that | 📄 Capacitor booklet §1A |

## Current

| ID | Question | Prereq | Context | Formula-proof rationale | Asset |
|---|---|---|---|---|---|
| **C1** | What is current? | E1 | everyday | Supplies charge, withholds time: "6 C crossed — state the current." You cannot | ✅ **built, 28 tests** |
| **C2** | What determines the current? | C1 | laboratory | Same current from different n and v_d; speed alone never fixes it | ✅ **built, 10 tests** |
| **C3** | What are the electrons actually doing? | C2 | internal_to_theory | Reconciles 10⁶ m/s random with 10⁻⁴ m/s drift — no formula asks that | ⬜ planned Module 3 |
| **C4** | Why does a wire get hot? | C2, E5 | everyday | Energy leaves; charge does not. The formula P = I²R hides which is which | ⬜ |
| **C5** | What does a battery actually do? | E5, C1 | everyday | mAh is a *charge*; the label is the lesson | ⬜ |
| **C6** | How fast does a capacitor lose its charge? | E6, C4 | laboratory | Q-Q01: **prediction required before calculation is permitted** (F8) | 📄 `Capacitor_to_e` |

## Magnetism

| ID | Question | Prereq | Context | Formula-proof rationale | Asset |
|---|---|---|---|---|---|
| **M1** | What is a magnet, and why does it have two ends? | — | everyday | Fridge magnets. No formula at this level | 🎞 Ch2 |
| **M2** | Put a compass at six places around a magnet. What will it do at each? | M1 | laboratory | Six spatial predictions, no numbers (Q-M01) | 🎞 Ch2 |
| **M3** | Is the field a real thing, or just bookkeeping? | M2 | laboratory | A judgment between two accounts of the same observations | 🎞 Ch2 |
| **M4** | How does the field change as you move away? | M2 | laboratory | Earth's field eventually wins — that distance is the measurement | 🎞 Ch2 |

## ⛔ The Oersted branch — nothing exists

| ID | Question | Prereq | Context | Formula-proof rationale | Asset |
|---|---|---|---|---|---|
| **O1** | A compass sits beside a wire. You switch the current on. What happens? | C1, M2 | laboratory | Prediction is binary and most students predict *nothing* | ⬜ **absent** |
| **O2** | What shape is the field around a straight wire? | O1 | laboratory | Predict the pattern before iron filings reveal it; nobody predicts circles | ⬜ **absent** |
| **O3** | What happens if you wind the wire into a coil? | O2 | laboratory | Superposition of the circular fields — reasoning, not substitution | ⬜ **absent** |
| **O4** | **Is a coil of wire the same thing as a bar magnet?** | O3, M1 | laboratory | Two claims about identity, tested by every experiment available | ⬜ **absent · JOIN** |
| **O5** | A wire carries current across a magnet's field. What happens to the wire? | O1, M2 | everyday | Earphones and the mixer motor. Direction is the commitment | ⬜ **absent** |

## Flux and induction

| ID | Question | Prereq | Context | Formula-proof rationale | Asset |
|---|---|---|---|---|---|
| **F1** | How much field passes through a loop? | M2, M4 | laboratory | The "butterfly net". Counting, before any Φ symbol | 🎞 Ch2 |
| **F2** | What can you change to change the flux? | F1 | laboratory | Three independent handles; predicting which matters most | 🎞 Ch2 |
| **I1** | Move a magnet near a coil. What appears, and when does it stop? | F2, **O1** | laboratory | Holding it still gives zero — the formula never says *why* | 🎞 Ch3 draft |
| **I2** | Which way does the induced current flow? | I1, **O2** | laboratory | ⛔ **Meaningless without O2.** "Opposes the change" is a statement about the induced current's own field | 🎞 Ch3 draft |
| **I3** | Is moving the magnet the same as moving the coil? | I1 | laboratory | Two accounts of one observation — the summit of *interplay* | ⬜ |

## AC

| ID | Question | Prereq | Context | Formula-proof rationale | Asset |
|---|---|---|---|---|---|
| **A1** | Why does a capacitor pass AC but block DC? | C6 | everyday | Booklet §1: *"only the frequency has changed"* | 📄 Capacitor booklet |
| **A2** | What does a coil do when the current keeps changing? | I1, O3 | laboratory | The mirror of A1 — inductance as induction applied to itself | ⬜ |

## Provisional nodes

Hyphenated rather than numbered, because they have not earned a place on the
spine. Each was **generated by writing a lesson** — a question the lesson turned
out to presuppose — rather than by planning the graph. They are listed so the
debt is visible; promotion to a numbered node is an authority decision.

| ID | Question | Generated by | Sits | Status |
|---|---|---|---|---|
| **P-carrier** | What is it that moves when charge moves? | E1 | after E1 | provisional |
| **P-quantisation** | Does charge come in smallest pieces? | E1 | after E1 | provisional |
| **P-conduction** | Does charge stay where you put it? | E2, ruling 6 | **between E1 and E2** — declared dependents E2, E4, C1 | provisional, **explicitly non-blocking**. E2 carries an interim demonstration; equal division follows by symmetry |
| **P-delay** | When one charge moves, when does the other find out? | E3 §7 / P3 | after E3; **hard prerequisite** for any node treating the field as carrying energy | provisional |

*`P-conduction` was ruled onto this map on 2026-08-10 and the ruling was not
executed until 2026-08-11. A ruling that is accepted and not applied is
indistinguishable from one that was refused.*

---

# What the topology revealed

### 1 · Lenz has an unmet prerequisite that is currently being taught anyway

**I2 depends on O2**, and O2 does not exist. Chapter 3's Lenz material is
downstream of a branch that was never built. This is not a gap to fill later; it
is a correction to material already in use.

### 2 · O4 is a join, and the pole-model repair cannot happen earlier

*Is a coil the same thing as a bar magnet?* requires **both** the magnetism
branch (M1) and the Oersted branch (O3). The declared repair can only land at
that junction. Attempting it in Chapter 2 would be assertion; placing it at O4
makes it a question the student has accumulated the evidence to *ask*.

**But the repair must give the pole model a domain, not retract it.** An earlier
draft of this map said *"poles are what circulating currents look like from
outside"* — pedagogically tidy and too strong, and precisely the kind of
overclaim the charter exists to catch. Replacing "poles are real, currents
aren't" with "currents are real, poles aren't" trades one misleading statement
for another.

The honest treatment distinguishes three things:

| | role |
|---|---|
| **Pole model** | An effective *external* description. It is what a compass responds to, it predicts correctly outside the magnet, and it remains in use. |
| **Current model** | A deeper description, valid inside the material too, and the one that connects magnetism to electricity. |
| **No isolated monopoles** | An empirical statement about what has been observed — not a claim that the pole model is invalid. |

O4's lesson is that the two descriptions have **different domains and different
jobs**, which is charter §7.7 applied to a model the student already trusts.

### 3 · Coverage is thinner than the asset count suggests

*Recounted when the review site was built; an earlier tally here was wrong in
three rows.*

| State | count | nodes |
|---|---|---|
| **Built and tested** | **2** | C1, C2 |
| Specified, not built | 3 | **E1** (see below), O1, O2 |
| Written document, not yet specified | 4 | E3, E6, C6, A1 |
| Slide deck only | 8 | M1–M4, F1, F2, I1, I2 |
| **Nothing at all** | **13** | E2, E4, E5, C3, C4, C5, **O1–O5**, I3, A2 |
| **Total** | **28** | |

**E1 was "partial". Writing the lesson specification demoted it to `proposed`.**

*What is charge?* appeared built — Module 1 Scene 1 covers two kinds, net count,
neutral-is-not-empty and quantisation, with tests. But building E1 from the
architecture (`LESSON_E1_what-is-charge.md`) showed that Scene 1 is only the
**back half**: the model exposition, with no prior model, no prediction, no
discrepancy and no judgment. The student is *told* charge comes in two kinds.

The front half — where the charter's machinery actually lives — has never existed
anywhere in the project. **The bookkeeping was flattering us**, and the revised
tally reflects it: built 2, proposed 1 (E1), document 4, deck 8, nothing 13.

When E1 is built, Module 1 Scene 1 must **reference** it rather than restate it —
the `model_ids` discipline applied to lessons. Otherwise two places will assert
two kinds of charge and they will drift.

Seven deck-only nodes are the Chapter 2 magnetism spine — real material, but not
yet specified, verified, or bound to a model. Sixteen empty nodes, of which
**five are the entire Oersted branch**.

### 4 · `internal_to_theory` earned its place

Flagged as untested after the schema stress test. Two spine nodes need it — **E3**
(how does one charge know the other is there?) and **C3** (what electrons are
actually doing). Neither has an honest everyday anchor, and inventing one would
produce exactly the decoration §7.4 forbids. The category is doing real work, not
serving as an escape hatch.

### 5 · The summit is reachable

**I3** — *is moving the magnet the same as moving the coil?* — needs only I1. It
is the relativity seed and the literal statement of the course title, and it sits
one step from material that already exists in draft.

---

# Recommended build order

Not the order of the graph. The order of *what unblocks most*.

| Priority | Work | Why |
|---|---|---|
| **1** | **O1, O2** | Unblocks I2, which is already being taught without them |
| **2** | **O3, O4** | Completes the branch; O4 discharges the pole-model debt |
| 3 | E2, E3, E5 | The electrostatics spine is thinner than the decks imply |
| 4 | C4, C5 | Both have strong everyday anchors and no prerequisites missing |
| 5 | O5, I3 | The interplay, both directions, and the summit |
| 6 | Peripheral questions | Only after the spine is agreed |

---

# The lesson-building workflow

Named after E1 demonstrated it is not merely a workflow preference — it changed
the curriculum.

```
map node → scratch specification → discover corrections → freeze → physics review
```

**Not** *write → perfect → next*, which would serialise the project behind every
review. A lesson is frozen when its corrections have been absorbed and its open
physics claims are listed; it then goes to review while the next lesson is
written.

**Write from the architecture, never by converting a deck.** The existing decks
and documents are evidence and raw material, not the source of truth. Converting
them would quietly reinstall their original pedagogical assumptions as the
architecture.

| lesson | status | corrections it produced |
|---|---|---|
| **E1** | frozen, in review | Q = Ne removed; particles removed; two new candidate nodes; a shipped defect (`ISSUES` #0c); `apparatus_failure_mode` tag |
| **E2** | frozen, in review | template stable at 12 fields; `silent-plausible` failure variety; first genuine dependency *payoff* |

# Provisional nodes — generated by writing a lesson

**These are not part of the frozen 28-node spine.** They exist because writing
E1 from scratch showed the graph was incomplete, which is what that exercise was
for. Marked `generated_by_lesson` so their provenance stays visible, and
deliberately given non-sequential IDs so nobody mistakes them for settled spine.

| ID | Question | generated_by | Position | Status |
|---|---|---|---|---|
| **P-carrier** | What is actually carrying the charge? | `LESSON_E1` §9 | After E1, before C3 — **C3 presupposes its answer** and nothing in the spine supplies it | provisional |
| **P-quantisation** | Why does charge come in discrete amounts? | `LESSON_E1` §9 | After E1. Position relative to P-carrier **deliberately not fixed** | provisional |
| **P-conduction** | Does charge stay where you put it? | `LESSON_E2_AMENDMENTS` A1, authority ruling Q6 | Between E1 and E2 | provisional |

### Why P-conduction exists

E1's apparatus is **balloons — insulators**. Charge stays where it is put; that is
why rubbing one patch works at all. Nothing in E1 establishes that charge moves
freely in some materials and not in others.

**Three nodes depend on that fact and none of them declares it:**

- **E2** — halving requires two identical *conductors* in contact to divide charge equally. It cannot be established from inside E2: with contact leaving fraction f on the primary, the measurement gives one equation in two unknowns and (f, n) pairs are degenerate.
- **E4** — a charged comb attracting neutral paper requires charge to shift *within* a neutral object.
- **C1** — *"What is current?"* is charge flowing through a conductor. **C1 is one of the two nodes marked built, with 28 tests, and lists E1 as its only prerequisite.**

That last one is the same species as the Lenz/Oersted headline: a prerequisite
absent from the spine, sitting underneath material already built.

### Why P-carrier exists

E1 establishes two kinds, transfer and conservation. It establishes **nothing**
about what carries the charge — the balloons cannot. C3 asks *"what are the
electrons actually doing?"* and therefore assumes an answer the graph never
provides.

```
E1 ──► P-carrier ──► C3
```

### Why P-quantisation's dependency is left open

Tempting to write `P-carrier → P-quantisation`. **Resist it.** The evidence for
quantisation is historically Millikan's oil-drop measurement, and the conceptual
question — *does charge come in lumps?* — can be posed without settling what the
lumps sit on.

Whether that dependency is hard, soft, or absent should be discovered the way
O2 → I2 was discovered: **write the lesson, then see what it needs.** Fixing it
now would be assuming exactly the kind of thing this process exists to test.

# Two kinds of dependency

Added before building, because otherwise every arrow reads as *"the student must
finish the earlier question before this one can even be mentioned"* — which would
make the curriculum needlessly rigid.

| Notation | Meaning |
|---|---|
| **→** hard | The later question is **not meaningfully understandable** without the earlier one. |
| **⇢** soft | The later question is **richer or easier** after the earlier one, but can be introduced independently. |

**Hard, and non-negotiable:**

- O1 **→** O2 · you cannot ask about the *shape* of a field you have not established exists
- O2 **→** I2 · the finding above
- O3, M1 **→** O4 · the join needs both branches
- C1 **→** C2, E1 **→** C1

**Soft, and worth marking as such:**

- M4 **⇢** F1 · flux can be introduced qualitatively before field strength is quantified
- E5 **⇢** C4 · heating can be felt before potential is formalised
- C3 **⇢** anything · the microscopic picture enriches but gates nothing
- E4 **⇢** O1 · see the confound note in the O1 specification

Prerequisites in the tables above are hard unless listed here.

# Prerequisite ≠ prior knowledge

A distinction worth keeping separate, since both were being called "blockers".

**The graph fixes logical prerequisites:** O2 requires O1. That is a property of
the physics and it is settled.

**Prior knowledge is instructional:** does an incoming Grade 11 student already
know enough to enter at O1? That is charter §15.1 and it is still open.

**The topology can therefore be frozen now.** What the unresolved prior-knowledge
question affects is where **entry ramps and remediation** sit *inside* each
branch — not the shape of the graph.

# Open

- Peripheral questions are **not** in this map yet, by design.
- Every `formula_proof_rationale` above is a first draft and needs the physics authority's review — several may not survive it.
- Prior knowledge of the target students (charter §15.1) still blocks sequencing decisions within each branch.
