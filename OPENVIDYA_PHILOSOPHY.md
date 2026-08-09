# OpenVidya — Philosophy

Ten principles. The detailed rules live elsewhere.

1. **Physics before decoration.** If a visual choice and a physical fact conflict, the fact wins.

2. **An animation must represent a physical model, not merely resemble one.** Every number drawn comes from the model layer.

3. **Assumptions must be explicit**, and they are shown to the student, not buried in a comment.

4. **Mathematical relationships should emerge from observable behaviour** where possible, rather than being asserted first and illustrated afterwards.

5. **Interactive parameters must have physical meaning.** A slider that changes nothing physical is decoration.

6. **Simplifications are acceptable when their validity is stated.** Every model omits something; the omission is part of the lesson.

7. **Implementations are tested against their declared models. The models themselves require human judgment.** Tests establish that the code does what the model says. Whether the model is the right physics for the situation is not something a test can settle.

8. **Verification must come by an independent route.** A check that recomputes what the implementation computed proves only self-consistency. Compare numerical integration against closed forms, pointwise sums against integral theorems, fields against potentials.

9. **Pedagogical quality requires human judgment.** A simulation can satisfy every equation and still build the wrong mental picture. Nothing automated catches that.

10. **Source code is part of the educational artifact.** The model declaration, the implementation and the tests are all readable, and the student is invited to read them.

## What this rules out

- Animations tuned to look convincing rather than to be correct.
- "Verified" claims resting on a language model's opinion.
- Tests that restate the implementation.
- Hiding a model's singularities or failure regimes because they are inconvenient to draw.
- Freezing an abstraction on the evidence of a single example.
