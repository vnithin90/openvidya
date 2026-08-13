/**
 * E4 — Why does a charged comb pick up paper nobody rubbed?
 *
 * Built from Q-E01 in docs/QUESTION_MAP_SCHEMA_TEST.md. Not ported from any
 * other tree.
 *
 * THE ONE THING THIS LESSON MUST GET RIGHT
 *
 * The second trial is the only evidence separating "the paper had a leftover"
 * from "charge shifted inside the paper". A review of a parallel build found
 * that trial doing nothing at all — docs/specs/E4-grok-review.md — because its
 * story A said the paper PICKED UP charge from the comb, and the second trial
 * used FRESH paper. Under that wording both accounts predict attraction twice
 * and the experiment separates nothing.
 *
 * So here, unavoidably paired:
 *   · story A gives the paper a leftover it ALREADY HAD, and
 *   · trial 2 uses THE SAME BITS.
 * Change one without the other and the lesson stops working.
 *
 * SECOND: a neutral scrap feels no force in a UNIFORM field, however strong.
 * That is the physics most treatments skip, and Q-E01 names it as required
 * rather than a footnote. It gets its own screen and its own figure.
 *
 * No equations here — hard rule 1. src/physics/polarisation/model.ts holds the
 * model; this lesson computes nothing.
 */

import { useCallback, useEffect, useState } from 'react';
import DevJump from './DevJump';
import { Contrast, PrereqNote, RecordBar, clearRun, earnModel, loadRun, saveRun } from './runtime';
import { CombPaperScene, GradientScene, InsideScene, KitScene } from './scenes/E4Scenes';

type P1 = 'toward' | 'away' | 'nothing';
type P2 = 'toward' | 'away' | 'nothing' | 'unsure';
type Obs1 = 'toward' | 'away' | 'nothing';
type Obs2 = 'toward' | 'away' | 'nothing';
type Judge = 'A' | 'B' | 'neither';
type Failed = 'formula' | 'q' | 'nopush';

type Step =
  | 'entry' | 'encounter'
  | 'p1' | 'try1'
  | 'p2' | 'try2'
  | 'judge' | 'formula'
  | 'inside' | 'gradient'
  | 'maths' | 'ledger';

const STEPS: Step[] = [
  'entry', 'encounter',
  'p1', 'try1',
  'p2', 'try2',
  'judge', 'formula',
  'inside', 'gradient',
  'maths', 'ledger',
];

export const BENCH_ACTIONS: Record<Step, 'none' | 'performable' | 'deferred'> = {
  entry: 'none',
  encounter: 'none',
  p1: 'none',
  try1: 'performable',   // a comb and torn paper; means already held
  p2: 'none',
  try2: 'performable',
  judge: 'none',
  formula: 'none',
  inside: 'none',
  gradient: 'none',
  maths: 'none',
  ledger: 'none',
};

/**
 * The two stories, and the wording is load-bearing.
 *
 * A's leftover is one the paper ALREADY HAD. If A instead said the paper picked
 * the charge up from the comb, fresh paper would reset it and trial 2 would
 * separate nothing. See the header.
 */
export const STORY_A =
  'Those bits already had a leftover of one kind, before any comb came near. ' +
  'The comb happens to be the unlike kind, so it pulls them. Bring the other kind ' +
  'of comb to the same bits and they should be pushed away.';

export const STORY_B =
  'The paper’s leftover is zero and stays zero. Charge inside it shifts a little. ' +
  'The side facing the comb ends up the unlike kind, so it is pulled. Flip the comb ' +
  'and both sides swap over. The near side is still unlike, so it is still pulled.';

interface RunState {
  step: Step;
  p1?: P1; p1why: string; p1locked: boolean;
  o1?: Obs1;
  p2?: P2; p2locked: boolean;
  o2?: Obs2;
  judge?: Judge; judgelocked: boolean;
  failed?: Failed; failedlocked: boolean;
}


function defaultRun(): RunState {
  return {
    step: 'entry',
    p1why: '', p1locked: false,
    p2locked: false,
    judgelocked: false,
    failedlocked: false,
  };
}



const P1_LABEL: Record<P1, string> = {
  toward: 'The paper moves toward the comb',
  away: 'The paper moves away',
  nothing: 'Nothing. It has no charge',
};
const P2_LABEL: Record<P2, string> = {
  toward: 'It still comes toward the comb',
  away: 'This time it is pushed away',
  nothing: 'Nothing happens this time',
  unsure: 'I cannot say',
};

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

