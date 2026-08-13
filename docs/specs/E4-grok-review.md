# Review — E4 in the `openvidya-grok` tree

`openvidya-grok/js/e4.js`, 12 screens, 318 lines. Reviewed 13 Aug 2026.

```text
STATUS:   CONDITIONAL — one defect sits at the centre of the lesson
SCOPE:    E4 only. Its own check.js run (98 pass), all five E4 figures rendered,
          readability measured, and the discriminating experiment traced through
          both trials by hand.
EVIDENCE: Source read in full. No claim below rests on the lesson's own summary
          of itself.
```

---

## What it gets right, and one thing better than anything else in the project

**The design is the sharpest in the course.** E4 runs two trials — a charged comb
near paper, then *the other kind of charge* near fresh paper — and uses the
second as the discriminator between two student stories. That is the correct
shape for this question.

**And then it does something no other lesson does.** From the judgment screen:

> *"This is not E3. There the two stories drew the same still arrows. Here they
> do **not** agree about the second trial."*

E3 taught that two accounts can be indistinguishable. Left alone, that lesson
rots into *"you can never really tell"*, which is worse than the naïve confidence
it replaced. E4 explicitly marks the contrast and shows a case where evidence
**does** decide. **That is excellent curriculum design and it should be
protected in any rewrite.**

**The physics that most treatments get wrong, this one gets right.** A net force
on a polarised neutral object requires a *non-uniform* field. E4 says so:

> *"If every place pushed the same, the two sides would cancel and the paper
> would sit still. The paper moves, so the push cannot be the same everywhere.
> Nearer has to be stronger. That is inferred from the jump, not measured with a
> ruler today."*

Correct, derived from the student's own observation rather than asserted, and
**flagged as inferred**. Very good.

**The formula-proof core is well aimed.** The `assume` screen puts up `F = q E`,
reads `q` as the leftover, notes that the leftover is zero, and asks why the
paper moved anyway. The resolution — *the leftover is not the only charge that
feels a push* — is right, and the screen explicitly refuses to throw the formula
away.

**Also good:** damp-air failure handled on both observation screens; the
assumption that charge can shift inside paper is declared rather than smuggled;
`polarisation` named only after the picture is built, and named as *a short word
for the picture*, not a new fact.

---

## The defect: the discriminating experiment does not discriminate

**Story A, as worded:**

> *"The paper **picked up** a little of the opposite kind. So the comb pulls it,
> the way unlike kinds pull. Flip the comb, and the paper should be pushed away."*

The leftover is **acquired from the comb**. Now trace both trials — and note that
the second trial uses **fresh paper** (`Hold that one near fresh paper`):

| trial | comb | what A says the paper gets | result under A |
|---|---|---|---|
| 1 | kind X | paper picks up ¬X | X attracts ¬X → **attract** |
| 2 | kind ¬X | **fresh** paper picks up X | ¬X attracts X → **attract** |

**Under A as written, both trials attract — exactly as B predicts.** The second
trial separates nothing.

So two statements in the lesson are wrong about its own story:

- the reveal: *"A says flipping the comb should flip the paper — pull, then push.
  You did not see a push."* Only true if the paper's leftover is fixed and
  pre-existing.
- the `neither` rebuttal: *"These two stories do not draw the same picture."* As
  worded, they do.

### The fix is one clause

Story A must give the paper a **pre-existing** leftover, not one acquired from
the comb:

> *"These bits of paper already carry a small leftover of one kind. The comb
> happens to be the unlike kind, so it pulls them. Bring the other kind of comb
> and the same bits should be pushed away."*

Then trial 2 genuinely refutes A, the reveal becomes true, and the lesson's
central claim holds.

⚠ **With that wording, trial 2 must use the SAME bits of paper, not fresh ones** —
otherwise "these bits already carry a leftover" says nothing about the new bits.
The instruction and the story have to agree, and at the moment neither version
of them does.

---

## Two smaller problems

### The E1 contrast is not right

> *"Charge has to be able to shift a little inside the paper. E1's balloons were
> not like that: charge stayed put on the rubber."*

This conflates two different things:

| | rubber | paper |
|---|---|---|
| charge moves freely through the bulk (conduction) | no | no |
| charge shifts slightly within the material (polarisation) | **yes** | **yes** |

Both are insulators. **Both polarise** — a neutral balloon is attracted to a
charged comb by exactly the mechanism E4 is teaching. What E1 established is that
charge *transferred onto* a balloon stays where it lands, which is about
conduction, not polarisation.

Suggested replacement, which keeps the honest admission and drops the false
contrast:

> *"In E1 you moved charge from one object to another, and it stayed where it
> landed. This is different. Nothing moves from the comb to the paper. Charge
> already in the paper shifts a tiny distance and stays inside. We have not shown
> why it can do that. We are telling you we are assuming it."*

### The prerequisite does not match the map

`QUESTION_MAP.md` gives E4 the prerequisites **E1, E3**. As built, E4 needs only
E1: it checks for the `charge` model, works entirely in *kinds* and *pushes*, and
never uses the field. E3 appears once, rhetorically.

That is arguably better — it makes E4 reachable a lesson earlier, and it is
consistent with E3 having left the field as an open judgment rather than a tool.
But the map and the lesson now disagree, and one of them should move.

---

## Readability

| | |
|---|---|
| sentences | 109 |
| mean length | 13.3 words |
| Flesch-Kincaid | **6.1** |
| over 25 words | **11** |
| containing an em-dash | 8 |

The average is at the target. **Eleven sentences run past 25 words**, which is the
shape UG students reported re-reading, so E4 would fail the structural half of
`tests/readability.test.ts` while passing the syllable half. Worth fixing before
it goes in front of anyone.

---

## Verdict

**Keep the architecture. Fix story A before this is used.**

The two-trial design, the explicit contrast with E3, the non-uniform-field
inference and the `F = qE` screen are all right, and the E3 contrast is the best
single idea in the tree. But the lesson currently claims its second trial
distinguishes two accounts when, as those accounts are worded, it does not — and
that claim is the whole reason the second trial exists.

**Required before use**

1. Story A gets a pre-existing leftover, and trial 2 uses the same paper.
2. The E1 balloon contrast is corrected or removed.
3. The eleven over-long sentences are split.

**Then decide**

4. Whether E4's prerequisite is E1 alone, and update `QUESTION_MAP.md` either way.
