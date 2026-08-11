# E3 · Lesson specification — *How does one charge know the other is there?*

> **Status: conceptual specification — ready for physics-authority review.**
> Written against the map after E1 and E2, following two authority rulings taken
> before drafting (§17.1, §17.2).

Prerequisite: **E2** (hard). Enters with: the push depends on both charges and on
distance, falls off steeper than proportional, and is equal and opposite however
unequal the charges. **No field. No lines. No `E`. No constant.**

Context: **`internal_to_theory`** — the second declared use, and the first that
reaches a student. There is no honest everyday anchor, and the charter forbids
inventing one.

---

# The finding, first

> **E3 cannot establish the field. With static charges, the field account and the
> action-at-a-distance account predict identical measurements — and the lesson's
> value is in making the student see that, not in hiding it.**

This is not a weakness peculiar to a school laboratory. It is a real feature of
electrostatics: **static measurements are reproduced equally well by an
instantaneous action-at-a-distance description and by the static limit of field
theory.** What separates them is dynamics — finite propagation, and fields with
their own local behaviour — and the smallest signature of that is a delay of r/c,
which no apparatus in this course can reach.

⚠ **The compressed form — *"the two accounts diverge only when charges move"* —
stays in this specification and does not go to a student in that wording.** It
invites "so they're the same thing for static charges", which is a statement
about descriptions being *equivalent in a limit*, not about them being identical.

So E3 is the second lesson in a row whose honest outcome is *"my evidence does not
settle this"* — and the second where that is the point. E2 could not separate two
exponents. E3 cannot separate two ontologies. The difference is that **E2's limit
was the apparatus, and E3's is the physics.** A better instrument fixes one and
not the other.

What E3 *can* do is make the question exist, produce a real map, and state
precisely what evidence would later decide it.

---

# 1 · Why this question

E2 left a hole and did not mention it. Two objects, nothing between them, and a
force. **Nobody asked how.**

Everything after this node needs an answer: potential (E5), capacitance (E6), and
the entire magnetism and induction half of the course, where "the field" is not a
convenience but the only way the statements can be made at all. **I2 — Lenz —
is a statement about a field's own behaviour.** A student who reaches it with the
field unexamined is pattern-matching.

E3 is also where the course first says out loud that *physics contains choices of
description, not only findings.*

# 2 · What the student needs at entry

E2 only.

**Deliberately not assumed:**

- Any prior notion of "field" from magnetism. M1–M4 are not prerequisites, and E3 must not lean on a compass picture the student may not have.
- Finite speed of light. It is *named* in §7 as the thing that would settle the question, not used.
- Vectors. Direction and strength are handled as arrow-and-length, not as notation.

# 3 · Initial model — what the student walks in with

Not a wrong belief this time. **An unasked question.**

Most students arriving from E2 have no position on how the force is conveyed,
because it has not occurred to them that anything needs conveying. The two
positions that surface once asked:

- **"It just pulls. That's what charges do."** Action at a distance, unexamined and treated as needing no explanation.
- **"Something must be going between them."** A mediating something, usually imagined as a substance — invisible rays, a stretched connection.

**The first job of E3 is to make the question feel like a question**, which is
harder than correcting a wrong answer. The move is to put the strangeness beside
something familiar: every push the student has ever given required contact. Here
there is measurably nothing in between, and there is still a force.

# 4 · Prediction and commitment

Three commitments, all locked before anything is shown.

**P1 — the empty-point question.** *This is the lesson.*

> A charged ball hangs at rest. You bring a second charged ball to a point 10 cm
> away; it is pushed. Now take the second ball **completely away**.
>
> **What, if anything, do you think is at that point when no second ball is
> there?**

Written down, with **the reason**, in the student's own words — not chosen from a
list.

