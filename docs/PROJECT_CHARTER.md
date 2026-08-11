# OpenVidya — Project Charter

**Version 2.4 — frozen.** Governs all three bodies of work in this folder, not
only the website.

*No further charter revisions before the question map (§15.4) exists. The
philosophy is ahead of the curriculum and the next work is converting it into
one.*

---

## Amendment log

Amendments are recorded here with their reasoning. A conclusion without its
reasoning cannot be re-examined, and this document exists to be re-examined.

| Version | Change | Why |
|---|---|---|
| **v1** | First charter. | Recorded what the project is for, after an extended design argument. |
| **v2** | **Scope ambiguity resolved** (§2): OpenVidya is an E&M curriculum, not a general physics platform. | The charter said one thing and the website said another. Two mechanics/fields modules in the public navigation made the project look like a platform. |
| v2 | **Non-goals promoted to their own section** (§6). | A one-line list inside "what we are making" was too weak to resist scope creep. |
| v2 | **Four independently-failing layers added** (§8). | Physics, mathematics, implementation and representation can each be wrong alone. The first three were correct in Module 1 while the fourth taught a falsehood. |
| v2 | **Model specification named as source of truth** (§10). | Reconciling three artefacts pairwise is unbounded work. Deriving three views from one declaration is not. |
| v2 | **Approval matrix added** (§13). | The working principle said humans judge, without saying which humans judge what. |
| v2 | **Anchor becomes a typed declaration, not a mandate** (§7.4). | Requiring "everyday" everywhere produces the decorative application boxes this project rejects. |
| v2 | **Owners and dates on open decisions** (§15). | Governance without owners is a wish list. |
| **v2.1** | **Fourth observation added** (§3.4): generated output is abundant, and the student is still left having to judge it. Phrased as an observable claim, never as a prediction about employment. *(Wording tightened again in v2.2 and v2.3 — see below.)* | Raised as a concern that AI makes formula-application low-value. The concern is right; the usual phrasing of it is an unfalsifiable forecast, which §9 forbids. |
| v2.1 | **Evaluation filter added** (§7.12), alongside the formula-proof filter. | AI answers conceptual questions well too, so "make it conceptual" is no longer sufficient protection. |
| v2.1 | **Non-goal added** (§6): we do not tell students their exam skills are worthless. | True for nobody in Grade 11, and heard as permission not to practise. |
| **v2.2** | **"Scarce" removed from §3.4.** | Scarcity is a claim about the distribution of a capability across a population. We can state what the student is left having to do; we cannot establish how rare that is. |
| v2.2 | **"An AI explains physics well" → "can produce fluent, plausible explanations."** | §9 exists to insist that fluency is not evidence. The looser phrasing conceded the point it was making. |
| v2.2 | **§7.12 "only three things survive" → a non-exclusive claim**, with an open candidate list. | The exclusivity was not established, and it closed a design space that should stay open. |
| v2.2 | **Prior commitment named as the irreducible mechanism**, with surprise placed downstream of it. | Surprise is a student state produced by a sequence, not an instructional mechanism. The defensible claim is narrower: an answer can replace an explanation but cannot retroactively become the student's prediction. |
| v2.2 | **"Physical model specification" → "model specification"** (§10). | The source-of-truth object spans the physical *and* mathematical layers plus parameters, validity and couplings. Naming it after one layer misdescribed it. |
| v2.2 | **§7.2 softened** from "never duplicated" to "not duplicated merely because a second question uses it." | A model may legitimately carry different parameterisations per question. What must not be duplicated is the physics. |
| v2.2 | **Success ladder added** (§14), and a testing protocol for criterion 1b with anonymised sources. | 1b was not guaranteed to be tested by the general protocol, and attitudes toward the source would have contaminated it. |
| **v2.3** | **§10 diagram label corrected** to "Model specification." | v2.2 corrected the prose and left the diagram saying the thing the prose had just rejected. Someone implementing the schema would reasonably read the diagram. |
| v2.3 | **§3.4 heading:** "judging them is not" → "judging them remains the student's task." | The heading still asserted the scarcity claim the body explains was removed. |
| v2.3 | **§14:** "the only rung on which a fluent generator offers no help at all" → "the rung at which fluent generation does not, by itself, establish correctness." | The original was the same species of overclaim this charter exists to catch. A generator helps with judgment; it cannot settle the matter. |
| v2.3 | Note added to §14 that the ladder **extends** rather than replaces physics understanding. | Criterion 1 comes first by design; the ordering was correct and now says so. |
| **v2.4** | **§5 corrected:** "surprise is the mechanism" → the prior expectation is the mechanism, surprise is the evidence it was violated. | A real internal contradiction, not a wording preference. v2.2 established in §7.12 that surprise is a student state downstream of prior commitment, and left §5 asserting the opposite. §7.12 is the correct formulation and §5 now agrees with it. |

