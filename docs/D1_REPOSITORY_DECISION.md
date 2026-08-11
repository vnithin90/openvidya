# D1 — Which repository is canonical?

A decision brief. Everything below was obtained by inspecting the working trees,
not from memory or from either repository's own description of itself. Where a
number could be checked by running something, it was run.

**One thing in here should be acted on today regardless of how D1 is decided.**
See §0.

---

## 0 · Urgent, and independent of the decision

`openvidya/` has **one commit, no git remote, and 28 uncommitted files.**

The uncommitted set is not incidental. It is:

```
?? BACKLOG.md                    ?? src/content/electricity/
?? ISSUES.md                     ?? src/physics/current/
?? docs/specs/                   ?? src/physics/current-factors/
?? scripts/                      ?? src/components/investigate/   (E1, 903 lines)
?? tests/current.test.ts         ?? src/components/physics/       (7 scene components)
?? tests/current-factors.test.ts ?? src/pages/electricity/, learn/, models/
```

Modules 1 and 2 in their entirety, both new test files, the mutation-testing
script, the issue list, the backlog, and all five specification documents exist
**only as untracked files in one directory on one machine.** No commit, no
remote, no backup.

Whatever is decided below, commit that tree and push it somewhere today. It is
the largest concentration of unbacked work in the project.

---

## 1 · Repository A — `openvidya/`

| | |
|---|---|
| Stack | Astro 5, React, TypeScript, MDX, KaTeX, vitest |
| Content | 4 modules: projectile-motion, electric-field, what-is-current (M1), what-determines-current (M2) — **plus a second E1**, `learn/electricity/what-is-charge.astro` → `E1Investigation.tsx` |
| Physics layer | 728 lines across 4 modules, separated from UI by an architectural rule (*"if you write a formula in a `.tsx` file, it is in the wrong place"*) |
| Model specs | 4 × `model.yaml`, 687 lines — declared physics, assumptions, representation choices |
| Tests | 4 files, 783 lines — **86 tests, all passing** (verified: fresh install, `vitest run`) |
| Mutation testing | `scripts/mutate.sh` — **15 mutants injected, 15 caught, 0 survived** (verified by running it) |
| Process assets | `BACKLOG.md` (120), `ISSUES.md` (31), `docs/specs/` (5 files, 1,193), `CONTRIBUTING.md`, `OPENVIDYA_PHILOSOPHY.md`, its own `AGENTS.md` (92), `CLAUDE.md` |
| Git | **1 commit, no remote, 28 files uncommitted** |
| Deployed | No |
| Sourcing debt | 5 ⚠ markers across 2 `model.yaml` files |

**The mutation result is the most decision-relevant number in this brief.** A
passing test suite tells you the tests agree with the code. A suite that catches
15 of 15 injected faults — including *`Q = N/e` instead of `N·e`* and *`e` off by
1%* — tells you the tests would have noticed if the code were wrong. That
sensitivity is measured here and unmeasured everywhere else in the project.

---

## 2 · Repository B — `openvidya-repo/`

| | |
|---|---|
| Stack | Plain HTML/CSS/vanilla JS. No framework, no build step, no dependencies, runs from `file://` |
| Content | E1 (`e1.js`, 845), E2 (`e2.js`, 1,163), 5 pages, `style.css` (470) — 2,759 lines |
| Checks | 5 tools, 1,072 lines — scene geometry, E2 rulings, figure rendering, text-overflow, finite-sphere by two independent routes. All pass |
| Mutation testing | None. Suite sensitivity unmeasured |
| Model specs | None as data. The model is in prose in `docs/` |
| `docs/` | 8 files, **byte-identical copies** of the root originals |
| Git | 2 commits, clean, remote `github.com/vnithin90/openvidya` |
| Deployed | **Yes — live on Vercel, gate verified to reject a broken build** |

Its checks are good and several are stack-independent. `verify-finite-sphere.py`
computes the same force by two routes sharing no arithmetic; it moves anywhere
unchanged.

---

## 3 · Third tree — `openvidya-site/`

Byte-identical to Repository B across all seven site files. Not a git repository.
It is the pre-git working copy, now fully superseded.

**Not a candidate. Delete or archive it** — a third copy that can drift is a
liability, and `openvidya-site.zip` at the root is a fourth.

---

## 4 · Duplication and conflicts

**4.1 · E1 is implemented twice, in two stacks.**

| | |
|---|---|
| Repo A | `E1Investigation.tsx` — 903 lines |
| Repo B | `e1.js` — 845 lines |

Same lesson, same question, two independent implementations. This is the sharpest
form of the problem: a correction to E1 currently has to be made twice or it
silently diverges.

**4.2 · `QUESTION_MAP.md` is stale, and it tracks A, not B.**

The map is the project spine. It currently records:

| Node | Status in the map | Reality |
|---|---|---|
| **E1** | ✅ Module 1 Scene 1 | true in A; also built in B, unrecorded |
| **E2** | ⬜ not built | **built and live on Vercel** |
| E3 | 📄 prototype `electric-field` | in A |
| C1 | ✅ built, 28 tests | in A |
| C2 | ✅ built, 10 tests | in A |

The map dates from 10 Aug; B's deploy from 11 Aug. **The project's source of truth
does not know that its only deployed lesson exists.** That is what an unresolved
D1 costs in practice.

**4.3 · Two `AGENTS.md`, both real, mutually unaware.**

Root (455 lines, five agents, written 11 Aug) and `openvidya/AGENTS.md` (92
lines, 9 Aug, directs the reader to `OPENVIDYA_PHILOSOPHY.md` — which exists, in
A only). The new one has no home; the old one governs a tree the new one does not
mention.