⚠ **Not "yes / no / cannot be decided".** An earlier draft offered those three,
and "yes" is ambiguous in a way that ruins the measurement: one student means
*"there is an electric field there"* — already adopting the ontology the lesson
has not reached — and another means *"something physical is going on"*, which is
a different claim. The teacher cannot tell them apart, and J1 later depends on
knowing which the student committed to. **The reason is the data here, not the
answer.**

**P2 — the map.** Around a single charged ball, mark **six positions**. At each,
draw an arrow for the way a second charged ball would be pushed, and make the
arrow longer where the push is stronger.

*Deliberately the same instrument as **M2**, which puts a compass at six places
around a magnet. Same move, different strand, and the parallel is intended — see
§18.*

**P3 — the timing question.** *Asked, committed, and not answered in this lesson.*

> You suddenly jiggle the first ball. **When does the second one find out?**
> Immediately, or after some delay?

Most commit to *immediately*. Nothing in E3 resolves it. It is asked here because
it is the criterion that eventually decides P1, and a student should have staked
something on it before meeting the answer.

# 5 · Activity

## 5a · Direction only — **preferred design, feasibility not yet established**

**Source: a small charged conducting sphere** — one of E2's own balls, fixed in
place. **Probe: a second small sphere carrying charge of known sign**, suspended.
Move the probe to each of the six marked positions and record **which way it is
pushed**. Direction only. No magnitudes, no numbers.

The six positions are arranged **symmetrically**, and must include **two at equal
distance in different directions** and **two in the same direction at different
distances**. Without the first pair the student cannot see that direction does
*not* matter; without the second, that distance does.

### Why not a charged rod — computed, not assumed

An earlier draft of this specification used a charged rod. The field of a rod is
not radial, and the error is large enough to destroy the inference the lesson
depends on. Rod of length L = 0.30 m, **centred at the origin** (tips at ±0.15 m);
six positions on a circle of radius 0.25 m **about that centre**, clear of both
tips:

| position | misalignment from radial | \|E\| relative to weakest |
|---|---|---|
| 0° (on axis) | 0.0° | **1.82** |
| 30° | 10.4° | 1.43 |
| 60° | 7.4° | 1.09 |
| 90° (broadside) | 0.0° | 1.00 |

The student would find the push **1.8× stronger along the axis than broadside at
the same distance** — comparable to the distance effect the lesson exists to
show — and would map the rod's *shape* while believing they had mapped a law.

For **an isolated charged conducting sphere, at points outside it and at equal
radial distance from its centre**, spherical symmetry gives equal magnitude and
radial direction. That qualification matters: it is a property of that geometry,
not a general fact about fields.

### Why the probe must be charged

⚠ **A neutral probe measures a different experiment.** A neutral foil strip or
pith ball is polarisable, so in the non-uniform field near any charged source it
is drawn toward the stronger field — **toward the source, whatever the source's
sign.** The resulting map points inward everywhere and is identical for a
positive and a negative source. That is not a degraded map, it is an inverted
one, and it is **E4's phenomenon** (*why does a charged comb attract neutral
paper?*). E3 would demonstrate E4 while claiming to map E3.

### Probe assumptions, stated rather than assumed away

- `q_probe ≪ q_source`, so the probe does not appreciably alter the source.
- The probe's presence induces redistribution on a *conducting* source sphere.

**⚠ The coefficient here was borrowed from the wrong configuration in the first
amendment, and is now derived for this one.**

`scripts/verify-finite-sphere.py` computes **two identical spheres at equal
potential and equal charge**, and extracts B = 1 − 4(a/R)³. E3 has a **small
probe q near a larger source sphere Q**. Different problem; the coefficient does
not transfer. Deriving it directly — image charge q′ = −aq/d at a²/d, plus
Q + aq/d at the centre to conserve the sphere's total charge:

$$B = 1 + \rho x - \frac{\rho x}{(1-x^2)^2}, \qquad x = \frac{a}{d},\ \ \rho = \frac{q_{\text{probe}}}{Q_{\text{source}}}$$

