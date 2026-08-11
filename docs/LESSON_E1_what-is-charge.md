# E1 · Lesson specification — *What is charge, and how much of it is there?*

**Lesson specification ≠ student lesson.** This is the design record. The rendered
lesson is a separate artefact and will contain a subset of this.

Written **from scratch** against the question map, deliberately without opening
the existing decks or the shipped module first. The diff against what already
exists is at the end, and it is the most useful part.

---

> **Status: conceptual specification — ready for physics-authority review.**
> Not a student-facing lesson, and **not to be polished further** until that
> review happens. The claims needing a physicist are listed in §17.

# The finding, first

> **The architecture, run cold, produced a lesson whose first half does not exist
> anywhere in the project — and whose second half is exactly what we already
> shipped.**

Module 1 Scene 1 gives the student two kinds of charge, a net-count readout, and
quantisation. It is a clean exposition of the *model*.

It contains **no prediction, no surprise, and no judgment**. The student is told
that charge comes in two kinds and then explores the consequences.

Writing E1 from the architecture generates a front half that motivates all of
that — and it turns out to be available with two balloons and no vocabulary at
all. Details in §18.

---

# 1 · Why this question

Charge is the first primitive of the whole electricity sequence. Every later node
— current, field, potential, flux — is built on it. If a student leaves E1 with
*charge is a kind of stuff that builds up on things*, that misconception is load
bearing for the next twenty-seven nodes.

# 2 · What the student needs at entry — **RESOLVED**

> **Students have heard the word *atom*. They do not know what is inside one.**
> No protons, no electrons, no nucleus.

Confirmed by the course author. This closes charter §15.1, open since the first
module specification.

**It is the better case, and it changes the lesson in one important way.**

The two-kinds model becomes a genuine *invention* the student is led to, rather
than a fact they retrieve. The judgment task in §7 is a real discovery.

**But E1 must not name the particles.** And on reflection that is not a
concession — it is more honest physics. Two balloons show that there are **two
kinds of charge**. They show nothing whatever about **what carries them**.
Naming protons and electrons here would assert something the evidence in the room
does not support, which is precisely what this project exists to stop doing.

Assumed, and safe: things sometimes attract or repel after rubbing; the student
has felt a static shock or seen hair stand up; matter is made of something small.

# 3 · Initial model — what the student walks in with

Almost universally: *rubbing makes things sticky, and sticky things attract.*

It is a single-mechanism model with one kind of effect. It is wrong, and it is
about to fail in front of them.

# 4 · Prediction and commitment

**Two separate commitments, recorded before anything is touched.**

**P1.** Rub two balloons on your hair. Hold them near each other on threads.
*Attract, repel, or nothing?*
→ Most commit to **attract**. Their model predicts it.

**P2.** Take one of those balloons and bring it near your *hair*.
*Attract, repel, or nothing?*
→ Most commit to **attract**. Their model predicts this too.

The commitments must be written down. The point of P2 is that the same model
gives the same answer for both, which is what makes the pair informative.

# 5 · Activity

Two balloons, thread, hair or wool. Total cost: nothing.

1. Rub both balloons. Suspend them. Release.
2. Bring one rubbed balloon toward hair.
3. Repeat step 1 with only one balloon rubbed.

# 6 · Observation

| | result |
|---|---|
| **P1** — two rubbed balloons | they **repel** |
| **P2** — rubbed balloon and hair | they **attract** |
| one rubbed, one not | attract |

# 7 · Judgment task

*Discriminating, per the F9 rule. The student chooses between accounts; they do
not restate the answer.*

> Two students try to explain both results.
>
> **A** — *"Rubbing makes things sticky. Two sticky things push apart because
> they are both sticky the same way."*
>
> **B** — *"Rubbing moves something from the hair onto the balloon. The balloon
> ends up with one kind, and the hair is left with the other kind. Same kinds
> push apart; different kinds pull together."*
>
> **Which account explains *both* observations?** And: **what would you have to
> see to rule B out?**

