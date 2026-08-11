# Question map — schema stress test

**Purpose:** find out whether the proposed schema survives four deliberately
dissimilar entries, **before** populating ~24 of them. This is not four lessons.
It is a torture test, and a field that cannot be filled honestly is a finding,
not a gap to paper over.

Governed by `PROJECT_CHARTER.md` v2.4.

---

## Verdict first

**The core schema holds and is frozen after two rounds. Two activity/design
questions remain explicitly untested and are recorded as such rather than
resolved by assumption.**

*Schema frozen ≠ every activity type validated.* Three fields became lists,
evidence moved to a reference, one entry could not be written at all — the most
useful result in round one — and round two found that quantitative questions get
their formula-proofness from a different place entirely.

| Finding | Severity |
|---|---|
| **F1** — `Model ID` must be a list. Q-E01 needs two models and cannot be written with one. | Blocking |
| **F2** — `Activity` must be a list. Module 1 already ships three activities under one question. | Blocking |
| **F3** — `Evidence` means different things for simulation and apparatus entries. Split it. | Should fix |
| **F4** — `Prior commitment` must allow a *set* of predictions, not a single value. | Should fix |
| **F5** — Q-I01 is unwritable: it sits downstream of a hole in the curriculum. | The valuable one |
| **F6** — `Formula-proof test` is a declaration, not a test. Name it honestly. | Wording |
| **F7** — 20 fields × 24 entries = **480 cells**. Solved by splitting into three layers, not by conditional fields. | Resolved |
| **F8** — For a **quantitative** question, formula-proofness comes from the activity ordering, not from the physics. Found in stress test 2. | Structural |
| **F9** — A judgment task must discriminate between competing claims, not restate the explanation as a question. | Design rule |

---

# Entry Q-E01 · Electrostatics

| Field | Content |
|---|---|
| **ID** | Q-E01 |
| **Question** | You rub a comb and hold it near small pieces of paper. The paper is **not charged**. Will anything happen? And would it be different if the comb had been charged the other way? |
| **Curriculum intent** | That a neutral object is not an inert object, and that "no net charge" does not mean "no charge present". Sets up polarisation, and later dielectrics. |
| **Prerequisites** | Charge comes in two kinds and cancels (Module 1, Scene 1). Charged objects exert forces without contact. |
| **Model IDs** | `field-of-charged-object`, `polarisation-in-non-uniform-field` — **two, see F1** |
| **Model statement** | A charged object produces a field. A neutral polarisable object placed in it separates internally, and experiences a net force **only if the field is non-uniform**. |
| **Context type** | `everyday` |
| **Why this context** | Comb and paper are free, in every home, and the effect is genuinely puzzling. Nothing is being decorated: delete the comb and the question does not survive. |
| **Formula-proof** | The syllabus formula for this situation is F = qE. The paper's charge is zero, so the formula predicts **no force at all** — and the paper visibly moves. A student cannot pattern-match their way out of this. |
| **Activity** | 1 · Predict and commit. 2 · Do it with a real comb. 3 · Repeat with the opposite charge (rubbed on a different material). 4 · Judge. |
| **Prior commitment** | Two binary predictions, recorded before doing anything: (a) attracted / repelled / nothing; (b) does reversing the comb's charge reverse the effect — yes / no. |
| **Observation** | Paper is attracted. Reversing the comb's charge changes nothing. |
| **Discrepancy** | Most students predict either "nothing, it is neutral" or "it depends on the sign". Both are wrong, and wrong in instructive ways. |
| **Judgment task** | Your formula said the force should be zero. The paper moved. Which part of the reasoning failed — the formula, or an assumption behind it? |
| **Explanation** | The paper contains equal positive and negative charge, free to shift slightly. The near side becomes oppositely charged and is *closer*, so attraction beats repulsion. Reversing the comb reverses both, and the attraction survives. |
| **Representation** | If drawn: shifted charge within the paper. **Must not imply** that charge has left the paper, or that the paper acquired net charge. |
| **Evidence — apparatus** | Reproducible with a comb and paper by any student, any time. Sign-independence is the check. |
| **Evidence — computational** | The field model already exists (`electric-field/model.ts`). A polarisation model does not; if built, verify that net force → 0 in a uniform field. |
| **Conceptual debt** | Treats the paper as a simple polarisable object; says nothing about *why* charge shifts, or about conductors versus insulators. |
| **Reuse** | `polarisation-in-non-uniform-field` is reused by dielectrics — capacitor booklet §4A, "what makes capacitance larger". |
| **Status** | Proposed |

