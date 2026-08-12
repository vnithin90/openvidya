/**
 * E3 — How does one charge know the other is there?
 *
 * Design source: docs/LESSON_E3_how-does-it-know.md.
 *
 * Built morsel-shaped from the start. E2 was written as long screens and
 * retrofitted after Dr. Vadaparty's review; doing that taught that the retrofit
 * is harder than the original, and that adding an activity late can turn
 * existing prose into an answer key. So E3 is one thought per screen from the
 * beginning, and every commitment was designed alongside the prose that follows
 * it rather than inserted into finished text.
 *
 * THE TWO RULINGS THIS LESSON IS BUILT ON (§17.1, §17.2):
 *
 *  1. The field is a JUDGMENT left open with stated criteria, not a fact to be
 *     established. Electrostatics cannot distinguish it from action at a
 *     distance — both accounts predict the same measurements — so J1's correct
 *     answer is NEITHER, and the lesson's job is to make the student see why.
 *
 *  2. §5a is DEFERRED, not performable. The rod design was wrong (a rod's field
 *     is not radial) and the sphere replacement has never been tried. So the
 *     student PREDICTS a map and never measures one, and the screen says so in
 *     their own words. J1 therefore runs on the student's own predicted map —
 *     which works because "neither account is supported" is true of any force
 *     map, measured or predicted.
 *
 * No equations here — AGENTS.md hard rule 1. src/physics/electric-field/ holds
 * the model, and E3 uses none of it on screen: the lesson never computes a field.
 */

import { useCallback, useEffect, useState } from 'react';
import DevJump from './DevJump';
import { GapScene, MapScene, POSITIONS, TimingScene, type Dir } from './scenes/E3Scenes';

type Timing = 'instant' | 'delay' | 'unsure';
type Judge = 'A' | 'B' | 'neither';
type Decide = 'closer' | 'stronger' | 'moving' | 'bigger';

type Step =
  | 'entry' | 'encounter'
  | 'p1' | 'p2' | 'p3'
  | 'deferred' | 'observe'
  | 'judge' | 'criterion'
  | 'explain' | 'math' | 'ledger'
  | 'faraday';

const STEPS: Step[] = [
  'entry', 'encounter',
  'p1', 'p2', 'p3',
  'deferred', 'observe',
  'judge', 'criterion',
  'explain', 'math', 'ledger',
];

/**
 * Template §B. `deferred` screens must say WHEN the action becomes possible and
 * WHY it is held — not merely omit it. E2 failed this twice before it was a
 * declared field.
 */
export const BENCH_ACTIONS: Record<Step, 'none' | 'performable' | 'deferred'> = {
  entry: 'none',
  encounter: 'none',
  p1: 'none',        // thought experiment, explicitly
  p2: 'performable', // paper and pencil; the means is already held
  p3: 'none',        // asked and explicitly not answered here
  deferred: 'deferred',
  observe: 'none',
  judge: 'none',
  criterion: 'none',
  explain: 'none',
  math: 'none',
  ledger: 'none',
  faraday: 'none',
};

interface RunState {
  step: Step;
  p1why: string; p1locked: boolean;
  map: Record<string, Dir>; maplocked: boolean;
  timing?: Timing; timinglocked: boolean;
  judge?: Judge; judgelocked: boolean;
  decide?: Decide; decidelocked: boolean;
}

const STORAGE_KEY = 'openvidya-e3-run-v1';
const MODEL_KEY = 'openvidya-models-earned';

function defaultRun(): RunState {
  return {
    step: 'entry',
    p1why: '', p1locked: false,
    map: {}, maplocked: false,
    timinglocked: false,
    judgelocked: false,
    decidelocked: false,
  };
}

function loadRun(): RunState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultRun(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultRun();
}

function earnModel(id: string) {
  try {
    const raw = localStorage.getItem(MODEL_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) localStorage.setItem(MODEL_KEY, JSON.stringify([...list, id]));
  } catch { /* ignore */ }
}

