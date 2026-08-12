# E2 · Morsel pass — labelling before rewriting

Triggered by Dr. Vadaparty's review: *E2 is excellent but demands a lot of
student attention — feed small morsels.*

**Nothing is rewritten here.** This is the labelling exercise that has to happen
first, so the redesign is disciplined rather than a prose trim.

---

## The diagnosis, stated precisely

Not "E2 is too long." **E2 asks the student to hold too many open questions at
once.** At its peak the lesson has ten live simultaneously:

what determines the force · how to change charge without knowing its value ·
why contact divides it · whether the spare is neutral · how an angle stands in
for a force · how changing charge moves the separation · which dependence fits ·
why *closest* is not *established* · what the experiment actually settled ·
how the historical route solved the same problem.

Every screen is individually understandable. Working memory saturates anyway,
and the student starts clicking Next while still nominally following.

> **The target is less *simultaneous* physics, not less physics.**

### Measured, not asserted

~3,581 words · 27.5 min reading before any bench work · median screen 178 words.

So this is **not** a density problem at screen level. It is a *concurrency*
problem in the middle and an *attention* problem at the end:

| Passive stretch | Cost |
|---|---|
| `conduction → method → spares` | 718 words, 5.5 min, no student action — the technique-heavy run right before the bench |
| **`model → history → ledger`** | **1,001 words, 30% of the lesson, 7.7 min with nothing to do — arriving *after* the bench work** |

---

## The test every morsel must pass

> **Does the student currently have a problem that this piece of information
> solves?**
>
> If yes → give it. If no → delay it.

E2 already passes this in places, and those places are its best moments. The
spare-sphere null test lands immediately after halving is introduced, so the
student is already wondering whether the fresh sphere is trustworthy. That
rhythm — *"why do I need this?"* … *"ah, that's why"* — is what the redesign
should propagate, not invent.

Three such beats already exist and must be protected:

| Student thinks | Then |
|---|---|
| "Why do I need another ball?" | "Ah — to halve the charge." |
| "Why check a ball that's supposed to be neutral?" | "Ah — a dirty spare contaminates the whole sequence." |
| "But 1/r² is obviously closest." | "Oh. Closest isn't enough." |

---

## Labels

`KEEP` one thought, leave alone · `SPLIT` several thoughts in one container ·
`DELAY` correct but not yet needed · `MERGE` one thought spread over two ·
`CONVERT` sound but passive; the student should do it, not read it

| # | Screen | w | Label | Reason |
|---|---|---|---|---|
| 1 | `entry` | 321 | **SPLIT** | Three jobs at once: framing, equipment list, and the B3 admission. The B3 warning must stay before any commitment to build — but it is competing with a shopping list. |
| 2 | `encounter` | 178 | **SPLIT** + **DELAY** | Carries three thoughts: the gap is a measurement · you do not choose the separation · you may never touch a charged ball. **The third fails the test** — the student has no urge to touch anything yet. Delay it to `method`, where they are about to reach for the balls. |
| 3 | `predict1` | 151 | KEEP | One commitment. |
| 4 | `predict2` | 159 | KEEP | One commitment. |
| 5 | `predict3` | 217 | KEEP | Long, but the "why imagine" card is *needed here* — it justifies the question's framing. Passes the test. |
| 6 | `conduction` | 180 | KEEP | One thought: metal shares, rubber does not, therefore you have an instrument. |
| 7 | **`method`** | **376** | **SPLIT ×3** + **DELAY** | The main target. Contains five morsels: charging procedure · why absolute charge does not matter · the three-kinds-of-"same" table · halving by contact · resetting a spare. **The table fails the test** — the student has no reason yet to wonder whether the two balls must start equal. That question arrives at `judge2`. Delay it there. |
| 8 | `spares` | 162 | KEEP | **The model case.** Arrives exactly when the student needs it. Do not touch. |
| 9 | `observe` | 66 | KEEP | — |
| 10 | `compare` | 67 | KEEP | ⚠ **Do not merge 9 and 10**, despite both being short. The split is what stops the chart appearing before the data is committed. Merging them would break prediction-before-reveal. |
| 11 | `judge1` | 140 | KEEP | The "closest isn't enough" beat. The sharpest screen in the lesson. |
| 12 | `explore` | 132 | KEEP | — |
| 13 | `judge2` | 139 | KEEP | Receives `method`'s delayed table. |
| 14 | **`model`** | **430** | **SPLIT ×3** + **CONVERT** | Five morsels, all passive: the relation · the three-way ledger · why the constant is absent · P1 answered · P3 answered. The last two currently *tell* the student what their locked predictions came to. They should have to **derive it** — the reasoning is two steps and they have everything needed. |
| 15 | `history` | 328 | KEEP | Passive, but it is a narrative and narratives do not survive chopping. Priestley and Cavendish are one story with one point. |
| 16 | `coulomb` | 292 | KEEP | Already optional and off-spine. Correctly placed. |
| 17 | **`ledger`** | **243** | **CONVERT** | Currently tells the student what they established and did not. **Make them sort the claims first**, then reveal. Sorting your own evidence is harder and more revealing than reading someone else's summary — and it converts the lesson's last passive screen into its final judgment. |

**Totals:** KEEP 10 · SPLIT 4 · DELAY 2 · CONVERT 2 · MERGE 0.

Ten of seventeen screens are already one student-sized thought. The problem is
concentrated in **`entry`, `encounter`, `method`, `model`, `ledger`** — five
screens holding 1,588 words, 44% of the lesson.

---

## Two decisions this pass cannot make

**D-a · Does the equilibrium insight move after the charge insight?**
The review's chain runs *we can change q* → *equilibrium gives us F*. E2 runs the
reverse: `encounter` establishes that the gap is the reading before any charge is
touched.

- **Review's order** is better by the morsel test: wanting to change q creates
  the need for a way to see the effect.
- **E2's order** avoids a student changing a quantity whose effect they cannot
  yet read.

Both defensible. This is a physics-authority decision, not a formatting one.

**D-b · Do morsels become more screens, or cards within a screen?**
Cards keep the click count down, but every reveal mechanism is a place where
prediction-before-reveal can quietly break. A card that expands on request is
fine. A card that shows its answer on scroll is not. **If cards are used, the
reveal must be an action, never a scroll position.**

---

## What this pass is not

It is not evidence. Ten screens labelled KEEP is a reading, and readings are
what `AGENTS.md` §A says a pedagogy lens may produce — not a verdict on whether
the lesson teaches. Dr. Vadaparty's judgment is the closest thing to evidence
this lesson has, and it is one experienced reader.

**`BACKLOG.md` §2 — four to six students — is what settles it**, and this pass
should be checked against them rather than shipped on confidence.

---

## Correction to the review's worked example

The sketch's first morsel reads: *"Touch the charged rod to the ball while the
ball is connected to the source."*

**There is no source in E2's apparatus**, and this matters more than wording.
E2 charges by stroking a rubbed rod across the two balls **while they are
touching each other** — which is what makes the equal split a symmetry argument.
And `predict3` turns on the apparatus having no supply at all:

> *"contact can halve, and thirds, and quarters — but there is no move on this
> bench that multiplies. Doubling would need a supply of charge the apparatus
> does not have."*

A morsel that introduces "the source" installs precisely the belief that screen
exists to remove.
