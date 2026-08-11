# Working rules for AI agents on OpenVidya

Read `OPENVIDYA_PHILOSOPHY.md` first. This file is the operational version of it.

Applies to any agent — Claude Code, Grok CLI, or otherwise. `CLAUDE.md` exists
only because Claude Code reads that filename by default; it points here. If you
add another agent, give it an explicit pointer to this file through whatever
instruction mechanism it natively reads. Do not assume any tool picks this up
automatically.

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

## Definition of done for a concept module

- `model.yaml` declaring assumptions, governing law, implementation route,
  verification with stated independence, and validity limits
- implementation in `src/physics/<concept>/`, framework-free
- tests in `tests/<concept>.test.ts`, all passing, each independent of the
  implementation route
- an MDX page that explains the idea and renders `<ModelPanel>`
- captions naming the representational choices
