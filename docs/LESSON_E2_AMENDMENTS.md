# E2 — proposed amendments to the frozen specification

**Target:** `LESSON_E2_what-decides-the-push.md` — *frozen, in physics-authority review.*
**This document does not edit that file.** A frozen specification under review is
amended by logged proposal, reviewed, and only then merged. Section references
below are to the frozen document as it stands.

**Status of each amendment:** `proposed`, except where a ruling is recorded in the
Authority rulings section below.

---

## Authority rulings

| Q | Ruling | Date |
|---|---|---|
| **1 · A1 apparatus** | **ACCEPTED, option (a).** Successive halving replaces single halving. Target **k = 3**, with the **k = 1 reading kept as the anchor** because it is the only point free of transfer-residual bias. Apparatus: **8 identical conducting spheres** (2 hanging + 6 spares). *Electroscope removed by the Q3 ruling.* | 2026-08-10 |
| **2 · small-angle limit** | **ACCEPTED, option (a).** Lesson keeps the small-angle predictions (0.500 / 0.630 / 0.707). Validity enforced as an auditable ruler check: **initial separation r₀ ≤ 0.68 × thread length** (θ ≤ 20°). Exact relation recorded in the model spec as source of truth; the lesson carries the derived approximation with its stated condition. | 2026-08-10 |
| **3 · residual charge** | **ACCEPTED, option (a).** Spare spheres are accepted by a **null test against the apparatus itself**: before charging, bring each spare to a specified distance from the hanging pair and require no visible change in separation. Self-calibrating (the threshold is the apparatus resolution), needs no extra equipment, and is **exponent-independent** — zero force is zero under any power law — so it satisfies C1 by construction. **No electroscope required.** Breaking point computed at s = 4.0%% of the initial charge; the document’s earlier “worthless by k=6” alarm was calibrated to a sequence length not chosen. | 2026-08-10 |
| **4 · A5 equal mass** | **ACCEPTED, option (b).** A5 confirmed: §7 and §4 must specify identical **balls**, not merely identical threads, with the static mechanism written out (tan θ = F/mg, not F = ma). **Plus the product test as a second observation:** (0.5q, 0.5q) and (1.0q, 0.25q) share a product and must give the same separation, 0.630. This measures the symmetry of the force law, which §8 currently only asserts. Unequal charges are produced by the same halving instrument; cost 4 of the 6 spares. | 2026-08-10 |
| **5 · B2 Newton III** | **ACCEPTED, option (a).** Assume the cohort knows the third law **formally but not operationally** — they can state it and will still predict that the bigger charge pushes harder. §4 P2 keeps its locked prediction and the resolution names the gap explicitly: *you know this law, and you did not apply it here.* Neither application nor discovery. **B2 CLOSED.** Two §15 additions follow: hanging balls matched to **within 5%% by mass** (a 5%% mismatch gives 0.9° of spurious deflection difference at 20°, below visibility; 20%% gives 3.1°, visible), and a validity note that the third law is exact for charges **at rest** — for moving charges momentum is carried by the field, so the lesson must not claim it always holds. | 2026-08-10 |
| **6 · equal division** | **ACCEPTED, option (c).** Option (a) — establish it inside E2 — was **retracted before ruling as impossible**: with contact leaving fraction f on the primary, r_k/r₀ = f^(2k/(n+1)) gives one equation in two unknowns, so (f=0.63, n=1), (f=0.50, n=2) and (f=0.40, n=3) fit identical data exactly. Equal division is degenerate with the exponent. Ruling: **add `P-conduction` to the question map as a provisional node with three declared dependents — E2, E4 and C1** — and let E2 carry a two-minute in-lesson demonstration (charged metal sphere collapses fully on finger contact; rubbed balloon does not) as an interim, with equal division following by symmetry argument. E2 is not blocked; the debt is recorded. | 2026-08-10 |
| **7 · sphere specification** | **ACCEPTED, option (a).** The question as originally posed (spares vs discharge) was already settled by Q1 and Q3; it was replaced by the live one. Ruling: **20 mm coated conducting balls on 30 cm threads**, giving r₀ = 20 cm and r₃ = 5 cm, so r₃/a = 5. Balls weighed and matched to 5%. **New systematic recorded:** two like-charged conductors push each other's charge to the far side, so the real force is weaker than the point-charge value. **Coefficient since verified from first principles** — see the finite-sphere section. Contributes −2.7% of the square–cube gap at k=3, biasing toward the *shallower* law, opposite to the small-angle and stray-charge biases. | 2026-08-10 |

**Consequential correction, required by the ruling and independent of it:** §5 says
*"touch **one** charged ball to an identical uncharged ball."* §6's mathematics
requires **both** hanging balls to be halved — separation depends on the product
q₁q₂, and halving only one gives a square–cube gap of 4.7 points instead of 7.7,
a 39% loss. §5's wording is wrong and §6's numbers are right. Each halving round
therefore needs **two** fresh spares, one per hanging ball; re-using the first
spare gives 0.75q, not 0.5q.

---

## Amendment log

Recorded in the charter's format: the change, and the reasoning without which it
cannot be re-examined.

| ID | Change | Why |
|---|---|---|
| **A1** | **§5–6: distance dependence comes from successive charge halvings, not from sampling separations.** Adds the auxiliary-sphere requirement and a third silent failure mode. | The apparatus does not permit separation to be chosen. Equilibrium separation is a *readout* fixed by charge, mass and thread length. Any design that samples r is describing an experiment that cannot be performed. |
| **A2** | **§4: "double both charges" promoted to a locked prediction — explicitly framed as a counterfactual resolved by reasoning, not by measurement.** | It is the strongest proportional-reasoning trap available and it currently sits inert in the explanation. It cannot be measured on this apparatus, and a prediction the student believes they tested reinstalls the dial-the-parameters model A1 removes. |
| **A3** | **§17 decision 4 closed: simulation permitted after J1 only, under three guards.** | Simulation is not banned, it is positional. Placed after the judgment it explains the limit the student hit; placed before, it supplies the evidence and destroys J1. |
| **A4** | **New closing section: the boundary to E3.** Promote to a template field. | E1 ends by naming what it did not establish, and the site's ledger screen depends on it. E2 has no equivalent, so the template is inconsistent after two lessons. |
| **A5** | **§7 J2: the two balls must be identical in mass, not merely hung on identical threads.** | Equal forces produce equal deflections only for equal masses. §4's "one ball carries much more charge than the other" invites a teacher to improvise with unequal spheres, and the apparatus then appears to disprove Newton's third law. |
| **C1** | **Charter: one principle, two instances — evidence must be obtained by a route that does not assume the conclusion being tested.** | The pedagogical rule and the independent-verification rule are the same rule. Stating it once, with both instances, removes a duplication that has already drifted. |