**What this entry proved.** The reviewer's draft listed one model, *"electric
field → force on charge/polarizable object."* That conflates two models and
hides the point. `F = qE` with `q = 0` gives zero force; the observed attraction
comes from polarisation in a **field gradient**. In a uniform field the induced
dipole feels equal and opposite forces and does not move at all.

So: **`Model ID` must be a list** (F1), and *"the field must be non-uniform"* is
a required assumption rather than a footnote. The schema forced that out into
the open, which is the schema working.

---

# Entry Q-C01 · Current

*Chosen because a module already exists. If the schema cannot describe something
we have already built and tested, the schema is wrong.*

| Field | Content |
|---|---|
| **ID** | Q-C01 |
| **Question** | What is current? |
| **Curriculum intent** | Distinguish how much charge is transferred from how quickly it is transferred. |
| **Prerequisites** | None. Entry point of the electricity sequence. |
| **Model IDs** | `charge-transfer-rate` (`src/physics/current/model.ts`) |
| **Model statement** | Q = Ne with N = N₊ − N₋; charge crosses a chosen surface; I ≡ ΔQ/Δt. A definition, not a law. |
| **Context type** | `everyday` |
| **Why this context** | A power bank is labelled 10000 mAh — **36,000 C**, 0.37 mol of electrons — and the student's daily complaint about charging speed is exactly the rate concept. |
| **Formula-proof** | The key item supplies charge and withholds time: *"6 C crossed a point — state the current."* The answer is that you cannot. |
| **Activities** | 1 · Counting charge (two kinds, net). 2 · Charge crossing a chosen surface, no clock. 3 · Same charge, different time. **Plus** a comparison panel. — **see F2** |
| **Prior commitment** | Before Run A and Run B: which run moves *more charge in total*? Most answer "the quick one". |
| **Observation** | Both bars finish at 10 C. Only the clocks differ. |
| **Discrepancy** | "Quicker" was read as "more". |
| **Judgment task** | Given a right answer with the reasoning *"because the electrons move faster"*, say why the reasoning fails even though the number is correct. |
| **Explanation** | I = ΔQ/Δt. Same numerator, different denominator. |
| **Representation** | Markers stand for a stated quantity of charge, shown on screen. **Must not imply** carrier speed — Scenes 2–3 are deliberately unsigned and speedless. |
| **Evidence — computational** | 28 tests; crossing count verified against a closed-form integer count; mutation-tested. |
| **Evidence — apparatus** | None yet. A charge-transfer measurement would strengthen it. |
| **Conceptual debt** | Says nothing about what carries the charge or how fast it moves. Repaired in Modules 2 and 3. |
| **Reuse** | `charge-transfer-rate` is reused by Module 2, and by capacitor charging and discharging later. |
| **Status** | **Built and shipped**, not yet student-tested |

**What this entry proved.** The schema describes a real module accurately — with
one break. Module 1 has **three scenes and a panel** under one question. The
single `Activity` field cannot hold that.

The fix matters architecturally: **`Activity` is a list, and each activity
carries its own prior commitment.** Otherwise the map either forces one activity
per question (fragmenting the curriculum into 70+ entries) or loses the internal
structure of every module we build.

---

# Entry Q-M01 · Magnetism

