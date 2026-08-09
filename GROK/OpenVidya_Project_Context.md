# OpenVidya — Project Architecture and AI Collaboration Context

## 1. Project idea

The goal is to build an **open, collaborative physics-education website** inspired by the idea of open educational documentation and interactive visualization.

The project should combine:

- Physics explanations
- Mathematical equations
- Interactive, physics-based animations
- Computational models
- Verification/tests
- Source code
- Student-facing documentation
- A workflow in which a co-creator can inspect, modify, improve, and publish content

The site is intended to be hosted on **Netlify**, with a Git repository as the canonical source of truth.

The important conceptual goal is not simply "AI-generated physics animations." It is to build something closer to an **open computational physics textbook**:

> physics explanation + interactive simulation + model assumptions + verification + source code.

---

# 2. Core collaboration principle

The central collaboration idea is:

> **The repository is the communication medium, not copy-pasted chat conversations.**

Claude and Grok should not be made to collaborate by copying outputs from one chat into another.

Instead:

```text
                    Git Repository
                         |
             +-----------+-----------+
             |                       |
          Claude                    Grok
             |                       |
       implementation          critique / ideas
       documentation           test suggestions
       refactoring              alternative views
             |                       |
             +-----------+-----------+
                         |
                    Git / PRs
                         |
                       Netlify
                         |
                  Deploy Preview
```

The repository provides shared, persistent context.

Both agents should work against the same project files and project rules.

---

# 3. Claude and Grok: roles

Do NOT permanently assign rigid roles such as:

- Claude = architecture
- Grok = visual design

Those assignments are speculative and may become obsolete as models change.

Instead, assign functions rather than model identities.

Either model may:

- implement
- refactor
- generate tests
- critique
- suggest alternatives
- improve documentation
- inspect architecture

The important distinction is between **implementation/idea generation** and **verification**.

A useful workflow is:

```text
You define physical model and educational intent
                    |
                    v
             Physics Contract
                    |
          +---------+---------+
          |                   |
          v                   v
      Claude/Grok        Claude/Grok
     implementation       critique
          |                   |
          +---------+---------+
                    |
                    v
              Automated tests
                    |
                    v
             Netlify Preview
                    |
                    v
             Human inspection
```

---

# 4. Three kinds of correctness

A central principle is that there are three distinct questions.

## 4.1 Physics correctness

**Is the chosen physical model correct and appropriate for the phenomenon being represented?**

This remains fundamentally a **human physics judgment**.

AI can assist, challenge, or suggest alternatives, but agreement between two LLMs is not evidence of physical correctness.

## 4.2 Implementation correctness

**Does the software actually implement the declared physical model?**

This is where automated tests are valuable.

Tests should establish whether the implementation satisfies its declared model/contract.

## 4.3 Pedagogical/visual correctness

**Does the animation communicate the intended physical concept without creating a misleading mental model?**

This also requires human judgment.

A simulation can be mathematically correct and still be pedagogically misleading.

---

# 5. Critical correction: LLM review is NOT verification

A second LLM reviewing code is not a reliable quality gate.

A review such as:

```text
✓ vx correctly remains constant
✓ assumptions are clear
⚠ acceleration vector could be improved
```

is an opinion, even if it is well formatted.

An LLM can produce a plausible review when the code is correct, incorrect, or subtly wrong.

Therefore:

> **LLMs should propose and inspect; executable tests should verify implementation behavior.**

Grok or Claude can be very useful as idea generators and critics, but should not be treated as the authority establishing correctness.

---

# 6. Avoid adversarial-review confabulation

A prompt such as:

> "Assume this animation is pedagogically wrong. Find how."

is not a sound verification strategy.

It forces the model to find something, whether or not something is actually wrong.

Better prompts are:

- "Identify cases the current tests do not cover."
- "Look for discrepancies between the documentation, model, implementation, and tests."
- "Suggest experiments that could falsify the current implementation."
- "Identify assumptions that are undocumented."
- "Find edge cases worth testing."
- "Suggest alternative pedagogical framings."

The LLM's role is to **surface questions and possible tests**, not to declare failure.

---

# 7. Physics contracts / model descriptions

Each simulation should have an explicit description of what it claims to represent.