## B3 · The apparatus has never been built — E2's quantitative arm is UNVALIDATED

**Status: BLOCKER. Raised after seven authority rulings had already been issued.**

Everything quantitative in this document — the 63%/71% discrimination, the 2^(k/6)
gain, the 4.0% stray-charge breaking point, the −2.7% finite-sphere correction, the
13.4% error budget — is **derived from the model E2 exists to test.** No hanging pair
has been assembled, charged, or measured.

Charter C1 says evidence must arrive by a route that does not assume the conclusion
being tested. Applied to the apparatus rather than to the code, the current position
fails it: the case that E2 is measurable rests entirely on Coulomb's law being true
and the equilibrium model being adequate.

### What the ruling apparatus demands, computed

Ruled configuration: 20 mm balls, L = 30 cm, r₀ = 20 cm, giving θ₀ = 19.5°.

| ball mass | charge on **each** ball for r₀ = 20 cm | after 3 halvings |
|---|---|---|
| 0.05 g | 27.8 nC | 3.5 nC |
| 0.10 g | 39.3 nC | 4.9 nC |
| 0.20 g | 55.6 nC | 6.9 nC |
| 0.50 g | 87.9 nC | 11.0 nC |

Tens of nanocoulombs from a rubbed rod is plausible but not comfortable, and the
lesson currently asserts the procedure works without any measurement behind it.

### The question that is pass/fail rather than a tolerance

Pendulum period at L = 30 cm is **T = 1.10 s**, and a light ball in still air is
badly underdamped. Twenty swings to settle within 2 mm is ≈ 22 s per reading, four
readings, with charge leaking throughout.

> **Is the settling time shorter than the leakage time?**

If they are comparable there is no experiment, and no amount of care in the write-up
recovers it. Every other prototype question is a number to characterise. This one
decides whether E2's measurement arm exists.

### Prototype protocol, before E2 is used with students

1. **Settling** — time from release to a stable reading within 2 mm. Repeat ten times.
2. **Leakage** — r(t) on a charged pair, undisturbed, for five minutes.
3. **Compare 1 and 2.** If settling is not comfortably shorter, stop and redesign.
4. Achievable charge from the rod-and-wool procedure, inferred from r₀.
5. Repeatability of r₀ across ten independent charging attempts.
6. Whether three halvings are reachable before the reading becomes untrustworthy.
7. Measured r₀, r₁, r₂, r₃ against 1.000 / 0.630 / 0.397 / 0.250.
8. Draft sensitivity — with and without an enclosure.
9. Humidity dependence across two or three days.
10. **Then, and only then:** does the achieved uncertainty distinguish the exponents?

Item 10 is the one the whole lesson turns on. If the answer is no, that is not a
failure of E2 — it is J1 being *true*, and the lesson should say so from measured
evidence rather than from a model.

### What this changes now

The seven rulings stand as **design decisions**, not as validated facts. The error
budget is a **prediction to be tested**, not a result. The site now says so on its
entry screen, in the student's own words, rather than presenting a procedure whose
feasibility nobody has checked.

---

## A6 · Template §B — performability of every described action

*Raised after E2 broke the same rule twice and no field in the template would have
caught either. Adopted as a standing obligation on all lessons, not an E2 fix.*

> **For every screen that describes a physical action, the lesson must state either
> that the student can perform it now, or when it becomes performable and why it is
> being withheld.**

**The two E2 instances.** Screen 2 was headed *"Charge both balls"* with the charging
method 1,241 words later on screen 7. Screen 4 said *"Hang them both and look at the
two threads"*, needing the halving method from screen 7 and the test itself on
screen 13.

**Both were repaired by changing mood, not order — and that is the general shape.**
Moving either method earlier would have handed over the halving instrument before the
lesson discovers it, spoiling the central experimental idea to make a prediction
legible. The default repair is to say plainly: not yet, here is when, here is why we
are not telling you how now.

**When it bites.** When the apparatus needs *technique* rather than *common action*.
E1 passes without effort — *"rub two balloons on your hair"* is its own method, and
the screen immediately adds *"Before you touch anything: what do you expect?"*. E2
fails twice because charging, halving and spare-verification are all technique. Any
lesson whose apparatus needs technique should expect to fail this on a first draft.

**Declared, not inferred.** Each lesson carries a `BENCH_ACTIONS` map — `none` /
`performable` / `deferred` per screen — and the check verifies completeness and that
every `deferred` screen names when and why. An imperative-detector was tried and
rejected: it flagged E1's *"**Charge** can be moved from one object to another"*,
which is a noun. A declaration can be wrong, but it is wrong visibly.

Written up in **`LESSON_TEMPLATE.md` §B**, which also records the template's other
seventeen fields — previously carried only implicitly in E1 and E2, where a third
lesson would have diverged from them silently.

---

**B2 is CLOSED** by ruling 5. **B3 is OPEN and blocking student use.**
**B1 is CLOSED** by the sourcing record below — and
sourcing it falsified the claim §8a was making.

## B1 · Coulomb's torsion balance — sourced, and §8a's claim withdrawn

### What §8a claimed

> *"That was exactly Coulomb's problem, and he did not solve it by measuring more
> carefully with the same equipment. He built a torsion balance… When your apparatus
> cannot answer the question, the answer is sometimes a better apparatus, not a
> better guess."*