---

# 1. What this document is

The record of what we are trying to achieve, why, and what would count as
achieving it. It is live: amend it when a decision changes, and log the
amendment.

---

# 2. What OpenVidya is — and what it is not

> **OpenVidya is an open, verifiable electricity and magnetism curriculum for
> Grades 8–12.**

Not a general physics learning environment. Not a computational physics
platform whose first domain happens to be E&M. **An E&M curriculum.**

This was ambiguous in v1 and the ambiguity had a visible cause: the website
homepage described "open computational physics learning modules," and the
repository carries a projectile-motion module and an electric-field module in
its public navigation. A visitor could reasonably conclude this was a general
platform.

**Those two modules are method prototypes, not content.** They were built to
discover what a concept module must declare, before the schema was frozen —
deliberately chosen to be structurally dissimilar so that whatever survived both
was architectural rather than accidental. See `docs/SCHEMA-COMPARISON.md`. They
teach mechanics and electrostatics only incidentally, and they are not part of
the curriculum.

**Consequences of this decision:**

- The website copy must be narrowed to match.
- The two prototypes must be labelled as method experiments, and retired from the public navigation once the schema question closes.
- Any proposal to add a module outside E&M is out of scope by default and requires a charter amendment, not a discussion.

**Delivery.** Three complementary forms: written lessons, hands-on apparatus,
interactive simulations. **The written lesson is primary.** The others exist to
make claims testable by the student.

---

# 3. The problem

### 3.1 Formula fluency without physical understanding

Students can select the right equation, substitute, and get the mark. What is
happening underneath is not understood. They cannot **feel** physics.

This is not a knowledge gap. It is a **competing strategy that currently wins** —
pattern-match, substitute, solve — rewarded for years, and effective. We are not
filling a vacuum; we are competing with an incumbent.

The strategic consequence, stated bluntly: **material positioned as an
alternative to formula practice will lose.** A student with an exam in eighteen
months, offered "understand deeply" versus "score well," will rationally choose
scoring well. The only framing that survives:

> This is why the formula is what it is, and this is why you will now stop
> mis-applying it.

Concept as the thing that makes the formula *reliable*. Never as its
replacement.

### 3.2 Daily devices are in a separate compartment from the course

Batteries, torches, chargers, fans, inverters, induction cooktops — used daily,
connected to nothing in the syllabus.

Cheaper to fix than 3.1 and probably higher-yield, because it connects two things
the student **already has**. The sharpest example is in their pocket:

| printed on a power bank | what it actually is |
|---|---|
| 10000 mAh | **36,000 C** |
| | 2.25 × 10²³ electrons |
| | **0.37 mol** — in the same week they meet the mole in chemistry |

And their daily complaint about charging speed *is* the concept of current. A
4500 mAh battery is 16,200 C either way; roughly **1.8 A** on a standard charger,
**7.5 A** on a 65 W one. Same charge, different time, different rate.

### 3.3 Our own material is fragmented

Three bodies of work on one course with no shared source of truth. §11.

### 3.4 Producing answers is now abundant; judging them remains the student's task

**Stated as an observation, deliberately, not as a forecast.** The claim is not
*"AI will make formula-application worthless"* — that is a prediction about the
future economy, it cannot be verified, and §9 forbids importing exactly this
kind of unsupported assertion into a document whose purpose is to police them.

The observable claim, testable today by any student in an afternoon:

> **Plausible answers are now available instantly and at scale. The student
> still has to determine whether a particular answer is right.**

*"Scarce" was removed from this sentence in v2.2. Scarcity is a claim about how
a capability is distributed across a population — an empirical sociological
claim we cannot establish. What we can state is what the student is left having
to do, which is all the argument needs.*

Three consequences follow, and the second and third are the ones usually missed.

**Understanding is not automatically safe either.** An AI can produce fluent,
plausible explanations of physics — and §9 is precisely the insistence that
fluency is not evidence. If the aim were *possessing good explanations*, those
are equally abundant. What
cannot be outsourced is **the student's own** understanding — you cannot delegate
having an expectation. The value was never in owning explanations; it is an
internal state, and internal states do not transfer.

