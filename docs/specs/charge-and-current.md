# Charge and Current — design specification

**Version 3. Status: superseded in scope by the scene review. No code yet.**

> ⚠ **Read [`charge-and-current-scene-review.md`](./charge-and-current-scene-review.md) first.**
> The scene-level review this document called for in §7 has now been run, and it
> **cut the scope**. This concept is split into three modules; only Module 1
> ("what is current?") is to be built. `I = nqAv_d`, B2a, B2b, B3 and B4 all
> leave the first module. The material below remains valid as the full analysis
> of the concept, but it describes more than Module 1 will contain.

This document fixes, before anything is built: who the students are and what they
already believe, which mental model each scene exists to displace, what a student
who has understood can now say, which claims a machine can check, which require a
physicist, and which require students.

The animation is the last thing designed, not the first.

---

## Revision history

**v1 → v2.** Removed the claim *"charge is not what makes lightning dangerous;
rate is"* — falsified by its own example, since a shorted AA delivers several
amps and stays safe. Hazard depends on voltage, resistance, duration and path,
and belongs in its own module. Prior knowledge moved to the front; "misconception"
replaced by "targeted mental model"; quantity and statement taxonomies added;
questions rewritten to demand reasoning; test protocol corrected for the testing
effect; verification/validation terminology adopted.

**v2 → v3.**

1. *"Independent quantities"* → **distinct** quantities. The amount transferred
   alone does not determine the rate; given a time interval it does. The v2
   phrasing was too strong as physics.
2. Quantisation item **split in two** — a conceptual form and a measurement form
   with explicit tolerance — rather than dropped. See §3.2.
3. **B2 rebuilt, not patched.** v2 misidentified it. See below.
4. Circuit-response wording: field established **along the conductor**;
   propagation deferred.
5. Arc restructured as *counting → transfer → rate*, per review.
6. Scene-level design review added as §7, with its first finding.

### The B2 correction, because it matters more than the others

v2 stated the target model as *"current means how fast electrons move,"* implying
the student's intuition is wrong. **It is not wrong.** Electrons in copper move
at roughly **1.6×10⁶ m/s**. The student who says electrons are racing is correct.

What is wrong is identifying that speed with the current. The current arises from
a minuscule *net drift* — about **7.3×10⁻⁵ m/s** — superimposed on that enormous
random motion. The ratio is about **2×10¹⁰**.

This changes the target, the question, and the scene. An animation showing dots
gliding smoothly in one direction does not simplify the picture; it **contradicts**
it, and installs a new mental model while removing another.

---

# 0. Audience and prior knowledge — decide this first

Not an implementation detail. It determines the whole sequence, and the tables
below are invalid without it.

| If the students | then |
|---|---|
| **Have not met circuits formally** | Treat the models below as *preconceptions* built from everyday language. B3 and B4 are good targets, not yet reinforced by instruction. Proceed as specified. |
| **Have already studied current, voltage, circuits** | **Diagnose, do not assume.** Post-instruction students often have the right words attached to the wrong model — harder to shift, and invisible on a written test. Run the questions first and rebuild the target list from what they say. |

**Terminology.** These are **targeted mental models**, not misconceptions.
Several are not false beliefs but the *absence* of a model. A student never told
that charge is quantised does not hold a belief that it is continuous.

---

# 1. The arc

Restructured per review. Each stage answers a question raised by the one before.

```
elementary charge — charge is a property, and it comes in one size
        ↓
counting charge — how many, not how big
        ↓
Q = Ne
        ↓
charge separation, then charge transfer  (cloud stays neutral overall)
        ↓
charge crossing a boundary — the countable event
        ↓
how much crossed?          how long did it take?
        ↓
I = ΔQ/Δt          — current is a rate
        ↓
what determines I?
        ↓
I = nqAv_d         — and v_d is a drift, not the electron's speed
```

The arc exists to establish one thing:

> **Amount of charge transferred and rate of transfer are distinct quantities.
> The amount alone does not determine the rate — you also need the time.**