However, do NOT prematurely freeze a general schema based on one example.

For now, call it something neutral such as:

`model.yaml`

rather than committing immediately to a universal "physics contract" schema.

The model description should eventually capture things such as:

- assumptions
- parameters
- governing equations
- domain
- initial conditions
- boundary conditions
- validity regime
- physical quantities
- expected relationships/invariants
- limitations

But the exact schema should be discovered empirically.

---

# 8. Do NOT derive everything from one YAML file

A major failure mode is:

```text
model.yaml
    |
    +----> implementation
    |
    +----> tests
    |
    +----> documentation
```

If Claude misinterprets the model, it can propagate the same mistake into the implementation, tests, and documentation.

Then everything agrees beautifully while being wrong.

Therefore:

> **Consistency is not correctness.**

The implementation and validation should have some degree of independence.

---

# 9. Independent verification

Tests become meaningful when the implementation and the test are derived through sufficiently independent routes.

For example, projectile motion:

### Weak test

Implementation uses:

```text
x(t) = v0 cos(theta) t
y(t) = v0 sin(theta) t - 1/2 g t²
```

and the test calculates range using:

```text
R = v0² sin(2theta) / g
```

If both were generated directly from the same contract in the same session, the test has limited independence.

It may only establish that the implementation agrees with the same model representation.

### Stronger test

Implementation:

- numerically integrates the equations of motion.

Independent validation:

- analytically calculates the expected range.

Then compare:

```text
numerical result ≈ analytical result
```

This can detect errors in the numerical implementation.

The principle is:

> **Whenever practical, verify an implementation through an independent consequence or formulation of the model rather than reproducing the implementation's own calculation.**

---

# 10. Tests verify implementation against the model; they do not validate the model itself

This distinction should be explicit.

Better principle:

> **Implementations are tested against their declared models; the models themselves require human physics judgment.**

Tests can establish:

- the numerical solver behaves as intended
- conservation laws are respected
- known limiting cases work
- numerical results agree with independent analytical results
- implementation invariants hold

Tests cannot, by themselves, establish:

- that the chosen physical model is the right model for reality
- that a simplification is pedagogically appropriate
- that a phenomenon has been represented in the best conceptual way

---

# 11. Examples of strong physics verification

Possible test classes include:

## Analytical cross-checks

Numerical implementation versus independently derived analytical solution.

## Limiting cases

For projectile motion:

```text
theta = 0°     -> range = 0
theta = 90°    -> range = 0
theta = 45°    -> maximum range
```

## Conservation laws

Where appropriate:

```text
Delta E ≈ 0
Delta p ≈ 0
```

## Symmetry

For ideal projectile motion:

```text
range(theta) ≈ range(90° - theta)
```

## Numerical convergence

For numerical models:

```text
smaller timestep -> solution approaches stable value
```

These tests have more evidential value than an LLM saying "the physics looks correct."

---

# 12. Convert useful review findings into executable knowledge

A review comment should not normally become a permanent review file.

For example, if Grok notices:

> "The projectile simulation is not tested at theta = 90°."

The durable artifact should be:

```text
tests/projectile.test.ts
```

with an actual test for that case.

The principle is:

> **Convert useful review observations into executable tests or explicit documentation.**

This allows knowledge to compound over time.

Reviews themselves become stale after refactoring.

PR comments are a better home for transient reviews.

---

# 13. Do not commit old AI reviews as permanent project artifacts

Avoid files such as:

```text
reviews/grok-review-2026-08-09.md
```

because after several refactors they become misleading.

Prefer:

- PR comments for transient reviews
- tests for durable verification
- documentation for durable decisions
- model descriptions for durable physical assumptions

---

# 14. The model schema must be tested against two dissimilar physics concepts

Do not design the universal schema from projectile motion alone.

Projectile motion is:

- particle
- trajectory
- ODE
- initial-value problem
- scalar/vector state evolving in time

A very different concept should be used as the second prototype.

A strong candidate is:

## Electric field of point charges

This is:

- a field over space
- vector-valued
- source-based
- governed by spatial relationships
- not a trajectory
- naturally demonstrates superposition

For example:

```text
E(r)
```

rather than a trajectory such as:

```text
x(t)
```

This forces the architecture to handle fundamentally different physical structures.