**The project's method and its educational aim are the same thing.** Everything
this project practises on itself is what a person needs in order to work with
generated output: a passing test suite is not evidence the physics is right; a
confident, well-formatted review is not verification; a correct number can come
from wrong reasoning; a check sharing a route with the thing it checks proves
nothing. We are not teaching *about* judgment as a topic. We are running the
discipline in public and inviting the student into it.

**Students will use AI on this material.** That is the environment, not a risk to
be mitigated. Designing as though they will not is designing for a world that no
longer exists.

**This argument does not appear in student-facing copy.** See §6.

---

# 4. Who it is for

**Primary:** Indian students, Grades 8–12, formula-fluent, exam-driven,
device-rich. Not beginners. They arrive with working strategies and strong
habits, one of which we are trying to change.

**Secondary:** teachers and coaches presenting from the same material;
co-creators extending it.

**Ceiling: Grade 12.** A decision, not a limitation. It means the physics-first
method survives the entire span — everything to AC and reactance is reachable
from charge, force, field, energy and time. No tier break, no second method.

---

# 5. What "understanding" means, operationally

> **Feeling physics = having an expectation before you calculate.** Knowing
> roughly what should happen, and being *surprised* when it doesn't.

The student's prior expectation is the mechanism; **surprise is the evidence
that the expectation met reality and was violated.** This is why prediction
before reveal is a rule and not a flourish.

See §7.12 for the full sequence this sits inside: prediction → observation →
discrepancy → surprise → explanation.

---

# 6. Non-goals

What OpenVidya will not become. Each is a live risk, not a straw man.

- **Not a general physics platform.** §2.
- **Not a replacement for textbooks or the syllabus.** It supplements; it does not compete for the same slot.
- **Not an exam-prep product.** No question banks organised by marking scheme, no shortcuts, no speed drills.
- **Not an automated tutor.** No adaptive engine deciding what a student sees next.
- **Not an AI authority on physics.** No agent output is evidence. §9.
- **Not a generic simulation engine.** Simulations exist to answer specific declared questions.
- **Not a collection of visually impressive demos.** Impressiveness is not a criterion and is sometimes evidence against.
- **Not an efficacy study.** We cannot and will not claim measured learning gains from the sample sizes available. §14.
- **Not a repository where every discovered idea becomes a lesson.** §7.9.
- **Not a place where students are told their exam skills are worthless.** §3.4 is our reasoning, not our message. It is false for a Grade 11 student — the exam exists and still gates their future — and it is heard as permission not to practise. Students get the physics. They do not get the argument about why the physics matters.
- **Not an argument about AI.** We make no claims about what AI will or will not be able to do, and none about future employment. The material contains physics.

---

# 7. Design principles

### 7.1 The question is the pedagogical unit

*How does a capacitor work?* — not "Capacitance." Topics invite coverage;
questions invite an answer, and let a document end when the question is
answered.

### 7.2 The physical model is the reusable unit

Distinct from 7.1, and v1 conflated them. Several questions share one model:
*how does a capacitor work*, *why does it block DC*, *why does reactance fall
with frequency* are three questions and one model.

**The question is the entry point. The model is the thing that is built, tested
and reused.** Many questions may point at one model; **the underlying model is
not duplicated merely because a second question uses it.**

That is deliberately narrower than "never duplicated." One model may legitimately
carry different parameterisations, approximations or representations for
different questions — what must not be duplicated is the physics itself.

### 7.3 Every question must be formula-proof

**Acceptance test:** can this be answered by pattern-matching to an equation
without understanding anything? If yes, it is a lookup, not a question.

Structurally formula-proof types: **no numbers**; **missing information**
(*"6 C crossed a point — state the current"* → you can't, which breaks the
installed belief that every problem is solvable); **right number, wrong
reason** — the highest-value type here, because conventional marking cannot see
it; **estimation**, which requires an expectation.

### 7.4 Every question declares a context type

Not "must have an everyday anchor." A declared choice from:

| type | meaning |
|---|---|
| `everyday` | a device the student has already touched |
| `laboratory` | apparatus they will use in the kit |
| `historical` | the experiment as it was actually done |
| `internal_to_theory` | no honest external context exists |

The question to answer is **why is this the most honest context for this
question?** — which is stronger than requiring one particular kind.

Where the context is `everyday`, the device is the **subject** of the question,
not decoration. **Test:** delete the device — does the question survive? If it
does, the device was ornament, and ornament of exactly the kind that teaches the
compartment split.

### 7.5 Represent the relationship honestly; the ontology loosely