A AA battery delivers on the order of **hundreds of times more total charge**
over its life than a lightning stroke transfers, while lightning's current
exceeds the battery's by a factor of tens of thousands. Same quantity, opposite
orderings. No claim about danger is needed and none is made.

**The comparison is illustrative, not foundational.** Across plausible ranges
(strokes of order 5–20 C, cells of order 2000–3000 mAh) the ratio spans roughly
**360× to 2160×**. A single figure is not defensible. The animation must show a
range computed from sourced inputs, and the student should see it move as inputs
vary.

---

# 2. Four quantities the earlier drafts conflated

Made **operationally visible, not by new notation** — three subscripted symbols
cost more than they buy at this level.

| Quantity | Meaning | How the scene shows it |
|---|---|---|
| Net charge | Algebraic sum over the whole system | Readout **pinned at zero** for the cloud, throughout |
| Separated charge | Magnitude displaced between regions | Second readout that **climbs** as regions polarise |
| Transferred charge | Charge crossing a surface in an interval | Counter that **ticks** as carriers cross the gate |
| Rate of transfer | Transferred charge per unit time | That counter **divided by a visible clock window** |

A student watching net charge stay at zero while separation climbs has seen
charge conservation without being told.

---

# 3. Part A — How much charge is an electron, and how much can a storm separate?

## 3.1 Targeted mental models

| ID | Model held | What a student says | Why it is reasonable |
|---|---|---|---|
| **A1** | Charge is a substance | "The cloud is full of charge, like a bucket of water" | Everyday language: charge "builds up", "leaks away", is "stored" |
| **A2** | Larger charge ⇒ larger particle | "The cloud's charges must be bigger than an electron" | Every other extensive quantity they know scales with size |
| **A3** | *(absence of a model)* charge is continuous | "You could have half an electron's worth" | Nothing in their experience is quantised |
| **A4** | A thundercloud *creates* charge | "The storm generates a huge negative charge" | The word "generate"; the cloud was previously unremarkable |

**A4 is the expensive one.** Charge conservation underpins everything
downstream, and "the cloud acquires an enormous net charge" contradicts what the
sequence is building toward. A storm separates charge that was already present;
the cloud as a whole stays close to neutral.

## 3.2 Discriminating questions

Acceptance criteria. Written before the animation, not adjusted to match what
gets built. **Every item demands reasoning** — v1's yes/no items measured
test-savviness rather than understanding.

| # | Question | Model-consistent response | Target response | Isolates |
|---|---|---|---|---|
| **A-i** | Compare the charge on an electron inside a storm cloud with one in this table. What can you say? | "The storm one is bigger" | Identical, always. Not a variable. | A1, A2 |
| **A-ii-a** | *(conceptual)* Can an isolated object carry a charge of exactly 1.5 elementary charges? Why? | "Yes, why not" | No. Charge comes in whole multiples of *e*. | A3 |
| **A-ii-b** | *(measurement)* Two measurements return 4.80×10⁻¹⁹ C and 2.40×10⁻¹⁹ C. Is either inconsistent with quantisation? How would you check? | "No way to tell" | Divide by *e*. 4.80×10⁻¹⁹ → 2.996 *e*, **0.14%** from an integer — consistent. 2.40×10⁻¹⁹ → 1.498 *e*, **49.8%** off — inconsistent. | A3 |
| **A-iii** | Before the storm, where was the charge the lightning released? What changed in the cloud? | "It wasn't there / the storm made it" | Already present and mixed; the storm separated it | A4 |
| **A-iv** | Taken as a whole, is a thundercloud charged? Justify. | "Enormously negative" | Roughly neutral overall; separated *within* | A4 |
| **A-v** | A AA battery delivers hundreds of times more total charge than a lightning stroke, yet lightning's current is tens of thousands of times larger. Explain how both are true. | "One must be wrong" | Charge is a total, current a rate. Same amount over a different time gives a different rate. | Bridge to Part B |