Another possible second concept is a standing wave, which introduces:

- boundary conditions
- spatial modes
- oscillatory fields
- potentially PDE/boundary-value reasoning

But electric field is particularly relevant because teaching fields as real physical entities is itself an important educational objective.

---

# 15. Recommended first two vertical slices

Build two complete, deliberately different examples before freezing the architecture.

## Prototype A — Projectile Motion

Category:

**dynamical system / ODE / particle trajectory**

Should include:

- explanation
- interactive animation
- model description
- numerical implementation
- independent analytical validation
- automated tests
- student-facing discussion of assumptions and validity

## Prototype B — Electric Field of Point Charges

Category:

**field / spatial vector quantity / source-based model**

Should include:

- explanation
- interactive field visualization
- source-charge manipulation
- model description
- independent checks
- automated tests where meaningful
- student-facing explanation of what the field represents
- explicit distinction between physical field and mathematical representation

Only after both exist should the general model schema be extracted.

---

# 16. Student-facing "model transparency" is a major project idea

One of the most interesting ideas is to expose the model itself to students.

Instead of only showing:

> Projectile Motion Simulation

show:

## Assumptions

- uniform gravitational field
- air resistance neglected
- object treated as a point particle

## Model

```text
a = g
```

## What makes this model valid?

Explain the physical regime in which the assumptions are reasonable.

## Verification

Show that the implementation agrees with an independent analytical result within a stated tolerance.

## Limitations

Explain where the model breaks down.

This teaches something deeper:

> **A physical model is a deliberately constrained representation of reality, not reality itself.**

This model-transparency principle may become one of OpenVidya's distinctive features.

---

# 17. Short project philosophy

Create:

`OPENVIDYA_PHILOSOPHY.md`

Keep it short, approximately one page.

Possible principles:

1. Physics before decoration.
2. An animation must represent a physical model, not merely resemble one.
3. Assumptions must be explicit.
4. Interactive parameters should have physical meaning.
5. Simplifications are acceptable when their validity is stated.
6. Implementations are tested against their declared models.
7. The models themselves require human physics judgment.
8. Pedagogical quality requires human judgment.
9. Source code is part of the educational artifact.
10. Useful review discoveries should become tests or durable documentation.
11. Reproducibility and traceability matter.
12. AI assists reasoning and implementation; it does not become the final physics authority.

---

# 18. Repository architecture

A likely eventual structure:

```text
openvidya/
│
├── CLAUDE.md
├── AGENTS.md
├── OPENVIDYA_PHILOSOPHY.md
├── CONTRIBUTING.md
│
├── src/
│   ├── content/
│   │   ├── mechanics/
│   │   │   └── projectile-motion/
│   │   │       ├── index.mdx
│   │   │       ├── model.yaml
│   │   │       └── ...
│   │   │
│   │   └── fields/
│   │       └── electric-field/
│   │           ├── index.mdx
│   │           ├── model.yaml
│   │           └── ...
│   │
│   ├── components/
│   │   ├── physics/
│   │   │   ├── ProjectileSimulation.tsx
│   │   │   └── ElectricFieldSimulation.tsx
│   │   └── ui/
│   │
│   └── layouts/
│
├── tests/
│   ├── projectile/
│   └── electric-field/
│
└── public/
```

This is provisional. Do not freeze it until the two vertical slices reveal what is genuinely reusable.

---

# 19. Claude/Grok instruction files

Claude Code reads `CLAUDE.md` by default.

A shared `AGENTS.md` can be useful as a cross-agent convention, but do not assume every agent automatically reads it.

Therefore:

> Each agent's native instruction mechanism should explicitly reference the shared project philosophy and rules.

For example, Claude's instructions can point to:

```text
OPENVIDYA_PHILOSOPHY.md
```

and the relevant project/domain rules.

The goal is that Claude and Grok operate under the same conceptual framework even if their instruction mechanisms differ.

---

# 20. GitHub + Netlify collaboration

GitHub should be the canonical source of truth.

A typical workflow:

```text
You define/change physics requirement
        |
        v
Feature branch
        |
        +---- Claude/Grok implementation
        |
        +---- tests
        |
        +---- documentation
        |
        v
GitHub Pull Request
        |
        +---- AI suggestions
        +---- automated tests
        |
        v
Netlify Deploy Preview
        |
        v
Human review
        |
        v
Merge
        |
        v
Production site
```

