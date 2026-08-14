# CLAUDE.md

Claude Code reads this filename by default. The project rules are shared across
agents and live in **[AGENTS.md](./AGENTS.md)** — read that file, and
[OPENVIDYA_PHILOSOPHY.md](./OPENVIDYA_PHILOSOPHY.md) before it.

Nothing project-specific belongs in this file. It exists to bridge a filename
convention, not to hold a second set of rules that can drift from the first.

Quick reference:

```bash
npm install
npm test        # physics verification — must pass before any PR
npm run dev     # local site
npm run build   # what Vercel (and Netlify) run
```

Two things that are easy to get wrong here and matter more than usual:

- Verification must come by a **different route** from the implementation.
- You may propose and inspect. You may not declare the physics correct.