**Two parts of that are false and the third is contested.** The claim is withdrawn.

### 1 · The torsion balance did not come from an electrical measurement problem

Coulomb's 1777 Academy prize memoir on the **magnetic compass** already contained an
early description of the torsion balance, and his 1784 memoir *Recherches théoriques
et expérimentales sur la force de torsion et sur l'élasticité des fils de métal*
established the underlying physics — restoring torque proportional to the twist
angle, to the fourth power of the wire diameter, and inversely to its length.

The instrument existed, and its calibration law was known, **before** it was pointed
at electricity. Coulomb did not build it because electrostatics had defeated him. He
had an instrument for small forces and applied it. *(Michell had used a similar
device for gravity earlier still.)*

### 2 · The inverse-square law was already argued, and already measured better, by a different route

- **Priestley, 1767.** Repeated Franklin's observation that corks inside a highly electrified metal vessel are neither attracted nor repelled. Recognising Newton's shell theorem — no gravitational force inside a hollow sphere — he inferred that the electrical law must likewise be inverse-square.
- **Cavendish, c. 1773.** Turned that into a measurement, and concluded the exponent **could not differ from 2 by more than about 1/50**. Unpublished; edited and published by Maxwell in 1879.

**Cavendish had the exponent to ±0.02 twelve years before Coulomb's memoir, by a
null experiment** — and a null test is what E2's own students use to accept their
spare spheres.

### 3 · Coulomb published three measurements, and whether he measured them is disputed

The 1785 *Premier Mémoire* reports, in print, **only three trials**:

| trial | micrometer torsion | separation |
|---|---|---|
| 1 | 0° | 36° |
| 2 | 126° | 18° |
| 3 | 567° | 8.5° |

Coulomb's own argument: total torsion 36 → 144 → 576, quadrupling as the separation
halves, and in the third trial *"it only requires one half a degree more"* for exact
agreement.

**Peter Heering (1992)** replicated the apparatus and argued *"Coulomb did not get
the data he published in his memoir by measurement"*; in replication the moving ball
wandered irregularly by two or three degrees every ten seconds or so.
**Alberto Martínez (2006)**, *Archive for History of Exact Sciences* 60: 517–563,
replicated it again and argued the opposite — that the 1785 report is an accurate
description of what Coulomb did. **The dispute is live.**

### What §8a should say instead — and it is better

The student has just concluded that their halving sequence cannot separate 1/r² from
1/r³. The honest history is not *"a great man built a better instrument."* It is:

> **A null experiment beat the direct measurement by a wide margin, and you have
> already used one without noticing.**

Cavendish bounded the exponent to 2 ± 0.02 by asking a question whose answer was
*nothing happens*. E2's students bounded a spare sphere's stray charge the same way,
and computed that holding it in the wrong place destroys the test. Meanwhile the
direct force measurement — Coulomb's and the students' alike — is delicate, disputed
and far less sharp.

And the three published trials are worth showing a student who has just been told
their own data is inconclusive: **that is what data looks like when it agrees with
its conclusion almost exactly, and historians have spent thirty years arguing about
whether to believe it.**

### Sources

| claim | source |
|---|---|
| 1785 *Premier Mémoire*, the three trials, Heering's challenge, Martínez's rebuttal | Martínez, A. A., *Replication of Coulomb's Torsion Balance Experiment*, Arch. Hist. Exact Sci. **60** (2006) 517–563, DOI 10.1007/s00407-006-0113-9 |
| Coulomb's memoirs, primary text | *Mémoires sur l'électricité et le magnétisme*, Internet Archive / Smithsonian Libraries digitisation |
| 1784 torsion memoir; 1777 compass prize; torsion balance origin | Chemistry World, *Coulomb's torsion balance*; Scientific Instrument Society |
| Priestley 1767 inference from Franklin's cork experiment | Priestley, *The History and Present State of Electricity* (1767) |
| Cavendish's 1/50 bound; Maxwell's 1879 edition | Maxwell & MacAlister's refinement of Cavendish's null experiment, standard history-of-physics accounts |

⚠ **Remaining sourcing debt, logged not hidden:** the Priestley and Cavendish entries
rest on secondary accounts. E1's Franklin quotation was taken to the primary text
(Founders Online). Before E2's history screen ships, **Cavendish's 1/50 figure should
be traced to Maxwell's 1879 edition of the *Electrical Researches*, and Priestley's
inference to the 1767 text.** Neither claim is doubted; the standard is provenance,
not plausibility.

## The null test — what it actually bounds

*Added after review. The earlier budget used s ≤ 1% as though the Q3 null test had
established it. It had not: a null test bounds a **force**, and converting that to a
**charge fraction** requires the test geometry, which nobody had specified. The
number was asserted. This is the derivation.*

For the hanging pair at separation r₀, small angles, threads from a common point:

```
balance:        mg(θ₁+θ₂) = 2F_c + ΔF      and      r = L(θ₁+θ₂)
                mg·r³/L   = 2kq₀² + ΔF·r²
unperturbed:    mg·r₀³/L  = 2kq₀²
linearise r = r₀(1+ε):

                ε = ΔF / (6 F_c)
```

**Placement is not a detail.** The spare acts on **both** hanging balls, and only the
*difference* changes the separation. Specified position: on the **extension of the
line joining the two ball centres, outside the pair, at distance d from the nearer
ball** — so it is d + r₀ from the far one:

```
ΔF_eff / F_c  =  (s/q₀) · [ (r₀/d)² − (r₀/(d+r₀))² ]

      s/q₀  <  6 · ε_min / [ (r₀/d)² − (r₀/(d+r₀))² ]
```

*An earlier draft said "in the plane of the pair" and used (r₀/d)² alone. Both were
wrong — the second by 4.2% at d = 5 cm and 33% at d = 20 cm, and the first far
more seriously (below).*

| test distance d | ε_min = 1 mm | ε_min = 2 mm | eyeballed, 1 cm |
|---|---|---|---|
| **5 cm** | 0.20% | **0.39%** | 1.95% |
| 10 cm | 0.84% | 1.69% | 8.44% |
| 20 cm (= r₀) | 4.00% | 8.00% | 40.00% |

