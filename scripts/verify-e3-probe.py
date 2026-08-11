#!/usr/bin/env python3
"""
verify-e3-probe.py  —  run with:  python3 scripts/verify-e3-probe.py

Regenerates every number in LESSON_E3 §5a's probe-perturbation table.
No dependencies. No quoted coefficient is used as input.

WHY THIS FILE EXISTS
--------------------
The first amendment to the E3 spec reported this perturbation as 4(a/d)^3,
citing verify-finite-sphere.py. That script computes a DIFFERENT configuration:
two identical spheres at equal potential and equal charge. E3 has a small probe
near a larger source sphere. The coefficient does not transfer, and the borrowed
table was pessimistic by roughly an order of magnitude — and, worse, independent
of the charge ratio, which the real answer is not.

Review caught the mislabelling. Recomputing caught the rest. This file exists so
the next person does not have to trust either of us.

THE CONFIGURATION
-----------------
An isolated conducting sphere, radius a, total charge Q, centre at the origin.
A point charge q (the probe) on the axis at distance d > a.

  Image:   q1 = -a q / d   at   p1 = a^2 / d      (grounds the sphere)
  Centre:  q2 = Q + a q/d  at   0                 (restores its total charge Q)

Force on the probe, in units where 1/(4 pi eps0) = 1:

  F = q [ q2/d^2  +  q1/(d - p1)^2 ]

against the naive point-charge value F0 = Q q / d^2.

  B = F/F0 = 1 + rho*x - rho*x/(1-x^2)^2,   x = a/d,  rho = q/Q

CHECKED BY AN INDEPENDENT ROUTE
-------------------------------
The force expression is not used to verify the image construction — that would
be circular. Instead the construction is checked against the boundary condition
it exists to satisfy: the sphere's surface must be an EQUIPOTENTIAL. That test
touches no force, no expansion and no coefficient.
"""

import math

fails = 0


def check(label, got, want, tol):
    global fails
    ok = abs(got - want) <= tol
    print(("  ok    " if ok else "  FAIL  ") +
          "%-56s %.9f  (expected %.9f)" % (label, got, want))
    if not ok:
        fails += 1


# ------------------------------------------------------------------ the model

def images(a, d, Q, q):
    """Charges inside/at the sphere: (magnitude, position on the axis)."""
    q1 = -a * q / d
    p1 = a * a / d
    q2 = Q + a * q / d
    return [(q1, p1), (q2, 0.0)]


def potential_at(a, d, Q, q, theta):
    """Potential at a point on the sphere's surface, angle theta from the axis.
       Sums probe + images. Independent of any force calculation."""
    sx, sz = a * math.sin(theta), a * math.cos(theta)
    V = q / math.hypot(sx, sz - d)
    for c, p in images(a, d, Q, q):
        V += c / math.hypot(sx, sz - p)
    return V


def B_exact(x, rho):
    return 1 + rho * x - rho * x / (1 - x * x) ** 2


def B_from_images(a, d, Q, q):
    """Force route. Kept separate from the equipotential test above."""
    F = 0.0
    for c, p in images(a, d, Q, q):
        F += q * c / (d - p) ** 2
    return F / (Q * q / d ** 2)


# ------------------------------------------------------------------- checks

print("\n=== 1. Is the sphere surface an equipotential? ===")
print("    The boundary condition the image construction exists to satisfy.")
print("    Uses no force, no expansion, no coefficient.")
for a, d, Q, q in ((0.01, 0.10, 1.0, 0.1), (0.02, 0.10, 1.0, 0.3), (0.02, 0.05, 1.0, 0.5)):
    Vs = [potential_at(a, d, Q, q, math.pi * i / 12) for i in range(13)]
    spread = (max(Vs) - min(Vs)) / abs(sum(Vs) / len(Vs))
    check("a=%.2f d=%.2f q/Q=%.1f  surface potential spread" % (a, d, q / Q),
          spread, 0.0, 1e-12)

print("\n=== 2. Closed form agrees with the summed image forces ===")
for a, d, Q, q in ((0.01, 0.15, 1.0, 0.1), (0.01, 0.10, 1.0, 0.1),
                   (0.02, 0.10, 1.0, 0.3), (0.02, 0.05, 1.0, 0.5)):
    check("a/d=%.3f  q/Q=%.1f" % (a / d, q / Q),
          B_from_images(a, d, Q, q), B_exact(a / d, q / Q), 1e-12)

print("\n=== 3. Limits ===")
check("B -> 1 as the sphere shrinks   (a/d = 1e-4)", B_exact(1e-4, 0.1), 1.0, 1e-11)
check("B -> 1 as the probe vanishes   (q/Q = 1e-6)", B_exact(0.2, 1e-6), 1.0, 1e-6)

print("\n=== 4. The coefficient, extracted rather than assumed ===")
print("    small-x behaviour of (1-B)/(rho x^3):")
for x in (0.20, 0.10, 0.05, 0.02, 0.01):
    rho = 0.1
    print("      x = %.2f   ->  %.6f" % (x, (1 - B_exact(x, rho)) / (rho * x ** 3)))
check("coefficient -> 2 as a/d -> 0 (evaluated at 0.01)",
      (1 - B_exact(0.01, 0.1)) / (0.1 * 0.01 ** 3), 2.0, 1e-3)
print("\n    => B ~ 1 - 2*rho*(a/d)^3.  NOT 4(a/d)^3, and NOT independent of rho.")

print("\n=== 5. The table as it appears in LESSON_E3 §5a ===")
print("    a/d   |  q/Q  |  perturbation  |  the borrowed 4(a/d)^3 figure")
for x, rho in ((0.0667, 0.1), (0.10, 0.1), (0.10, 0.3), (0.20, 0.1), (0.20, 0.3)):
    print("    %.3f | %.1f   |    %6.3f %%    |         %6.3f %%"
          % (x, rho, (1 - B_exact(x, rho)) * 100, 4 * x ** 3 * 100))

print("\n=== 6. What this means for the bench ===")
print("    A direction-only map records which way the probe moves.")
print("    A sub-1% change in magnitude cannot alter a direction reading, so")
print("    source redistribution is NOT what threatens 5a. Charge retention,")
print("    sign stability and air currents are — see LESSON_E3 §17.3.")

print("\n" + ("ALL CHECKS PASSED" if not fails else "%d CHECK(S) FAILED" % fails))
raise SystemExit(1 if fails else 0)