$$\text{small } x:\quad B \approx 1 - 2\rho x^3$$

**The perturbation depends on the charge ratio, not on geometry alone** — which
the earlier table wrongly implied.

| a/d | q/Q | perturbation | earlier table claimed |
|---|---|---|---|
| 0.067 | 0.1 | **0.006%** | 0.12% |
| 0.10 | 0.1 | **0.020%** | 0.40% |
| 0.10 | 0.3 | **0.061%** | 0.40% |
| 0.20 | 0.1 | **0.170%** | 3.2% |
| 0.20 | 0.3 | **0.510%** | 3.2% |

At any workable geometry this is **far below what a direction-only map could
resolve** — the earlier figures were pessimistic by roughly an order of
magnitude. Recorded as an assumption rather than dismissed, and it grows as ρ
rises, so a probe carrying a sizeable fraction of the source's charge is the case
to avoid.

⚠ **Status: preferred design, not a settled one, and not yet ruled as an
interim.** The proposed small sphere **may** retain substantially less usable
charge than the rod of the earlier design, in which case the probe force is
weaker — but that is an apparatus-specific empirical claim, not a general
property of spheres versus rods, and **the bench decides it, not this document.**
Logged as an empirical input. **Whether 5a is performable at all is an
experimental question, not a design decision** — see §17.3.

## 5b · What cannot be done yet — the quantitative map

Measuring the **strength** of the push at each position, dividing by the size of
the test charge, and showing that the result depends only on position needs the
hanging-pair apparatus and its precision.

**That apparatus has never been built. See blocker B3 in
`LESSON_E2_AMENDMENTS.md`.**

## §B · Performability declaration

Template v1 §B. Every screen describing a physical action is declared, and a
`deferred` screen must say **when** it becomes doable and **why** it is held.

| Screen | Value | Obligation discharged |
|---|---|---|
| Entry, recalling E2 | `none` | — |
| P1 empty point | `none` | thought experiment, explicitly |
| P2 six-position sketch | `performable` | paper and pencil; means already held |
| P3 timing | `none` | explicitly asked and explicitly not answered here |
| 5a direction mapping | **`deferred`** *(was `performable`)* | **When: once the bench session confirms a charged probe reliably shows direction near a small charged sphere. Why held: the rod design it was written for produces a non-radial field that contradicts §6, and the sphere replacement has never been tried. §17.3.** |
| **5b strength mapping** | **`deferred`** | **When: once B3 confirms the hanging pair settles faster than it leaks. Why held: the measurement needs a precision no one has yet demonstrated, and E3 will not describe a procedure whose feasibility is unverified.** |
| Judgment J1 | `none` | — |
| Simulation | `none` | computed, and marked as computed |

**The `deferred` screen must say this to the student in their own words**, not
carry it only in the specification. E2 was corrected twice on exactly this.

# 6 · Observation

From 5a, honestly: **the arrows point away from the source everywhere, and get
weaker further out.** That is all a direction map gives.

⚠ `apparatus_failure_mode: silent-plausible` — inherited from E1 and E2.
Humidity drains charge from **both the source sphere and the probe** mid-session,
and the arrows quietly become shorter and more erratic while the student reads
them as data.

**What the map does not show, and must not be claimed:** whether anything is
present at the marked points when the test object is elsewhere. Every arrow was
drawn *by putting something there*. The map is a record of what happened when a
second object was present — which is precisely the thing P1 asks about.

**This is the sentence the whole lesson turns on, and it must survive to the
screen intact.**

# 7 · Judgment task

**J1 — two accounts of the same map.**

> Two students look at the same six arrows.
>
> **A** — *"The arrows show what's there. The charge fills the space around it
> with a push, and it's there whether or not anything is in it. My second ball
> just responds to what's already at its own location."*
>
> **B** — *"The arrows show what happens when I put a ball there. With no ball,
> nothing is at that point. The first charge reaches across and pushes the second
> one directly. The map is a record of what would happen, not of what is."*
>
> **Which student does the map support?**