| Field | Content |
|---|---|
| **ID** | Q-M01 |
| **Question** | Put a compass at several different places around a bar magnet. What will its needle do at each place? |
| **Curriculum intent** | Move from *a magnet has two ends* to *there is a direction defined at every point of the surrounding space*. |
| **Prerequisites** | Magnets attract and repel; a compass needle is itself a small magnet. |
| **Model IDs** | `magnetic-field-direction` |
| **Model statement** | At every point around the magnet there is a direction; the compass aligns with it. Currently built on a two-pole source — **see debt**. |
| **Context type** | `laboratory` |
| **Why this context** | The kit contains magnet and compass. No everyday device exposes field *direction*; forcing one would be contrivance, which §7.4 explicitly permits declining. |
| **Formula-proof** | No numbers are supplied and none are asked for. The task is a spatial prediction. |
| **Activities** | 1 · Mark six positions on paper around the magnet. 2 · Predict and draw an arrow at each, before placing the compass. 3 · Place the compass at each in turn. 4 · Compare, then judge. |
| **Prior commitment** | **Six arrows drawn on paper, before any measurement.** — **see F4** |
| **Observation** | Six actual needle directions. |
| **Discrepancy** | Students commonly predict arrows pointing *at* the nearest pole everywhere. Off-axis they curve. |
| **Judgment task** | Does the direction belong to the magnet's ends, or to each point of the space around it? What would distinguish those two claims? |
| **Explanation** | The direction is defined at every point; the poles are where the pattern converges, not where the direction lives. |
| **Representation** | Arrows sample a direction at chosen points. **Must not imply** that physical lines exist in the space, nor that they are attached to and dragged by the magnet. |
| **Evidence — apparatus** | Compass at marked positions; reproducible. |
| **Evidence — computational** | `electric-field/model.ts` has the analogous verification pattern; a magnetic model would need its own. |
| **Conceptual debt** | **Two, both inherited from Chapter 2.** (1) Built on poles; there are no magnetic monopoles, and poles are what circulating currents look like from outside. (2) *"Field lines are fixed to the magnet and move with it"* — not a well-defined statement, and it resurfaces in the homopolar generator. |
| **Reuse** | `magnetic-field-direction` is reused by field mapping, flux, and later by the Oersted comparison. |
| **Status** | Proposed |

**What this entry proved.** `Prior commitment` cannot be a single value. Six
drawn arrows is the commitment, and it is *better* than a single prediction —
richer, harder to fake, and it leaves a physical artefact on the desk. But it is
also harder to score, which the acceptance-question discipline needs to
accommodate. **`Prior commitment` becomes a structured field** (F4).

It also confirmed that `context_type: laboratory` does not feel like a failure.
It felt like the honest answer, and reaching for a household object here would
have produced exactly the decoration §7.4 forbids.

---

# Entry Q-I01 · Induction — **could not be written**

**This is the most useful outcome of the test.**

I attempted the question *"What happens when you move a magnet near a coil?"*
and could not complete the entry. The schema exposed why.

| Field | Content |
|---|---|
| **ID** | Q-I01 |
| **Question** | ⛔ **Not writable yet.** |
| **Curriculum intent** | Changing magnetic flux produces an electrical effect. |
| **Prerequisites** | Field direction at every point (Q-M01) ✅ · **flux** ❌ *does not exist* · **what a current does magnetically** ❌ *does not exist anywhere in the programme* |
| **Model IDs** | `magnetic-flux` — **not specified**; `faraday-induction` — **not specified** |
| **Blocking** | See below |
| **Status** | **Blocked** |

**Three distinct blockers, and the schema separated them cleanly:**

1. **A missing prerequisite.** Flux — Chapter 2's "butterfly net" — has no model specification. It exists as slides and as bench code calibrated to the deck's 7 / 4 / 0 / −7 sequence, with nothing enforcing agreement.

2. **A missing half of the subject.** Charter §12: Oersted, current-makes-field, and F = qv×B are absent from the entire programme. Induction is *electricity from magnetism*; a student meeting it without ever having seen *magnetism from electricity* is being handed the second half of a story whose first half was never told.

