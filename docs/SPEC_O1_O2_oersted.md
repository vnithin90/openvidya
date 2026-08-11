# O1 and O2 — activity specification

**Layer 2.** The first two nodes of the missing Oersted branch, and the repair
of Chapter 3's unmet prerequisite.

Schema: `QUESTION_MAP_SCHEMA_TEST.md`. Map: `QUESTION_MAP.md`. Charter: v2.4.

---

# The design problem, stated honestly

The standard Oersted demonstration gives away its conclusion in the framing.
*"Watch the compass while I switch on the current"* announces that something will
happen to the compass. The student witnesses an effect they were told to expect,
and the discovery is theatre.

**The fix is not a better demonstration. It is giving the student a genuine
reason to predict nothing.**

And they have one. Everything the curriculum has established so far says a
copper wire should do nothing to a compass:

- magnets move compasses (M1, M2) — **a wire is not a magnet**
- current is charge flowing (C1) — **charge produces an electric field**, not a magnetic one
- a charged object attracts *neutral* things (E4) — **but that is attraction, not pointing**

A student reasoning correctly from what they have been taught should predict
**no effect**. That is what makes O1 a discovery: the prediction is wrong, and it
is wrong for good reasons.

## Three levels of conclusion — do not let them collapse

The discovery architecture depends on keeping these apart. O1 and O2 must not
reach for O4's conclusion, however tempting it is once the pattern appears.

| | conclusion | node |
|---|---|---|
| **existence** | A current-carrying wire influences a compass. | **O1** |
| **structure** | That influence has a direction at every point, forming a circular pattern around the wire. | **O2** |
| **unification** | That structure can be compared with a permanent magnet's, leading to a current-based description of magnetism. | **O4** |

**O1 does not say "field".** The word is earned in O2, when the student has
actually met the spatial evidence. Introducing it earlier hands over the answer
to O2's question before it has been asked.

---

# O1 · A compass sits beside a wire. You switch the current on.

| | |
|---|---|
| **id** | O1 |
| **question** | A compass lies next to an ordinary copper wire. You connect the wire to a battery. Does anything happen to the compass? |
| **intent** | That a current-carrying wire **produces an influence that changes the orientation of a magnetic compass**. The first link from electricity to magnetism, and the missing prerequisite of I2. |
| **prerequisites** | C1 (current is charge flowing) **→** · M2 (a compass reads field direction) **→** · E4 (polarisation) **⇢** *soft, see confound* |
| **model_ids** | `magnetic-field-of-current` *(new)* · `magnetic-field-direction` *(reused from M2 — the compass is the detector)* |
| **context_type** | `laboratory` |
| **context_rationale** | Compass, wire, battery. Cheapest apparatus in the whole map, and the effect cannot be prompted into existence. |
| **formula_proof_rationale** | No formula available to this student predicts whether a compass responds to a wire. The prediction is binary, and their existing model says *no*. |
| **status** | specified |

### activities

**1 · Establish the control before anything is switched on.**
Compass beside the wire, battery disconnected. Nothing happens. The student
records that the wire is *not* a magnet. This step is not filler — it is what
makes the later result attributable.

- **prior_commitment** — *"Will this bare copper wire affect the compass?"*
  Free response with a reason. Nearly all say no, and they are right.
- **artefact** — a written reason, which will be re-read in activity 4.

**2 · Commit, then connect.**

- **prior_commitment** — *"Now the battery is connected and current flows. Does anything change? If so, what exactly does the needle do — swing toward the wire, away from it, or something else?"*
  Three-way choice **plus** a required reason.
- **observation** — the needle swings, and it settles **across** the wire, not toward it.
- **discrepancy** — most predict nothing at all. Of those who predict movement, most expect attraction *toward* the wire, by analogy with E4. It is neither.

**3 · Reverse the current.**
The single most important step in the activity.

- **prior_commitment** — *"If the battery is connected the other way round, what happens?"*
- **observation** — the deflection reverses.
- **why it matters** — it **rules out the principal non-magnetic explanations under consideration here**: heating or draught, and electrostatic attraction. Neither reverses. *Not* "kills every rival explanation" — it eliminates the ones on the table, which is all an experiment ever does.

