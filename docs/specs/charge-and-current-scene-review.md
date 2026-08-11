# Scene-level design review — charge and current

**Input:** `charge-and-current.md` v3.
**Question asked of every scene:** *can it answer its questions without creating a
new mental model?*
**Instruction:** reduce, do not expand.

---

## Headline decision

**Split into three modules and build only the first.**

| Module | Objective | Status |
|---|---|---|
| **1 — What is current?** | Charge is countable; charge crosses boundaries; current is a rate | **Build this** |
| **2 — What determines the current?** | `I = nqAv_d`; speed is one factor among several | Deferred, committed |
| **3 — What are electrons actually doing?** | Microscopic motion, drift as a small bias, why the classical picture is a model | Deferred, committed |

v3 was trying to teach all three at once. Every problem the review found came
from that overload, not from the individual scenes.

**Result: 3 scenes and 1 panel.** All physics in Module 1's scenes rests on
`e` alone, which is exact by definition. Every unsourced value moves into the
illustrative panel, where a range is honest and a point value was never needed.

---

## The seven questions

### Q1 — Can Part A answer A-i…A-v without creating a new model?

**Mostly. One new risk found.**

If the counter accumulates electrons into a growing pile, it reinforces **A1**
(charge as substance) — the very model Part A exists to remove. Counting must
present *countable individuals*, never an accumulating quantity of stuff. The
readout is a number, not a volume.

A-v is not a scene. It is a comparison panel with sourced ranges.

### Q2 — Can the gate scene establish `I = ΔQ/Δt` without presupposing current?

**Yes, under two constraints.**

The word *current* and the ammeter symbol must not appear until after the student
has divided a count by a time. The sequence is: how many crossed → how long did
it take → divide → *this ratio has a name*.

Second constraint, found here: **the student must not be able to change carrier
speed in this scene.** If speed is manipulable it becomes the salient variable
and installs B2a before rate is established. Only the count and the clock window
are under the student's control.

### Q3 — Can the twin-configuration scene establish that current is not simply speed?

**Yes — but not in Module 1.** See Q4; it moves to Module 2.

Also, the target itself was misframed in v3 and is corrected here. The lesson is
**not** "speed has nothing to do with current" — that would install the opposite
error. It is *speed is one of the quantities determining current, alongside how
many carriers there are and how wide the conductor is.*

### Q4 — Does the random-motion scene belong here?

**No. But deferring the correction does not prevent the damage, and v3's
reviewer glossed this.**

Any scene drawing carriers gliding smoothly at drift speed installs B2b
("electrons crawl steadily along the wire") whether or not a later module
corrects it. Postponing the fix delays repair; it does not avoid injury.

Two honest options: include minimal random motion now, or defer with the debt
**declared and the follow-up committed**. This review chooses the second, and
records it as a promissory note below rather than as silence.

This is only acceptable because Module 1 no longer contains any scene showing
carriers moving at a stated drift speed. Module 2 is where the debt falls due,
and Module 2 must not ship without Module 3 following it.

### Q5 — Can B4 be shown without an instantaneous-field model?

**Not needed — B4 leaves the module.**

By the same principle that removes B3 (below), B4 is about *circuit response*,
not about charge and rate. It belongs with fields in circuits.

Where it is eventually built: do not animate the field propagating. Show carriers
already present, then drifting. State in text that closing the circuit
establishes a field along the conductor. Any animated propagation invites a
speed-of-field question the module cannot answer.

### Q6 — Does B3 belong here?

**No.** B3 is *charge is conserved in a steady circuit while energy is
transferred*. That is a different objective and belongs with energy and power.

The general principle, which should go into `OPENVIDYA_PHILOSOPHY.md`:

> **A discovered mental model does not automatically belong in the current
> lesson.** Otherwise every review makes the lesson larger, and no lesson is ever
> finished.

### Q7 — What is the minimum scene set?

**Three scenes and one panel.**

---

## Module 1 — the reduced set

### Scene 1 · Counting charge

*Answers A-i, A-ii-a, A-ii-b. Targets A1, A2, A3.*

| Must show | Must not show |
|---|---|
| The elementary charge drawn identically at every zoom | Any pile, volume, or bar whose *size* encodes amount |
| A counter that can only display integers | A continuous readout |
| Large numbers reached via the time yardstick — counting at 1 s⁻¹ takes ≈3.0×10¹² years, ≈215× the age of the universe | A linear-looking bar for 10¹² *e* |
| `● is a symbol for one electron, not a picture of one` | Electrons with drawn radii that vary |

### Scene 2 · Separation, then transfer

*Answers A-iii, A-iv. Targets A4. Establishes conservation.*

