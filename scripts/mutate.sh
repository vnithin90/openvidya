#!/usr/bin/env bash
#
# Mutation testing — closes ISSUES.md #6.
#
# The README claims this suite has been mutation-tested. Until this script
# existed, a reader had to take that on trust, which is precisely the
# unfalsifiable assertion AGENTS.md rule 8 forbids — in our own documentation.
#
# Every mutation below deliberately breaks the physics. EVERY ROW MUST FAIL.
# A row that passes means the tests cannot detect that class of error, and the
# right response is to write a test, not to remove the mutation.
#
#   usage:  bash scripts/mutate.sh
#
set -uo pipefail
cd "$(dirname "$0")/.."

PASS=0
FAIL=0

mutate () {
  local name="$1" file="$2" from="$3" to="$4"
  cp "$file" "$file.bak"
  sed -i "s|$from|$to|" "$file"
  if ! grep -qF "$to" "$file"; then
    printf "  %-46s \033[33mSED DID NOT APPLY\033[0m\n" "$name"
    mv "$file.bak" "$file"; return
  fi
  local out
  out=$(npx vitest run 2>&1 | grep -E "Tests +[0-9]" | tail -1)
  mv "$file.bak" "$file"

  if echo "$out" | grep -q "failed"; then
    printf "  %-46s \033[32mcaught\033[0m   %s\n" "$name" "$out"
    PASS=$((PASS+1))
  else
    printf "  %-46s \033[31mSURVIVED\033[0m %s\n" "$name" "${out:-no result}"
    FAIL=$((FAIL+1))
  fi
}

PR=src/physics/projectile/model.ts
EF=src/physics/electric-field/model.ts
CU=src/physics/current/model.ts

echo "projectile motion"
mutate "gravity sign flip"              $PR "dv: { x: 0, y: -g }" "dv: { x: 0, y: g }"
mutate "g -> g/2"                       $PR "dv: { x: 0, y: -g }" "dv: { x: 0, y: -g/2 }"
mutate "vy launch sign flip"            $PR "y: p.v0 \* Math.sin(th) }" "y: -p.v0 * Math.sin(th) }"
mutate "RK4 weight 1/6 -> 1/5"          $PR "(dt / 6) \* (k1.dr.x" "(dt / 5) * (k1.dr.x"

echo "electric field"
mutate "Coulomb 1/r^3 -> 1/r^2"         $EF "scale(d, (K_E \* c.q) / (r \* r \* r))" "scale(d, (K_E * c.q) / (r * r))"
mutate "field sign flip"                $EF "scale(d, (K_E \* c.q) / (r \* r \* r))" "scale(d, (-K_E * c.q) / (r * r * r))"
mutate "Coulomb constant off by 1%"     $EF "8.9875517873681764e9" "9.0774273052418580e9"
mutate "potential 1/r -> 1/r^2"         $EF "v += (K_E \* c.q) / r;" "v += (K_E * c.q) / (r*r);"

echo "current"
mutate "e off by 1%"                    $CU "1.602176634e-19" "1.618198400e-19"
mutate "Q = N/e instead of N*e"         $CU "N \* E" "N / E"
mutate "rate = Q*dt instead of Q/dt"    $CU "return deltaQ / deltaT" "return deltaQ * deltaT"
mutate "drop the uncertainty guard"     $CU "if (!(uncertainty > 0))" "if (false)"
mutate "drop the zero-time guard"       $CU "if (!(deltaT > 0))" "if (false)"
mutate "crossing-bounds regression"     $CU "s.speed \* t1) / s.spacing) - 1" "s.speed * (t1 - t0)) / s.spacing) - 1"
mutate "ratioRange endpoints paired wrong" $CU "return \[aLo / bHi, aHi / bLo\]" "return [aLo / bLo, aHi / bHi]"

echo
echo "caught: $PASS   survived: $FAIL"
if [ "$FAIL" -gt 0 ]; then
  echo "A surviving mutant is a gap in the suite. Write the missing test."
  exit 1
fi

echo "Restoring and confirming a clean run…"
npx vitest run 2>&1 | grep -E "Tests +[0-9]|Test Files" | tail -2