**The bound goes as roughly d². Where you hold the spare dominates everything else.**
At d = r₀ the test is worthless. At d = 5 cm with a 2 mm threshold it bounds
s < 0.39%. And d = 5 cm is the smallest distance the Q7 sphere-size constraint
permits (r/a = 5), so the two constraints meet exactly with no slack.

### Why "in the plane of the pair" was a silent failure in the acceptance test

Held **perpendicular** to the centre line, the spare's force on the near ball is
perpendicular to the separation axis. The separation then changes only at second
order — the pair swings bodily instead. **Sensitivity goes to zero, and a tester
holding the spare there passes every sphere however charged.**

The acceptance test would fail silently, and its failure would then silently
corrupt the measurement it exists to protect. Two `silent-plausible` failures in
series, introduced by four unspecified words.

### Protocol

1. Charge the pair, record r₀.
2. Place the spare **on the extension of the centre line, outside the pair, 5 cm from the nearer ball.**
3. Record the separation **before, during and after** insertion.
4. Reject the spare if the separation changes by more than **2 mm** while it is present.

Step 3's in-and-out comparison does not make the test insensitive to leakage in any
absolute sense. It **distinguishes a reversible change caused by the spare's presence
from the slow baseline drift running throughout**; the quantity of interest is the
reversible part.

### Status of this channel: conditionally closed

The null test does **not** establish that s < 0.39% as a measured fact. It
establishes an **apparatus-based acceptance criterion**, valid provided the ruler
resolves 2 mm, the spare sits at d = 5 cm, it sits on the specified line, and the
in/out protocol is followed.

That is the more honest claim, and the better one: the experiment never needs to
know any spare's residual charge numerically. It only needs to know whether that
residual is small enough **for this apparatus** — which is a question the apparatus
can answer about itself.

## The finite-sphere correction — coefficient verified, direction settled

*The 2.4% in ruling 7 was a dimensional estimate with an unverified coefficient,
correctly flagged in review as the kind of number C1 forbids taking on trust. It has
now been computed. Review also challenged the **direction**; that has been settled
numerically, and the original direction stands.*

### The coefficient, from images rather than from a manual

Built the Maxwell image series for two spheres of radius a at centre separation R
held at equal potential (hence equal charge), summed the force between the image
sets, and extracted the correction. No quoted coefficient was used as input:

| a/R | F_exact / (Q²/R²) | 1 − 4(a/R)³ | implied coefficient |
|---|---|---|---|
| 0.02 | 0.999968 | 0.999968 | 4.002 |
| 0.05 | 0.999498 | 0.999500 | 4.013 |
| 0.10 | 0.995954 | 0.996000 | 4.046 |
| **0.20** | **0.966998** | 0.968000 | 4.125 |

```
B(a,R)  =  1 − 4(a/R)³ + …          confirmed, coefficient → 4 as a/R → 0
```

At the operating point a/R₃ = 0.2 the higher terms are already worth 0.1% of the
force, so what belongs in the model spec is the **exact image-series calculation**, not the
leading asymptotic term. The two are different objects and the spec must name them
as such: `1 − 4(a/R)³ + …` is the **asymptotic expansion**; the image series
(converged, see provenance) is the **exact calculation**.

### Propagated through the actual sequence

Equilibrium solved self-consistently at each charge state for a **true inverse-square
law with real conducting spheres**, a = 10 mm, r₀ = 200 mm:

| k | q/q₀ | point-charge r_k/r₀ | finite-sphere r_k/r₀ | shift | % of square–cube gap |
|---|---|---|---|---|---|
| 1 | 0.500 | 0.6300 | 0.6296 | −0.0003 | **−0.4%** |
| 2 | 0.250 | 0.3969 | 0.3958 | −0.0010 | **−1.0%** |
| 3 | 0.125 | 0.2500 | **0.2472** | −0.0028 | **−2.7%** |

r₃ = 49.4 mm against 50.0 mm. **The bias grows with k**, like the stray-charge
channel and for the same underlying reason: the later measurements are the
contaminated ones.

### Direction — it biases toward the SHALLOWER law

The measured ratio is *smaller* than the point-charge prediction, and a smaller
ratio means a *smaller* exponent, because `r_k/r₀ = 2^(−2k/(n+1))` **rises** with n:

```
1/r → 0.125        1/r² → 0.250        1/r³ → 0.354
```

0.2472 sits **below** 0.250, displaced toward 1/r. The apparent exponent from the
k=3 ratio is **n = 1.975** for a true value of 2.

Physically: a weaker force needs the balls *closer* to rebalance. A steeper law
would require them to move *less*, not more — that is what produces the higher
ratio at higher n in the first place.

*Review argued this biases toward 1/r³ instead. The magnitude in that review was
right (r₃ ≈ 49.4 mm, ~2.8% of the gap); the direction was not, and the demand that
the coefficient be verified rather than estimated was correct and is what produced
this section.*

### Computational provenance

*Review's second objection: "we computed it" still asks the reader to trust a
computation they cannot see, which is the same gap C1 exists to close. Correct. The
computation is therefore a runnable file, not a description of one.*

**`verify-finite-sphere.py` — `python3 verify-finite-sphere.py`.** No dependencies.
It regenerates every finite-sphere number in this document and exits non-zero on any
mismatch.