3. **Inherited debt that falls due precisely here.** Q-M01's two debts — poles, and lines "moving with" the magnet — are exactly the ideas a student will reach for to explain induction. The debt is called in at this entry.

**Consequence for the map.** `Status` needs a **`blocked`** value carrying *what
blocks it*, and the map must be built as a **dependency graph, not a list**. A
linear inventory of 24 questions would have hidden all three of these. Ordering
them by prerequisite makes the Oersted hole structural and visible — it is not
one missing lesson, it is a missing branch that several later entries hang from.

---

# The eight questions, answered

**1. One schema for qualitative prediction, comparison, laboratory observation and induction — without special-case fields?**
Yes, with F1–F4. No special-case fields were needed. Q-E01 (qualitative), Q-C01 (comparison) and Q-M01 (laboratory) all fit the same shape.

**2. Does every question pass formula-proof?**
Q-E01 passes most strongly — the syllabus formula predicts *zero* and the paper moves. Q-C01 passes by withholding time. Q-M01 passes trivially, as no numbers exist. Untested: whether a *quantitative* entry can pass, since none of these four were quantitative. **That is a gap in the test, not a pass.**

**3. Can one model serve several questions without duplication?**
Yes in principle — `charge-transfer-rate` is already referenced by two modules. But `ISSUES.md` #0b records that the elementary charge is currently **declared twice** in two model files. The schema expresses reuse correctly; the code does not yet honour it.

**4. Is prior commitment specific enough to be testable?**
Yes, and it varies more than expected: binary (Q-E01), a choice among three (Q-C01), six drawn arrows (Q-M01). Hence F4.

**5. Is judgment genuinely different from giving the answer?**
Yes in Q-E01 and Q-C01, where the judgment is about *which part of the reasoning failed*. **Weakest in Q-M01**, where "judge whether direction belongs to the poles or to space" sits close to the explanation itself. Watch this field — it may collapse into `Explanation` for descriptive entries.

**6. Does `internal_to_theory` survive without feeling like failure?**
**Untested.** None of these four needed it. Honest answer: unknown.

**7. Does the model spec carry enough for the activity without becoming the lesson?**
Yes for Q-C01, where an existing `model.yaml` supported three scenes without dictating them. Q-I01 shows the converse — no spec, no activity.

**8. Can conceptual debt be recorded without making entries enormous?**
Yes, but Q-M01 carries two inherited debts and Q-I01 exists mainly *because* of debt. Debt is not evenly distributed: entries near a repair point are heavy, and that concentration is information worth keeping visible.

---

# Stress test 2 · Q-Q01 — a quantitative entry

*The gap the first test left open. All four earlier entries were qualitative,
and most of Grade 11–12 is not.*

**Components are the ones already in the capacitor booklet's bill of materials
(33 kΩ, 220 nF), so the entry is bound to apparatus that exists.**