**4 · Move the compass to the other side of the wire.**

- **prior_commitment** — *"Same current, compass moved from above the wire to below it. Same deflection, or different?"*
- **observation** — it reverses again.
- **this seeds O2 directly** and already makes "the wire has become a bar magnet" hard to sustain.

### judgment_task

> Three students explain activity 2.
> **A** — *"The current heats the wire and the warm air moves the needle."*
> **B** — *"The current puts charge on the wire, and the charged wire attracts the steel needle."*
> **C** — *"The current produces something magnetic around the wire."*
>
> **Which single observation from activities 3 and 4 rules out A and B together —
> and why does that same observation not rule out C?**

Discriminating, per F9. The answer — reversal — is an observation the student
made themselves, and A and B both fail it. **B fails for exactly the reason E4
taught them:** electrostatic attraction does not reverse when the sign reverses.

### representation_constraints

- Do **not** draw field lines yet. O1 establishes only that *something magnetic* is present; the shape is O2's question, and pre-drawing it hands over the answer.
- Do **not** label the wire N and S.

### ⚠ Declared confound

An electrostatically charged object **does** deflect a compass needle — the
needle is steel, it polarises, and it is attracted. A student who tests "does
static charge do it too?" may see movement and conclude yes.

This is not a flaw to hide. It is why **E4 is a soft prerequisite**, and the
discriminator is precisely E4's lesson: *magnetic deflection reverses with
current direction; electrostatic attraction does not reverse with charge sign.*

The static-charge control is specified as an **optional extension**, to be
included only if the physics authority judges the confound productive rather
than confusing at this level.

### apparatus specification — **geometry is not optional**

The numbers below are meaningless without the geometry, and an earlier draft
quoted them without it. **Declared:**

> **Wire horizontal, laid along the north–south line** (parallel to Earth's
> horizontal component **B_H**). **Compass directly above or below the wire** at
> distance *r*.

Under that arrangement B_wire at the compass is horizontal and **perpendicular**
to B_H, so tan θ = B_wire / B_H — the tangent-galvanometer geometry.

**Get the geometry wrong and the headline experiment shows nothing.** Lay the
same wire **east–west** instead and B_wire at the compass becomes *parallel* to
B_H: the needle does not rotate at all, only the resultant magnitude changes.
Same current, same distance, no visible effect. A teacher who improvises the
layout can silently destroy the lesson.

| I (A) | r (cm) | B_wire (µT) | θ = arctan(B_wire/B_H) |
|---|---|---|---|
| 0.5 | 1 | 10 | 16° |
| **1** | **1** | **20** | **30°** |
| 2 | 1 | 40 | 49° |
| 1 | 3 | 6.7 | 11° |

⚠ **B_H = 35 µT is assumed and unsourced.** It varies substantially across India.
The apparatus specification must carry **the local horizontal field magnitude**,
not just the geometry. Until it does, this table is illustrative.

### Why ~30° and not 90° — the deeper reason

Avoiding saturation is the practical argument. The physical one matters more:

> The compass is not answering *"is there a magnetic field?"* It is settling
> along the **resultant** of two fields, **B_net = B_Earth + B_wire**.

A partial deflection makes that visible. A 90° swing hides it, and with it the
fact that Earth's field never stopped acting. This is **M4's lesson arriving for
free**, and it is a physics opportunity rather than an apparatus limitation —
recorded as such so nobody later "improves" the demonstration by cranking the
current up.

---

# O2 · What shape is the field around a wire?

| | |
|---|---|
| **id** | O2 |
| **question** | You now know a current-carrying wire affects a compass. Walk the compass all the way around the wire. What will the needle do at each place? |
| **intent** | That the field direction around a wire is **tangential, forming a circular pattern** — and that **the pole model which worked for the bar magnet does not transfer unchanged to a wire**. Prerequisite of I2, and the seed of O4. |
| **prerequisites** | O1 **→** · M2 **→** (six-position prediction is the same activity form) |
| **model_ids** | `magnetic-field-of-current` |
| **context_type** | `laboratory` |
| **formula_proof_rationale** | The available formula, B = μ₀I/2πr, gives a *magnitude*. The question asks for the **shape**, which it does not state. At Grade 8–9 no formula exists at all. |
| **status** | specified |