| Must show | Must not show |
|---|---|
| Net-charge readout pinned at zero throughout | The cloud "acquiring" charge |
| A separation readout that climbs as regions polarise | Any mechanism of electrification |
| A transferred counter that ticks only when charge crosses | Leader/return-stroke structure |

**Wording correction accepted from review.** The neutrality is a property of the
model, not an asserted fact about weather. On-screen text: *in this model the
cloud begins neutral; charges separate into regions while the total charge of the
modelled system stays constant.* A document arguing that models are models cannot
then present its own simplification as reality.

### Scene 3 · The gate

*Answers B-iii. Targets B1. Establishes the objective.*

| Must show | Must not show |
|---|---|
| A counting plane; carriers crossing; a running count | The word *current* before the division is made |
| A visible clock window the student sets | An ammeter symbol |
| Same count, different window → different ratio | Any speed control |
| The name arriving after the ratio | `nqAv_d` |

### Panel · How much, and how fast

*Answers A-v. Bridges to Module 2.*

Not an animation. A comparison with **ranges**, recomputed live from its inputs:
strokes of order 5–20 C against cells of order 2000–3000 mAh give a total-charge
ratio spanning roughly **360× to 2160×**, while lightning's current exceeds the
cell's by a factor of tens of thousands. Same quantity, opposite orderings.

No claim about danger. That remains removed.

---

## What left, and where it went

| Left Module 1 | Went to | Why |
|---|---|---|
| `I = nqAv_d`, twin-configuration scene | Module 2 | Second objective; brings all the model-dependent physics |
| B2a (speed determines current) | Module 2 | Cannot be addressed without `nqAv_d` |
| B2b (electrons crawl) | Module 3 | Debt declared below |
| B3 (current consumed) | Energy and power | Different objective — Q6 |
| B4 (electrons travel to the bulb) | Fields in circuits | Different objective — Q5 |
| B-vi (drift-speed estimate) | Module 2 | Depends on carrier density |

---

## Declared conceptual debt

Recorded because choosing not to fix something is different from not knowing
about it.

1. **B2b is not addressed in Modules 1 or 2.** Module 2's twin-configuration
   scene will install "electrons glide steadily," and Module 3 exists to repair
   it. **Module 2 must not publish without Module 3 scheduled.**
2. **Dot-carriers support a billiard-ball ontology.** Accepted at this level,
   declared on the page.
3. **The classical picture of conduction is a model with a quantum
   justification.** Not raised in Module 1, which never depends on it.

---

## Evidential debt after the cut

| | v3 (single module) | Module 1 |
|---|---|---|
| Quantities used | 8 | 5 |
| Unsourced | 7 | **4** |
| Model-dependent | 3 | **0** |

Dropped with `I = nqAv_d`: copper carrier density, Fermi speed, relaxation time.

**Every scene's physics in Module 1 rests on `e` alone**, which is exact by
definition and carries no uncertainty. The four remaining unsourced values —
lightning charge, peak current, cell capacity, age of the universe — sit entirely
in the illustrative panel, where a *range* is the honest presentation and a point
value was never required.

Reducing scope did not merely shrink the lesson. It removed the entire class of
claims that could not be verified.

---

## Corrections to v3 accepted

1. *"Electrons in copper move at 1.6×10⁶ m/s"* → *characteristic velocities of
   order 10⁶ m/s*, model-dependent. Applies in Module 3.
2. **Quantisation consistency cannot be decided from percentage deviation.**
   v3's *"0.14% from an integer — consistent"* is invalid reasoning without a
   stated uncertainty. The item must supply one, e.g. *(4.80 ± 0.02)×10⁻¹⁹ C*,
   and ask whether 3*e* = 4.806529902×10⁻¹⁹ C lies inside the interval. This was
   a real error, not a wording preference — and it is why a `measured` quantity
   needs `value + uncertainty + conditions + source`, not just a value.
3. Cloud neutrality stated as a model property. Applied in Scene 2.
4. B2a reframed: speed is *one* determinant, not irrelevant. Applies in Module 2.
5. Drift speed's dependence on *I*, *A* and assumed *n* made visible. Module 2.

---

## Open decisions

1. **Prior knowledge** — still blocking, still unanswered.
2. **Sourcing** for the four panel values.
3. **Is Scene 2 in or out?** It is the marginal one: conservation is not in
   Module 1's stated objective, though "transfer" is hard to make meaningful
   without it. Defensible either way — a two-scene Module 1 is a legitimate
   further cut.
4. **Does Module 1 alone justify a page?** Three scenes on "current is a rate" is
   modest. It is also verifiable, sourced and finishable, which no version of the
   larger module was.
