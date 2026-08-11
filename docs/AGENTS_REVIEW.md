# Review — `AGENTS.md` and `OPENVIDYA_CLAUDE_LEAD_PROMPT.md`

Written to the review format in `AGENTS.md` §4, because rule 12 says chat history
is not the permanent record.

**Filed at the Course Material root rather than in `docs/specs/`, deliberately.**
Rule 12 assigns physical and pedagogical reasoning to `docs/specs/` and gives no
home for a review of the process document itself — and there are currently two
repositories that could receive it. See F5. Move this once that is decided.

```text
STATUS:   CONDITIONAL
SCOPE:    AGENTS.md (455 lines) and OPENVIDYA_CLAUDE_LEAD_PROMPT.md (28 lines),
          as of 2026-08-11 21:52.
EVIDENCE: Both files read in full. Cross-checked against openvidya/AGENTS.md
          (a different file, 92 lines, 2026-08-09), openvidya/ISSUES.md,
          openvidya/BACKLOG.md, openvidya/docs/specs/ (5 files), and against the
          defect history of this project's own E1/E2 work.
          No claim below rests on a second agent agreeing with it.
```

---

## Verdict in one line

Rules 1–12 are the valuable part and most have been earned by real defects.
The five-agent structure in §2 is the weak part, and the document's own best
rule is what undermines it.

---

## What is load-bearing and should be kept unchanged

| | Why it holds |
|---|---|
| **Rule 3** — four evidence types, ending *"AI output is not evidence in any of these categories"* | The sharpest sentence in the document. Everything good downstream depends on it. |
| **Rule 4** — a test must not reproduce the implementation's own calculation | This is the principle that caught real errors here. `verify-finite-sphere.py` computes the force twice by routes sharing no arithmetic; the agreement is the check. |
| **Rule 11** — no checklist masquerading as verification | Earned. Three content rules in E2 were prose until they rotted silently when the wording improved; they are now executable. |
| **Rule 10** — no silent scope expansion | Earned, and violated repeatedly in practice before it was written down. |
| **§4** — *never write "the other agent confirmed this"* | The correct defence against the specific failure mode of multi-agent systems. |
| **§5** — *agent majority vote is never a substitute for evidence* | Same. |
| **§6** — definition of done, explicitly listing "tests pass" as insufficient | Correct, and rare. |

Most documents in this genre treat agent consensus as validation. This one
forbids it in three separate places. That instinct is the document's main
asset — the problem is that §2 was not held to it.

---

## FINDINGS

### F1 · Five same-model roles are not five independent routes — **High**

Rule 4 demands independence of *route*: closed form against numerical
integration, analytical against pointwise, measurement against prediction.
Rule 3 says agent output is not evidence.

§2 then builds a structure whose primary product is agent agreement.

Five roles played by the same model, on the same context, in the same
conversation, share every prior that matters. The correlation between
`[PHYSICS] correct` and `[RED TEAM] correct` approaches 1 exactly where it is
most costly — on an error the underlying model does not know is an error.
A common-mode failure is invisible to all five hats simultaneously.

**This project's own record is the evidence.** Every substantive catch came from
one of three places, and none from role-switching:

| Catch | Source |
|---|---|
| Balloon swing drawn as attraction, not repulsion | executable check recomputing the geometry |
| Preview stylesheet silently losing `.thread` | self-check inside the extractor |
| `tools/` deleted by `.vercelignore`, disarming the deploy gate | the build failing loudly |
| "20%, exactly" overclaim (true value 18.9%) | external review by a different model |
| Cavendish historical overclaim | external review by a different model |
| "bias independent of k" — wrong, it grows with k | external review, then re-derivation |
| Contradiction on thread length and r₀ | the human |

When this model self-reviewed under a different heading, it produced confident
prose and missed all three of the errors in the lower block.

**Recommendation.** Demote §2 from "five agents" to "five review lenses," and say
plainly what they are for: **directing attention, not supplying independence.**
Writing `[PHYSICS]` genuinely does make the next paragraph check signs and
limiting cases. That is worth having. It is not verification, and the document
should stop implying it is.

---

### F2 · §8 concedes the point without stating the consequences — **High**

§8 permits single-conversation operation with role labels. That is the honest
fallback and will be the normal case. But the document does not say which of its
guarantees survive the concession. They do not all survive:

| Provision | Single conversation |
|---|---|
| Rules 1, 2, 3, 10, 11, 12 | **Survive.** Discipline works single-threaded. |
| Rule 4, independent verification | **Survives, but only via executable checks** — not via a second hat. |
| §5 conflict resolution | **Largely fails.** A disagreement between two hats on one model is not two positions; it is one model sampling twice. |
| Agent 5 red-team independence | **Fails.** Cannot falsify from outside its own priors. |

Add this table, or its equivalent, to §8. A rule whose failure mode is undocumented
will be trusted in the case where it does not hold.

---

### F3 · Agent 3 is chartered to produce the one evidence class it cannot — **High**

Rule 3 lists *"pedagogical validation: does it change what students think?"* as a
category of evidence. Agent 3 is named **PEDAGOGY VALIDATOR** and its output
begins with a verdict.

No agent can produce that evidence. Only students can.