export default function E4Investigation() {
  const [run, setRun] = useState<RunState>(defaultRun);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setRun(loadRun('e4', defaultRun)); setHydrated(true); }, []);
  useEffect(() => {
    if (!hydrated) return;
    saveRun('e4', run);
  }, [run, hydrated]);
  useEffect(() => { if (run.step === 'maths') earnModel('polarisation'); }, [run.step]);

  const go = useCallback((step: Step) => {
    setRun((r) => ({ ...r, step }));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const set = useCallback(<K extends keyof RunState>(k: K, v: RunState[K]) => {
    setRun((r) => ({ ...r, [k]: v }));
  }, []);

  const step = run.step;
  const n = STEPS.indexOf(step);

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
            <p className="kicker">Investigation E4 · Electricity</p>
            <h1>Why does a comb pick up paper that nobody rubbed?</h1>
            <p className="lead">
              E1 said a leftover of zero does not mean nothing is there. This asks what that has
              to do with a comb and some bits of paper.
            </p>
            <div className="card quiet">
              <h3 style={{ marginTop: 0 }}>You will need</h3>
              <KitScene />
              <ul>
                <li>A dry plastic comb, or a balloon from E1.</li>
                <li>Small bits of torn paper. Torn, not rubbed.</li>
                <li>A second comb or balloon if you can manage one. It has to carry the other kind of charge.</li>
              </ul>
              <p className="small muted" style={{ marginBottom: 0 }}>
                On a damp day nothing happens. That is the air, not a new law. Try a drier room.
              </p>
            </div>
            <PrereqNote needs="charge" label="E1 · What is charge?" href="/learn/electricity/what-is-charge" />
            <p className="small muted">Your predictions lock once you commit them.</p>
            <div className="actions"><Next to="encounter" label="Begin" /></div>
          </>
        );

      case 'encounter':
        return (
          <>
            <p className="kicker">The question</p>
            <h2 style={{ marginTop: '.2rem' }}>Only one of these has been rubbed.</h2>
            <CombPaperScene />
            <p>
              In E1 you rubbed two balloons, or a balloon and your hair. Both partners were
              treated. Here only the comb is. The paper is exactly as it came off the page.
            </p>
            <p>
              From E1: a leftover of zero means both kinds, in equal amounts. It does not mean
              the paper is empty.
            </p>
            <div className="actions"><Back to="entry" /><Next to="p1" label="Predict first" /></div>
          </>
        );

      case 'p1':
        return (
          <>
            <p className="kicker">Prediction 1 of 2</p>
            <h2 style={{ marginTop: '.2rem' }}>You rub the comb and hold it close. What do the bits do?</h2>
            <CombPaperScene />
            <Choices
              options={[
                { id: 'toward' as P1, label: P1_LABEL.toward },
                { id: 'away' as P1, label: P1_LABEL.away },
                { id: 'nothing' as P1, label: P1_LABEL.nothing },
              ]}
              value={run.p1}
              locked={run.p1locked}
              onPick={(v) => set('p1', v)}
            />
            <p className="small muted" style={{ marginBottom: '.3rem' }}>Why? One sentence.</p>
            <textarea
              value={run.p1why}
              disabled={run.p1locked}
              placeholder="Because…"
              onChange={(e) => set('p1why', e.target.value)}
            />
            {run.p1locked ? (
              <>
                <div className="locked-note">
                  <span className="lab">Locked</span>
                  <strong>{run.p1 ? P1_LABEL[run.p1] : ''}</strong>
                </div>
                <div className="actions"><Next to="try1" label="Now try it" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.p1} onClick={() => set('p1locked', true)}>Commit</button>
              </div>
            )}
          </>
        );

      case 'try1':
        return (
          <>
            <p className="kicker">Trial 1</p>
            <h2 style={{ marginTop: '.2rem' }}>Rub the comb. Hold it just above the bits.</h2>
            <CombPaperScene lifted={run.o1 === 'toward'} />
            <p className="small muted">Do not let the comb touch them. What happened?</p>
            <Choices
              options={[
                { id: 'toward' as Obs1, label: 'The bits jumped up to the comb' },
                { id: 'away' as Obs1, label: 'The bits moved away' },
                { id: 'nothing' as Obs1, label: 'Nothing, or I could not tell' },
              ]}
              value={run.o1}
              locked={false}
              onPick={(v) => set('o1', v)}
            />
            {run.o1 === 'nothing' && (
              <div className="card warn">
                <p style={{ margin: 0 }}>
                  Damp air stops this. Tear smaller bits. Rub the comb for longer. A balloon often
                  works when a comb will not.
                </p>
              </div>
            )}
            {run.o1 && run.o1 !== 'nothing' && (
              <Contrast
                predicted={run.p1}
                observed={run.o1}
                predictedLabel={run.p1 ? P1_LABEL[run.p1] : '—'}
                observedLabel={P1_LABEL[run.o1]}
              />
            )}
            <div className="actions"><Next to="p2" label="Next prediction" enabled={!!run.o1} /></div>
          </>
        );

      /* THE DISCRIMINATING TRIAL. Same bits, other kind of comb. */
      case 'p2':
        return (
          <>
            <p className="kicker">Prediction 2 of 2 · <span className="ptag test">this one tells two stories apart</span></p>
            <h2 style={{ marginTop: '.2rem' }}>Now the other kind of charge, on the same bits.</h2>
            <p>
              From E1: two objects that attract each other carry different kinds. Charge a second
              comb so that it attracts the first one. That second comb is the other kind.
            </p>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                <strong>Use the same bits of paper.</strong> Not fresh ones. This matters more than
                it looks, and you will see why on the next screen but one.
              </p>
            </div>
            <p className="small muted">
              If a bit actually touched the first comb, throw that one away. Touching moves charge,
              and then it is a different experiment.
            </p>
            <Choices
              options={[
                { id: 'toward' as P2, label: P2_LABEL.toward },
                { id: 'away' as P2, label: P2_LABEL.away },
                { id: 'nothing' as P2, label: P2_LABEL.nothing },
                { id: 'unsure' as P2, label: P2_LABEL.unsure },
              ]}
              value={run.p2}
              locked={run.p2locked}
              onPick={(v) => set('p2', v)}
            />
            {run.p2locked ? (
              <>
                <div className="locked-note">
                  <span className="lab">Locked</span>
                  <strong>{run.p2 ? P2_LABEL[run.p2] : ''}</strong>
                </div>
                <div className="actions"><Next to="try2" label="Try it" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.p2} onClick={() => set('p2locked', true)}>Commit</button>
              </div>
            )}
          </>
        );

      case 'try2':
        return (
          <>
            <p className="kicker">Trial 2</p>
            <h2 style={{ marginTop: '.2rem' }}>The other kind of comb, over the same bits.</h2>
            <CombPaperScene lifted={run.o2 === 'toward'} kind="minus" />
            <Choices
              options={[
                { id: 'toward' as Obs2, label: 'They still came toward the comb' },
                { id: 'away' as Obs2, label: 'They were pushed away this time' },
                { id: 'nothing' as Obs2, label: 'Nothing, or I could not make the other kind' },
              ]}
              value={run.o2}
              locked={false}
              onPick={(v) => set('o2', v)}
            />
            {run.o2 === 'nothing' && (
              <div className="card warn">
                <p style={{ margin: 0 }}>
                  <strong>Say so, and keep going.</strong> In a dry room, with a comb that really is
                  the other kind, the bits still come closer. You are taking that from us rather
                  than from your own bench, and the next screen depends on it.
                </p>
              </div>
            )}
            {run.o2 && run.o2 !== 'nothing' && (
              <Contrast
                /* "I cannot say" is a real answer here, not a wrong one. It has
                   nothing to compare against, so Contrast is told so. */
                predicted={run.p2 === 'unsure' ? undefined : run.p2}
                observed={run.o2}
                predictedLabel={run.p2 ? P2_LABEL[run.p2] : '—'}
                observedLabel={run.o2 === 'toward' ? P2_LABEL.toward : P2_LABEL.away}
              />
            )}
            <div className="actions"><Next to="judge" label="Two students disagree" enabled={!!run.o2} /></div>
          </>
        );

      case 'judge': {
        const right = run.judge === 'B';
        return (
          <>
            <p className="kicker">Judgment</p>
            <h2 style={{ marginTop: '.2rem' }}>Two students. Both trials.</h2>
            <div className="models">
              <div className="model-card static"><span className="tag">Student A</span><p>“{STORY_A}”</p></div>
              <div className="model-card static"><span className="tag">Student B</span><p>“{STORY_B}”</p></div>
            </div>
            <p className="small muted">
              They agree about trial 1. They do not agree about trial 2. Which one did your bench
              back up?
            </p>
            <Choices
              options={[
                { id: 'A' as Judge, label: 'A. The bits already had a leftover of one kind' },
                { id: 'B' as Judge, label: 'B. The leftover stayed zero, and charge inside shifted' },
                { id: 'neither' as Judge, label: 'Neither. Both trials look the same under either story' },
              ]}
              value={run.judge}
              locked={run.judgelocked}
              onPick={(v) => set('judge', v)}
            />
            {run.judgelocked ? (
              <>
                <div className={`card ${right ? 'accent' : 'warn'}`}>
                  <p style={{ marginTop: 0 }}>
                    <strong>B, and trial 2 is why.</strong> A says the bits carry one fixed kind. The
                    other comb is the other kind. So A predicts a push, on those same bits. You did
                    not see a push.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    {run.judge === 'neither'
                      ? 'This is not E3. There the two stories drew the same arrows and no measurement could separate them. Here they say different things about trial 2, and you already looked.'
                      : 'B says the near side is always the unlike kind, whichever comb you bring. So B expects a pull both times, which is what happened.'}
                  </p>
                </div>
                <div className="card quiet">
                  <p style={{ margin: 0 }}>
                    <strong>Why the same bits mattered.</strong> With fresh paper, A could say the new
                    bits happened to carry the other kind, and it would fit again. Reusing the bits
                    is what closes that door.
                  </p>
                </div>
                <div className="actions"><Next to="formula" label="A formula you may already know" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.judge} onClick={() => set('judgelocked', true)}>Commit my judgment</button>
              </div>
            )}
          </>
        );
      }

      case 'formula': {
        const ok = run.failed === 'q';
        return (
          <>
            <p className="kicker">Judgment · the formula</p>
            <h2 style={{ marginTop: '.2rem' }}>Many books write F = q E.</h2>
            <p>
              Read q as the leftover on the paper. The paper was never rubbed, so its leftover is
              zero. Multiply anything by zero and you get zero.
            </p>
            <p><strong>So the formula says no force at all. The paper moved. What failed?</strong></p>
            <Choices
              options={[
                { id: 'formula' as Failed, label: 'The formula is wrong. Throw it out' },
                { id: 'q' as Failed, label: 'The leftover is not the only charge that feels a push' },
                { id: 'nopush' as Failed, label: 'There is no push near the comb at all' },
              ]}
              value={run.failed}
              locked={run.failedlocked}
              onPick={(v) => set('failed', v)}
            />
            {run.failedlocked ? (
              <>
                <div className={`card ${ok ? 'accent' : 'warn'}`}>
                  <p style={{ marginTop: 0 }}>
                    <strong>The leftover is not the whole story.</strong> Both kinds are still inside
                    the paper. Each kind feels a push. They sit in slightly different places, so the
                    two pushes do not cancel.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    We are not throwing the formula away. We are saying what its q is about: a
                    leftover, sitting at one place. This paper is not that.
                  </p>
                </div>
                <div className="actions"><Next to="inside" label="Draw what is inside" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.failed} onClick={() => set('failedlocked', true)}>Commit</button>
              </div>
            )}
          </>
        );
      }

      case 'inside':
        return (
          <>
            <p className="kicker">The picture</p>
            <h2 style={{ marginTop: '.2rem' }}>Charge inside the paper shifts. Nothing leaves.</h2>
            <InsideScene state="balanced" />
            <p>Before the comb arrives, both kinds are in the paper, evenly mixed. The leftover is zero.</p>
            <InsideScene state="shifted" />
            <p>
              The comb pulls one kind a little closer and pushes the other a little further. The
              side facing the comb is now the unlike kind. Nothing has left the paper. The leftover
              is still zero.
            </p>
            <InsideScene state="shifted" kind="minus" />
            <p>
              Bring the other kind of comb and both sides swap over. The near side is still the
              unlike kind. So the pull is still a pull. That is trial 2.
            </p>
            <div className="card warn">
              <p style={{ margin: 0 }}>
                <strong>We are assuming something.</strong> Charge has to be able to shift a little
                inside paper. Nothing you did today shows that it can. In E1 you moved charge from
                one object to another and it stayed where it landed. This is different: nothing
                moves from the comb to the paper. We are telling you we are assuming it.
              </p>
            </div>
            <p className="small muted">
              The shift has a name: <strong>polarisation</strong>. The name is not a new fact. It is
              a short word for the picture above.
            </p>
            <div className="actions"><Next to="gradient" label="One thing left to explain" /></div>
          </>
        );

      /* The physics Q-E01 names as required rather than a footnote. */
      case 'gradient':
        return (
          <>
            <p className="kicker">The part that is easy to miss</p>
            <h2 style={{ marginTop: '.2rem' }}>Why does it move at all?</h2>
            <p>
              One side is pulled toward the comb. The other side is pushed away. Those are opposite
              directions. Why does the paper go anywhere?
            </p>
            <GradientScene />
            <p>
              <strong>Because the near side is nearer.</strong> The push from a comb is stronger
              close up and weaker further away. So the pull on the near side beats the push on the
              far side, and the paper wins its way inward.
            </p>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                If the push were the same everywhere, the two sides would cancel exactly. The paper
                would not move at all, however strong the push was. <strong>A neutral thing only
                moves when the push changes from place to place.</strong>
              </p>
            </div>
            <p className="small muted">
              You did not measure that with a ruler. You worked it out from the fact that the bits
              jumped.
            </p>
            <div className="actions"><Next to="maths" label="Write it down" /></div>
          </>
        );

      case 'maths':
        return (
          <>
            <p className="kicker">Compression</p>
            <h2 style={{ marginTop: '.2rem' }}>What the formula is really about.</h2>
            <div className="eq">
              F &nbsp;=&nbsp; q<span className="sub">net</span> E
              <span className="hint">
                q<span className="sub">net</span> is the leftover. For this paper it is zero, and the
                paper still moved.
              </span>
            </div>
            <p>
              Used on the paper as a whole, that line predicts nothing happens. The missing piece is
              not a new symbol. It is that the two kinds sit in two different places, and the push is
              not the same at both.
            </p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>Two things are missing on purpose.</strong></p>
              <p style={{ margin: '0 0 .5rem' }}>
                <strong>No number for how far the charge shifts.</strong> You did not measure it, and
                you have no way to.
              </p>
              <p style={{ margin: 0 }}>
                <strong>No field lines.</strong> You watched paper jump. Drawing curves through the
                space around the comb would add a claim your bits of paper never made.
              </p>
            </div>
            <p className="small muted">You have earned the <strong>polarisation model</strong>.</p>
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
                    <li>Paper nobody rubbed can still be pulled by a comb</li>
                    <li>Swapping the comb for the other kind does not swap the pull</li>
                    <li>So the bits did not simply carry a leftover of their own</li>
                    <li>A leftover of zero does not mean nothing feels a push</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ marginTop: 0 }}>You did not establish</h3>
                  <ul className="no">
                    <li>That charge really can shift inside paper. You assumed it</li>
                    <li>Why it can shift in paper but stayed put on an E1 balloon</li>
                    <li>How far it shifts, or any number for the pull</li>
                    <li>That the push really is stronger nearer. You worked it out, you did not measure it</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="locked-note">
              <span className="lab">Your first reason, before any of this</span>
              <strong>{run.p1why || '(left blank)'}</strong>
            </div>
            <p>
              Read it again. “It is neutral, so nothing happens” is a good first answer. It is what
              the usual formula says. The useful thing is knowing which assumption it was leaning on.
            </p>
            <RecordBar />
            <div className="actions">
              <a className="btn primary" href="/models">See the models you have earned</a>
              <a className="btn" href="/">Home</a>
              <button
                className="btn ghost"
                onClick={() => {
                  if (confirm('Start E4 from the beginning? Your locked answers will be cleared.')) {
                    clearRun('e4');
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
        label="E4"
        steps={STEPS}
        current={step}
        onJump={go}
        onSeed={() =>
          setRun((r) => ({
            ...r,
            p1: 'nothing', p1why: 'The paper has no charge, so nothing should happen.', p1locked: true,
            o1: 'toward',
            p2: 'away', p2locked: true,
            o2: 'toward',
            judge: 'B', judgelocked: true,
            failed: 'q', failedlocked: true,
          }))
        }
      />
      {n >= 0 && <p className="screen-of" aria-live="polite">Screen {n + 1} of {STEPS.length}</p>}
      {body()}
    </div>
  );
}
