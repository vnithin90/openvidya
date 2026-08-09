# Contributing

## Licence

- **Code** (everything under `src/physics/`, `src/components/`, `tests/`): MIT.
- **Content** (MDX explanations, figures, `model.yaml` files): CC BY 4.0.

By opening a pull request you agree to release your contribution under these
terms. Attribution is expected for reuse; adaptation and redistribution are not
restricted.

## The review bar

A pull request is merged when all four hold:

1. **Tests pass.** CI runs `npm test`. No exceptions, including for
   documentation-only changes to a module whose model.yaml changed.
2. **Verification is independent.** Any new check must be derived by a route the
   implementation does not use, and must say so in
   `model.yaml → verification[].independent_of`. A test that recomputes the
   implementation will be rejected even though it passes.
3. **The model declaration is honest.** Assumptions, validity limits and
   omissions are stated. New approximations are recorded.
4. **Physics and pedagogy approved by a human.** Currently Nithin. This is the
   step no automation replaces, and it covers two questions tests cannot:
   *is this the right model?* and *does the animation build the right picture?*

## Workflow

```
branch  →  implement  →  tests pass locally  →  PR
                                                 │
                                    CI + Netlify Deploy Preview
                                                 │
                                    review on the live preview
                                                 │
                                              merge
```

Deploy Previews are generated automatically for every PR. Review the physics on
the preview, not in the diff — an animation cannot be reviewed as source.

## Adding a concept

1. Write `model.yaml` first, including what is *not* modelled.
2. Implement in `src/physics/<concept>/` — no framework imports, no rendering.
3. Write the tests. Independent route. If you cannot find one, say so in the PR
   rather than writing a consistency check and calling it verification.
4. Build the island in `src/components/physics/`. No equations in this file.
5. Write the MDX page and render `<ModelPanel>`.

## On AI-assisted contributions

They are welcome, and most of this repository was produced that way. Two rules:

- Do not let the same pass generate both an implementation and the invariants
  that check it. Errors of interpretation then appear in both.
- "The model reviewed it and found no problems" is not evidence and should not
  appear in a PR description. Point at a passing independent test instead.