The responsibility list itself is fine, because it is almost entirely
**structural**: is prediction-before-reveal present, is the central question
formula-proof, is the prerequisite actually taught earlier, does the lesson end
when its question is answered. Several are already machine-checkable —
`check-e2.js` tests three of them today.

**Recommendation.** Rename to PEDAGOGY **REVIEWER**. Restrict its authority to the
structural properties, which are checkable. Remove the verdict line from its
output. Record explicitly that validation proper is `BACKLOG.md §2` — four to six
students — and that nothing else discharges it.

---

### F4 · No owner for empirical sourcing — **Medium**

Sourcing is the third of the four evidence types and `BACKLOG.md §1` calls it
*"the cheapest item on the list and the only one blocking anyone being pointed at
the site."*

Agent 2 *identifies* quantities requiring sourcing. Nobody is charged with
obtaining them, and no role owns the debt register. The result is visible in both
repositories: four ⚠ values still unsourced in the Astro modules; here, B1 needed
a dedicated effort and remains logged as debt, with Priestley (1767) and
Cavendish (via Maxwell, 1879) still untraced to primary sources.

**Recommendation.** Give it to Agent 2 explicitly, with a named register file, or
create a sixth lens. An unowned obligation in a document this long will not be
discharged by implication.

---

### F5 · Rule 12 is currently unsatisfiable — **High, and blocking**

Rule 12 opens *"the repository is the source of truth"* — singular. There are two,
and they disagree about their own rules:

| | `openvidya/` | `openvidya-repo/` |
|---|---|---|
| stack | Astro + React + TypeScript | plain HTML/JS, no build step |
| content | Modules 1–2 (current), projectile, field | E1, E2 (charge) |
| `AGENTS.md` | present, **different file**, directs the reader to `OPENVIDYA_PHILOSOPHY.md` | absent |
| `BACKLOG` / `ISSUES` / `docs/specs` | present | absent |
| mutation testing | `scripts/mutate.sh`, 15 mutants, 15 caught | none |
| deployed to Vercel | no | **yes** |

They already cross-reference: `openvidya/ISSUES.md` entry 0c cites
`LESSON_E1_what-is-charge.md §9, §18`, which belongs to the other line of work.

Two further points worth weighing rather than assuming:

- The Astro repo's issue list is in places **stronger** than anything in the
  deployed repo. Entry 0b — the elementary charge declared twice in two modules,
  each verified against its own copy, so the suite structurally cannot detect a
  divergence — is a genuine common-mode failure found by reasoning, not by tests.
  That is the standard this document is asking for, already being met there.
- The deployed repo is the one with no `BACKLOG`, no `ISSUES`, and no `specs`.

No process document can be authoritative across two repositories with different
rules. **This is a Stage 0 human decision and it outranks the agent architecture.**

---

### F6 · The LEAD prompt omits the two things it most needs — **Low**

- It never mentions **§6, definition of done**. The lead is the role that decides
  when to stop; the criteria for stopping are not in its prompt.
- *"Do not treat AI agreement as evidence"* is the last line. On the evidence of
  F1 it is the most important line, and should be first.
- It directs the reader to `PROJECT_CHARTER.md` and `AGENTS.md`; the other
  `AGENTS.md` directs the reader to `OPENVIDYA_PHILOSOPHY.md` first. Another
  symptom of F5.

---

### F7 · The process does not touch the binding constraint — **High**

Stages 0–8 with five review artifacts per module is heavy for a two-person
project. The risk is not that the reviews are wrong; it is that **the process
becomes the deliverable.**

The binding constraint on OpenVidya today is not insufficient review. It is:

1. **No student has ever used any of this.** `BACKLOG.md §2` says so directly:
   *"the one thing no test and no reviewer can settle."*
2. **The E2 apparatus has never been built.** Blocker B3 — whether settle time
   exceeds leakage time — is pass/fail for the entire lesson. If it fails, the
   lesson does not work, and no amount of upstream review will have detected it.

Four additional review stages in front of an untested lesson with an unbuilt
apparatus does not reduce risk. It defers the two measurements that would.

---

## REQUIRED ACTIONS

1. **Decide the repository question (F5).** Human decision. Nothing else in this
   document is coherent until it is made. Cheap to decide now, expensive later —
   the two trees are already cross-referencing.
2. **Rewrite §2's framing (F1).** "Five review lenses," with an explicit statement
   that they direct attention and do not supply independence.
3. **Add the survival table to §8 (F2).**
4. **Rename Agent 3 and remove its verdict (F3).**
5. **Assign empirical sourcing to a named owner with a named register (F4).**

## OPTIONAL ACTIONS

6. Fold §6 into the LEAD prompt and move the anti-consensus line to the top (F6).
7. Promote the three structural pedagogy checks already implemented in
   `check-e2.js` into the document, as the worked example of what Agent 3 may
   legitimately assert.
8. Record in §2 where independence can actually be bought: an executable check
   that recomputes by a different route, a genuinely different model, and the
   human. That is the whole budget. Spend it deliberately.

## HUMAN DECISION

- **D1.** One repository or two? If one, which, and what migrates? *(blocks rule 12)*
- **D2.** Does the five-lens process apply to work already shipped (E1, E2), or
  only to new lessons? Applying it retroactively is a substantial re-review.
- **D3.** Does B3 — building the E2 apparatus — go before or after the next
  lesson? This review's recommendation is **before**, per F7, but it is a scope
  decision and belongs to the human.
