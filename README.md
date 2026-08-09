# OpenVidya — prototype slices

Interactive physics documentation where the model, the implementation, the
verification and the limits of validity are all part of the material a student
reads.

This repository currently contains **two concept modules**, chosen to be
structurally as different as possible. They exist to answer one question before
any general architecture is committed to: *what does a physics concept module
actually need to declare?* See [`docs/SCHEMA-COMPARISON.md`](docs/SCHEMA-COMPARISON.md)
for the answer so far.

## Run it

```bash
npm install
npm test        # 48 physics verification tests
npm run dev     # http://localhost:4321
npm run build   # static output in dist/
```

## Layout

```
src/
  physics/                    the models. no framework imports, no rendering.
    projectile/model.ts         RK4 integration of the equations of motion
    electric-field/model.ts     pointwise Coulomb superposition
  content/<area>/<concept>/model.yaml
                              assumptions, governing law, verification, validity
  components/
    physics/*.tsx               React islands. visualization only, no equations.
    ui/ModelPanel.astro         renders model.yaml as student-facing content
  pages/*.mdx                   the explanations
tests/                        verification, independent of the implementations
docs/SCHEMA-COMPARISON.md     what the two prototypes taught us
```

The separation between `src/physics/` and `src/components/` is the load-bearing
decision. A co-creator can rewrite an animation without touching physics, and
change a model without touching pixels.

## The verification principle

A test that recomputes what the implementation already computed proves only that
the code agrees with itself. Every check here is derived by a **different route**:

| | implemented by | verified by |
|---|---|---|
| Projectile motion | numerical integration (RK4) | closed-form solution, energy conservation, symmetry |
| Electric field | pointwise Coulomb sum | Gauss's law surface integral, ∮E·dl = 0, E = −∇V |

The suite has been mutation-tested: deliberately breaking each implementation
(wrong exponent, flipped sign, 1% error in the Coulomb constant, altered RK4
weights) makes tests fail. One such mutant exposed a real defect, now fixed and
guarded by a regression test.

**What tests cannot establish:** whether the chosen model is the right physics
for a situation, and whether the animation builds the correct mental picture.
Those are human judgments and the project says so openly.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the review bar and
[`AGENTS.md`](AGENTS.md) for the rules AI agents work under.
[`OPENVIDYA_PHILOSOPHY.md`](OPENVIDYA_PHILOSOPHY.md) is the one-page statement of
intent.

Code MIT · content CC BY 4.0.
