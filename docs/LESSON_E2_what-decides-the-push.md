# E2 · Lesson specification — *Two charged objects. What decides how hard they push?*

> **Status: conceptual specification — ready for physics-authority review.**
> Written from scratch against the map, in parallel with E1's review rather than
> behind it.

Prerequisite: **E1** (hard). Enters with two kinds, transfer, conservation,
like/unlike, neutral ≠ empty, net ≠ total. **No particles. No quantisation. No
numbers.**

---

# The finding, first

> **E2's apparatus can distinguish inverse-square from inverse-first — but only
> just, and the lesson should be built around that fact rather than hiding it.**

The measurement predicts a separation of **63%** of its original value under
inverse-square, against **50%** for 1/r and **71%** for 1/r³. Those gaps are 13
and 8 percentage points, which a ruler can see and leaking charge can easily
destroy.

So E2 is the first lesson where **the honest outcome may be "my data cannot
settle this."** That is not a failure of the lesson. It is the most valuable
thing in it, and it is why Coulomb had to build a special instrument.

---

# 1 · Why this question

E1 established *that* charges push and pull. E2 asks *what decides how hard*.
Everything quantitative downstream — field, potential, capacitance — is built on
the answer, and the inverse-square in particular reappears in Gauss's law.

# 2 · What the student needs at entry

E1 only. **Deliberately not assumed:** Newton's third law. See §7.

# 3 · Initial model — what the student walks in with

Two beliefs, both common and both wrong:

- **"The bigger charge pushes harder."** A strongly charged object is expected to dominate a weakly charged one.
- **"Twice as far, half the push."** Force is expected to fall off in proportion to distance.

Both are reasonable. Both are about to fail.

# 4 · Prediction and commitment

**P1 — the distance question.** Two charged balls hang side by side, pushed
apart. *If you could double the distance between them, what happens to the push?*
Commit to a number: half? a quarter? something else?

**P2 — the symmetry question.** One ball carries much more charge than the
other. *Which one pushes harder on the other?*
→ Most commit to **the bigger charge**.

Both written down before touching anything.

# 5 · Activity

Two identical light balls on threads of equal length. Charge both. They hang
apart at some separation *r*.

**The move that makes this work — and it comes straight from E1.** Touch one
charged ball to an identical *uncharged* ball and separate them. The charge
divides equally between two identical objects: **each now carries half**. Nothing
was created; it was shared. That is E1's transfer-and-conservation model being
*used as an instrument*, which is the first time in the course that a previous
result does work rather than just being recalled.

Then measure the new separation.

# 6 · Observation — and what the numbers actually say

With F ∝ q²/rⁿ, and the geometry of two hanging balls, separation scales as
r ∝ q^(2/(n+1)). Halving the charge therefore gives:

| law | separation becomes | |
|---|---|---|
| F ∝ 1/r | **50%** | what most students predict |
| **F ∝ 1/r²** | **63%** | what actually happens |
| F ∝ 1/r³ | **71%** | |

**The discrimination is real but tight.** 13 percentage points between the
student's prediction and the truth; 8 between inverse-square and inverse-cube. A
ruler can see that. Charge leaking off the balls during the measurement can
destroy it.

⚠ `apparatus_failure_mode: silent` — the third instance in two lessons. Humid
air here does what it did in E1, and a slow measurement gives a falling
separation that mimics a different power law. **The failure looks like data.**

# 7 · Judgment task

*Two tasks, because the lesson has two commitments.*

**J1 — on the evidence.**
> Two students look at the same measurement.
> **A** — *"It came out around 60%, so the force must go as one over distance squared."*
> **B** — *"It came out around 60%, but 1/r² predicts 63% and 1/r³ predicts 71%. My ruler and my leaking charge could be off by that much. I don't think this measurement can tell those two apart."*
>
> **Who is being more careful?** And: **what would you have to improve to settle it?**

**B is right**, and this is the point of the lesson. *"My data cannot distinguish
these"* is a legitimate scientific conclusion, and a student who reaches it has
done better physics than one who reaches the right exponent by accident.

**J2 — on the symmetry.**
> A ball with a lot of charge and a ball with very little. Student A says the
> big charge pushes harder. **What measurement would settle it?**

Answer: hang both on identical threads and compare deflections. They deflect
equally. **The forces are equal and opposite regardless of how unequal the
charges are.**

⚠ **If the student has Newton's third law from mechanics, this is an
application.** If not, it is a discovery — and it is worth asking whether they
have met it, because the lesson reads differently either way. *Flagged, not
assumed.*

# 8 · Explanation

The push depends on **both** charges, and on **how far apart** they are.