| Field | Content |
|---|---|
| **ID** | Q-Q01 |
| **Question** | A charged capacitor discharges through a resistor. You double the resistance and change nothing else. **Before calculating**: does the time to fall to a given fraction of its starting voltage get longer, shorter, or stay the same — and by what factor? Does your answer depend on which fraction you picked? |
| **Curriculum intent** | That τ = RC is a *scaling constant for the whole process*, not "the time it takes to discharge"; and that the shape of the decay is independent of where you start. |
| **Prerequisites** | Q = CV · I = V/R · I = ΔQ/Δt · the discharge is not at a steady rate (`Capacitor_to_e` §3) |
| **model_ids** | `rc-discharge` |
| **Model statement** | V(t) = V₀e^(−t/RC). Time to reach fraction f: t = −RC ln f. |
| **context_type** | `laboratory` |
| **Why this context** | The ESP32/ADS1115 demonstrator in the capacitor booklet §20 measures exactly this. No everyday device exposes the decay curve. |
| **formula_proof_rationale** | ⚠ **The formula does answer this question.** Formula-proofness here comes from the **activity**, not the physics — the prediction is required and recorded before the calculation is permitted. See finding F8. |
| **activities** | 1 · Predict and commit, no calculation allowed. 2 · Calculate. 3 · Measure on the demonstrator. 4 · Judge. |
| **prior_commitment** | Three parts, recorded before any arithmetic: (a) longer / shorter / unchanged; (b) by what factor; (c) does that factor depend on the fraction chosen? |
| **observation** | τ = 7.26 ms → 14.52 ms. Time to 50%: 5.03 → 10.06 ms. To 10%: 16.72 → 33.43 ms. **Ratio exactly 2.000 for every fraction.** |
| **discrepancy** | Part (c) is where predictions fail. Students commonly expect the factor to depend on how far the capacitor has to fall. |
| **judgment_task** | Two students agree the time doubles. A says *"because τ = RC and R doubled."* B says *"because the capacitor has to push charge through twice the resistance, so it takes twice as long to get anywhere."* Both reach 2×. **Which reasoning also predicts that the factor is the same for 50% and 10%, and which does not?** |
| **explanation** | R appears only inside τ, and t = −RC ln f is τ multiplied by a factor fixed by f alone. Changing R rescales time uniformly; it does not change the shape. |
| **representation** | If plotted: V against t, and the same data against t/τ, where both curves collapse onto one. **Must not imply** the capacitor reaches zero. |
| **evidence** | → `rc-discharge` model spec. Independent route available: measured decay vs analytic form. |
| **conceptual_debt** | Ideal resistor and capacitor; no leakage, no dielectric absorption, no source resistance. |
| **reuse** | See the model-reuse test below. |
| **Status** | Proposed |

**The follow-up worth building the lesson around:** *how long until it is
completely empty?* After 5τ it is at 0.67%; after 10τ, 0.0045%; never zero. A
student pattern-matching for a number will produce one, and the honest answer is
that the question presumes something false.

---

## F8 — the finding this test produced

**For a quantitative question, formula-proofness cannot come from the physics.
It has to come from the activity.**

Q-E01's formula predicts *zero* while the paper visibly moves — the question is
formula-proof by construction. Q-Q01 has no such property: `t = −RC ln f` answers
it completely and correctly.

What makes Q-Q01 work is that **the commitment is required before the
calculation is permitted**. Remove that ordering and the entry collapses into an
ordinary numerical exercise.

Consequence for the schema: `formula_proof_rationale` must be allowed to point at
the *activity ordering* rather than at a property of the question. And for
quantitative entries it usually will.

This also means the charter's §7.3 and §7.12 filters are not independent for
quantitative physics — the second is what rescues the first. Worth knowing before
twenty quantitative entries get written.

### Operational interpretation of charter §7.3

*Recorded here rather than by reopening the frozen charter. This is how the
existing rule is to be read, not a new rule.*

> **"Formula-proof" does not mean that no equation can answer the question. It
> means that equation application alone cannot constitute the intended learning
> activity.**

For qualitative entries the two coincide. For quantitative entries — most of
Grade 11–12 — they come apart, and the ordering is what does the work:

```
predict → commit → calculate → measure → judge
```

---

## The final test · can one model serve three question types without duplication?

Posed as the maturity check. Tested against `rc-discharge`:

| Question type | Question | Uses the same model? |
|---|---|---|
| **Qualitative** | Does the capacitor lose charge at a steady rate? | Yes — `Capacitor_to_e` §3, no numbers at all |
| **Quantitative** | Q-Q01 above | Yes |
| **Experimental** | Measure V(t) on the demonstrator and find the pattern | Yes — booklet §20.3 |

**Result: yes, and it is already demonstrated in existing material.**
`Capacitor_to_e` runs exactly this progression — *Experiment → Pattern → Law →
Equation* — over one model, with no duplication.

