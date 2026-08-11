# Module 1 — student-facing acceptance questions

Written **before** implementation. These are the acceptance criteria for the
prototype. They are not to be adjusted to match whatever gets built.

**Scored on reasoning, not on the answer.** A correct number with wrong reasoning
is a miss. The distinction matters most in AT-3, where the calculation is trivial
and the explanation is the entire point.

---

## AT-1 · A large charge is a large count

**Shown:** a quantity of charge stated as ≈10²⁰ elementary charges.

> What does this number tell you? Is there anything unusually large here apart
> from the number itself?

| Response | Verdict |
|---|---|
| "The charges must be huge / it's a giant electron" | **Fail** — targets A2 |
| "There's a huge amount of charge-stuff" | **Fail** — targets A1 |
| "There are an enormous number of charged particles; each one carries the same tiny charge as any other electron" | **Pass** |

*Diagnostic follow-up:* is the charge on one of those electrons bigger than the
charge on an electron in this table? Any answer other than "identical" fails,
regardless of what was said above.

---

## AT-2 · Charge alone does not determine current

**Shown:** charge crossing a surface, with **no time information given**.

> Can you state the current? If not, what else do you need, and why?

| Response | Verdict |
|---|---|
| Attempts a number | **Fail** |
| "No — need to know how fast the electrons are going" | **Fail** — targets B2a, and this is the response to watch for |
| "No — I need the time interval, because current is charge per unit time" | **Pass** |

The second row is the most informative failure in the whole set. A student who
asks for *speed* rather than *time* has the wrong variable, and the prototype has
not done its job.

---

## AT-3 · The explanation, not the arithmetic

**Shown:** two runs — 10 C in 10 s, then 10 C in 2 s.

> Which has the larger current? Explain why, without using the word "faster"
> about the charges themselves.

| Response | Verdict |
|---|---|
| "5 A, because the electrons are moving faster" | **Fail** — the calculation is right and the concept is wrong |
| "5 A" with no reasoning offered | **Fail** |
| "The second. The same amount of charge crossed, but in less time, so more charge crossed per second" | **Pass** |

**This is the module's objective in one question.** The constraint on the word
"faster" is deliberate: without it, a student holding B2a produces the right
number and the misconception is invisible.

---

## AT-4 · The surface is a choice

**Shown:** the imaginary surface at one position, then moved.

> If we had drawn the surface somewhere else along the wire, would the answer
> change? Why?

| Response | Verdict |
|---|---|
| "Yes — it would catch different electrons" | **Fail** — reads the surface as a physical object |
| "No, because the same charge has to pass wherever you put it" | **Pass** |

Supports the representation principle directly: the surface is observer-selected,
not a gate in the wire.

---

## AT-5 · Order of magnitude (scale representation only)

Used to test the scale device, not the physics.

> Is 10²⁰ elementary charges closer to 10¹⁸, or to 10⁶?

| Response | Verdict |
|---|---|
| "10⁶ — they're both small numbers" or guessing | **Fail** |
| "10¹⁸ — it's a hundred times bigger, whereas 10⁶ is fourteen orders away" | **Pass** |

⚠ **Do not ask which representation students prefer.** Preference is not
comprehension. Six students cannot rank two representations; this question only
reveals whether either produces visible confusion.

---

## Scoring and protocol

- Matched item forms, counterbalanced across pre and post.
- A comparison group on conventional text.
- Think-aloud throughout; the transcript is the data.
- Delayed retest at two weeks on AT-2 and AT-3.

**AT-2 and AT-3 are the module.** AT-1 supports them, AT-4 supports the
representation, AT-5 tests a device rather than a concept. If AT-2 and AT-3 do
not shift, the prototype has failed regardless of the others.