const DIRS: { id: Dir; label: string }[] = [
  { id: 'out', label: 'away from the ball' },
  { id: 'in', label: 'toward the ball' },
  { id: 'side', label: 'sideways' },
];

function Choices<T extends string>({
  options, value, locked, onPick,
}: { options: { id: T; label: string }[]; value?: T; locked: boolean; onPick: (v: T) => void }) {
  return (
    <div className="choices" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          disabled={locked}
          className={`choice ${value === o.id ? 'on' : ''}`}
          onClick={() => onPick(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function E3Investigation() {
  const [run, setRun] = useState<RunState>(defaultRun);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setRun(loadRun()); setHydrated(true); }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(run)); } catch { /* ignore */ }
  }, [run, hydrated]);
  useEffect(() => { if (run.step === 'math') earnModel('electric-field'); }, [run.step]);

  const go = useCallback((step: Step) => {
    setRun((r) => ({ ...r, step }));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const set = useCallback(<K extends keyof RunState>(k: K, v: RunState[K]) => {
    setRun((r) => ({ ...r, [k]: v }));
  }, []);

  const step = run.step;
  const n = STEPS.indexOf(step);
  const mapDone = POSITIONS.every((p) => run.map[p.id]);

  const Next = ({ to, label, enabled = true }: { to: Step; label: string; enabled?: boolean }) => (
    <button className="btn primary" disabled={!enabled} onClick={() => go(to)}>{label}</button>
  );
  const Back = ({ to }: { to: Step }) => (
    <button className="btn ghost" onClick={() => go(to)}>Back</button>
  );

  const body = () => {
    switch (step) {
      case 'entry':
        return (
          <>
            <p className="kicker">Investigation E3 · Electricity</p>
            <h1>How does one charge know the other is there?</h1>
            <p className="lead">
              E2 left a hole and did not mention it. Two objects, nothing between them, and a
              force. <strong>Nobody asked how.</strong>
            </p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>You will need nothing.</strong></p>
              <p style={{ marginBottom: 0 }}>
                No balloons, no bench, no dry day. This one is done with a pencil and your own
                judgment — and that is not a gap in the lesson, it is what the lesson is about.
                Some questions in physics are not settled by measuring harder.
              </p>
            </div>
            <p className="small muted">Prerequisite: E2. Your predictions lock once committed.</p>
            <div className="actions"><Next to="encounter" label="Begin" /></div>
          </>
        );

      case 'encounter':
        return (
          <>
            <p className="kicker">The question</p>
            <h2 style={{ marginTop: '.2rem' }}>Every push you have ever given needed contact.</h2>
            <GapScene />
            <p>
              You lean on a door, your hand is on the door. You kick a ball, your foot touches it.
              Every push you have felt in your life happened where two things met.
            </p>
            <p>
              <strong>Not this one.</strong> You measured that force in E2 without the balls ever
              touching. There is air between them, and if you did it in a vacuum there would be
              nothing at all — and the push would still be there.
            </p>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                That is strange, and it is worth letting it be strange for a moment before we do
                anything about it.
              </p>
            </div>
            <div className="actions"><Back to="entry" /><Next to="p1" label="One question first" /></div>
          </>
        );

      /* THE LESSON, in one question.
       * Open text with a required reason — NOT yes/no/cannot-be-decided. "Yes"
       * means "there is a field there" to one student and "something physical is
       * going on" to another, and J1 later depends on knowing which was meant.
       * The reason is the data here, not the answer. */
      case 'p1':
        return (
          <>
            <p className="kicker">Prediction 1 of 3 · <span className="ptag reason">thought experiment — nothing to perform</span></p>
            <h2 style={{ marginTop: '.2rem' }}>Take the second ball away.</h2>
            <p>
              A charged ball hangs on its own. You bring a second charged ball to a point 10 cm
              away, and it is pushed. Now take that second ball <strong>completely away</strong> —
              out of the room.
            </p>
            <p><strong>What, if anything, do you think is at that point now?</strong></p>
            <textarea
              value={run.p1why}
              disabled={run.p1locked}
              placeholder="I think…"
              onChange={(e) => set('p1why', e.target.value)}
            />
            <p className="small muted">
              In your own words, with your reason. There is no list to choose from, on purpose —
              this is the question the whole investigation is built on, and the wording you reach
              for is part of your answer.
            </p>
            {run.p1locked ? (
              <>
                <div className="locked-note">
                  <span className="lab">Locked</span>
                  <strong>{run.p1why || '(left blank)'}</strong>
                </div>
                <div className="actions"><Next to="p2" label="Next" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={run.p1why.trim().length < 4} onClick={() => set('p1locked', true)}>
                  Commit
                </button>
                <span className="small muted">Locks permanently. Come back to it at the end.</span>
              </div>
            )}
          </>
        );

      /* P2 — the six-position map. Same instrument as M2, deliberately. */
      case 'p2':
        return (
          <>
            <p className="kicker">Prediction 2 of 3</p>
            <h2 style={{ marginTop: '.2rem' }}>Six places. Which way would it be pushed?</h2>
            <p>
              One charged ball, fixed. Six positions marked around it — four the same distance
              away in different directions, and two further out. At each one, imagine placing a
              small ball carrying <strong>the same kind of charge</strong>.
            </p>
            <MapScene choices={run.map} caption={mapDone ? 'your map' : 'mark a direction at each of the six'} />
            <div className="mapgrid">
              {POSITIONS.map((p) => (
                <div key={p.id} className="maprow">
                  <span className="mapid">{p.id}</span>
                  <span className="maplab">{p.label}</span>
                  <div className="mapdirs">
                    {DIRS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        aria-pressed={run.map[p.id] === d.id}
                        disabled={run.maplocked}
                        className={`bin ${run.map[p.id] === d.id ? 'on' : ''}`}
                        onClick={() => setRun((r) => ({ ...r, map: { ...r.map, [p.id]: d.id } }))}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {run.maplocked ? (
              <div className="actions"><Next to="p3" label="One more" /></div>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!mapDone} onClick={() => set('maplocked', true)}>
                  Commit my map
                </button>
                <span className="small muted">{mapDone ? 'Locks permanently.' : 'All six first.'}</span>
              </div>
            )}
          </>
        );

      /* P3 — asked, committed, and deliberately not answered in this lesson.
       * It is the criterion that would eventually decide P1, and the student
       * should have staked something before meeting it. */
      case 'p3':
        return (
          <>
            <p className="kicker">Prediction 3 of 3 · <span className="ptag reason">this lesson will not answer it</span></p>
            <h2 style={{ marginTop: '.2rem' }}>Now shake one of them.</h2>
            <TimingScene />
            <p>
              Two charged balls, a metre apart. You suddenly jerk the left one sideways.
              <strong> When does the right one find out?</strong>
            </p>
            <Choices
              options={[
                { id: 'instant' as Timing, label: 'Immediately — the moment I move it' },
                { id: 'delay' as Timing, label: 'After a delay, however small' },
                { id: 'unsure' as Timing, label: 'I do not think I can say' },
              ]}
              value={run.timing}
              locked={run.timinglocked}
              onPick={(v) => set('timing', v)}
            />
            {run.timinglocked ? (
              <>
                <div className="card warn">
                  <p style={{ margin: 0 }}>
                    <strong>Nothing in this lesson answers that</strong>, and nothing you can build
                    at school will either. It is kept because it turns out to be the question that
                    decides the one you just answered — and you should have staked something on it
                    before finding that out.
                  </p>
                </div>
                <div className="actions"><Next to="deferred" label="To the bench — almost" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.timing} onClick={() => set('timinglocked', true)}>Commit</button>
              </div>
            )}
          </>
        );

      /* TEMPLATE §B — the deferred screen must say WHEN and WHY, in the
       * student's own words, not merely in the specification. */
      case 'deferred':
        return (
          <>
            <p className="kicker">What you would do next, and cannot yet</p>
            <h2 style={{ marginTop: '.2rem' }}>The measurement that is not ready.</h2>
            <p>
              Here is what should happen now. Fix a small charged ball. Hang a second small ball
              carrying charge of a known kind, bring it to each of your six positions in turn, and
              record which way it is pushed. That is your map, measured instead of imagined.
            </p>
            <div className="card warn">
              <p style={{ marginTop: 0 }}>
                <strong>You cannot do it yet, and you are owed the reason.</strong>
              </p>
              <p style={{ margin: '0 0 .5rem' }}>
                The first version of this experiment used a charged <em>rod</em> as the source. That
                was wrong. A rod's push does not point straight out from its middle — near one at
                these distances the direction is off by up to ten degrees, and the strength varies
                by nearly a factor of two around a circle where it should not vary at all. A student
                doing it would have mapped the shape of the rod and believed they had found a law.
              </p>
              <p style={{ margin: 0 }}>
                <strong>When:</strong> once someone has built the corrected version — a small sphere
                as the source — and shown that a charged probe reliably shows direction near it,
                holds its charge long enough, and does not simply blow about the room.
                <strong> Why we are telling you rather than quietly leaving it out:</strong> because
                a page that hands you a procedure nobody has tried is doing the thing this whole
                course exists to argue against.
              </p>
            </div>
            <div className="actions"><Next to="observe" label="So what have we got?" /></div>
          </>
        );

      case 'observe':
        return (
          <>
            <p className="kicker">What the map is, and is not</p>
            <h2 style={{ marginTop: '.2rem' }}>Look at what you drew.</h2>
            <MapScene choices={run.map} caption="your map" />
            <p>
              Almost everyone draws the same thing: arrows pointing away from the ball everywhere,
              shorter further out. Whether that is right is a question for the bench. But suppose
              it is exactly right.
            </p>
            <div className="card accent">
              <p style={{ marginTop: 0 }}>
                <strong>Every one of those arrows was drawn by imagining something placed there.</strong>
              </p>
              <p style={{ marginBottom: 0 }}>
                That is what an arrow on this map means: <em>if I put a charge here, it would be
                pushed that way</em>. The map is a record of what would happen when a second object
                is present — which is precisely the thing your very first answer was about.
              </p>
            </div>
            <div className="actions"><Next to="judge" label="Two students disagree" /></div>
          </>
        );

      /* J1 — the correct answer is NEITHER, and the screen must not lead. */
      case 'judge': {
        const right = run.judge === 'neither';
        return (
          <>
            <p className="kicker">Judgment</p>
            <h2 style={{ marginTop: '.2rem' }}>Two students, one map.</h2>
            <div className="models">
              <button
                type="button"
                className={`model-card ${run.judge === 'A' ? 'on' : ''}`}
                aria-pressed={run.judge === 'A'}
                disabled={run.judgelocked}
                onClick={() => set('judge', 'A')}
              >
                <span className="tag">Student A</span>
                <p>
                  “The arrows show what is <em>there</em>. The charge fills the space around it with
                  a push, and it is there whether or not anything is in it. My second ball just
                  responds to what is already at its own position.”
                </p>
              </button>
              <button
                type="button"
                className={`model-card ${run.judge === 'B' ? 'on' : ''}`}
                aria-pressed={run.judge === 'B'}
                disabled={run.judgelocked}
                onClick={() => set('judge', 'B')}
              >
                <span className="tag">Student B</span>
                <p>
                  “The arrows show what <em>happens when I put a ball there</em>. With no ball,
                  nothing is at that point. The first charge reaches across and pushes the second
                  one directly. The map records what would happen, not what is.”
                </p>
              </button>
            </div>
            <p className="small muted">Which one does the map support?</p>
            <Choices
              options={[
                { id: 'A' as Judge, label: 'A — the map shows something that is there' },
                { id: 'B' as Judge, label: 'B — the map only records what would happen' },
                { id: 'neither' as Judge, label: 'Neither — the map cannot tell them apart' },
              ]}
              value={run.judge}
              locked={run.judgelocked}
              onPick={(v) => set('judge', v)}
            />
            {run.judgelocked ? (
              <>
                <div className={`card ${right ? 'accent' : 'warn'}`}>
                  <p style={{ marginTop: 0 }}>
                    <strong>Neither.</strong> Read the two descriptions again and ask what
                    measurement would come out differently. There isn't one. Every arrow you could
                    ever draw, and every arrow anyone could ever measure with charges sitting still,
                    is identical under both accounts.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    {right
                      ? 'That is not a trick question and it is not a failure of your map. It is a real feature of this part of physics, and noticing it is the whole of this lesson.'
                      : 'This is the hardest step in the investigation, and choosing a side is the natural thing to do. The map is genuinely silent here — it is not that the evidence is weak, it is that both stories predict it exactly.'}
                  </p>
                </div>
                <div className="actions"><Next to="criterion" label="Then what would settle it?" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.judge} onClick={() => set('judgelocked', true)}>Commit my judgment</button>
              </div>
            )}
          </>
        );
      }

      case 'criterion': {
        const right = run.decide === 'moving';
        return (
          <>
            <p className="kicker">After the judgment, not before</p>
            <h2 style={{ marginTop: '.2rem' }}>What would tell them apart?</h2>
            <p>
              If no map of a still charge can separate the two accounts, something else has to.
              Four candidates — <strong>which one could actually decide it?</strong>
            </p>
            <Choices
              options={[
                { id: 'closer' as Decide, label: 'Measure at more positions, much closer in' },
                { id: 'stronger' as Decide, label: 'Use a much bigger charge, so the push is easier to read' },
                { id: 'moving' as Decide, label: 'Move one charge suddenly and time when the other responds' },
                { id: 'bigger' as Decide, label: 'Repeat it in a far larger room' },
              ]}
              value={run.decide}
              locked={run.decidelocked}
              onPick={(v) => set('decide', v)}
            />
            {run.decidelocked ? (
              <>
                <div className={`card ${right ? 'accent' : 'warn'}`}>
                  <p style={{ marginTop: 0 }}>
                    <strong>Movement and timing.</strong> The other three make the same measurement
                    more precisely, and a more precise version of a measurement that cannot
                    distinguish two accounts still cannot distinguish them. More decimal places on
                    the same question is not a different question.
                  </p>
                  <p style={{ margin: '0 0 .5rem' }}>
                    <strong>That is the question you already answered</strong>, back at prediction
                    three. If the second charge reacts <em>after a delay</em>, then whatever is
                    going on is not instantaneous, and a description that assigns a condition to
                    every point in space handles that without alteration.
                  </p>
                  <p style={{ marginBottom: 0 }} className="small muted">
                    You will not measure it here. The delay across a metre is about three
                    nanoseconds — three billionths of a second. Naming the right experiment is the
                    achievement; reaching it is not.
                  </p>
                </div>
                <div className="then-now">
                  <div><span className="lab">At prediction three you said</span><strong>{
                    run.timing === 'instant' ? 'Immediately'
                    : run.timing === 'delay' ? 'After a delay'
                    : run.timing === 'unsure' ? 'I cannot say' : 'not recorded'
                  }</strong></div>
                  <div><span className="lab">Which account that would support</span><strong>{
                    run.timing === 'delay' ? 'A — something at every point'
                    : run.timing === 'instant' ? 'B — reaching across directly'
                    : 'still open'
                  }</strong></div>
                </div>
                <div className="actions"><Next to="explain" label="What physics actually does" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.decide} onClick={() => set('decidelocked', true)}>Commit</button>
              </div>
            )}
          </>
        );
      }

      /* §8 — and the two halves must not merge. What E3 established is one
       * thing; what modern physics does anyway is another, and running them
       * together would answer J1 retrospectively. */
      case 'explain':
        return (
          <>
            <p className="kicker">Explanation</p>
            <h2 style={{ marginTop: '.2rem' }}>Two separate things.</h2>
            <div className="threeway two">
              <div className="tw measured">
                <h4>What you established</h4>
                <ul>
                  <li>a reproducible pattern of push around a charge</li>
                  <li>that this pattern does <strong>not</strong> decide between the two accounts</li>
                  <li>what kind of observation would</li>
                </ul>
              </div>
              <div className="tw elsewhere">
                <h4>What physics does anyway</h4>
                <ul>
                  <li>describes the interaction using <strong>electric and magnetic fields</strong></li>
                  <li>assigns a condition to every position, occupied or not</li>
                  <li>for reasons that arrive later than this lesson</li>
                </ul>
              </div>
            </div>
            <p>
              We describe this spatial pattern using the <strong>electric field</strong>. Treating
              it as something present at every point is a <strong>choice of description</strong>{' '}
              that electrostatics alone does not force — and one that becomes far more than
              bookkeeping once charges move.
            </p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}>Three reasons that choice turned out to be the right one. Only the first is anything you have seen.</p>
              <ol style={{ marginBottom: 0 }}>
                <li><strong>It is local.</strong> Every object responds only to what is at its own position. Nothing has to reach across a gap.</li>
                <li><strong>It survives motion.</strong> When charges move the delay is real and measured, and this description handles it unchanged. The other does not.</li>
                <li><strong>It carries energy.</strong> Later: changing electric and magnetic fields can travel through space and carry energy, after the charge that made them has stopped.</li>
              </ol>
            </div>
            <p className="small muted">
              Reasons two and three are outside anything you did today. They are named as the
              reasons, and marked as promises this course has to keep — not as things you have
              shown.
            </p>
            <div className="actions">
              <Next to="math" label="Write it down" />
              <button className="btn" onClick={() => go('faraday')}>Who argued about this? →</button>
            </div>
          </>
        );

      /* Optional branch — off-spine, so it does not count against "screen N of M".
       * The review's advice, taken: E3 already carries a heavy conceptual load and
       * Faraday, Poisson, Ampère and Maxwell arriving immediately after the
       * epistemic distinction would turn the lesson into history of physics. */
      case 'faraday':
        return (
          <>
            <p className="kicker">Optional · the nineteenth century</p>
            <h2 style={{ marginTop: '.2rem' }}>Your question was a real argument.</h2>
            <div className="card warn">
              <p style={{ margin: 0 }}>
                ⚠ <strong>This section is not yet sourced.</strong> Everything below is written from
                general knowledge, and this course does not put unsourced history in front of
                students as fact. E1's Franklin section was traced to a primary source before it
                shipped; this one has not been. Read it as a story we still owe you a citation for.
              </p>
            </div>
            <p>
              The mathematical tradition of Ampère and Poisson treated electric and magnetic forces
              as acting directly across distance. Faraday thought instead in terms of{' '}
              <strong>lines of force</strong> filling the space, and held that they were physically
              real rather than a drawing aid. Maxwell later put that picture into equations — and
              those equations predicted that a disturbance in the field travels at a finite speed,
              which turned out to be the speed of light.
            </p>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                The thing that eventually settled it was the thing you named a moment ago:{' '}
                <strong>what happens when charges move.</strong>
              </p>
            </div>
            <div className="actions"><Back to="explain" /><Next to="math" label="On to the notation" /></div>
          </>
        );

      case 'math':
        return (
          <>
            <p className="kicker">Compression</p>
            <h2 style={{ marginTop: '.2rem' }}>One line, and two things deliberately missing.</h2>
            <p>
              Your map has a problem as a record: the arrows depend on how much charge you imagined
              putting at each point. A bigger test ball would be pushed harder everywhere, and the
              map would look different while describing the same situation.
            </p>
            <p>Divide it out.</p>
            <div className="eq">E &nbsp;=&nbsp; F / q<span className="sub">test</span></div>
            <p>
              <strong>The push, divided by the size of whatever you used to measure it.</strong>{' '}
              That is what makes it a property of the <em>position</em> rather than of the pair.
            </p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>Two things are not here, on purpose.</strong></p>
              <p style={{ margin: '0 0 .5rem' }}>
                <strong>No formula for E itself.</strong> Nothing you did today measured how the
                field of a charge falls off — that was E2's question and E2 could not settle it
                either.
              </p>
              <p style={{ margin: 0 }}>
                <strong>No field lines.</strong> You drew six arrows. Joining them into continuous
                curves is a further choice, and it adds a claim about the space between your six
                positions that nothing here supports. Later, when there is a reason.
              </p>
            </div>
            <p className="small muted">You have earned the <strong>field model</strong>. It stays available.</p>
            <div className="actions"><Next to="ledger" label="What do we know now?" /></div>
          </>
        );

      case 'ledger':
        return (
          <>
            <p className="kicker">Investigation complete</p>
            <h2 style={{ marginTop: '.2rem' }}>What do we know now?</h2>
            <div className="card">
              <div className="ledger">
                <div>
                  <h3 style={{ marginTop: 0 }}>You established</h3>
                  <ul className="yes">
                    <li>The question exists. Two objects, no contact, and a force is <em>strange</em>, and E2 never mentioned it</li>
                    <li>A map of pushes around a charge does not decide what is at an empty point</li>
                    <li>What kind of observation would decide it — movement and timing</li>
                    <li>That “I cannot tell from this” is a conclusion, not a failure</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ marginTop: 0 }}>You did not establish</h3>
                  <ul className="no">
                    <li><strong>That the field is real.</strong> Nothing here could — and that is a fact about electrostatics, not about your apparatus</li>
                    <li>That your map is even correct. <strong>Nobody has measured it</strong></li>
                    <li>How the field falls off with distance</li>
                    <li>Whether the delay is real, or how long it is</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="locked-note">
              <span className="lab">Your very first answer, before any of this</span>
              <strong>{run.p1why || '(left blank)'}</strong>
            </div>
            <p>
              Read it again. You wrote that before you had a map, before you had two accounts to
              choose between, and before you knew the question could not be settled by looking
              harder. <strong>You do not have to have been wrong.</strong> The useful thing is
              whether you can now say what your answer was assuming.
            </p>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                E2 asked what decides how hard. E3 asked how the push crosses the gap and found the
                question harder than it looks. Next: why a charged comb picks up paper that has no
                charge at all — where <strong>F = qE with q = 0 predicts nothing happens</strong>,
                and the paper moves anyway.
              </p>
            </div>
            <div className="actions">
              <a className="btn primary" href="/models">See the models you have earned</a>
              <button
                className="btn ghost"
                onClick={() => {
                  if (confirm('Start E3 from the beginning? Your locked answers will be cleared.')) {
                    localStorage.removeItem(STORAGE_KEY);
                    setRun(defaultRun());
                  }
                }}
              >
                Run it again
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="inv-card">
      <DevJump
        label="E3"
        steps={[...STEPS, 'faraday' as Step]}
        current={step}
        onJump={go}
        onSeed={() =>
          setRun((r) => ({
            ...r,
            p1why: 'Nothing is there until you put something there.',
            p1locked: true,
            map: { a: 'out', b: 'out', c: 'out', d: 'out', e: 'out', f: 'out' },
            maplocked: true,
            timing: 'instant', timinglocked: true,
            judge: 'A', judgelocked: true,
            decide: 'moving', decidelocked: true,
          }))
        }
      />
      {n >= 0 && (
        <p className="screen-of" aria-live="polite">Screen {n + 1} of {STEPS.length}</p>
      )}
      {body()}
    </div>
  );
}