| | |
|---|---|
| **Configuration** | two conducting spheres, radius a, centres at 0 and R, held at equal potential V = 1 — which by symmetry gives them equal charge. Units 4πε₀ = 1. |
| **Seed** | charge `a·V` at each centre; in isolation this puts a lone sphere at potential V. |
| **Recurrence** | a point charge c at distance d > a from a sphere's centre images as `c′ = −a·c/d` at `a²/d`. Each generation inside sphere 1 is mirrored into sphere 2 at R − p and imaged back. Only the newest generation is imaged per round, so nothing is double-counted. |
| **Convergence** | \|c′/c\| = a/d < a/(R−a) < 1, geometric. Measured at the operating point a/R = 0.2: B changes by 6×10⁻⁹ between 10 and 20 generations and is bit-identical from 40 onward. Runs at 80. |
| **Charge** | Q = Σ of image charges inside one sphere. |
| **Force, route A** | Coulomb sum over every pair (charge in sphere 1, charge in sphere 2). Valid because the image set reproduces the exact exterior field. |
| **Force, route B** | `F = −dU/dR` at fixed charge. With Q₁ = Q₂ and V₁ = V₂, `U = Q²/C(R)` where `C(R) = Q(V=1,R)`, so `F = Q²C′/C²`. **Shares no arithmetic with route A** — it never forms the pairwise sum. |
| **Agreement** | A and B agree to < 2×10⁻⁶ across a/R = 0.05…0.25. |
| **Coefficient** | extracted as `(1 − B)/(a/R)³` and observed to tend to 4 as a/R → 0 (4.002 at a/R = 0.02). Never supplied as input. |

**Independent sanity check, and what it cost.** The far-field charge limit was got
wrong twice before it was right — v1 expected Q/aV → 1 and failed at 0.999001;
v2 expected 1 − x + x² and failed by 8×10⁻⁶ at x = 0.02. The image recurrence in
fact generates the full alternating geometric series, `Q/aV → 1/(1+a/R)`, matching
to 10⁻¹² at a/R = 0.001. **Both failures were in the check, not the series** — which
is the argument for writing the checks down rather than describing them.

## Consolidated error budget at k=3, after all seven rulings and this derivation

Square–cube gap at k=3 is 10.36 points. Contributions as a percentage of it:

| channel | size | direction | status |
|---|---|---|---|
| stray charge, s < 0.39% (d = 5 cm, 2 mm, on-axis) | 4.4% | toward 1/r³ | **derived above — conditionally closed** |
| small-angle, θ ≤ 20° | 4.7% | toward 1/r³ | computed |
| finite sphere size, r₃/a = 5 | **−2.7%** | **toward 1/r** | **computed — coefficient verified by image series** |
| ruler, ±0.5 mm | ±1.9% | either | — |
| **worst case, magnitudes summed** | **~13.7%** | | breaking point 50% |
| **signed net** | **+6.4% ± 1.9%** | toward 1/r³ | |

**Sensitivity to the protocol**, which is the point of stating it:

| null-test protocol | s bound | total budget |
|---|---|---|
| d = 5 cm, 2 mm ruler, on-axis *(specified)* | 0.39% | **13.4%** |
| d = 5 cm, eyeballed | 1.95% | 30.5% |
| d = 10 cm, 2 mm ruler | 1.69% | 27.6% |
| d = 20 cm, 2 mm ruler | 8.00% | **92.3% — FAILS** |
| **held perpendicular, any d** | **unbounded** | **test passes everything** |

**Direction of each channel, stated precisely:** stray charge and small-angle both
push toward **1/r³**; finite-sphere pushes toward **1/r**; the ruler is bidirectional.
So there is a partial cancellation and the signed net is +6.4%, not 13.7%.

**That cancellation is luck, not design.** Change the ball size or the thread length
and it moves — the finite-sphere term scales as (a/r)³ while the small-angle term
depends on deflection. The budget must be quoted as the worst case, with the signed
net shown alongside as information rather than as margin.

## Status — two different kinds of open item

*Separated after review, because calling them all "blockers" hid which ones stop a build.*

**Blocking a build:**

- **B1** — Coulomb's torsion balance unsourced (§17.2). Blocks §8a only. **Now the only one.**
- ~~Finite-sphere coefficient~~ — **CLOSED.** B = 1 − 4(a/R)³ verified by image series; contribution −2.7% at k=3, direction confirmed toward 1/r. The **exact image-series calculation** goes in the model spec, not the leading asymptotic term `1 − 4(a/R)³`.

**Not blocking a build:**

- **Null-test bound** — ***conditionally* closed**: an apparatus-based acceptance criterion, not a measured value. Valid only under the specified geometry, distance, threshold and in/out protocol.
- **P-conduction** — provisional map node, explicitly non-blocking under ruling 6. E2 carries the interim demonstration; equal division follows by symmetry.

**Accurate status: E2 is conceptually specified and can proceed to physical build.
Its quantitative error budget is closed. B1 — sourcing Coulomb's torsion balance —
is the only remaining build blocker.**

---

# A1 · Distance dependence by successive halving

## What is wrong now

§5 specifies a **single** halving, and §6's table is the one-halving case. That is
correct as far as it goes, but the lesson has no method for varying distance, and
the obvious repair — measure at several separations — is not available.

**The separation is not an input.** For two identical balls on threads,
equilibrium is set by charge, mass and thread length. You get exactly one
separation per charge state. A design that samples r is describing an
apparatus nobody has.

## The method

Halve repeatedly. Each halving multiplies the separation by a constant factor
that depends on the exponent, and the *ratio* is the measurement.

With `F ∝ q²/rⁿ` and the small-angle balance `F ∝ r`:

```
q² ∝ r^(n+1)        →        r ∝ q^(2/(n+1))
```

Separation as a fraction of the original, after k halvings:

| halvings | F ∝ 1/r | **F ∝ 1/r²** | F ∝ 1/r³ | cube ÷ square |
|---|---|---|---|---|
| 1 | 0.500 | **0.630** | 0.707 | 1.122 |
| 2 | 0.250 | **0.397** | 0.500 | 1.260 |
| 3 | 0.125 | **0.250** | 0.354 | 1.414 |
| 4 | 0.062 | **0.157** | 0.250 | 1.587 |

The discrimination between inverse-square and inverse-cube is **2^(k/6) under the
small-angle model** — 1.122, 1.260, 1.414, 1.587 for k = 1…4. It improves
geometrically with each halving.

**Exactly, it is slightly smaller, and it shrinks as the deflection grows:**

| initial deflection | k=1 | k=2 | k=3 |
|---|---|---|---|
| small-angle limit | 1.122 | 1.260 | 1.414 |
| 20° | 1.117 | 1.253 | 1.406 |
| 30° | 1.110 | 1.243 | 1.395 |
| 40° | 1.100 | 1.230 | 1.380 |