The second half matters as much as the first. Ruling B out would require finding
two objects that repel *and* attract, or a rubbed pair that does nothing — and
the student can go looking.

**A fails immediately.** It has one mechanism and there are two behaviours.
**B survives**, and it costs the student a commitment: something *moved*, and
therefore there are two kinds of something.

# 8 · Explanation

**Stated at three separate levels, because the experiment supports three
different amounts of claim.**

| level | statement |
|---|---|
| **Observation** | After rubbing, the balloon and the hair interact *differently* — and two rubbed balloons interact differently again. |
| **Model inference** | Something associated with charge has been **transferred** between them. Nothing was created: whatever one gained, the other lost. |
| **Model** | Charge comes in **two kinds**. The two objects end up with opposite kinds. Like kinds repel; unlike kinds attract. |

*An earlier draft compressed these into "rubbing moves one kind from one object
to the other." The experiment does not show which kind moved, or that anything
moved at all — only that the interaction state changed. The three-level split is
the honest version and it costs one extra sentence.*

### The real discovery is not "two kinds"

It is this:

> **The same object behaves differently depending on what you compare it with.**

Rubbed balloon against rubbed balloon → repel.
Rubbed balloon against hair → attract.
Rubbed balloon against an unrubbed balloon → attract.

*Charged* is therefore **not** a synonym for *attracts*. A student who leaves
with the taxonomy *charged things attract* has a model that will fail them at
Coulomb's law. What they need instead: **there is a property with two kinds, and
what happens depends on the relation between them.**

### A neutral object is not an empty one

Your hair before rubbing had both kinds, in balance. **Neutral means balanced,
not absent.** This is the sentence that makes everything downstream possible, and
it is the one most students are never told.

---

# 8a · Historical interlude — why "positive" and "negative"?

*Placed here deliberately: after the student's own discovery, before any
notation. History is not decoration here — it answers a question the student now
genuinely has.*

**The question they are left with:** we have found two kinds. Which one should be
called **+** and which **−**? Nothing in the balloons says.

**Somebody had to decide, and we know exactly who and when.**

In Philadelphia in 1747, Benjamin Franklin ran an experiment with three people.
Two stood on wax — one rubbing a glass tube, one drawing sparks from it — and a
third stood on the floor. He found that both people on the wax appeared
"electrised" to the third, **but in opposite ways**: the third person *received* a
spark from one and *gave* one to the other.

His explanation was that there is a single "electrical fire" spread through
everything, and rubbing does not make it — it **moves** it. One person ends up
with more than their share, the other with less.

Then, in his own words, in a letter to Peter Collinson:

> *"Hence have arisen some new Terms among us. We say B (and other Bodies alike
> circumstanced) are electrised positively; A negatively: Or rather B is
> electrised **plus** and A **minus**. … **These Terms we may use till your
> Philosophers give us better.**"*

**Two things worth stopping on.**

**One.** In the same letter Franklin writes that the electrical fire *"is never
really destroyed"* — only moved about and shared out.

**Franklin had already formulated a conservation idea for electricity: the
electrical "fire" was not destroyed but transferred.** His physical theory was
later replaced; the conservation principle survived, in a more precise form.

*Stated that way deliberately.* An earlier draft said *"that is charge
conservation, written down in 1747."* It is a **precursor** — conservation within
his single-fluid theory, not the modern conserved-charge concept in its present
framework. The looser claim would have been the same species of overreach this
project keeps catching.

And the more careful version teaches more, because the pattern now appears
**three times in one letter**:

| | fate |
|---|---|
| Franklin's single-fluid **model** | replaced |
| his **plus/minus terminology** | survives unchanged |
| his **conservation idea** | survives, in refined form |

A student who sees all three has learned something about how science actually
moves that no summary of the modern theory could give them.

**Two.** Franklin offered *plus* and *minus* as temporary. He expected better
names to come along. **Nobody ever supplied any**, and we are still using his
words 279 years later.

### What survived, and what did not

Franklin's *physical picture* — a single fluid, present in everything, that
rubbing moves around — is **not** the modern model. It was replaced.

