# Lesson template

**Status: v1, adopted.** Until now the template existed only implicitly, as the
shape E1 and E2 happened to share. Writing it down was forced by a defect that
appeared twice in E2 and had no field to catch it — see §B.

The template is a **checklist of obligations**, not a house style. A lesson may
add sections. It may not omit these.

---

## Amendment log

| Version | Change | Why |
|---|---|---|
| **v1** | Template extracted from E1 and E2 and written down. | It was being carried in two heads and one pair of documents. A third lesson would have diverged silently. |
| v1 | **§B added: performability of every described action.** | Found twice in E2 and nowhere in the field list, so nothing was going to catch it. Details below. |

---

# A · The eighteen fields

Numbering follows E1 and E2, which are the reference implementations.

| § | Field | Obligation |
|---|---|---|
| 1 | Why this question | Where it sits in the map, and what it unblocks |
| 2 | Entry requirements | What the student must already hold — and what is **deliberately not assumed** |
| 3 | Initial model | What the student walks in believing, stated as a claim that can fail |
| 4 | Prediction and commitment | Locked before any result is available |
| 5 | Activity | What is physically done |
| 6 | Observation | What the apparatus actually produces, including what it produces when it fails |
| 7 | Judgment task | Choosing between accounts, not restating the answer |
| 8 | Explanation | The model, after the judgment |
| 8a | Historical interlude | Optional. Sourced to primary or authoritative material, or it does not ship |
| 9 | Mathematical representation | Last. Compression of something already reasoned through |
| 10 | Formula-proof | Why an answer-generator does not shortcut this lesson |
| 11–14 | References | Model spec, context, evidence, debt — pointers, not copies |
| 15 | Teacher notes | Including every apparatus tolerance and failure mode |
| 16 | Assessment evidence | What a student who understood would be able to say |
| 17 | Open decisions | With owners |
| 18 | What this lesson tested about the process | The template's own feedback loop |

---

# B · Performability — new in v1

> **For every screen that describes a physical action, the lesson must state
> either that the student can perform it now, or when it becomes performable and
> why it is being withheld.**

Three values, declared per screen:

| value | meaning | obligation on the screen |
|---|---|---|
| `none` | no bench action described | — |
| `performable` | the student can do this now, with what they have and know | the means must already have been given |
| `deferred` | described but not yet doable | must say **when** it becomes doable, and **why** it is held |

`deferred` **may not be silent**. A screen that describes an action and simply
does not mention that it is impossible has failed this field, whether or not it
uses the imperative mood.

## Why it exists

E2 broke it twice, in ways nothing else would have caught.

**Screen 2** was headed *"Charge both balls."* The method for charging them was on
**screen 7**, 1,241 words later. The heading was an instruction; the means was not
yet in the student's hands.

**Screen 4** said *"Hang them both and look at the two threads."* Making one ball
carry four times the charge of the other requires the halving method, taught on
**screen 7**; the test itself happens on **screen 13**. A promise on 4, its means
on 7, its redemption on 13.

Both were fixed by changing **mood, not order** — and that is the general shape of
the repair.

## The order is usually right; the wording is usually wrong

Moving either screen's method earlier would have been worse. E2's halving method
is the central experimental idea of the lesson; handing it over at screen 4 to
make a prediction legible would spoil the discovery it exists to produce.

So the default repair is **not** to reorder. It is to say plainly:

- this is not something you can do yet;
- here is when you will do it;
- here is why we are not telling you how, now.

That last clause matters. Deferring without a reason reads as coyness. Saying
*we are withholding this because giving it to you now would ruin the discovery*
treats the student as somebody who can be told how the lesson is built.

## When the field bites

It bites when the apparatus requires **technique** rather than **common action**.

E1 passes without effort: *"rub two balloons on your hair"* needs no method
beyond itself, and the screen immediately adds *"Before you touch anything: what
do you expect?"* — which holds the action explicitly.

E2 fails twice because its apparatus needs technique: charging by rod, halving by
contact, verifying a spare by null test. **Any lesson whose apparatus needs
technique should expect to fail this field on the first draft.**

## How it is checked

Declared, not inferred. A crude imperative-detector produces false positives — one
run flagged E1's *"**Charge** can be moved from one object to another"*, which is a
noun.

So each lesson declares a `BENCH_ACTIONS` map in its implementation, and the
check verifies:

- every screen appears in the map;
- every `deferred` screen actually contains language naming when and why;
- no `performable` screen precedes the screen that supplies its means.

A declaration can be wrong, but it is wrong **visibly**, and a reviewer can read
the map in one screenful.

---

# C · Standing rules the template inherits

From the charter and the E1/E2 rulings, restated here so a new lesson need not
reconstruct them:

- **Prediction locks.** A prediction that can be edited after the result is not a prediction.
- **Never "wrong."** Only *you predicted X, the experiment produced Y*.
- **The page never shows a result before the student has reported it.**
- **Mathematics arrives last**, and only as compression of something already reasoned.
- **Nothing is named before it is earned** — no particle names in E1 or E2, no constant in E2.
- **Simulation is positional**: permitted after the judgment, never as the source of evidence, and visibly marked as computed.
- **Evidence must be obtained by a route that does not assume the conclusion being tested.** *(charter C1 — applies to the verification code and to the lesson equally)*
- **Every lesson ends with what it did *not* establish**, and points at the next question.