**4.4 · Eight duplicated documents.**

`openvidya-repo/docs/` holds byte-identical copies of the eight root documents.
Identical today by luck of copy order. The first edit to either side forks the
charter.

**4.5 · The canonical prose is in neither repository.**

`PROJECT_CHARTER.md`, `QUESTION_MAP.md`, `SPEC_O1_O2_oersted.md`,
`LESSON_TEMPLATE.md`, `LESSON_E2_AMENDMENTS.md` and the rest live loose at the
Course Material root, untracked by any git. B has copies; A has none.

---

## 5 · Migration options

### Option 1 — **A canonical; port E2 into it**

| Migrates | E2 content → React/TS + `model.yaml`; E2's physics checks → vitest; `verify-finite-sphere.py` unchanged; root documents → `docs/`; Vercel repointed |
| Abandoned | `e1.js` (E1 already exists in A), `preview-figures.js` (couples to `style.css`, needs rework), the zero-dependency property |
| Breaks | The live site until A is deployed — hours, not days |
| Cost | **Medium–high.** E2's screen content ports readily; its content-rule checks need re-expressing against rendered React |
| Keeps | 86 tests, mutation testing, physics/UI separation, `model.yaml`, BACKLOG/ISSUES/specs |

### Option 2 — **B canonical; port A's modules into it**

| Migrates | M1, M2, electric-field, projectile → vanilla JS; 86 vitest tests → node checks; `model.yaml` → prose or hand-rolled schema |
| Abandoned | Astro, vitest, **mutation testing**, `model.yaml` machinery, the physics/UI separation rule |
| Breaks | Every architectural guarantee A currently enforces mechanically |
| Cost | **High, and it is a downgrade.** More work than Option 1, to end with less |
| Keeps | Live deployment, zero dependencies |

### Option 3 — **Merge into a new structure**

Highest cost, and it requires §0 done first regardless. No advantage over Option 1
that I can identify: A already *is* the richer structure.

### Option 4 — **Keep both, formally split by strand**

A for the current/field strand, B for the charge/force strand, with the question
map as the join. Cheapest today.

Rejected on inspection: E1 already exists in both, so the split is not clean at
the only point where it would need to be. It also makes rule 12 permanently
unsatisfiable, which is what triggered this brief.

---

## 6 · Recommendation

**Option 1 — `openvidya/` becomes canonical.** Five reasons, in order of weight:

1. **Measured test sensitivity.** 15/15 mutants caught. Nothing else in the
   project has this, and it is the only direct evidence that any test suite here
   would notice a wrong number.
2. **It already contains the process assets the new `AGENTS.md` assumes.** Rule 12
   assigns work to `BACKLOG.md`, defects to `ISSUES.md`, reasoning to
   `docs/specs/`. All three exist in A and none in B. **The new document cannot be
   followed in Repository B at all.**
3. **More content.** Four modules plus E1, against two lessons.
4. **The architecture enforces the charter mechanically** — physics out of the
   view layer, model declared as data, approximations recorded in `model.yaml`.
   In B those are prose commitments a reviewer must remember.
5. **`QUESTION_MAP.md` already tracks A's builds.** Adopting A makes the spine
   accurate with one edit; adopting B requires re-pointing every row.

**Honest counterweights, so this is a decision and not a rubber stamp:**

- E2 is the more advanced lesson pedagogically, and the port is real work.
- B's check tooling is good. The independent-route principle, the text-overflow
  check and the finite-sphere verification should migrate, not be discarded.
- Option 1 costs the zero-dependency property. B runs from a `file://` URL with
  no toolchain; A needs `npm install`. If offline classroom use matters, say so
  now — it changes the answer.
- A's 86 tests cover the physics layer. Its **components are untested**, which is
  where B's checks are strongest. The port should not lose that.

---

## 7 · If Option 1 is chosen — sequence

1. **Today, independent of everything:** commit A's 28 files, add a remote, push.
2. Move the root documents into `openvidya/docs/`. Delete `openvidya-repo/docs/`
   and `openvidya-site/`. One copy of the charter.
3. Update `QUESTION_MAP.md` — mark E2 built, record where.
4. Resolve `AGENTS.md`: one file, in A, revised per `AGENTS_REVIEW.md`.
5. Port E2. Keep `verify-finite-sphere.py` as-is; re-express the content rules as
   vitest cases.
6. Repoint Vercel at A (`astro build`, with `vitest run` in the gate).
7. Archive `openvidya-repo` — do not delete. It is the only working E2 until the
   port is verified.

**B3 — building the E2 apparatus — runs in parallel from step 1 and depends on
none of this.**

---

```text
STATUS:   RECOMMENDATION — human decision required
SCOPE:    Which repository is canonical, and what migrates.
EVIDENCE: Both trees inspected. Repo A's suite installed fresh and run: 86 tests
          passed. scripts/mutate.sh run: 15 mutants, 15 caught, 0 survived.
          Repo B's five checks run: all pass. File-level diffs used to establish
          that openvidya-site is byte-identical to openvidya-repo and that the
          eight docs/ files are identical copies of the root originals.
          No claim here rests on either repository's self-description.

HUMAN DECISION:
  D1a · Which repository is canonical?          → recommended: openvidya/ (A)
  D1b · Does offline / zero-toolchain operation matter?
         If yes, the recommendation changes — say so before any porting starts.
  D1c · Is openvidya-site/ (and the .zip) approved for deletion?

REQUIRED ACTION, NOT BLOCKED BY THE ABOVE:
  Commit and back up openvidya/. 28 files, one machine, no remote.
```