**Neither.** The map is identical under both accounts, and that is the answer.

Then the second half, which is what separates E3 from a debate:

> **What would you have to observe to tell them apart?**

The target answer, in the student's own terms: *something involving movement and
timing.* If the first charge is jiggled and the second reacts **after a delay**,
then the influence is **not instantaneous** — something about the electric state
has to propagate from one place to the other, and a description that assigns a
condition to each position handles that without alteration.

**That is weaker than "A wins", deliberately.** A measured delay establishes
finite-speed local propagation. It does not by itself establish that the field is
a thing occupying the space, and an earlier draft of this specification said it
did — *"something that travels has to be somewhere in between while it travels"* —
which a student converts in one step into **an invisible fluid filling space**.
That is exactly the ontology this lesson exists to avoid planting.

The honest form: **the timing result decides whether the influence is
instantaneous. It does not decide everything P1 asks.**

**Nothing in this course measures that delay.** It is r/c — **3.3 nanoseconds
across a metre**, computed, not recalled. Naming the criterion is the
achievement; reaching it is not.

# 8 · Explanation

**Two separate things, and §8 must not merge them.**

*What E3 established:* a reproducible pattern of force around a source, and that
this pattern does not decide between the two accounts.

*What modern physics does anyway:* **electromagnetism describes the interaction
using electric and magnetic fields** — a condition assigned to every position,
whether or not anything is there to feel it. That is not the result of a vote
taken after looking at six arrows. It is the framework that turned out to work,
for reasons that arrive later than this lesson.

> We describe this spatial pattern using the **electric field**. Treating it as
> something present at every point is a **choice of description** that
> electrostatics alone does not force — and one that becomes far more than
> bookkeeping once charges move.

*Not "the map is called the field", which sounds like physicists gave the arrows
a name. It is a model, and saying so is the lesson.*

The choice is not arbitrary, and the student is owed the reasons:

1. **It is local.** Every object responds only to what is at its own position. Nothing has to reach across a gap.
2. **It survives motion.** When charges move, the delay is real, measured, and the field account handles it without alteration. The other does not.
3. **It carries energy.** Later in the course: changing electric and magnetic fields can propagate through space and carry energy, after the charge that made them has stopped. That energy has to be somewhere.

⚠ An earlier draft said *"radio and light are this map, shaken loose and
travelling on its own."* Vivid, and wrong in three ways a student will
literalise: a wave is not a static map set in motion, the electric and magnetic
parts oscillate together, and the source need not still exist. The lesson does
not need the metaphor to create the debt.

**Reasons 2 and 3 are outside this lesson's evidence.** They are named as the
reasons, and marked as promises the course will have to keep — not as things E3
established. `conceptual_debt` recorded in the model spec.

# 8a · Historical interlude — Faraday, who was arguing about exactly this

*Placement follows E1's Franklin and E2's Coulomb: after the student's own
judgment, before notation.*

The student has just been asked to choose between two accounts of the same
observations. **That argument is real and it was had.**

The mathematical tradition of Ampère and Poisson treated electric and magnetic
forces as acting directly across distance, at a distance, instantaneously.
Faraday — who could not follow their mathematics — thought in terms of **lines of
force** filling the space, and held that the lines were physically real rather
than a drawing aid. Maxwell then put Faraday's picture into equations, and those
equations predicted that a disturbance in the field travels at a finite speed
which turned out to be the speed of light.

> **The student's J1 question was a live dispute among working physicists, and
> what eventually settled it was the thing they were asked to name: what happens
> when charges move.**

⚠ **Unsourced, and the whole passage above is provisional.** Must be traced to
primary or authoritative material before it reaches a student, to the standard
E1 §8a set and E2 §8a is still failing.

