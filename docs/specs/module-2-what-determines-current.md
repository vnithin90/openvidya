# Module 2 — What determines the current?

**Build-ready specification.** Follows Module 1 (`I = ΔQ/Δt`) and the scene
review that deferred `I = nqAv_d` here.

## Objective

> Show that the current in a uniform conductor model is set by **four factors**
> together — carrier density, charge per carrier, cross-sectional area, and drift
> speed — and that **drift speed is one factor among several**, not the whole
> story.

## Single testable question

> Can a student explain how two wires can carry the **same current** with
> **different** drift speeds (or different areas / densities), and estimate a
> drift speed order of magnitude once `n`, `q`, `A`, and `I` are given?

## Explicitly out of scope

- Microscopic random motion / thermal speeds (Module 3)
- Fermi velocity, band structure, quantum justification of the free-electron model
- Where the electric field comes from; circuit topology; Kirchhoff
- Whether current is “consumed”; energy and power
- Electrical hazard
- Time-varying / AC currents
- Non-uniform cross-sections, contact resistance

## Representation principle (load-bearing)

> **Aggregate first.** Prefer density bars, cross-section width, and a single
> labelled “net drift” indicator over swarms of gliding dots.
>
> Individual carriers crawling along a wire install “electrons slowly march to
> the bulb.” That is Module 3’s repair job. Module 2 must not make it worse than
> necessary.

Conceptual debt is still declared on the page: the classical drift picture is a
model; thermal motion is deferred to Module 3.

## Governing model

Steady free-electron (or single-carrier) model in a uniform wire:

$$
I = n\, q\, A\, v_d
$$

| Symbol | Meaning | SI unit |
|--------|---------|---------|
| \(I\) | current | A |
| \(n\) | number density of mobile carriers | m⁻³ |
| \(q\) | charge per carrier (often \(e\)) | C |
| \(A\) | cross-sectional area | m² |
| \(v_d\) | drift speed (net advance along the wire) | m/s |

Assumptions (must appear in `model.yaml` and on the page):

- Uniform \(n\), \(A\), \(v_d\) along the segment considered
- One carrier species with charge \(q\)
- Steady state: same \(I\) through every cross-section
- \(v_d\) is the **net** drift of the carrier population, not a thermal speed

## Scenes

### Scene 1 · Four factors

Student varies one factor at a time (others fixed). Live product \(I = nqAv_d\).

| Must show | Must not show |
|-----------|----------------|
| All four factors named with units | Dots racing when only \(v_d\) rises as the *only* visual |
| \(I\) updates from the product | “Speed is all that matters” |
| “Double this → double I” for each factor | Circuit symbols, battery, bulb |

### Scene 2 · Same current, different mixes

Two side-by-side configurations. Goal: reach the **same target \(I\)** with
**different** \((n, A, v_d)\) ( \(q\) fixed at \(e\) ).

| Must show | Must not show |
|-----------|----------------|
| Target current and both live \(I\) values | A single “speed” slider as the only difference |
| Explicit statement: same \(I\), different \(v_d\) is possible | Implication that higher \(I\) always means faster electrons |

### Scene 3 · How small is drift speed?

Given typical \(I\), \(A\), and a **declared model** \(n\) for copper, compute

$$
v_d = \frac{I}{n q A}
$$

| Must show | Must not show |
|-----------|----------------|
| \(n\) labelled as model-dependent / table value | Pretending \(n\) is measured by this page |
| \(v_d\) often mm/s or slower for household currents | “Electrons race at light speed in the wire” |
| Link back: large \(I\) can come from large \(nA\), not large \(v_d\) | Fermi speed as if it were drift speed |

## Verification (machine-checkable)

| Claim | Independent route |
|-------|-------------------|
| Product form | Recompute \(I\) as \(((n\cdot q)\cdot A)\cdot v_d\) vs nested product |
| Proportionality | Double each factor alone → \(I\) doubles |
| Inverse for drift | \(v_d = I/(nqA)\) then re-product recovers \(I\) |
| Flux meaning | Charge through area \(A\) in time \(\Delta t\): \(\Delta Q = I\Delta t = nqA v_d \Delta t\) |
| Copper order-of-magnitude | With declared \(n\), \(I=1\,\mathrm{A}\), \(A=1\,\mathrm{mm}^2\), \(v_d\) in a stated band |

## Empirical / model values

| Quantity | Type | Notes |
|----------|------|-------|
| \(e\) | exact-by-definition | Same as Module 1 |
| \(n_{\mathrm{Cu}}\) (mobile e⁻) | model-dependent table value | ⚠ must be cited before publication; order \(10^{28}\,\mathrm{m}^{-3}\) |
| Demo \(I\), \(A\) | pedagogical choices | Stated as examples, not measurements |

## Link from Module 1

Module 1: current **is** the rate \(\Delta Q/\Delta t\).
Module 2: in this conductor model, that rate **equals** \(nqAv_d\).

Do not re-teach “what current means.” One short bridge sentence is enough.

## Conceptual debt (on-page)

1. Smooth “net drift” is not the full microscopic story → Module 3.
2. \(n\) for a real metal is not measured in this lesson; it is an input to the model.
3. Carrier picture is classical / free-electron-like.