A visualisation is not obliged to show what is physically there. It is obliged
not to imply what is not. Arrow length, colour, density and scale are choices,
and are declared as choices.

### 7.6 Prediction before reveal — mandatory

Every interactive asks the student to commit before showing.

### 7.7 Assumptions, validity and scope are student-facing

A model is a constrained representation of reality and the constraints are the
lesson.

### 7.8 Verification by an independent route

A check that recomputes what the implementation computed proves only
self-consistency.

### 7.9 A discovered mental model does not automatically belong in the current lesson

Otherwise every review enlarges the lesson and none is finished.

### 7.10 Record conceptual debt

Where a simplification will need later correction, say so and name where the
correction lives. **Choosing not to fix something differs from not knowing about
it.** Deferring a repair delays it; it does not avoid the damage.

### 7.11 Anything expressible as a test must not be written as a checklist

### 7.12 The evaluation filter

The formula-proof test (§7.3) is necessary and no longer sufficient. A generated
answer handles conceptual questions well too, so "make it conceptual" is not
protection.

**Second acceptance test, applied alongside the first:**

> Does this activity build the student's ability to **judge whether an answer is
> right**, rather than to produce one?

**Three mechanisms already central to the design survive it particularly
strongly.** This is not a claim that they are the only ones — see the candidate
list below, which is open.

| Mechanism | Why it resists outsourcing |
|---|---|
| **Prior commitment** (§7.6) | A student can ask for the answer — but the moment they do, they have skipped the commitment, and *they know it*. |
| **Apparatus** | You cannot prompt a compass. The magnet does what it does regardless of what was generated. |
| **Discrepancy between the two** | The gap between what you said would happen and what happened is generated by the student's own prior state. |

### The irreducible part is the prior commitment

Surprise is not an instructional mechanism. It is a **student state produced by
a sequence**:

```
prediction → observation → discrepancy → surprise → explanation
```

Every stage after the first can be supplied by someone else. The first cannot.

> **An answer supplied by another agent can replace an explanation. It cannot
> retroactively become the student's prediction.**

That is the defensible formulation, and it is narrower and stronger than "AI
can't do surprise."

### Other activity types that would pass this filter

Open list. These are candidates for future OpenVidya activity types, not yet
built, and recorded here so the design space is not prematurely closed:

- comparing two competing explanations
- identifying the hidden assumption in an explanation
- finding the error in a worked solution
- deciding which of two experimental results is trustworthy
- judging whether a graph is physically plausible
- predicting the consequence of changing one parameter
- designing a measurement that distinguishes two hypotheses

**Design consequence.** Where a question could be answered by asking rather than
by thinking, the activity must place the student's own commitment, or a physical
object, before the answer becomes available. This is the strongest argument for
keeping the hands-on kit central rather than treating it as enrichment.

---

# 8. Four layers that fail independently

New in v2, and it is the sharpest technical addition since v1. Each layer can be
wrong while the others are right.

| Layer | Question | Example of failing alone |
|---|---|---|
| **Physical model** | What do we assume about reality? | Modelling a magnet as two monopoles |
| **Mathematical model** | What equations follow from those assumptions? | A sign error in a derived relation |
| **Computational implementation** | How were those equations computed? | Search bounds derived from a window length rather than its endpoints |
| **Pedagogical representation** | How did we choose to show it? | Carriers drawn gliding smoothly at drift speed |

The last row is not hypothetical. In Module 2's design, the physics, the
mathematics and the implementation were all correct while the representation
would have installed "electrons crawl steadily down the wire" — a model Module 3
then exists to remove.

**This is a different four-way split from §9.** §8 describes *what can be wrong*.
§9 describes *how a claim is settled*. They are orthogonal and must not be
merged.

---

# 9. What counts as evidence

| Class | Question | Settled by |
|---|---|---|
| **Verification** | Did we build the thing right? | Executable tests, by an independent route |
| **Validation** | Did we build the right thing? | A physicist |
| **Empirical inputs** | Where do the numbers come from? | Citation, with range and conditions |
| **Pedagogical validation** | Does it change what a student thinks? | Students |

**No AI output is evidence in any class.** An agent may propose, implement,
refactor and inspect. It may not establish correctness. *"The model reviewed it
and found no problems"* is not a finding.

**The worked example.** Module 1 shipped with 86 passing tests while telling
students an electron carries **+**1.602×10⁻¹⁹ C. It carries −e. No test could
have caught it: tests verify code against the declared model, and the declared
model was silent about sign. A human reading the page found it. That boundary is
where the project's care must concentrate.

