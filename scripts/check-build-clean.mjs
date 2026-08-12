#!/usr/bin/env node
/**
 * check-build-clean.mjs — run AFTER `astro build`:
 *
 *     npm run build && node scripts/check-build-clean.mjs
 *
 * WHY
 * ---
 * `DevJump.tsx` ships a screen jumper that can skip locked predictions and jump
 * straight to any screen. It is guarded by `import.meta.env.DEV`, which Vite
 * replaces with a literal at build time so the branch is dead-code-eliminated.
 *
 * That is a claim about a build tool's behaviour. It is exactly the kind of
 * claim this repository does not take on trust — if the guard is ever written
 * as a runtime check, or the constant stops being inlined, a student gets a
 * button that walks past every commitment in the lesson, and nothing else would
 * notice.
 *
 * A student who can jump to the answer screen has not been given a shortcut.
 * They have been given a different lesson.
 *
 * This also catches the ordinary leaks: source maps, TODO markers, and the
 * localhost URLs that creep into a production bundle.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

if (!existsSync(DIST)) {
  console.error('check-build-clean: no dist/ — run `npm run build` first.');
  process.exit(1);
}

/**
 * Things that must never appear in a production build.
 *
 * ⚠ THE FIRST VERSION OF THIS LIST WAS WRONG, and the mistake is worth keeping
 * visible because it is the same one this project keeps finding elsewhere.
 *
 * It forbade the string `devjump`, and failed immediately — on a build that was
 * completely correct. The hits were the module's own filename in an import path
 * and its dead CSS class names. The actual shipped chunk was 136 bytes reading
 * `function t(...){ return null }`: every button, the seed control and the
 * aria-label had been eliminated exactly as intended.
 *
 * The check was testing a PROXY (does this name appear) rather than the
 * PROPERTY (can this render). A proxy fails both ways — it cried wolf here, and
 * it would have stayed silent if someone had renamed the component while
 * leaving a live jumper in the build.
 *
 * So the rule below is about MARKUP, not names.
 */
const FORBIDDEN = [
  { pattern: /devjump-btn/, why: 'the development jumper can still render its buttons' },
  { pattern: /Development screen jumper/, why: 'DevJump aria-label survived into the build' },
  { pattern: /seed a run/, why: 'DevJump seed button survived into the build' },
  { pattern: /localhost:\d+/, why: 'a localhost URL is baked into the build' },
];

/** Warnings — reported, but not a failure. */
const SUSPECT = [{ pattern: /\bTODO\b|\bFIXME\b/, why: 'TODO/FIXME left in shipped output' }];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(html|js|css|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(DIST);
let failures = 0;
let warnings = 0;

console.log(`\nchecking ${files.length} built files in ${DIST}/\n`);

for (const { pattern, why } of FORBIDDEN) {
  const hits = files.filter((f) => pattern.test(readFileSync(f, 'utf8')));
  if (hits.length) {
    console.error(`  FAIL  ${why}`);
    for (const h of hits.slice(0, 5)) console.error(`          ${h}`);
    failures++;
  } else {
    console.log(`  ok    absent: ${String(pattern)}`);
  }
}

for (const { pattern, why } of SUSPECT) {
  const hits = files.filter((f) => pattern.test(readFileSync(f, 'utf8')));
  if (hits.length) {
    console.warn(`  warn  ${why} (${hits.length} file${hits.length > 1 ? 's' : ''})`);
    warnings++;
  }
}

/* The positive form of the same claim.
 *
 * Absence of markup could also mean the module was renamed, or that nothing was
 * built. So if a DevJump chunk exists at all, assert its body really is the
 * eliminated one — a bare `return null` — rather than trusting that the strings
 * happened not to match. */
const devChunks = files.filter((f) => /DevJump[.\w-]*\.js$/.test(f));
if (devChunks.length) {
  for (const f of devChunks) {
    const body = readFileSync(f, 'utf8');
    const eliminated = /return null/.test(body) && body.length < 1000;
    if (eliminated) {
      console.log(`  ok    DevJump chunk is the eliminated stub (${body.length} bytes)`);
    } else {
      console.error(`  FAIL  DevJump chunk is ${body.length} bytes and not a bare stub: ${f}`);
      failures++;
    }
  }
} else {
  console.log('  ok    no DevJump chunk in the build at all');
}

/* A build with no JavaScript at all would pass every check above vacuously.
   Confirm the lessons actually shipped their client bundles. */
const js = files.filter((f) => f.endsWith('.js'));
const islands = ['E1Investigation', 'E2Investigation'];
for (const name of islands) {
  const found = js.some((f) => f.includes(name));
  if (!found) {
    console.error(`  FAIL  ${name} has no client bundle — the check above proves nothing`);
    failures++;
  } else {
    console.log(`  ok    ${name} client bundle present`);
  }
}

console.log(
  `\n${failures ? `${failures} FAILURE(S)` : 'build is clean'}` +
    `${warnings ? `, ${warnings} warning(s)` : ''}\n`,
);
process.exit(failures ? 1 : 0);