**Why A-ii is split.** Dividing a measured charge by *e* and asking whether the
result is near an integer is not a rounding exercise — it is how quantisation is
actually established, and it is the substance of Millikan's argument. Removing it
would remove real physics practice. But it must be posed as a *measurement with
tolerance*, and the exact value 3*e* = 4.806529902×10⁻¹⁹ C stated separately, so
that no student concludes quantisation is approximate. The two candidates are
0.14% and 49.8% from integers; these are not the same kind of near-miss and no
student will confuse them.

## 3.3 Design constraints

1. **The electron never changes size.** At every zoom level the elementary charge
   is drawn identically. This single invariant carries A1 and A2.
2. **The counter always reads an integer.** Quantisation shown by the readout
   being *unable* to display 2.5, not by assertion.
3. **The cloud starts neutral and stays neutral.** Conservation made visible.
4. **Magnitude is never conveyed by drawn size.**

## 3.4 The scale problem has no visual solution

A ~15 C stroke involves about 9.4×10¹⁹ elementary charges. A field of dots
saturates into a solid block by around 10³. A bar drawn for 10¹² *e* that looks
three times the 10⁹ *e* bar represents a factor of 1000 as a factor of 3 — a
representational lie of the kind `OPENVIDYA_PHILOSOPHY.md` forbids.

Two honest devices, neither spatial:

- **Time as yardstick.** Counting one electron per second takes about 3.0×10¹²
  years — roughly **215 times the age of the universe**.
- **An explicitly labelled logarithmic axis**, log-ness visible and stated.

⚠ Whether a 16-year-old reads a labelled log axis as logarithmic is an open
question (§6.4). It is a guess.

## 3.5 Representation note, to appear on the page

**● is a symbol standing for one electron. It is not a picture of one.** Without
this, students leave believing electrons are tiny balls carrying a fluid called
charge — the ontology the sequence exists to remove.

## 3.6 Deferred

Fields, potential, energy, electrical hazard, and the mechanism of cloud
electrification. Lightning here is *a quantity of separated charge*, and the page
says it is not attempting the mechanism.

---

# 4. Part B — Current is a rate of flow

## 4.1 Targeted mental models

| ID | Model held | What a student says | Status of the intuition |
|---|---|---|---|
| **B1** | Current *is* charge | "This wire has more current in it" (meaning charge) | Wrong; units never made operational |
| **B2a** | Current is determined by carrier speed alone | "High current means the electrons are racing" | **Half right.** True at fixed *n* and *A* — a condition nobody states. |
| **B2b** | The electron's motion *is* the drift | "So electrons crawl along at 0.07 mm/s" | **Wrong, and usually caused by the animation itself.** Electrons move at ~1.6×10⁶ m/s; the drift is a tiny bias on top. |
| **B3** | Current is consumed going round | "Less comes back to the battery" | Wrong; the bulb visibly uses *something* up |
| **B4** | Electrons travel from battery to bulb to light it | "The electricity has to get there first" | Wrong; the light appears the instant the switch closes |

**B2a and B2b pull in opposite directions and both must be addressed.** Correcting
B2a by showing slow drift creates B2b. Correcting B2b by showing fast random
motion makes the drift invisible. This is the central design tension of Part B and
§7 records that it is not yet solved.

## 4.2 Discriminating questions

