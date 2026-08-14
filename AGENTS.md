# Working rules for AI agents on OpenVidya

Read `OPENVIDYA_PHILOSOPHY.md` first. This file is the operational version of it.

Applies to any agent — Claude Code, Grok CLI, or otherwise. `CLAUDE.md` exists
only because Claude Code reads that filename by default; it points here. If you
add another agent, give it an explicit pointer to this file through whatever
instruction mechanism it natively reads. Do not assume any tool picks this up
automatically.

**This is the only `AGENTS.md` in the project.** Two others existed until
11 Aug 2026 — one at the Course Material root, one here — and they did not know
about each other. See the amendment log.

---

## Amendment log

| Date | Change | Why |
|---|---|---|
| 11 Aug 2026 | §0 human authority stated explicitly. | It was assumed everywhere and written down nowhere. |
| 11 Aug 2026 | §A roles and lenses added. | A proposed five-agent architecture treated role separation as a source of independent evidence. It is not. Recorded here so the mistake is not made twice. |
| 11 Aug 2026 | §B single-conversation table added. | Names which properties are lost when one model plays every role, and the mitigation for each. |
| 11 Aug 2026 | Hard rule 13 added — sourcing register. | Empirical sourcing is one of four evidence classes and had no owner. Four ⚠ values are unsourced today because of it. |
| 11 Aug 2026 | §C architecture acceptance test added. | The lens structure is a hypothesis about our own process. It gets tested like any other. |
| 11 Aug 2026 | Hard rules 1–12 kept verbatim. | They are checkable, and every one was earned. `AGENTS_REVIEW.md` §"load-bearing" gives the evidence. |
| 14 Aug 2026 | §D live deploy: push `main` to `vnithin90/openvidya`. | This folder is the Claude site. Vercel deploys that repo. `openvidya2` is the Grok site — do not mix them. |

---

## §0 · Human authority — constitutional, not a lens

A human makes the final decision on physics, pedagogy, scope, and empirical
claims. An agent may recommend, reject, implement, or test. It may not silently
settle a disputed physical or pedagogical question.

This is not one perspective among several and does not belong in the list of
review lenses below. It is the rule the rest of the file operates under.

Where a dispute cannot be settled by an independent calculation, a test, an
experiment, an external source, or student observation, it goes to the human.
Preserve both positions; do not average them.

---

## What agents may and may not establish

You may **propose, implement, refactor, and inspect**.

You may **not establish correctness**. Specifically, never write or imply
"the physics is correct" as a conclusion. An agent's assessment is a hypothesis.
Correctness is established by a passing test derived by an independent route, or
by the human physics authority.

If asked to review, the useful outputs are:

- cases the current tests do not cover
- discrepancies between `model.yaml`, the implementation, the tests and the prose
- ways the visualization could mislead a learner
- experiments that could falsify the implementation

The unhelpful output is a checklist of ✓ marks.

---

## §A · Two operating roles, three review lenses

Not five agents. The distinction is load-bearing.

**Operating roles** — these do work:

| Role | Does |
|---|---|
| **Lead / Architect** | Decomposes the request, protects scope, keeps `BACKLOG.md` and `ISSUES.md` coherent, preserves disagreements. |
| **Implementation** | Builds the approved specification. Stops and reports if implementing it exposes a specification problem, rather than quietly changing the model to make coding easier. |

**Review lenses** — these direct attention:

| Lens | Looks for |
|---|---|
| **Physics** | Signs, limiting cases, hidden assumptions, model-versus-reality confusion, whether the experiment can actually produce the claimed observation, empirical values needing sourcing. |
| **Pedagogy** | Conceptual sequence, prerequisites actually taught earlier, prediction-before-reveal present, formula-proofness, where a student could get the right answer for the wrong reason. **Structural properties only** — see below. |
| **Verification / Red team** | Runs and adds tests, recomputes independently, attacks boundaries, asks what implementation could pass the tests while still being physically wrong. |

> **The lenses improve coverage and direct attention. They do not produce
> independent evidence.** Multiple outputs from the same model, the same context,
> or the same reasoning chain are one route wearing several hats. A common-mode
> error is invisible to all of them at once.

Independence comes from exactly six places, and nowhere else:

an independent calculation · an executable test by a different route ·
an actual experiment · an external source · student observation · the human.

**The pedagogy lens may not issue a verdict on whether something teaches.** That
is validation, it requires students, and no agent can supply it. It may report on
the structural properties above, which are checkable — several already are.

---

## §B · What is lost when one model plays every role

The normal case is a single conversation. These are the properties that do not
survive it, and what to do instead.

| Mechanism | Single-conversation mode | Mitigation |
|---|---|---|
| Hard rules 1–13 | **Retained** — discipline works single-threaded | this file |
| Specification before implementation | **Degrades badly.** The session that writes the spec then implements it, and implementation convenience leaks backwards into the model | commit `model.yaml` **before** code; the leak then has to appear as an edit |
| Physics lens | attention retained, **independence absent** | independent calculation or external source |
| Pedagogy lens | attention retained, **student validation absent** | student testing; nothing else discharges it |
| Executable verification | **Retained, if genuinely a different route** | hard rule 2, and `verification[].independent_of` |
| Disagreement between two roles | **Not independent evidence.** One model sampled twice | escalate under §0 |
| Red-team independence | **Degrades strongly** | external review, experiment, or independent route |
| Human authority | **Retained, and final** | §0 |