His *names* were not.

> **A scientific model can be replaced while the conventions built on it
> survive.**

That is worth more to a student than "the labels are arbitrary". They are not
arbitrary — they are **inherited**, from a specific person solving a specific
problem with a theory we no longer hold.

### One qualification on "convention"

Which kind gets called positive **is** a convention. But once the choice is
fixed, the distinction between the two signs is physically real, through how they
interact: like repels like, unlike attracts. *Convention* applies to the naming,
not to the difference.

⚠ **Not included, deliberately:** Franklin's kite experiment. It is famous, its
historical detail is contested, and — more importantly — it answers *"is
lightning electrical?"*, not *"why plus and minus?"*. It belongs to a later node.

⚠ **Also deferred:** that Franklin's choice makes the mobile carrier in metals
negative. That fact requires knowing what the carrier is, which this lesson has
explicitly not established (§9).

# 9 · Mathematical representation

**Rewritten twice.** Once when §2 resolved, and again to remove quantisation
entirely.

$$Q_{\text{net}} = Q_+ - Q_-$$

Or, if counting units of the two kinds:

$$N_{\text{net}} = N_+ - N_-$$

That is all E1 has earned. It expresses exactly the conceptual result the student
reached:

> **net charge ≠ amount of charged stuff**

Five hundred units of each kind gives zero net charge with a thousand units
present.

### ⚠ Q = Ne has been REMOVED from E1

An earlier draft put $Q = Ne$ here, with *e* defined as *"the smallest amount of
charge ever found on its own."* **Both were wrong for this lesson.**

**The balloons do not establish quantisation.** They establish two kinds,
transfer, and conservation. Nothing in the experiment says charge comes in
discrete lumps, or that there is a smallest one. Putting $Q = Ne$ in E1 asserts
an experimental result the student has not been given evidence for — the exact
failure §16's last assessment item is designed to catch.

**And "smallest amount ever found on its own" is not a clean definition anyway.**
It invites the fractional-charge question, and it is a claim about the entire
history of measurement rather than about anything in this room.

Charge quantisation is a real, separate, hard-won experimental result. It
deserves its own node.

### ⚠ Two candidate nodes, generated by this lesson

Neither exists in the map. Flagged, not added — the spine is frozen and this is
the course author's call.

| candidate | why it now exists |
|---|---|
| **What is carrying the charge?** | E1 establishes two kinds and says nothing about the carrier. C3 (*what are the electrons doing*) presupposes electrons; nothing in the graph establishes them. |
| **Why does charge come in discrete amounts?** | Removed from E1. Needs its own evidence — historically Millikan. Currently homeless. |

**This is the lesson finding the graph incomplete**, which is what writing it was
supposed to test. The graph looked finished until a lesson was actually written
against it.

# 10 · Formula-proof — and what it means when there is no formula yet

**The §7.3 filter is vacuous at E1.** The student has no equation to
pattern-match with. Nothing to be proof against.

**This is a finding, not a gap.** For entry-level nodes only the §7.12
*evaluation* filter is active — prior commitment, apparatus, discrepancy. The
formula-proof filter switches on at the first node where a formula exists, and
the template must permit `not_applicable` with a reason.

# 11–14 · Representation, context, evidence, debt

**References, not copies.** Per the frozen three-layer architecture these live in
the model specification and the map, and duplicating them here would guarantee
drift.

- representation constraints → `charge-count` model spec
- context type → `everyday` (map E1)
- evidence → `charge-count` model spec; currently 28 tests via Module 1
- conceptual debt → says nothing about *why* rubbing transfers charge, or which way it goes for which materials (triboelectric series). Declared, deferred.

# 15 · Teacher notes

### `apparatus_failure_mode: silent`

**A new tag, and it should propagate across the whole project.** Two lessons in,
two instances, both with the same shape:

| lesson | failure | what it looks like |
|---|---|---|
| **E1** | humid air — charge leaks away in seconds | the balloons do nothing |
| **O1** | wire laid east–west instead of north–south | the compass does not move |