Netlify is the publishing and preview layer, not the source of truth.

---

# 21. Recommended technology stack

The current recommendation for the two prototypes is:

## Astro + MDX

with:

- React components/islands for interactive simulations
- TypeScript
- KaTeX for mathematics
- GitHub
- Netlify

The reasoning:

The project is fundamentally **documentation + interactive physics**, rather than an application with documentation attached.

An MDX page can look conceptually like:

```mdx
# Projectile Motion

The horizontal and vertical motions...

<ProjectileSimulation />

## What do we observe?

The horizontal velocity remains constant...

\[
x(t)=...
\]

<VelocityGraph />

## Test the model

Try changing the launch angle...
```

The document remains primarily a document, while React components provide the interactive elements.

---

# 22. Why not the other options?

## Vanilla ES modules, no build

Advantages:

- extremely simple
- minimal runtime
- excellent for a single standalone simulation

Problem:

The long-term project is not one simulation. It is a large documentation system with many concepts, reusable components, mathematical content, navigation, search, and collaboration.

Vanilla modules are attractive for individual demos but less suitable as the overall OpenVidya architecture.

## Vite + React

Very strong alternative.

Would be appropriate if the project were primarily:

> an interactive physics application with documentation.

But the intended project is closer to:

> documentation with embedded interactive physics.

Therefore Astro + MDX is the current preference.

---

# 23. Important implementation principle: don't make everything React

With Astro, use React where interactivity requires it.

Conceptually:

```text
Astro page
│
├── MDX explanation
├── KaTeX equations
├── figure
├── React ProjectileSimulation
├── explanatory text
├── React TrajectoryGraph
└── questions
```

This keeps ordinary documentation lightweight while allowing sophisticated simulations where needed.

---

# 24. Proposed overall architecture

The current thinking can be summarized as:

```text
                    PHYSICAL PHENOMENON
                            |
                            v
                 Human chooses physical model
                            |
                            v
                       model.yaml
                            |
              +-------------+-------------+
              |                           |
              v                           v
       Implementation             Independent validation
              |                           |
              |                           |
              +-------------+-------------+
                            |
                            v
                     Automated tests
                            |
                            v
                      Visualization
                            |
                            v
                   Human pedagogy review
                            |
                            v
                      Documentation
                            |
                            v
                    GitHub / Pull Request
                            |
                            v
                      Netlify Preview
                            |
                            v
                         Publish
```

AI agents can operate at almost every stage, but:

- **Human** = final authority on physical model and pedagogy
- **AI** = implementation, exploration, critique, test suggestions
- **Tests** = evidence about implementation behavior
- **Git** = shared memory and collaboration medium
- **Netlify** = preview/deployment infrastructure

---

# 25. The key philosophical statement

The strongest current formulation is:

> **Humans define the physical model and educational intent; AI agents implement and challenge it; independent tests establish whether implementations satisfy their declared models; humans judge whether the models and visualizations are physically and pedagogically appropriate; Git records the resulting knowledge.**

This is preferable to:

> "Claude builds and Grok reviews."

The latter makes a second LLM the apparent quality mechanism. The former separates **reasoning assistance, verification, and authority**.

---

# 26. Immediate next step

Do not build the entire OpenVidya platform yet.

Build exactly two vertical slices:

### 1. Projectile Motion
Particle trajectory / ODE / initial-value problem.

### 2. Electric Field of Point Charges
Spatial vector field / source-based model.

For each, implement:

```text
documentation
+
interactive animation
+
model description
+
implementation
+
independent verification
+
automated tests
+
student-facing assumptions
+
student-facing validity/limitations
+
source code
```

Then compare the two implementations.

Ask:

> Which concepts are genuinely common?

> Which fields in `model.yaml` survived both?

> Which were accidental consequences of projectile motion?

Only then design the reusable schema and broader OpenVidya architecture.

---

# 27. One-sentence project definition

**OpenVidya is an open computational physics learning environment in which physical models, interactive simulations, documentation, verification, assumptions, limitations, and source code are presented together and remain editable, reproducible, and collaboratively improvable.**