Three specific claims need checking, not one:

| Claim | Status |
|---|---|
| Faraday held the lines of force to be physically real, against the action-at-a-distance tradition | plausible, untraced. Candidate: *Experimental Researches*, Series XXVIII (1852) — but that paper concerns **magnetic** lines, so the electric case needs its own citation |
| Faraday lacked the mathematics of Ampère and Poisson | widely repeated; needs a real source, not repetition |
| The duration of the dispute | **no figure asserted.** An earlier draft said "roughly forty years" without a checked anchor at either end. Removed rather than guessed |

**Not yet done — see §17.4.**

# 9 · Mathematical representation

Only now, and minimally.

$$\mathbf{E} = \frac{\mathbf{F}}{q_{\text{test}}}$$

In words: **the map is the force divided by the size of whatever you used to
measure it** — which is what makes it a property of the position rather than of
the pair.

**Deliberately absent:**

- $\mathbf{E} = kq/r^2$ — the explicit form. Nothing in E3 measured it, and E2 already refused the constant for the same reason.
- **Field lines.** The student has drawn six arrows. Lines are a further representational choice, and joining arrows into continuous curves adds a claim about the space between them that nothing here supports. Deferred, with the reason recorded.

# 10 · Formula-proof

**Strong, and structural rather than procedural.**

A student who arrives with $\mathbf{F} = q\mathbf{E}$ can compute every number in
this lesson and cannot answer its question. **P1 is not a calculation.** Asking
whether the field exists at an unoccupied point is not a quantity that any
rearrangement produces, and J1 asks which of two accounts a piece of data
supports — to which the correct answer is *neither*, which no formula returns.

This is the first lesson in the course whose central question is **not of a form
that any equation could answer.** That is worth stating in §18.

# 11–14 · References

Per the frozen three-layer architecture — pointers, not copies.
Model: `electric-field` (`src/content/fields/electric-field/model.yaml`, exists,
18 tests). Context: `internal_to_theory`. Evidence and debt: model spec, plus
§17 below.

# 15 · Teacher notes

- **The most likely failure of this lesson is that it succeeds too well.** A student shown a field-line picture concludes the field is real *because they saw it*. Guard the order: judgment first, picture second, and the picture labelled as computed.
- **Do not resolve J1.** "Neither, and here is what would" is the target. A student who says *"the arrows prove the field is there"* has missed the lesson, however confident they sound.
- `apparatus_failure_mode: silent-plausible`. Humidity drains the rod and shortens the arrows. Recharge between positions and say why.
- The six positions must include **two at the same distance in different directions** and **two along the same direction at different distances**, or the map cannot show that both position and distance matter.
- **Simulation is licensed here and dangerous here.** Permitted after J1, for representation and extension only, visibly marked as computed from the model rather than measured. It may never be the evidence that the model is true. `context: internal_to_theory` is what licenses it at all.

# 16 · Assessment evidence

| item | passes if |
|---|---|
| A charge sits alone in a room. Is anything happening one metre away from it? | Names both accounts, and that this measurement does not decide between them. Not a confident yes. |
| What would you have to observe to decide? | Something involving movement and timing — a delay between jiggling one charge and the other responding. |
| Your six arrows all point outward and shrink with distance. What have you shown? | What happens *when a test object is placed there*. Not what is there in its absence. |
| Why is $\mathbf{F} = q\mathbf{E}$ not an answer to this lesson's question? | Because it computes a force on a charge that is present, and the question is about a point where none is. |
| Why divide the force by the test charge? | So the result describes the position rather than the particular object used to probe it. |

# 17 · Open decisions

