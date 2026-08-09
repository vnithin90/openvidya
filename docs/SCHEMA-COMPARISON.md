# What the two prototypes revealed about the schema

The experiment: build two concept modules that are as structurally different as
possible, then see which parts of `model.yaml` survived both. Whatever survived
is probably architectural. Whatever appeared in only one was an accident of that
example.

| | Projectile motion | Electric field |
|---|---|---|
| Mathematical object | ODE, initial-value problem | field rule over a domain |
| What it answers | where is the particle at time *t* | what vector sits at point **r** |
| Independent variable | time | position |
| Has initial conditions | yes | **no** |
| Has time evolution | yes | **no** |
| Output | a trajectory (list of states) | a vector at every point |
| Implementation route | RK4 numerical integration | direct pointwise summation |
| Verification route | closed-form solution, conservation | Gauss's law, ∮E·dl, −∇V |
| Singularities | none | yes, at every charge |
| Superposition applies | no | yes, exactly |

## Keys that survived both — candidates for the general schema

- `concept`, `slug`, `category`
- `assumptions` — a flat list of prose statements. Worked unchanged for both.
- `governing_law` — but only after loosening it (see below).
- `implementation` — `{file, method, scheme, notes}`. Worked unchanged, and
  turned out to be load-bearing: you cannot judge whether a check is independent
  without knowing the route the implementation took.
- `verification[]` — `{name, method, independent_of, expected, tolerance}`.
  **The most valuable key in the schema.** `independent_of` is what makes the
  difference between a test and a restatement legible to a reviewer.
- `validity` — `{holds_when, breaks_when, not_modelled}`. Worked unchanged and
  is the part students see.
- `parameters` — survived in name only; see below.

## Keys that turned out to be projectile-specific

- **`state` + `initial_conditions`.** Meaningless for a field. There is nothing
  to initialise and nothing to evolve. Any schema that requires these has
  assumed the ODE case.
- **`governing_law.statement` as a single equation.** The field concept needed
  `equivalent_forms`, because Gauss's law (integral), ∇·E = ρ/ε₀ (differential),
  and E = −∇V are the *same physics* in forms that different verification
  strategies attack. The projectile case never needed this. A schema with one
  equation slot would have forced the electric field to lie.
- **`parameters` as a flat map of scalars with ranges.** Fine for v₀, θ, g.
  Wrong for a configuration of charges, where the parameters are a *variable
  length list of objects*, each with a vector position. The electric field
  needed `sources` and `presets` instead, and `parameters` degenerated into a
  container for presets.

## Keys the field concept forced into existence

- **`domain`** — region, dimensionality, and where the model is undefined. The
  projectile has no analogue; its "domain" is implicit in the initial conditions.
- **`sources`** — what produces the field, as distinct from the field itself.
- **`field_quantity`** — with `rank` (scalar/vector) and derived quantities
  related by stated identities (V, F). The projectile has no field quantity.
- **`pedagogical_notes.common_misconceptions`** — added here because field lines
  are genuinely misleading in ways a trajectory is not. Arguably belongs in the
  general schema; a third example would settle it.

## Provisional conclusion

There appear to be **two families**, not one schema:

```
             common core
  concept · assumptions · governing_law
  implementation · verification · validity
        /                        \
   evolution family          field family
   state                     domain
   initial_conditions        sources
   scalar parameters         field_quantity
                             representation notes
```

The honest position is that two examples show a core exists but not what the
families are. A third concept from a *third* category — a boundary-value
problem such as standing waves, or a statistical one such as diffusion — would
say whether "evolution vs field" is the real axis or whether that too is an
artefact of picking these two.

**Recommendation: do not write a schema validator yet.** Write the third
concept, keep `model.yaml` hand-written and slightly inconsistent, and only
formalise once a key has earned its place in three dissimilar examples.

## A note on the verification design

Both modules deliberately implement and verify by different routes:

| | implementation | verification |
|---|---|---|
| Projectile | RK4 integration of dr/dt = v, dv/dt = −gŷ | closed-form R, H, T; energy conservation; complementary-angle symmetry |
| Electric field | pointwise Σ kqᵢ(r−rᵢ)/\|r−rᵢ\|³ | numerical ∮E·dA vs Q/ε₀; ∮E·dl = 0; −∇V from separately summed V; far-field exponents |

This was checked by mutation testing rather than assumed. Deliberately breaking
each implementation — wrong exponent, flipped sign, 1% error in the Coulomb
constant, altered RK4 weights — produced test failures in every case. One mutant
(flipping the sign of gravity) originally caused an out-of-memory crash instead
of a clean failure, which exposed a real defect: `simulate` accumulated states
forever when the trajectory never returned to the ground. It now throws. That
guard exists because of the mutation test, not because anyone predicted it.

A test suite that has never been shown to fail is not evidence.
