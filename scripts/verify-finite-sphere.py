#!/usr/bin/env python3
"""
verify-finite-sphere.py  —  run with:  python3 verify-finite-sphere.py

Regenerates every finite-sphere number in LESSON_E2_AMENDMENTS.md from scratch.
No dependencies. No quoted coefficient is used as input anywhere.

WHY THIS FILE EXISTS
--------------------
The amendment document originally carried "~2.4%", a dimensional estimate with an
unverified coefficient. Review correctly refused it under C1 — evidence must be
obtained by a route that does not assume the conclusion being tested — and then
correctly refused the replacement too, on the grounds that "we computed it" still
asks the reader to trust a computation they cannot see. This is the computation.

It is checked two ways that share no arithmetic:

  ROUTE A   direct Coulomb summation over the image charges
  ROUTE B   force from the energy, F = -dU/dR at fixed charge

Route B never touches Route A's pairwise force sum; it uses only the total charge
the same image series produces. Agreement between them is the check.

THE IMAGE SERIES
----------------
Two conducting spheres, radius a, centres at x = 0 and x = R, held at equal
potential V = 1 (which by symmetry gives them equal charge). Units 4*pi*eps0 = 1.

  Seed:       a charge  a*V  at each centre. In isolation this puts a lone sphere
              at potential V, since V = Q/(4 pi eps0 a) = Q/a in these units.

  Recurrence: a point charge c sitting at distance d from a sphere's centre
              (d > a) is imaged by that sphere as

                    c' = -a*c/d        at distance  a^2/d  from the centre.

              Each generation of charges inside sphere 1 is mirrored into sphere 2
              (by symmetry, at R - p), and imaged back into sphere 1. Only the
              newest generation is imaged each round, so nothing is double counted.

  Convergence: |c'| / |c| = a/d < a/(R - a) < 1, so the series converges
              geometrically. Rate worsens as the spheres approach.

  Charge:     Q = sum of all image charges inside one sphere.

  Force:      sum of Coulomb forces between every charge inside sphere 1 and every
              charge inside sphere 2. Valid because the image set reproduces the
              exact exterior field, and the force on a conductor is determined by
              that field.
"""

import math


# ---------------------------------------------------------------- the series

def image_series(a, R, ngen):
    """Charges (c, p) inside sphere 1, p measured from its centre at x = 0.
       Sphere 2 is the mirror: charge c at position R - p."""
    seed = [(a, 0.0)]                     # a*V with V = 1
    all1, gen = list(seed), list(seed)
    for _ in range(ngen):
        new = []
        for c, p in gen:
            d = R - p                     # distance from sphere 1's centre to the mirrored charge
            if d <= a:                    # would be inside; series has broken down
                return None
            new.append((-a * c / d, a * a / d))
        if not new:
            break
        all1.extend(new)
        gen = new
    return all1


def charge_and_force(a, R, ngen=80):
    """ROUTE A. Returns (Q on one sphere at V=1, force between the spheres)."""
    ch = image_series(a, R, ngen)
    if ch is None:
        return None, None
    Q = sum(c for c, _ in ch)
    F = 0.0
    for ci, pi in ch:
        for cj, pj in ch:                 # sphere 2's charge cj sits at R - pj
            F += ci * cj / (R - pj - pi) ** 2
    return Q, F


def B_direct(a, R):
    """Correction factor F_actual / F_point-charge, ROUTE A."""
    Q, F = charge_and_force(a, R)
    return F / (Q * Q / R ** 2)


def B_energy(a, R, h=1e-5):
    """ROUTE B. F = -dU/dR at fixed charge. With Q1 = Q2 = Qf and V1 = V2 = V,
       U = (1/2) sum(Qi Vi) = Qf V, and V = Qf / C(R) where C(R) = Q(V=1, R).
       So U = Qf^2 / C(R)  and  F = Qf^2 C'(R) / C(R)^2.
       Shares no arithmetic with the pairwise force sum in Route A."""
    def C(x):
        return charge_and_force(a, x)[0]
    Cm, C0, Cp = C(R * (1 - h)), C(R), C(R * (1 + h))
    dC = (Cp - Cm) / (2 * R * h)
    # Choose Qf = C0, i.e. V = 1 at this R. Then F = Qf^2 C'/C^2 = C'.
    F = dC
    return F / (C0 * C0 / R ** 2)


# ---------------------------------------------------------------- the checks

fails = 0


def check(label, got, want, tol):
    global fails
    ok = abs(got - want) <= tol
    print(("  ok    " if ok else "  FAIL  ") + "%-52s %.6f  (expected %.6f)" % (label, got, want))
    if not ok:
        fails += 1


print(__doc__.split("THE IMAGE SERIES")[0].strip()[:0])   # keep stdout clean

print("\n=== 1. Convergence: is the series truncation harmless? ===")
print("   a/R = 0.20, the operating point. B against number of generations:")
prev = None
for n in (5, 10, 20, 40, 80, 120):
    ch = image_series(0.2, 1.0, n)
    Q = sum(c for c, _ in ch)
    F = sum(ci * cj / (1.0 - pj - pi) ** 2 for ci, pi in ch for cj, pj in ch)
    B = F / (Q * Q)
    print("      ngen = %3d   B = %.10f%s" % (n, B, "" if prev is None else "   delta = %.2e" % abs(B - prev)))
    prev = B
check("converged at ngen=80 vs ngen=120", B_direct(0.2, 1.0), prev, 1e-9)