In both cases the **model is right, the apparatus conditions suppress the
effect**, and what the room concludes is *"the physics doesn't work."* That is
the worst possible outcome for a course whose entire argument is that physics is
something you can check.

Any lesson with a silent failure mode must declare it, and the declaration is a
teacher-facing obligation, not a footnote.

- **Humidity ruins E1.** Have a dry-day fallback, and check the balloons yourself before the room does.
- Do not name the two kinds until after the judgment task. Naming them supplies B's answer.
- Some students will already say "electrons". Ask them *how they know*, and whether the balloon experiment shows it. It does not — it shows two kinds, not what carries them.

# 16 · Assessment evidence

Reuses the existing acceptance-question discipline.

**Reworded after §2 — no item may mention protons or electrons.**

| item | passes if |
|---|---|
| An object carries 500 units of one kind and 500 of the other. What is its net charge? Is there any charge in it? | Zero net, and a thousand units present. *Neutral means balanced, not empty.* |
| Where did the balloon's charge come from? | The hair. Nothing was created. |
| A rubbed balloon repels another rubbed balloon, but attracts your hair and attracts an unrubbed balloon. Is "charged" the same as "attracts things"? | No. What happens depends on the **relation** between the two objects, not on one of them alone. |
| What did the balloon experiment tell you about **what** is carrying the charge? | **Nothing at all.** It showed two kinds, transfer, and conservation. It said nothing about what they sit on. |
| Franklin called them *plus* and *minus*. Could we have swapped the names? | Yes — the naming is a convention. |
| **If the names are conventional, does that mean the two kinds of charge are physically arbitrary? Explain.** | **No.** Which kind is *called* positive is conventional. That there are two kinds, and that like repels while unlike attracts, is an empirical fact about the world. |

**Two items were removed** when quantisation left §9: *"could an object carry
one-and-a-half units?"* and *"is one unit on a cloud different from one on this
table?"* Both test quantisation, which E1 no longer establishes. They move to the
future quantisation node.

The carrier item is the most important of the five. A student who answers
*"electrons"* has imported knowledge the lesson did not supply, and the honest
response is to ask how two balloons could possibly have shown that.

# 16a · Sources

The historical material in §8a is quoted from Franklin's own letter, verified
against the primary source rather than a textbook retelling.

- **Franklin to Peter Collinson, 25 May 1747** — Founders Online, National Archives. The *plus/minus* passage, the three-person experiment, the single-fluid statement, and *"never really destroyed"* are all direct from this letter. The editorial apparatus notes that dating has varied across printed editions; the Bowdoin manuscript date is given as correct. <https://founders.archives.gov/documents/Franklin/01-03-02-0059>
- **Library of Congress** — catalogue record for Franklin, *Experiments and Observations Made on Electricity, Made at Philadelphia in America*, 1751–1753, LCCN 04006387. <https://guides.loc.gov/franklin-business-science/science>

⚠ **Not verified and therefore not used:** any account of the kite experiment,
and any claim about how Franklin's convention relates to electron flow. The
first is contested in its detail; the second requires knowing the carrier, which
this lesson has explicitly not established.

# 17 · Open decisions

1. ~~Entry assumption~~ — **RESOLVED.** Students know the word *atom*, not its contents. See §2.
2. ~~Whether particle names appear at §9~~ — **RESOLVED: they do not.** See §9.
3. **Two new nodes needed (§9).** *What is carrying the charge?* and *Why does charge come in discrete amounts?* Both generated by writing this lesson; neither exists in the frozen spine. **Course author's call, since it changes the graph.**
4. Whether the triboelectric direction (why hair loses and balloon gains) is worth mentioning or is scope creep.
5. **Module 1 Scene 1 contradicts the entry assumption** — logged as `ISSUES.md` #0c.
6. Whether §8a's historical interlude is the right length. It is currently the longest section in the lesson, and it is doing conceptual work rather than decoration — but that is a judgment for the course author.

---

# For the physics-authority review

**Five claims where a physicist's judgment is needed, not a reviewer's.**