Never write, in any form:

```
[PHYSICS]  I think X.
[RED TEAM] I disagree; perhaps Y.
[LEAD]     Two roles considered it, so it has been reviewed.
```

That is the failure this section exists to prevent.

---

## Hard rules

1. **Physics lives in `src/physics/`.** Visualization components import from it
   and contain no equations. If you write a formula in a `.tsx` file, it is in
   the wrong place.

2. **Never write the implementation and its verification by the same route.**
   If the implementation integrates numerically, the test compares against a
   closed form or a conservation law. If the implementation sums pointwise, the
   test uses an integral theorem. State the independence in `model.yaml` under
   `verification[].independent_of`.

3. **Do not generate both the implementation and its critical invariants in one
   pass.** A misreading of the model then appears in both and they will agree
   with each other. Critical invariants come from the human physics authority.
   Routine cases may be filled in by an agent.

4. **Declare assumptions in `model.yaml` before writing code**, including what
   is *not* modelled.

5. **Do not hide a model's singularities or failure regimes.** Return `null`,
   or fail loudly. A plausible finite number where the physics has none is a lie
   the visualization will then draw.

6. **Never introduce an approximation without recording it** in `model.yaml`
   under `validity` or `implementation.notes`.

7. **Distinguish physical entities from representational choices** in both code
   and captions. Arrow length, colour scale and line density are choices.

8. **Convert review findings into tests or documentation.** A review comment is
   not a durable artifact. If a gap is found, the lasting output is a new test
   in `tests/` or a new entry in `model.yaml`.

9. **Do not generalise the `model.yaml` schema** on current evidence. It has two
   dissimilar examples and is explicitly provisional. See
   `docs/SCHEMA-COMPARISON.md`.

10. **Anything expressible as a test must not be written as a checklist.** A
    calibration table with "re-run this if you change X" is a regression test
    that depends on someone remembering. If a claim can be executed, execute it.
    Prose is for the reasoning behind a decision, never for the check itself.

11. **Record external couplings in `model.yaml`.** `verification[]` protects
    against the code being wrong. `external_couplings[]` protects against a
    value being load-bearing for something outside the file — a spec, a printed
    slide, a physical kit, a downstream module. Anything listed there needs a
    conversation, not a commit. See
    `src/content/electricity/what-is-current/model.yaml` for the pattern.

12. **Defects go in `ISSUES.md`, new work goes in `BACKLOG.md`.** Not in a
    commit message, not buried in a spec, not in a chat log. If you find
    something and cannot fix it now, it is only recorded if it is in one of
    those two files.

13. **The physics lens owns the sourcing register.** Every empirical value
    reaching a reader is either sourced — value or range, uncertainty,
    conditions, citation — or carries ⚠ and an entry in `BACKLOG.md`.
    **Identifying that a source is needed is not itself evidence, and neither is
    supplying a remembered number.** The evidence is the external source. An
    agent may not close a sourcing item from its own knowledge.

---

## §C · The lens structure is a hypothesis, and gets tested

This architecture is a claim about our own process: that lenses catch things a
single ordinary session would miss. Untested, it is a preference.

It is tested on the next full lesson, under the rule the lessons themselves use —
**commit before you see the result.**

Before the multi-role run, and frozen in `docs/specs/`:

1. **The baseline.** One ordinary session, fixed prompt and context. Its output
   is written down and locked.
2. **What counts as a substantive finding.** Defined in advance. A wording
   improvement is not one; a wrong sign, an unsupported claim, an unperformable
   instruction, or a missing prerequisite is.
3. **What makes the lesson an adequate test.** Also in advance — at minimum one
   novel physical model, one apparatus claim, and one empirical value needing
   sourcing. This exists so that a null result cannot be explained away
   afterwards as *"that lesson was too easy."*

Then run the lenses without exposing the baseline, and compare only once both are
frozen.

**The consequence, pre-registered:** if the multi-role run produces no substantive
finding the locked baseline missed, the architecture has not demonstrated value.
Do not expand it. Check the adequacy criterion from step 3 — if the lesson met it,
simplify or abandon the multi-role process and keep §B and the hard rules, which
stand on their own.

---

## Definition of done for a concept module

- `model.yaml` declaring assumptions, governing law, implementation route,
  verification with stated independence, and validity limits
- implementation in `src/physics/<concept>/`, framework-free
- tests in `tests/<concept>.test.ts`, all passing, each independent of the
  implementation route
- an MDX page that explains the idea and renders `<ModelPanel>`
- captions naming the representational choices
- every empirical value sourced or carrying ⚠ with a `BACKLOG.md` entry (rule 13)

None of the above is satisfied by a page rendering, a suite passing, or an agent
saying it looks correct.

---

## §D · Live deploy (this folder only)

Git remote: `https://github.com/vnithin90/openvidya.git`  
Vercel for the Claude site should be connected to **that** repo. A push to `main` is a live deploy.

This is **not** `openvidya-grok` / `vnithin90/openvidya2`. Do not push this tree there.

After any change in this website:

1. Commit in this folder only.
2. `git push origin main` (a `post-commit` hook also does this).
3. Do not wait to be asked.

Do not commit `node_modules/`, `dist/`, `.astro/`, or `.vercel/`.