| # | Question | Model-consistent response | Target response | Isolates |
|---|---|---|---|---|
| **B-i** | Two wires carry the same current. What can you say about how fast the electrons move in each? Explain. | "Same speed" | Cannot tell — depends on carrier density and cross-section | B2a |
| **B-ii** | Double the number of mobile carriers and halve their drift speed. What happens to the current? Reason it out. | "Doubles" / "halves" | Unchanged. Verified: *I*(n,v) = *I*(2n, v/2) = 1.0000 A | B2a |
| **B-iii** | Describe two situations where the same charge passes a point but the currents differ. What must differ? | "Impossible" | Different elapsed times | B1 |
| **B-iv** | Compare current returning to the battery with current leaving it. Is anything used up in the bulb? | "Less returns" | Identical current. *Energy* is transferred; charge is not consumed. | B3 |
| **B-v** | Close the switch and the bulb lights at once, yet individual electrons drift slower than a snail. Explain how both are true. | "The electrons must be fast" | Carriers are already present throughout the conductor; closing the circuit establishes a field along it that sets them drifting. | B4 |
| **B-vi** | Estimate how long one electron takes to travel a metre of wire carrying 1 A. What did you assume? | "Nearly instant" | Hours (3.8 h). Requires assuming a carrier density — which rests on a model. | B2a, model-dependence |
| **B-vii** | *(new in v3)* An electron in a copper wire is moving at over a million metres per second. The current corresponds to a drift of well under a millimetre per second. Are both true? How? | "One must be wrong" | Both true. Rapid motion is random and cancels; the drift is a small net bias on top of it. | B2b |

B-vii exists because v2 had no way to detect B2b at all — and B2b is a model the
animation would have created.

## 4.3 Design constraints

1. **Vary one thing at a time, visibly.** When the clock window changes, carriers
   must not. When speed changes, density must be shown pinned. Any frame where
   two variables move together is a defect.
2. **The ammeter is a turnstile.** Current introduced as *carriers counted
   crossing a plane per second*, before any symbol. Operational definition first,
   `I = ΔQ/Δt` second, `I = nqAv_d` third.
3. **Same current, different configuration, side by side.** Sparse-and-quick
   beside dense-and-crawling, identical reading, and the student must hit a target
   current two ways *themselves*.
4. **Carriers visible in the wire before the switch closes**, or B4 is reinforced.
5. **Circuit response stated carefully.** Not "all electrons start at once": *the
   conductor already contains mobile carriers, and closing the circuit establishes
   an electric field along it which sets them drifting.* Propagation deferred to a
   later fields-in-circuits module.
6. **Conventional current last, and explicitly**, both directions shown, the sign
   convention named as a convention.
7. **The drawn motion must be declared a distortion.** See §4.4.

## 4.4 The drift/random-motion problem, and why it cannot be drawn honestly

Same shape as the Part A scale problem, and it must be handled the same way.

| Quantity | Value |
|---|---|
| Random (Fermi) speed in copper | ≈ 1.6×10⁶ m/s |
| Drift speed, 1 A in 1 mm² | ≈ 7.3×10⁻⁵ m/s |
| Ratio | ≈ **2.1×10¹⁰** |
| Mean free path (τ ≈ 2.5×10⁻¹⁴ s) | ≈ 39 nm — while drifting ≈ 2×10⁻⁶ pm |

If the drift is drawn at a visible 20 px/s, honest random motion would be
**4×10¹¹ px/s** — about 4×10⁸ screen-widths per second. It cannot be drawn.
**Distortion is not a stylistic choice here; it is mandatory.** The only question
is whether it is declared.

Required treatment:

- **Two view modes.** *Drift only* (random motion suppressed, ratio distorted) and
  *with random motion* (drift barely perceptible, closer to honest).
- **The distortion factor stated on screen** in the drift-only mode — the same
  discipline as a labelled log axis.
- **A "follow one electron" mode** showing an erratic path with slow net progress.
  This is the single frame that carries B2b.
- Caption: *the arrow represents an average drift, not the motion of any
  individual electron.*

⚠ Whether students can hold both pictures at once, or whether the two modes
simply produce two disconnected impressions, is **unknown** and is now the
highest-priority item in §6.4.

## 4.5 Deferred

Resistance, Ohm's law, energy and power, EMF, what sets the drift speed,
scattering mechanisms, fields inside conductors, AC. The page ends at "current is
a rate" and says so.

---

# 5. Quantity and statement taxonomies

Applies retroactively to existing modules — see §8.

## Quantity types