1. **Does the balloon experiment actually support the transfer inference?** §8 states it at three levels — observation, inference, model — precisely because the experiment shows an interaction change, not a transfer. Is the middle level warranted?
2. **Is "neutral means balanced, not empty" appropriately formulated at this stage**, given the student has no particle model to balance *with*?
3. **The Franklin interpretation** (§8a): is the single-fluid account fair to him, and is the three-fold survives/replaced pattern historically sound?
4. **The exact status of conservation** — precursor within his theory, refined later. Is that the right characterisation?
5. **Do the assessment items in §16 exceed the experiment?** Each is meant to be answerable from what happened in the room. If any requires imported knowledge, it fails the lesson's own standard.


---

# 18 · Diff against what already exists

**Module 1 Scene 1**, shipped and tested, does §8, §9 and §16. Two kinds, net
count, neutral-is-not-empty, quantisation with a measurement-and-uncertainty
check. All correct, all verified.

**It does not contain §3–§7 at all.** No prior model, no prediction, no
discrepancy, no judgment. The student is *told* that charge comes in two kinds
and then explores what follows.

| | E1 as designed | Module 1 Scene 1 |
|---|---|---|
| §3 initial model | student's own, elicited | — |
| §4 prediction | two commitments, written | — |
| §6 observation | balloons repel; balloon attracts hair | — |
| §7 judgment | two competing accounts | — |
| §8 explanation | two kinds, transferred not created | ✅ asserted |
| §9 mathematics | Q = Ne | ✅ |
| §16 assessment | four items | ✅ three of them |

**What this means.** The shipped content is the *back half* of E1 — the model
exposition, without the discovery that earns it. That is not a defect in Module
1; Module 1's question is *"What is current?"*, and Scene 1 is a legitimate piece
of scaffolding inside it.

But it means **E1 is not "already built"**. Its front half has never existed, and
the front half is where the charter's machinery lives.

**Three consequences:**

1. **E1's status changes from `partial` to `proposed`** in the question map. The bookkeeping was flattering us.
2. When E1 is built, **Module 1 Scene 1 should reference it rather than duplicate it** — the same discipline as `model_ids`, applied to lessons. Otherwise two places will assert two kinds of charge and they will drift.
3. **Module 1 Scene 1 assumes knowledge these students do not have.** Its legend reads *"proton — charge +e"* and *"electron — charge −e"*, and its steppers are labelled with particle names. Written before the entry assumption was settled, it now introduces protons and electrons to students who have never been told what is inside an atom — and it does so with no evidence in the module that either exists.

   This is a shipped defect, not a design preference. The fix is small: relabel the two steppers as **kind + / kind −**, or **positive units / negative units**, and let the particles arrive at the later node where evidence for them exists. Logged in `ISSUES.md`.

---

# 19 · What the template test found

The 17-field template, run once:

| field | verdict |
|---|---|
| 1 why · 2 needs · 3 initial model · 4 prediction · 5 activity · 6 observation · 7 judgment · 8 explanation | **kept, all did work** |
| 9 mathematical formulation | kept — and its *position* after judgment is the whole architecture |
| **10 formula-proof** | **needs `not_applicable` with a reason.** Vacuous at entry nodes. |
| **11–14 representation, context, evidence, debt** | **should be references, not fields.** Copying them here breaks the three-layer separation already frozen. |
| **15 teacher notes** | **keep, and it is more valuable than expected.** The humidity trap is this lesson's version of O1's wire-orientation trap — apparatus that fails silently and looks like failed physics. |
| 16 assessment evidence | keep, but it is the *same* acceptance-question discipline under a new name. Consider merging. |
| 17 open decisions | keep |

**Recommended template: 12 fields, not 17.** Sections 11–14 become a single
`references` block, and 16 folds into the existing acceptance-question artefact.

**The ordering is right and should not change.** Question → initial model →
prediction → activity → observation → judgment → explanation → mathematics. The
mathematics arriving *after* the judgment is the difference between this and a
conventional chapter, and it survived contact with the first real lesson.