---

# 10. Source of truth

> **None of the three assets is the source of truth. The declared model
> specification is.**

**Not "physical model specification."** §8 separates four layers, and the
source-of-truth object spans more than the first: it carries the physical
declarations *and* the mathematical ones, plus parameters, validity limits and
external couplings. Naming it after one layer would misdescribe what it holds.

```
                       Model specification
                   (assumptions · statements · validity ·
                    empirical values · external couplings)
                                 │
              ┌──────────────────┼──────────────────┐
              ↓                  ↓                  ↓
          Lesson             Apparatus          Simulation
        (deck, text)          (kit, bench)      (interactive)
```

The deck, the bench and the simulation become **three views of one declaration**,
not three artefacts to be reconciled pairwise. Reconciling three artefacts is
unbounded work; deriving three views from one declaration is not.

**Consequence.** The specification must carry what the apparatus needs — pole
separation, field strengths, calibration constants — because the bench and the
decks are bound to physical kit. `external_couplings` therefore rises from a
per-module block to a programme-level obligation.

**Limit, stated honestly.** Pedagogy is *not* derivable from the model. One model
supports several legitimate lessons with different representations, and choosing
among them is a human judgment no specification determines. The model constrains
the lesson; it does not generate it.

---

# 11. The three assets

| Asset | What it is | State |
|---|---|---|
| **Slide decks** | Chapter 0 (programme), 2 (Magnetism Basics, 35 slides), 3 (Change in Magnetic Flux, 9 slides, draft). Chapter 1 not seen. | The pedagogical spine. Bound to physical kit. |
| **byoPhysics bench** | `em-lab-bench.html`, 1,465 lines, single file, no build, ES5. | Strong handover document. **No automated tests**; calibration tables are prose. |
| **OpenVidya site** | Astro/React/TypeScript. 5 pages, 4 `model.yaml`, **86 passing tests**, mutation-tested (15 mutants, 15 caught). | Verification and reasoning layers. No link to physical kit. |

The flux sequence 7 / 4 / 0 / −7 appears in the Chapter 2 deck and the bench is
calibrated to it. Nothing enforces that they agree.

Each holds half of something: the bench binds numbers to apparatus a student
holds; the site has executable verification and recorded reasoning. §10 is the
resolution.

---

# 12. Subject-matter scope

The existing spine, which is correct: magnets → poles → compass → field has
direction everywhere → field is non-uniform → *how do we catch it?* → flux →
changing flux → voltage.

**The largest hole: the interplay runs only one way.** Oersted, a current making
a magnetic field, F = qv×B, and electromagnets are all absent. The course is
called *The Interplay Between Electricity and Magnetism* and half the interplay
is missing. The everyday anchors for it are unusually good — earphones and the
mixer-grinder motor are both *current → force*.

**Declared repairs, both currently owed:**

1. **Poles.** Magnetism is built on poles in both deck and bench. There are no magnetic monopoles; poles are what circulating currents look like from outside. Handled well this is among the best moments in the course. Handled badly it is a contradiction discovered at the worst time.
2. **"Field lines are fixed to the magnet and move with it."** Field lines moving is not a well-defined physical statement, and it resurfaces in the homopolar generator. The field is real; the *lines* are a representation.

---

# 13. Approval matrix

The working principle said humans judge. This says which humans judge what.

| Change | Physics approval | Pedagogy approval | Automated tests |
|---|---|---|---|
| Model assumption or governing statement | **Required** | If it changes what is taught | Required |
| Numerical implementation | Not unless the model changes | No | **Required** |
| Visual representation | **Required** — a representation can imply a physical claim | **Required** | Partial |
| Empirical value or its source | **Required** | If it appears in the lesson | Required |
| New targeted mental model / misconception claim | **Required** | **Required** | Not applicable |
| `out_of_scope` or `external_couplings` edit | **Required** | **Required** | No |
| New lesson question | No | **Required** | No |
| Prose, layout, styling | No | No | Build must pass |
| Charter amendment | **Required** | **Required** | Logged in §0 |

**Roles, to be confirmed:** physics authority — Dr. Kumar Vadaparty as course
author, with Nithin as working authority. Pedagogy authority — Nithin,
pending. Maintainer — Nithin. *These assignments are inferred from
`CONTRIBUTING.md` and the bench handover and need explicit confirmation.*

---

# 14. Success and failure

**Success, ranked. The first is the only one that ultimately matters.**