### activities

**1 · Predict the whole pattern before measuring.**

- **prior_commitment** — mark eight positions on a card around the wire; **draw an arrow at each, before any measurement**. Same form as M2's six arrows, deliberately, so the student recognises the method.
- **artefact** — the drawn card.
- **expected failure** — students predict a pole-like pattern, arrows pointing *at* or *along* the wire, because M2's magnet is the only field pattern they have ever seen.

**2 · Measure at all eight positions.**

- **observation** — the needle is always **tangential** — perpendicular to the line joining it to the wire. Carry the compass once around the wire and the needle turns through a full **360°**.

**3 · Go looking for the poles.**

- **prior_commitment** — *"Every magnet you have met has two ends the needle points toward. Where are this wire's?"*
- **observation** — **none is found anywhere in the explored region.** Outside a bar magnet you can always locate places the needle converges on. Around this wire, at every position tried, the needle points *around*, never *at*.

### judgment_task

> Two students describe the eight readings.
> **A** — *"The wire is behaving like a very thin bar magnet lying along its own length."*
> **B** — *"The field direction forms circles around the wire; there isn't a point that acts like a pole."*
>
> **Which of the eight readings is impossible under A?** And: **what would you
> have to find, and where, to rescue A?**

The second half is the valuable one. Rescuing A requires locating a
pole-like convergence point, and the search fails everywhere the student looks.

### ⚠ What this establishes — and what it does not

**Establishes:** the pole model, which described the bar magnet correctly, **does
not transfer unchanged** to a current-carrying wire. That is a statement about a
model's domain, and it is exactly the qualification the charter asks for.

**Does not establish:** that isolated magnetic monopoles do not exist. Walking a
compass around one laboratory wire cannot support a universal claim about nature,
and an earlier draft of this specification said it did — reproducing the very
overclaim the O4 revision had just removed.

The general statement about monopoles belongs to a later node, at a declared and
different level of evidence. What the student earns here is domain-limitation of
a model they trusted, which is more useful and is actually true.

### representation_constraints

- Circles are a representation of direction, **not** channels the field flows along.
- Field magnitude falls as 1/r; drawing evenly spaced circles must not imply uniform strength.

### evidence

- **apparatus** — eight compass positions; reversal checks from O1 still apply.
- **computational verification** — implement Biot–Savart as a pointwise sum, then verify the resulting field with a numerical line integral against **Ampère's circuital law**, ∮B·dl = μ₀I. The verification pattern from the electric-field prototype transfers directly, and this is the first real payoff from that method prototype.

  ⚠ **This is independent *computational* verification, not independent *physical* validation.** Biot–Savart and Ampère's law are both consequences of the same field equations under these assumptions; agreement shows the code computes the model correctly, not that the model describes the world. Physical validation is the apparatus row above. The distinction is charter §9, and it is easy to lose precisely because the computational check feels so convincing.

### conceptual_debt

- Treats the wire as infinitely long and infinitesimally thin.
- Says nothing about *why* moving charge produces a magnetic field. That is relativity, and it is out of scope at Grade 12 — declared, not hidden.

---

# What these two entries settle, and what they do not

**Settled:** I2's missing prerequisite. Once O2 exists, *"the induced current's
field opposes the change"* has a referent the student has measured with their own
compass.

**Also settled, unexpectedly:** the electric-field method prototype turns out to
carry real curriculum weight. Its verification pattern — pointwise sum checked
against an integral theorem — is exactly what O2's model needs. That is the first
evidence the prototypes earned their place beyond schema discovery.

**Not settled — and these are now empirical and apparatus questions, not
pedagogical ones:**

- Whether the static-charge control helps or confuses. Physics authority decides.
- **The local value of Earth's horizontal field.** ⚠ unsourced; the whole apparatus table depends on it, and it varies substantially across India.
- Whether eight positions is right — M2 uses six, and method consistency may matter more than angular coverage.
- Every `formula_proof_rationale` here is a first draft, per the map's own caveat.

**Status: ready for physics-authority review**, not for another round of
pedagogical redesign. The discovery architecture has been tested; what remains is
whether the physics and the apparatus survive someone who has run this
experiment in a room with real students.