The approximation flatters the design. The loss is under 2% even at 40° and does
not change the recommendation — but the figure must carry its validity condition,
because this document is subject to the rule it is asking of the lesson.

## The design decision this hands the student

More halvings gives better discrimination. It also gives more charge leakage, more
transfer losses, and separations that shrink toward the diameter of the balls,
where a ruler stops meaning anything.

**How far to continue the sequence is the student's decision, and it is the
experimental design problem.** It must be presented as a decision, not supplied as
a recommended number. This is what turns J1 from a verdict on a finished
measurement into a judgment made *during* one.

## Apparatus requirement — currently unstated

Halving is done by contact with an identical **uncharged** sphere. A second
halving therefore needs either:

- **a second uncharged identical sphere** (k halvings → k spare spheres), or
- **one auxiliary sphere plus a reliable discharge step between each transfer.**

Neither is in §5 or §15. A teacher following the frozen specification cannot
perform the second halving.

**Prefer the spare-sphere route over the discharge route**, at least for the first
physical implementation. "Reliably discharge the auxiliary sphere" introduces a
second physical process that itself needs validating, and its failure is invisible.
A set of identical spare spheres is cruder and **auditable** — each can be checked
against an electroscope before use. Given that this entire amendment is about
silent failure, the auditable route wins. The cost is sourcing k spheres that are
genuinely identical.

**Each used sphere must then be removed far enough away that its residual charge
does not perturb the next equilibrium measurement.** A charged sphere left on the
bench is a third body in the experiment. Add to §15.

### The spare-sphere route has its own failure, and it is worse

A spare sphere is unlikely to carry a charge *proportional* to the primary's. It
carries whatever it picked up from handling — a roughly **fixed** amount s. And a
fixed stray charge becomes a growing fraction as the primary's charge shrinks:

```
q_k = (q_{k−1} + s)/2        →        q_k = (q₀ − s)/2^k + s        →        q_k → s
```

**The sequence has a hard floor.** Halving stops working once the charge approaches
the stray level. Actual charge as a multiple of the intended q₀/2^k:

| stray s, as fraction of q₀ | k=2 | k=3 | k=4 | k=5 | k=6 |
|---|---|---|---|---|---|
| 0.2% | 1.01 | 1.01 | 1.03 | 1.06 | 1.13 |
| 0.5% | 1.01 | 1.03 | 1.07 | 1.16 | 1.31 |
| **1%** | 1.03 | 1.07 | **1.15** | 1.31 | 1.63 |
| 2% | 1.06 | 1.14 | 1.30 | 1.62 | 2.26 |

At 1% stray charge the sequence is 15% off by the fourth halving and worthless by
the sixth. **This sets a practical ceiling on k that the spare-sphere route cannot
escape**, and it is the strongest argument for checking each sphere against an
electroscope rather than assuming it is neutral.

## A1 exposes a prerequisite that E1 does not supply

The halving method assumes **two identical conductors in contact divide the charge
equally**. That is two propositions, not one:

1. **charge is conserved during the contact** — E1 establishes this;
2. **identical objects in contact end with equal shares** — E1 does not.

(2) follows from a symmetry argument that is airtight *provided the charge is free
to move*. And that proviso is the difficulty: **E1's apparatus is balloons, which
are insulators.** Charge stays where it is put on a balloon — that is why rubbing
one patch works at all. E2's halving needs conducting spheres.

So A1 silently changes the material class between lessons, and leans on a fact —
charge moves freely in some materials and not in others — that appears nowhere in
the electrostatics spine.

Three ways to discharge the debt, for the authority to choose between:

- **establish equal division experimentally inside E2** before it is used as an instrument;
- **supply it as a declared apparatus principle**, explicitly labelled as assumed rather than shown;
- **introduce the conductor/insulator distinction as a map node.**

The third means the graph gains a node, exactly as writing E1 generated `P-carrier`
and `P-quantisation`. Candidate:

| ID | Question | generated_by | Position | Status |
|---|---|---|---|---|
| **P-conduction** | Does charge stay where you put it? | `LESSON_E2_AMENDMENTS` A1 | Between E1 and E2 — **A1's method presupposes its answer** | provisional |

Without one of the three, A1 replaces one unearned assumption with another, which
is the failure this review exists to catch.

## New failure mode — `silent-plausible`, and the worst one yet

Two identical conductors in contact share the **total** charge equally.

**Definition of α, which matters more than it looks.** Let α be *the charge on the
nominally uncharged auxiliary sphere, divided by the charge currently held by the
sphere being halved, immediately before contact.* Two spheres are equal in charge
straight after a contact, so "a fraction of what the auxiliary kept" and "a fraction
of what the primary holds" coincide from the second transfer onward — but they are
different statements and the document must say which it means.

If the auxiliary carries αq instead of nothing:

```
q_new  =  (q + αq)/2  =  q(1+α)/2        — not q/2
```

Effect on a single halving, when the true law is inverse-square:

| residual α | measured r′/r | where that sits |
|---|---|---|
| 0 | 0.630 | inverse-square ✓ |
| 0.05 | 0.651 | 27% of the way to inverse-cube |
| 0.10 | 0.671 | 54% of the way |
| **0.189** | **0.7071** | **reads as inverse-cube — exactly** |
| 0.20 | 0.7114 | inferred exponent 3.07 |

**A residual charge of about 19% turns a correct inverse-square measurement into an
inverse-cube result exactly.** At 20% the inferred exponent is 3.07 — not equal to
three, but nothing this apparatus can distinguish from it.

The distinction matters and is worth keeping in the wording: *mathematically
equivalent* and *experimentally indistinguishable* are different claims, and
collapsing them is the habit J1 exists to break. An earlier draft of this section
said "20%, exactly", which was wrong in precisely that way.

Either way the data looks good and nothing signals a fault.

This is more severe than the two failures §18 already lists. Humidity degrades
toward noise; this degrades toward *a different wrong law*, which the student then
has evidence for.