print("\n=== 2. Sanity limits ===")
# Two spheres at equal potential each hold LESS charge than an isolated one, because
# they repel. Two earlier versions of this check were wrong before the right one was
# found, which is itself worth recording:
#   v1 expected Q/aV -> 1, and failed at 0.999001 for a/R = 0.001;
#   v2 expected 1 - x + x^2, and failed at a/R = 0.02 by 8e-6.
# The image recurrence generates the FULL alternating geometric series, so
#       Q/(aV) -> 1 - x + x^2 - x^3 + ... = 1/(1 + x),      x = a/R,
# which reproduces the computed values to 1e-12 at x = 0.001 and 1e-8 at x = 0.01.
# It is the small-x limit, not an identity: the residual grows as roughly x^4
# (1.1e-3 at x = 0.2), which is the genuine multi-image structure appearing.
for aR, tol in ((0.001, 1e-11), (0.010, 1e-7), (0.020, 1e-6)):
    Q_far, _ = charge_and_force(aR, 1.0)
    check("Q/aV -> 1/(1 + a/R) at a/R = %.3f" % aR, Q_far / aR, 1 / (1 + aR), tol)
check("B -> 1 as a/R -> 0", B_direct(0.001, 1.0), 1.0, 1e-8)

print("\n=== 3. ROUTE A vs ROUTE B — independent routes to the same force ===")
print("   direct Coulomb sum over images   vs   F = -dU/dR at fixed charge")
for aR in (0.05, 0.10, 0.15, 0.20, 0.25):
    ba, be = B_direct(aR, 1.0), B_energy(aR, 1.0)
    check("a/R = %.2f" % aR, be, ba, 2e-6)

print("\n=== 4. The leading coefficient, extracted rather than assumed ===")
print("   a/R    |   B (exact image series)  |  1 - 4(a/R)^3  |  implied coefficient")
for aR in (0.02, 0.05, 0.10, 0.15, 0.20, 0.25):
    B = B_direct(aR, 1.0)
    print("   %.2f   |        %.6f           |    %.6f    |       %.3f"
          % (aR, B, 1 - 4 * aR ** 3, (1 - B) / aR ** 3))
check("coefficient -> 4 as a/R -> 0 (evaluated at 0.02)", (1 - B_direct(0.02, 1.0)) / 0.02 ** 3, 4.0, 0.01)
print("\n   => B = 1 - 4(a/R)^3 + ... is the LEADING ASYMPTOTIC term.")
print("      The image series above is the EXACT calculation. At a/R = 0.2 they")
print("      differ by %.4f, about 0.1%% of the force, so the model spec must carry"
      % (1 - 4 * 0.2 ** 3 - B_direct(0.2, 1.0)))
print("      the exact calculation, not the asymptotic term.")

print("\n=== 5. Propagated through the ruled apparatus ===")
print("   a = 10 mm, r0 = 200 mm, true law = inverse square.")
print("   Equilibrium solved self-consistently:  C*r = (q^2/r^2) * B(a,r)")
a, r0 = 10.0, 200.0
Cst = 1.0 / r0 ** 2 * B_direct(a, r0) / r0          # fixed by the observed r0 at q = q0 = 1


def equilibrium(qfrac):
    lo, hi = 2 * a + 1e-3, r0 * 1.2
    for _ in range(200):
        m = 0.5 * (lo + hi)
        if Cst * m - qfrac ** 2 / m ** 2 * B_direct(a, m) < 0:
            lo = m
        else:
            hi = m
    return 0.5 * (lo + hi)


GAP = {k: 0.5 ** (2 * k / 4) - 0.5 ** (2 * k / 3) for k in (1, 2, 3)}
print("\n   k | point-charge r_k/r0 | finite-sphere r_k/r0 |  shift   | % of square-cube gap")
rows = {}
for k in (1, 2, 3):
    pc = 0.5 ** (2 * k / 3)
    fs = equilibrium(0.5 ** k) / r0
    rows[k] = fs
    print("   %d |       %.4f        |        %.4f        | %+.4f  |       %+5.1f%%"
          % (k, pc, fs, fs - pc, (fs - pc) / GAP[k] * 100))

check("k=1 finite-sphere ratio", rows[1], 0.6296, 2e-4)
check("k=2 finite-sphere ratio", rows[2], 0.3958, 2e-4)
check("k=3 finite-sphere ratio", rows[3], 0.2472, 2e-4)
check("k=3 shift as % of gap", (rows[3] - 0.25) / GAP[3] * 100, -2.7, 0.1)

n_app = -6 * math.log(2) / math.log(rows[3]) - 1
check("apparent exponent at k=3 (true value 2)", n_app, 1.975, 0.002)

print("\n=== 6. Direction ===")
print("   r_k/r0 = 2^(-2k/(n+1)) RISES with n:   1/r -> 0.125,  1/r^2 -> 0.250,  1/r^3 -> 0.354")
print("   The finite-sphere ratio %.4f sits BELOW 0.250, so it is displaced toward 1/r." % rows[3])
print("   => the bias is toward the SHALLOWER law. Apparent exponent %.3f < 2." % n_app)
for k in (1, 2, 3):
    assert rows[k] < 0.5 ** (2 * k / 3), "direction check failed at k=%d" % k
print("   direction assertion holds at k = 1, 2 and 3.")

print("\n" + ("ALL CHECKS PASSED" if fails == 0 else "%d FAILED" % fails) + "\n")
raise SystemExit(1 if fails else 0)