1. ~~**What may E3 assert about the field's status?**~~ **RULED 11 Aug 2026: a judgment, left open with stated criteria.** Mirrors M3. The criteria are named in §7 and the debt recorded in §8.
2. ~~**Does E3's activity inherit B3?**~~ **RULED 11 Aug 2026: declared `deferred` under template §B**, with when-and-why stated to the student.
3. **Is the 5a qualitative direction map performable at all?** No longer a design question — an experimental one, added to the B3 bench session. Eight things must hold, and any one can sink it:

   | # | Question |
   |---|---|
   | 1 | How much charge does the source sphere retain, and for how long? |
   | 2 | How much does the probe retain? |
   | 3 | Does the probe keep its **sign** across all six readings? |
   | 4 | Is the electric force large enough to produce a **repeatable deflection against the suspension's restoring force**? (Weight is not the competing force for a horizontal deflection — the restoring component is.) |
   | 5 | Is the response distinguishable from air currents? |
   | 6 | How fast does charge leak — the B3 question again, at smaller charge? |
   | 7 | Does bringing the probe close enough to see a deflection perturb the source? (§5a puts this under 0.5% at ≥10 source-radii — to be confirmed, not assumed) |
   | 8 | Are the six positions repeatable? |

   **⚠ If 5a fails, this is not a small edit.** §6 and §7 both presuppose that six arrows exist — J1 opens *"two students look at the same six arrows."* With no measurement there are no arrows, and the only other source is the simulation, which the licence forbids as evidence. **J1 would need redesigning, not deleting**, and the honest fallback is a hypothetical framing (*"suppose you measured…"*) which is materially weaker. Costed here so the pure-reasoning branch is not mistaken for a cheap one.

   That said: if the bench says no, a pure reasoning lesson **is** the scientifically honest outcome of an `internal_to_theory` node, not a failure.
4. **Faraday history unsourced.** Same debt E2 §8a still carries. Neither should reach a student until traced.
5. **Are field lines deferred to a later node, or is the deferral permanent at school level?** §9 defers them without saying where they land.
6. **Does the cohort meet E3 before or after the magnetism strand?** M2's six-compass move and P2 are the same instrument. Whichever comes second gains a powerful "you have done this before"; whichever comes first pays for it. Currently unspecified, and it is a sequencing decision, not a content one.

---

# 18 · What E3 tested about the process

**The template held again — with §B doing visible work for the first time.**
E2 forced §B into existence retroactively, after failing it twice. E3 is the first
lesson where the field was filled in *before* drafting, and it changed the design:
5b was written as `deferred` from the start rather than being caught in review.
**That is the first evidence §B prevents rather than merely detects.**

**Three findings E1 and E2 could not have produced:**

1. **The first question in the course that no equation could answer.** E1 and E2 were formula-proof by ordering and by judgment design. E3 is formula-proof by *kind*: P1 is not a quantity. This is a stronger category and the template should probably distinguish it — `formula_proof: by_ordering | by_judgment | by_kind`.

2. **A lesson whose limit is the physics, not the apparatus.** E2 could not separate 1/r² from 1/r³ because its ruler was too coarse; a torsion balance fixes that. E3 cannot separate the two accounts because *electrostatics does not distinguish them*. The distinction matters: one is a debt against better equipment, the other is a debt against a later part of the theory. **`conceptual_debt` needs two kinds.**

3. **Cross-strand instrument reuse, found rather than planned.** P2 and M2 are the same move — six positions, predict before probing. Neither was written with the other in view. If the map's strands keep converging on the same instruments, that is evidence about the instruments, and it is worth looking for deliberately rather than noticing twice.

**Graph nodes generated: one, provisional.**

| ID | Question | Source | Sits | Status |
|---|---|---|---|---|
| **P-delay** | When one charge moves, when does the other find out? | E3 §7 / P3 | After E3; hard prerequisite for anything that treats the field as carrying energy | provisional |

E1 generated two (`P-carrier`, `P-quantisation`), E2 none, E3 one. The earlier
claim in E2 §18 — that the spine is more complete after the foundational nodes
than at them — is **weakened**: E3 sits three deep and still produced a node.