## Why this argues *for* A1 rather than against it

The bias is a constant multiplicative shift in the inferred exponent, and it is
**independent of k**:

```
n_apparent + 1  =  (n + 1) · ln(0.5) / ln(f)        where f = (1+α)/2
```

| residual α | true n = 2 reads as | true n = 3 reads as |
|---|---|---|
| 0 | 2.00 | 3.00 |
| 0.10 | 2.48 | 3.64 |
| 0.20 | 3.07 | 4.43 |

**An earlier draft of this section claimed the bias is independent of k, and that
more halvings therefore dilutes it. That is wrong**, and pinning down the
definition of α is what exposed it. The k-independence only holds if *every*
transfer is contaminated by the same fraction — including the first. It isn't. The
first transfer uses a sphere that is genuinely uncharged, so it is clean, and only
k−1 of k transfers carry the error:

```
q_k  =  (q / 2^k) · (1 + α)^(k−1)
```

The bias therefore **grows** with k and approaches a limit:

| k | α = 0.10: true n=2 reads as | true n=3 reads as | α = 0.20: n=2 reads as | n=3 reads as |
|---|---|---|---|---|
| 1 | **2.00** | **3.00** | **2.00** | **3.00** |
| 2 | 2.22 | 3.30 | 2.45 | 3.61 |
| 3 | 2.30 | 3.40 | 2.64 | 3.85 |
| 4 | 2.34 | 3.46 | 2.74 | 3.98 |
| → ∞ | 2.48 | 3.64 | 3.07 | 4.43 |

## Two things that were being conflated

The corrected model separates them, and the design survives on the second:

- **The absolute exponent estimate degrades with k.** At α = 0.20 a true inverse-square reads as 2.74 by the fourth halving. You cannot read an exponent off this apparatus and trust it.
- **The separation between competing hypotheses still grows with k** — 1.00, 1.15, 1.21, 1.25 in inferred-exponent units at α = 0.20. Discrimination improves even as absolute accuracy gets worse.

J1 asks the student to *distinguish* candidate laws, not to estimate an exponent.
So more halvings still helps, but for a different reason than the earlier draft
gave, and the earlier reason was false.

α is also not guaranteed constant — contact quality, humidity and charge
distribution vary between transfers. The table is a model, not a measurement.

## ⚠ For the physics authority — the 63% figure is itself an approximation

`r ∝ q^(2/(n+1))` assumes small angles. Exactly, `F = mg·tan θ` and `r = 2L·sin θ`,
so `q² ∝ (sin θ)ⁿ · tan θ`. Solving that numerically:

| initial deflection | 1/r² exact | *(small-angle: 0.630)* | 1/r³ exact | bias as % of the square–cube gap |
|---|---|---|---|---|
| 10° | 0.6319 | | 0.7085 | 2.5% |
| 20° | 0.6380 | | 0.7127 | 10.3% |
| 30° | 0.6488 | | 0.7204 | 24.3% |
| 40° | 0.6657 | | 0.7325 | 46.3% |

**The approximation biases the result toward inverse-cube — the same direction as
the residual-charge error — and at 30° it consumes a quarter of the gap the whole
lesson turns on.**

Two consequences, both needing a ruling:

1. §6's *"63%"* should be stated with its validity limit, or replaced with the
   exact relation. The charter requires validity limits on model-dependent
   quantities; this one currently has none.
2. **Small initial deflection is an apparatus requirement**, not a preference.
   §15 must say so, with a number.

---

# A2 · "Double both charges" as a locked prediction

## Change

Add to §4, after P1 and P2:

> **P3 — the proportionality question.** Both objects carry the same charge and
> repel. *Suppose the charge on **both** of them were doubled, with everything else
> the same. What happens to the push — the same, twice as much, or four times?*

Locked before proceeding, in the same way P1 and P2 lock.

## It must be framed as a counterfactual

**This cannot be measured on this apparatus.** Doubling both charges changes the
separation by 2^(2/3) ≈ 1.59 — the balls move, so "everything else the same" never
happens. P3 is resolved by reasoning from the proportionality the halvings
established, and the resolution screen must say so.

If it is not said, the student concludes they measured it, and the belief that you
can hold r fixed and dial q — the precise error A1 exists to remove — walks back in
through the prediction they were asked to commit.

## Why it is worth a prediction slot

A student who answers 2F has a coherent, natural, wrong model, and can still get
full marks on any question that hands them the formula. That is the charter's
formula-proof target in one commitment.

---

# A3 · Simulation position — closes §17 decision 4

## Ruling

**Simulation is permitted in E2, after J1 only.** §17 decision 4 is closed.

## Role

Not to generate evidence. To explain the limit the student ran into:

> Your measurement could not separate these two. What would it take to separate
> them — how much more precision, how many more halvings, how much less leakage?

It may display rival exponent predictions and the trade-off between discrimination,
precision, leakage, and the shrinking separation. That is Coulomb's torsion-balance
problem reached experientially rather than narrated, and it is why §8a lands.

## Three guards, all required

1. **Unreachable until the observation is committed and J1 answered.**
2. **It may not alter the recorded observation.** The student's data stands.
3. **It must be visibly marked as computed.** A simulator rendered in the same
   visual language as the drawn apparatus erases the distinction silently. The
   site now has a house style for real apparatus; a computed view must not share it.

Guard 3 is the one most likely to be dropped and the one that matters most here.

## Underlying rule

A simulation may show what a model implies. It may never be the evidence that the
model is true. See **C1**.

---

# A4 · Boundary to E3

## Change

New closing section, and a **required field in the lesson template**.

> **What E2 has established, and what it has not.**
>
> Established: the strength of the push depends on both charges and on the distance
> between them, and the falloff with distance is steeper than proportional.
>
> **Not** established: **the exact exponent.** Your measurement separated the
> distance laws only as far as your apparatus allowed, and how far that was is
> something you decided and judged.
>
> Not established: **how the push gets from one object to the other.** Nothing here
> touched the space between them.
>
> That is E3.

