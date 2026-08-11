# Module 1 — What is current?

**Build-ready specification.** Supersedes the scope of `charge-and-current.md` v3.
Derived from `charge-and-current-scene-review.md` and the review that followed it.

The shortest of the three documents, because the scope is the smallest. That is
the point.

---

## Objective

> **Distinguish how much charge is transferred from how quickly it is
> transferred.**

## The single testable question

> Can a student, shown a quantity of charge crossing a surface, say what further
> information is needed before the current can be stated — and say why?

If Module 1 achieves that and nothing else, it has succeeded.

## Explicitly out of scope

`I = nqAv_d` · electron speed · drift velocity · Fermi velocity · microscopic
motion · carrier density · circuit response · conductors and lattices · energy
and power · whether current is consumed · electrons travelling from battery to
bulb · electrical hazard · the mechanism of cloud electrification.

Each has a home in a later module. None is smuggled in as a caption.

---

## Scene 1 · Charge can be counted

*Establishes: charge is a property of particles, quantised in units of e; large
charges are large **counts**, not large particles.*

**Conceptual statement, precisely worded.** The electron is a particle that
*has* electric charge. **●** represents the particle; *e* represents the
magnitude of its charge. So `Q = Ne` does not say charge is made of little
pieces of charge-substance — it says the net charge of a collection of
elementary charged particles comes in whole multiples of *e*.

| Must show | Must not show |
|---|---|
| The particle symbol drawn identically at every scale | Any symbol whose *size* encodes amount of charge |
| A counter that can display only integers | A continuous or fractional readout |
| Countable individuals | An accumulating pile, volume or bar — that reinforces charge-as-substance |
| `● is a symbol for the particle, not a picture of it` | Electrons with meaningful drawn radii |

**Scale representation — undecided, and to be tested rather than argued.**

- **(a)** Log number line, equal intervals labelled *each step is ×1000*, running
  1*e* → 10²⁰*e*.
- **(b)** Time as yardstick: counting at 1 s⁻¹ reaches a lightning stroke's worth
  in ≈3.0×10¹² years.

Neither is obviously right. (a) is more honest about not being able to draw
10²⁰; (b) may land harder but may also slide past as another large number. Build
both, show both, and see. ⚠ Six students cannot tell you which is *better* —
they can only reveal whether either produces visible confusion. Do not design the
study to compare them.

---

## Scene 2 · Charge can cross a surface

*Establishes: "charge transferred" is a well-defined countable thing, before any
notion of rate exists.*

**No clock is visible in this scene.** Showing elapsed time here hands the
student both quantities before Scene 3 asks them to relate the two, and the
discovery in Scene 3 collapses into arithmetic they have already done.

| Must show | Must not show |
|---|---|
| A **transparent imaginary surface** the observer chooses | A gate, door, barrier or turnstile |
| A running count of charge that has crossed it | Any clock, timer or elapsed-time readout |
| The count in **both coulombs and numbers of elementary charges** | The word *current* |
| That moving the surface does not change the physics | An ammeter symbol |

**Why not a gate.** A gate implies something physically intercepts and tallies
electrons. The definition does no such thing: it counts charge crossing a
*chosen* surface, and the surface is a decision by the observer, not an object in
the wire. The metaphor would install a mechanism that does not exist.

**Why both units.** Scene 1 is granular and countable; Scenes 2–3 are aggregate
and continuous. Without a bridge the student ends holding two disconnected
pictures — the failure mode we rejected in the two-view drift design. The dual
readout is that bridge.

---

## Scene 3 · Rate of transfer

*Establishes the objective. The student sets Q and Δt independently and finds
the ratio.*

**No speed control exists in this module.** If carrier speed is manipulable it
immediately becomes the salient variable and installs "current is how fast
charges move" before rate has been established. The first current animation
should be almost boringly controlled.

| Must show | Must not show |
|---|---|
| Independent control of charge crossed and time window | Any speed, density or cross-section control |
| Worked runs: 10 C in 10 s → 1 A; 10 C in 2 s → 5 A | The name *current* before the ratio is formed |
| The ratio appearing as the student's own construction | `nqAv_d` in any form |
| The name arriving last: *this rate is called electric current* | An ammeter before the concept |

Sequence, strictly: how much crossed → how long did it take → divide → *this has
a name*.

---

## Context panel · How much, and how fast

Not an animation. A live comparison recomputed from its inputs, showing
**ranges**, not point values.

Strokes of order 5–20 C against cells of order 2000–3000 mAh give a total-charge
ratio spanning roughly **360× to 2160×**, while lightning's current exceeds the
cell's by a factor of tens of thousands. Same quantity, opposite orderings.