| Type | Meaning | Example here | Must declare |
|---|---|---|---|
| `exact-by-definition` | Fixed by the SI | *e* = 1.602176634×10⁻¹⁹ C | the defining standard |
| `measured` | Empirical, with spread | lightning charge transfer | range, conditions, source |
| `model-dependent` | Follows only from a stated assumption | copper *n*; Fermi speed | the assumption itself |
| `conventional` | Standard agreed value, not universal | *g* = 9.81 m/s² | that it is conventional |
| `device-specific` | Depends on make and use | AA capacity | make, model, load |
| `derived` | Computed from the above | *Q* = *It* | its inputs |
| `illustrative` | Chosen to teach, not claimed typical | worked examples | that it is chosen |

## Statement types

`governing_law.form` must not force everything into "equation".

| Type | Example |
|---|---|
| `definition` | *I* ≡ d*Q*/d*t* |
| `conservation-principle` | charge is conserved |
| `law` | **F** = *q*(**E** + **v**×**B**) |
| `model` | **a** = **g**; free-electron gas |
| `constitutive-relation` | **J** = σ**E** |
| `empirical-relation` | fitted correlations |

This concept's governing statement is a **definition**. Nothing is integrated.

---

# 6. Claims, in four classes

- **Verification** — did we build the thing right? *(machine)*
- **Validation** — did we build the right thing? *(physicist)*
- **Empirical inputs** — where do the numbers come from? *(citation)*
- **Pedagogical validation** — does it change what a student thinks? *(students)*

## 6.1 Verification — machine-checkable by an independent route

| Claim | Route independent of the implementation |
|---|---|
| Gate counter is always an integer multiple of *e* | Assert `Q_counted / e` integral to machine precision |
| Charge conserved: in = out + in transit | Count at entry and exit planes over the full run |
| Counted current equals `nqAv_d` | **Count** crossings (simulation) vs the **analytic product** (formula) |
| Current invariant under `n → λn, v → v/λ` | Verified: 1.0000 A both ways |
| Accumulated charge equals ∫*I* d*t* | Numerical quadrature vs running counter |
| Drift speed, 1 A in 1 mm² Cu | Verified: 7.343×10⁻⁵ m/s; 26.4 cm/hour; 3.8 h per metre |
| Quantisation examples | Verified: 4.80×10⁻¹⁹ C = 2.996 *e* (0.14% off); 2.40×10⁻¹⁹ C = 1.498 *e* (49.8% off) |
| **Random motion averages to the drift** | Simulate carriers with random velocities plus a bias; the *mean* displacement over many collisions must reproduce `v_d` to within sampling error, and the counted current must be unchanged by the random component |

The last row is new in v3 and is the verification counterpart of the B2b scene:
if the random-motion view is drawn, the model behind it must demonstrably yield
the same current as the drift-only view.

## 6.2 Validation — requires a physicist

- Is `I = nqAv_d` appropriate for what is depicted? (Free-electron gas in a
  uniform metal — not valid for semiconductors, electrolytes, plasmas.)
- Is treating lightning as "a quantity of transferred charge" defensible, given
  the real process is a structured plasma channel?
- Is one conduction electron per copper atom acceptable here?
- **Is a classical random-walk picture of conduction acceptable at this level**,
  given that the real justification is quantum (Fermi surface, Pauli exclusion)?
  A classical gas gets the drift roughly right for the wrong reason.

## 6.3 Empirical inputs — must be cited

| Value | Type | Status |
|---|---|---|
| *e* = 1.602176634×10⁻¹⁹ C | `exact-by-definition` | ✅ SI 2019 |
| Lightning charge ≈ 5–20 C | `measured` | ⚠ **UNSOURCED.** Varies by >1 order of magnitude |
| Peak stroke current ≈ 30 kA | `measured` | ⚠ **UNSOURCED** |
| AA capacity ≈ 2000–3000 mAh | `device-specific` | ⚠ **UNSOURCED.** Cite a datasheet with load conditions |
| Copper *n* = 8.5×10²⁸ m⁻³ | `model-dependent` | ⚠ From density and molar mass **assuming one conduction electron per atom** |
| Fermi speed ≈ 1.6×10⁶ m/s | `model-dependent` | ⚠ **New in v3.** From *E*_F ≈ 7 eV via a free-electron model. Both the value and the model need citing. |
| Relaxation time τ ≈ 2.5×10⁻¹⁴ s | `model-dependent` | ⚠ **New in v3.** Order-of-magnitude only |
| Age of universe ≈ 1.38×10¹⁰ yr | `measured` | ⚠ **UNSOURCED** |