**"Steeper than proportional" survives an inconclusive J1; the exponent does not.**
The gap between 1/r and 1/r² is about 1.7× the gap between 1/r² and 1/r³ at every
k — 13.0 against 7.7 percentage points at one halving, 14.7 against 10.3 at two. So
a student who cannot separate square from cube can still have ruled out simple
proportionality, and both systematic biases identified in A1 push *away* from 1/r,
making that conclusion more secure rather than less.

The boundary must state both, or an inconclusive J1 quietly becomes an experimental
proof of inverse-square in the summary — undoing the lesson one screen after it
lands.

## Why a template field

E1 already does this — its ledger names what two balloons could not show, and the
site's `models.html` reads from it. E2 has no equivalent, so after two lessons the
template is inconsistent in a way that will be inherited by every lesson after it.

E2 → E3 is a hard dependency under the map's default rule (it is in neither the
soft list nor the explicitly-enumerated hard list; the map's convention is that
table prerequisites are hard unless listed as soft).

---

# A5 · J2 requires identical balls, not just identical threads

## What is wrong now

§7's J2 resolves with *"hang both on identical threads and compare deflections.
They deflect equally."*

Equal forces produce equal deflections **only if the masses are equal.** The
relation is static, not dynamic: each ball sits where `F_electric = mg·tan θ`, so
equal forces give equal angles only at equal `mg`. (It is not an `F = ma` argument —
nothing is accelerating.) §7 constrains the threads and says nothing about the balls, while §4's P2 describes *"one ball
carries much more charge than the other"* — which invites improvising with a large
sphere and a small one.

## The failure

Unequal masses give unequal deflections under equal and opposite forces. The
student then has apparatus evidence that **the bigger charge pushes harder** —
the exact misconception J2 exists to destroy, now experimentally confirmed.

Another `silent-plausible` failure, sitting in the judgment task that carries the
lesson's most counterintuitive result.

## Change

- §7 J2: *"hang both on **identical balls on** identical threads"*, with the reason
  stated — equal deflection tests equal force only at equal mass.
- §4 P2: reword so the two objects are understood to be **the same two balls**, one
  of which has been halved, rather than a big object and a small one.
- §15: add to teacher notes.

---

# C1 · Charter amendment — one principle, two instances

## Proposal

Add as a numbered charter principle:

> **Evidence must be obtained by a route that does not assume the conclusion being tested.**
>
> - **Computational.** A verification check must be computed by a route the
>   implementation does not use. RK4 against a closed form; a pointwise Coulomb sum
>   against a Gauss's-law surface integral; Biot–Savart against Ampère.
> - **Pedagogical.** An observation offered to a student as evidence for a model may
>   not be generated from that model. A simulation of Coulomb's law is not evidence
>   for Coulomb's law.

## Why

These have been running as two separate rules — one in the test discipline, one in
§7 — and the duplication has already cost something: the pedagogical instance was
being justified case by case, and a proposed E2 design supplied model-generated data
as evidence without any existing rule being visibly violated.

Stating the common principle once makes the second instance follow from the first
rather than needing to be re-argued, and it means a contributor who has internalised
the test discipline already knows the lesson rule.

**On the wording.** "Does not *assume* the conclusion being tested" rather than
"does not *contain* it". Every measurement contains assumptions — calibration, the
apparatus model, conservation. The prohibition is on circular dependence on the
proposition under test, not on prior theory in general, and the looser phrasing
would forbid measurement altogether.

---

# Blockers — unchanged

**B1 · §17.2 — Coulomb history unsourced.** The torsion balance is well documented,
but this project does not put unverified history in front of students. E1 §8a set the
standard with a primary source (Franklin to Collinson, 25 May 1747, Founders Online).
E2 must meet it. **Not done. Blocks §8a shipping.**

**B2 · §17.1 — does the cohort have Newton's third law?** Changes J2 from application
to discovery.

*Recommendation, for the authority to accept or reject:* at a Grade 12 ceiling with
formula-fluent students, assume **yes, formally — and no, operationally.** They can
state the third law and will still predict that the bigger charge pushes harder. J2
should be built to expose that gap deliberately rather than being reframed as
either application or discovery. The gap between a law a student can recite and a
belief they actually hold is this project's central claim, and J2 is the cleanest
instance of it in the curriculum so far.

---

# What the physics authority is being asked to rule on

| | question |
|---|---|
| 1 | **A1's apparatus change.** Successive halving replaces single halving. Does the auxiliary-sphere requirement make this classroom-viable? |
| 2 | **The small-angle validity limit.** Is §6's 63% acceptable with a stated deflection limit, or must the exact relation be used? What maximum initial deflection? |
| 3 | **What residual is realistic?** Not "is 20% realistic" — that anchors on an arbitrary figure. The physically meaningful questions: (a) what fractional residual α, relative to the charge being halved, is achievable by the proposed classroom transfer procedure; (b) what fixed stray charge s, as a fraction of the starting charge, a handled spare sphere typically carries. (b) sets the ceiling on k. |
| 4 | **A5.** Confirm the equal-mass requirement and that no other J2 configuration is intended. |
| 5 | **B2.** Rule on the cohort's Newton's third law, per the recommendation above. |
| 6 | **Where does equal division between identical conductors come from?** Established in E2, declared as an apparatus principle, or a new `P-conduction` node? E1 used insulators and supplies none of it. |
| 7 | **Spare spheres or a discharge step?** This document recommends spare spheres on auditability grounds; sourcing k identical spheres is the cost. |

---

# Provenance

A1's method and A2–A4 originate in a design review of a proposed E2 redesign that
would have replaced the measurement with model-generated data. That proposal was
rejected; these are the parts of it that survived, plus what the rejection exposed.

A1's supporting arithmetic (2^(k/6), the residual-charge table, the exact
small-angle comparison) was computed for this document and is reproducible — the
relations are stated above in full so they can be checked independently rather than
taken on trust. That is C1 applied to this document.

A5 and the small-angle finding were not in any proposal. They came out of checking
the frozen specification's own numbers.