1. A student who could already get the mark can now explain the reasoning, and notices when the reasoning is wrong even though the number is right.
1b. A student shown a confident, fluent, **wrong** explanation can say why it is wrong — whether it came from a book, a teacher, or a machine.

**The target, stated as a ladder.** This sharpens "conceptual understanding" into
something with rungs:

```
wrong number
      ↓
right number
      ↓
right reasoning
      ↓
detect wrong reasoning
      ↓
detect plausible-but-wrong reasoning        ← the aim
```

The project's original criterion was *right reasoning rather than merely the
right number*. Criterion 1b is its extension: *right judgment rather than merely
a plausible explanation*. The last rung is the one §3.4 argues has become the
important one, and it is **the rung at which fluent generation does not, by
itself, establish correctness.**

*Not "the rung where a generator offers no help." It offers plenty — a competing
derivation, the assumptions in play, a counterexample, an algebraic
inconsistency. What it cannot do is settle the matter for the student. That is
§9 restated at the level of the learner rather than the project.*

**The ladder does not replace physics understanding with judgment.** Criterion 1
still comes first, and deliberately. This is an extension of what understanding
has to mean where explanations are cheap — not a substitution.

2. A student reaches for a device on their desk when asked a physics question, and reaches for physics when asked about a device.
3. A co-creator adds a module without being told the rules, because the repository states them and enforces what it can.
4. Every number has a type and a source; every model states its limits; every check runs.

**Measured how:** think-aloud with 4–6 students, matched item forms
counterbalanced, comparison group, scored on reasoning, delayed retest at two
weeks.

**For criterion 1b specifically**, since the general protocol does not guarantee
it is tested: students are shown **both correct and deliberately flawed
explanations, matched for fluency and confidence**, and asked to judge which is
sound and to justify the judgment.

**Sources are anonymised** — *Student A · a teacher · a textbook · a machine* —
or omitted entirely. The point is to test judgment of the reasoning, not
attitudes toward the source. A student who rejects an explanation because it came
from a machine has failed the item exactly as much as one who accepts it for the
same reason. **Six students cannot measure a learning gain or rank two
representations.** They surface failure modes nobody anticipated. That is the
purpose, and the claim must never be inflated beyond it.

**Failure, written down so it is noticed early:**

- Admired by physicists, ignored by students.
- Becomes an alternative to exam preparation, and therefore optional.
- Everyday devices appear as decorative boxes at the end of sections.
- The verification apparatus grows faster than the lessons — a beautiful method with little content.
- A claim ships that we cannot support, and the central argument collapses with it.
- The three assets diverge until they contradict each other in front of a class.

---

# 15. Open decisions

| # | Decision | Owner | Needed by | Blocks |
|---|---|---|---|---|
| ~~1~~ | ~~**Prior knowledge of target students**~~ — **RESOLVED.** Students have heard the word *atom*; they do not know its contents. No protons, no electrons, no nucleus. | Answered by the course author | — | Unblocked. Consequences worked through in `LESSON_E1_what-is-charge.md` §2, §9, §18: E1 must not name particles, *e* is defined by quantisation rather than particle identity, a new candidate node appears (*what carries the charge?*), and `ISSUES.md` #0c records a shipped module that contradicts the assumption. |
| 2 | **Confirm the roles in §13** | Nithin | Before a second co-creator joins | All approval routing |
| 3 | **Reconcile the three assets under §10** | Nithin | Before either the bench or the decks are extended | Cost rises with delay |
| 4 | **The question map** — ~two dozen questions with prerequisites, formula-proof acceptance question, context type | Claude to draft, Nithin to approve | Next | What gets written next |
| 5 | **Source the ⚠ empirical values** | Nithin | Before students see the site | Publication |
| 6 | **Narrow the website copy and label the prototypes** (§2) | Claude | Immediate | Nothing; do it now |
| 7 | **Concrete anchors inside the simulations** | Nithin to decide, Claude to build | After the student study | — |

---

# 16. Working method

> Humans define the physical model and the educational intent. Agents implement
> and challenge it. Executable tests verify what can be verified. Humans judge
> what cannot. Git records the resulting knowledge.

Specification before implementation. Scope reduction as a design move, not a
retreat. Findings converted into tests or declarations, never left as prose
assertions. Defects in `ISSUES.md`, new work in `BACKLOG.md`, rules in
`AGENTS.md`, reasoning in `docs/specs/`, amendments in §0.

**Final authority on physics and pedagogy rests with a human.** That is not a
courtesy. It is the one boundary that makes the rest of the method mean
anything.