The panel asks, and answers, the module's question: a large amount of transferred
charge does not by itself tell you the current. You also need the time.

**No claim about danger.** Removed in v2 and stays removed.

---

## Representation principle

> **The animation does not have to depict the ontology literally. It has to
> represent the relationship honestly.**

This is the general form of the way out of the B2 problem, and it is already
implicit in the shipped electric-field module, which draws sampled arrows on a
grid — an aggregate representation of a continuous field, not a picture of what
is present. Proposed for `OPENVIDYA_PHILOSOPHY.md`; see below.

---

## Verification — machine-checkable

Module 1 has unusually clean verification because it depends on no measured
physics at all.

| Claim | Independent route |
|---|---|
| The crossing counter is always an integer multiple of *e* | Assert `Q/e` integral to machine precision |
| Coulomb and elementary-charge readouts agree | Convert by an independent path and compare |
| Charge is conserved: counted crossings = charge that left the source | Count at two surfaces |
| The displayed rate equals count ÷ window | Recompute by quadrature over the window, not by reusing the displayed value |
| Result is independent of surface position | Evaluate at several surfaces; all must agree |
| Panel ratios are correctly propagated from input ranges | Interval arithmetic vs the displayed range |

## Empirical inputs

| Value | Type | Status |
|---|---|---|
| *e* = 1.602176634×10⁻¹⁹ C | `exact-by-definition` | ✅ SI 2019 |
| Lightning charge ≈ 5–20 C | `measured` | ⚠ unsourced — **panel only** |
| Peak stroke current ≈ 30 kA | `measured` | ⚠ unsourced — **panel only** |
| Cell capacity ≈ 2000–3000 mAh | `device-specific` | ⚠ unsourced — **panel only** |

**All three scenes rest on *e* alone**, which is exact and carries no
uncertainty. Every unsourced value sits in the illustrative panel, where a range
is the honest presentation. Zero model-dependent quantities remain — down from
three before the scope cut.

The "215× the age of the universe" figure carries a fourth unsourced value and
disappears entirely if scale representation (a) is chosen. That is a point in
(a)'s favour, though not a decisive one.

---

## Pedagogical validation

Protocol unchanged from `charge-and-current.md` §6.4: matched item forms,
counterbalanced; a comparison group; think-aloud scored on reasoning; delayed
retest at two weeks.

**What n≈6 buys.** Not an efficacy study, and it must not be reported as one. Six
students cannot measure a learning gain and cannot rank two representations. They
can surface failure modes nobody anticipated — which is the purpose.

Open questions, in priority order:

1. Does either scale representation convey "enormous count", or do both slide
   past?
2. Does the dual-unit counter bridge Scene 1 to Scene 2, or do students treat
   coulombs and electron-counts as unrelated?
3. Does the imaginary surface read as a chosen boundary, or as a thing in the
   wire?
4. Does the panel produce insight or disbelief?

---

## Conceptual debt

Recorded because choosing not to address something differs from not knowing.

1. **What electrons are actually doing is not addressed.** Module 1 never depicts
   a carrier moving at a stated speed, so it does not create the model — but it
   does not remove any prior belief about it either.
2. **The particle symbol supports a billiard-ball ontology.** Accepted at this
   level; declared on the page.

**Revised Module 2 condition** (weakened from the scene review, per review):
Module 2 must not publish until *its representation of drift velocity has passed
scene-level review* — not, necessarily, until Module 3 exists. An aggregate
representation (carrier density as a bar, net drift as a labelled arrow, no
individual carriers in motion) may avoid creating the crawling-electron model at
all, which would make the dependency unnecessary.

---

## Proposed additions to OPENVIDYA_PHILOSOPHY.md

Not yet applied — the philosophy file stays stable until confirmed.

> **11. A discovered mental model does not automatically belong in the current
> lesson.** Otherwise every review enlarges the lesson and none is ever finished.

> **12. Represent the relationship honestly rather than the ontology literally.**
> A visualisation is not obliged to show what is physically there; it is obliged
> not to imply what is not.

> **13. Record conceptual debt.** Where a simplification will need later
> correction, say so in the module and name where the correction lives. Choosing
> not to fix something is different from not knowing about it.

---

## Open decisions

1. **Prior knowledge.** Still blocking. Before or after formal circuit teaching?
2. **Scale representation** (a) or (b) — or build both and test.
3. **Sourcing** for the three panel values.
4. **Is three scenes enough to justify a page?** It is modest. It is also
   verifiable, sourced, finishable and testable, which no earlier version was.