- Double one charge → force doubles. Double both → force **quadruples**. It is symmetric in the two charges, which is why neither one "wins".
- The falloff with distance is **steeper than proportional**. Double the distance and the force drops to about a quarter, not a half.

# 8a · Historical interlude — why Coulomb needed a new instrument

*Same placement as E1's Franklin section: after the student's own judgment,
before notation.*

The student has just concluded that their apparatus cannot cleanly separate 1/r²
from 1/r³. **That was exactly Coulomb's problem**, and he did not solve it by
measuring more carefully with the same equipment. He built a **torsion balance** —
an instrument whose whole purpose was to measure a very small force precisely
enough to settle the exponent.

> **When your apparatus cannot answer the question, the answer is sometimes a
> better apparatus, not a better guess.**

⚠ **To be verified before this goes into a student lesson.** Coulomb's 1785
memoirs and the torsion balance are well documented, but this project does not
put unverified history in front of students — E1 §8a set that standard with a
primary source, and E2 must meet it. **Not yet done.**

# 9 · Mathematical representation

Only now.

$$F \propto \frac{q_1 q_2}{r^2}$$

Proportional, not equal. **The constant is deliberately absent**: nothing the
student measured determines it, and introducing *k* here would be exactly the
move E1 refused when it dropped $Q = Ne$.

The full form, with its constant, belongs with the node that gives a reason for
the constant's value.

# 10 · Formula-proof

**Applicable here, unlike E1 — and it works through activity ordering (F8).**

$F = kq_1q_2/r^2$ answers P1 immediately for any student who has it. What makes
E2 formula-proof is that **the prediction is committed before the measurement,
and the judgment task is about evidence quality rather than about the exponent.**
J1 cannot be answered from the formula at all: it asks whether *this* data
supports *that* conclusion.

# 11–14 · References

Per the frozen three-layer architecture — pointers, not copies.
Model: `coulomb-force`. Context: `laboratory`. Evidence and debt: model spec.

# 15 · Teacher notes

- `apparatus_failure_mode: silent` — humidity, and slow measurement. Both produce plausible-looking wrong numbers rather than obvious failure.
- **Halve the charge by contact with an identical uncharged sphere.** Identical matters: unequal spheres do not split charge equally.
- Measure fast. Charge leaks, separation drifts, and a drifting separation imitates a different power law.
- Do not correct a student who concludes "I can't tell." That is the target answer for J1.

# 16 · Assessment evidence

| item | passes if |
|---|---|
| Double the distance between two charges. What happens to the force? | Falls to about a quarter — steeper than proportional. |
| A large charge and a tiny charge. Which feels the bigger force? | Neither. Equal and opposite, however unequal the charges. |
| Your measurement gives 60%. Inverse-square predicts 63%, inverse-cube 71%. What can you conclude? | That it is consistent with inverse-square and not with inverse-cube — **but** whether it *settles* it depends on the uncertainty, which has not been stated. |
| Why did Coulomb build a torsion balance instead of measuring more carefully with hanging balls? | Because the question needed precision the apparatus could not reach. |

# 17 · Open decisions

1. **Does the cohort have Newton's third law?** Changes J2 from application to discovery. Same class of question as E1 §2, and it needs the same explicit answer.
2. **Coulomb history is unverified.** Must be sourced to primary or authoritative material before it reaches a student, to the standard E1 §8a set.
3. Whether the quantitative measurement is attempted at all at Grade 8–9, or the lesson stops at *"steeper than proportional"* and the exponent waits for Grade 11.
4. Whether a simulation should back up the apparatus when humidity defeats it — and if so, how to stop the simulation quietly replacing the measurement.

---

# 18 · What E2 tested about the process

**The template held.** Twelve fields, same ordering, no new fields needed. Second
lesson, no structural change — which is the first evidence the template is stable
rather than fitted to E1.

**Three things E2 found that E1 could not have:**

1. **A lesson whose apparatus cannot fully settle its own question**, and the discovery that this is a *feature*. J1 is the strongest judgment task written so far, and it is about evidence rather than physics.
2. **A previous lesson's result used as an instrument.** E1's transfer-and-conservation model is what makes "halve the charge" a legal move. That is the first genuine dependency *payoff* in the graph, as opposed to a prerequisite that is merely recalled.
3. **`apparatus_failure_mode: silent` has a second variety.** E1 and O1 fail by showing nothing. E2 fails by showing **plausible wrong numbers** — which is worse, because nothing signals that anything went wrong. The tag needs two values: `silent-null` and `silent-plausible`.

**No new graph nodes generated.** E1 produced two; E2 produced none. Worth
noting — it is weak evidence that the spine is more complete after the
foundational nodes than at them.