All arithmetic derived from these is machine-verified. **The arithmetic is right;
the inputs are not yet trustworthy.** v3 has *increased* the unsourced count — the
B2b fix brought two new model-dependent quantities with it. Correcting a
pedagogical error added evidential debt, which is worth noticing.

## 6.4 Pedagogical validation — only students settle these

Ranked by how much rests on them:

1. **Can students hold the drift and random-motion pictures together?** New in v3
   and now the highest risk, because the two-view design is untested and was
   invented to fix B2b.
2. Does the twin-tube comparison dislodge B2a, or do students file the tubes as
   unrelated cases?
3. Does "215 times the age of the universe" convey 10²⁰, or slide past?
4. Is a labelled log axis read as logarithmic by a 16-year-old?
5. Does the AA/lightning comparison produce insight or disbelief?
6. Do dot-carriers create more B4 than they remove?

### Protocol

Asking the same questions before and after **cannot work** — the testing effect
would produce an apparent gain from a blank screen.

1. **Matched item forms**, counterbalanced across pre and post.
2. **A comparison group**, even four students on a conventional text treatment.
3. **Think-aloud, scored on reasoning.** A right answer with wrong reasoning is a
   miss.
4. **Delayed retest** at two weeks on the B2 items.

**What n≈6 buys.** Not an efficacy study and must not be reported as one. Six
students cannot measure a learning gain. They can **surface failure modes nobody
anticipated** — the actual purpose, given that six items above are guesses.

---

# 7. Scene-level design review — *can the scenes satisfy every question without creating a new model?*

The review proposed as the next step. Started here; **not complete.**

### Finding 1 — OPEN. The Part B scene as specified creates B2b.

Smooth unidirectional dots at drift speed contradict the physics by a factor of
2×10¹⁰ and install "electrons crawl steadily" in place of "current is about
speed." The two-view treatment in §4.4 is a *proposal*, not a validated solution,
and it carries its own risk (§6.4 item 1). **This finding is why v3 exists**, and
it is evidence the review is worth completing before any code.

### Still to check

- Does the cloud scene satisfy A-iii and A-iv, or does showing separation imply
  the cloud became charged?
- Can a student answer B-i from the twin-tube scene alone, or does it need the
  formula?
- Does the turnstile scene answer B-iii without the student already knowing
  `I = ΔQ/Δt`?
- Does anything in Part A create a model Part B must then undo?
- Which scene answers B-iv? Nothing currently specified does — **possible gap.**

That last item suggests B3 has no scene at all. If confirmed, either a scene is
added or B3 is dropped from the target list. Claiming a target with no instrument
is the kind of gap this review exists to catch.

---

# 8. Retroactive defect in a shipped module

In `src/content/mechanics/projectile-motion/model.yaml`, **`g = 9.81` is typed as
a plain parameter default.** It is a `conventional` value — latitude- and
altitude-dependent, not a constant of nature. The module declares the uniform-field
*assumption* but never says the *number* is a convention.

**Logged as an issue, not an action.** Per review, projectile motion is not to be
modified until the schema comparison across all three concepts is complete.

---

# 9. Decisions still needed

1. **Prior knowledge** — §0. Blocks everything.
2. **Ions and lattice.** Show the positive lattice or only mobile carriers?
   Showing only electrons risks implying the wire is negatively charged. *Now
   entangled with §4.4* — random motion is more honest against a visible lattice.
3. **Sourcing** for the ⚠ rows, now eight of them.
4. **Does the two-view drift treatment work?** Must be tested on students before
   Part B is built, not after.
5. **Does B3 need a scene, or should it leave the target list?** See §7.