That is the strongest single piece of evidence that the question/model
separation is real rather than an architectural preference. It was arrived at
independently, by hand, before this schema existed.

---

# Recommended schema changes

# Schema — frozen after two stress tests

## Three layers, not one table

The 480-cell problem is not solved by making fields conditional. It is solved by
noticing that the fields belong to three different documents, matching the
charter's source-of-truth architecture (§10).

```
LAYER 1 · Question map          what the curriculum contains        — cheap, complete
LAYER 2 · Activity spec         how the student encounters it       — added at `specified`
LAYER 3 · Model spec            what is true, and how we know       — already exists as model.yaml
```

```yaml
# ── LAYER 1 · the map itself. Every entry has all of this. ──────────────
id:
question:                 # student-facing
intent:                   # what understanding this establishes
prerequisites: []         # other question ids, or declared gaps
model_ids: []             # may be several — one question, several models (F1)
context_type:             # everyday | laboratory | historical | internal_to_theory
context_rationale:        # why this is the honest context
formula_proof_rationale:  # a declaration, not an executable check (F6)
                          # for quantitative entries this points at activity
                          # ordering rather than at the question (F8)
status:                   # proposed | specified | built | tested | validated | blocked
blocked_by: []            # REQUIRED if and only if status: blocked

# ── LAYER 2 · added when the entry moves to `specified` ────────────────
activities:               # a list — one question may hold several cycles (F2)
  - description:
    prior_commitment:
      description:
      representation:     # FREE-FORM for now — see note below
      recorded_before:
      artefact:           # what the student is left holding
    observation:
    discrepancy:
    judgment_task:        # must discriminate between claims — see note
representation_constraints:   # what the depiction must not imply

# ── LAYER 3 · lives in model.yaml; the question REFERENCES it ──────────
evidence:                 # a pointer, not a copy
conceptual_debt:          # a pointer, not a copy
```

**`prior_commitment.representation` stays free-form.** A closed enum was
proposed — `binary | choice | ranking | sketch | numeric` — and it already fails
on Q-M01, where six arrows at six marked positions is a *spatial prediction over
a set of locations*, not a sketch. Predicted graphs, orderings, verbal causal
claims and predicted relationships between variables would each need another
member. Freezing the vocabulary now is exactly the mistake this whole exercise
exists to prevent. **Controlled vocabulary is deferred until the map reveals
which forms actually recur.**

**Evidence and debt are references, not copies.** They live in the model
specification, which is the source of truth (§10). Copying them into every
question would duplicate the model's evidence architecture across the map and
guarantee drift.

## Judgment must discriminate

Promoted to a design rule after Q-M01 exposed it.

> **A judgment task must ask the student to choose between competing claims or
> competing reasoning. It must not simply solicit the explanation that follows
> the activity in interrogative form.**

Q-M01's judgment task, as first drafted, failed this:

> ~~"Does the direction belong to the magnet's ends, or to each point of the space around it?"~~

That is the explanation with a question mark on it. Replaced with:

> "Two students explain the six compass readings differently. **A** says the
> compass points toward the nearest pole. **B** says each position has its own
> field direction. Which explanation accounts for all six observations, and
> **which single reading distinguishes them?**"

The second asks the student to *test* two accounts against evidence. It also
matches charter §7.12 and criterion 1b directly, and it produces a scoreable
artefact — the identified discriminating reading.

Q-Q01's judgment task was built to this rule from the start: two students, both
correct at 2×, only one of whose reasoning also predicts fraction-independence.

---

# What to do next

1. **Populate the map as a dependency graph, not a list.** Start from the prerequisite spine and let the graph determine its own size. The charter says *"~two dozen"*; it does not say 24, and the missing Oersted branch may change the topology before the map is finished.
2. Expect that branch to be the largest structural gap the graph reveals.
3. **Two things remain untested and should be marked as such when they first arise:** `context_type: internal_to_theory`, which none of the five entries needed; and whether `judgment_task` stays distinct from `explanation` for purely descriptive entries.
