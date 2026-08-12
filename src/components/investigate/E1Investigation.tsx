/**
 * E1 — What is charge? Student investigation runtime.
 * Design source: LESSON_E1_what-is-charge.md + storyboard.
 * This file is the student-facing path only — not the design record.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ApparatusScene,
  CancellationScene,
  FranklinExperiment,
  FranklinPortrait,
  HairScene,
  MiniScene,
  PairScene,
} from './scenes/E1Scenes';

type Trio = 'attract' | 'repel' | 'nothing';
type JudgePick = 'A' | 'B' | 'both' | 'neither';
type Falsify = 'both-at-once' | 'nothing-while-others' | 'colour' | 'other';
type Franklin = 'tools' | 'names' | 'theory' | 'other';

type Step =
  | 'entry'
  | 'encounter'
  | 'predict1'
  | 'observe1'
  | 'predict2'
  | 'observe2'
  | 'observe3'
  | 'conflict'
  | 'judge'
  | 'falsify'
  | 'model'
  | 'history'
  | 'math'
  | 'done';

interface RunState {
  step: Step;
  p1?: Trio;
  p1Locked: boolean;
  o1?: Trio;
  p2?: Trio;
  p2Locked: boolean;
  o2?: Trio;
  o3?: Trio;
  judge?: JudgePick;
  judgeLocked: boolean;
  falsify?: Falsify;
  franklin?: Franklin;
  franklinLocked: boolean;
}

const STORAGE_KEY = 'openvidya-e1-run-v1';
const MODEL_KEY = 'openvidya-models-earned';

const STEPS: Step[] = [
  'entry',
  'encounter',
  'predict1',
  'observe1',
  'predict2',
  'observe2',
  'observe3',
  'conflict',
  'judge',
  'falsify',
  'model',
  'history',
  'math',
  'done',
];

const labelTrio = (t: Trio) =>
  t === 'attract' ? 'ATTRACT' : t === 'repel' ? 'REPEL' : 'NOTHING / UNCLEAR';

const labelJudge = (j: JudgePick) =>
  j === 'A' ? 'A only' : j === 'B' ? 'B only' : j === 'both' ? 'Both' : 'Neither';

function loadRun(): RunState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultRun(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultRun();
}

function defaultRun(): RunState {
  return {
    step: 'entry',
    p1Locked: false,
    p2Locked: false,
    judgeLocked: false,
    franklinLocked: false,
  };
}

function stageFor(step: Step): 'question' | 'predict' | 'observe' | 'judge' | 'model' | 'math' {
  if (step === 'entry' || step === 'encounter') return 'question';
  if (step === 'predict1' || step === 'predict2') return 'predict';
  if (['observe1', 'observe2', 'observe3', 'conflict'].includes(step)) return 'observe';
  if (step === 'judge' || step === 'falsify') return 'judge';
  if (step === 'model' || step === 'history') return 'model';
  return 'math';
}

function EpistemicStrip({ step }: { step: Step }) {
  const cur = stageFor(step);
  const order = ['question', 'predict', 'observe', 'judge', 'model', 'math'] as const;
  const labels = {
    question: 'Question',
    predict: 'Predict',
    observe: 'Observe',
    judge: 'Judge',
    model: 'Model',
    math: 'Math',
  };
  const idx = order.indexOf(cur);
  return (
    <ul className="ep-strip" aria-label="Where you are in the investigation">
      {order.map((s, i) => (
        <li key={s} className={i < idx ? 'done' : i === idx ? 'now' : ''}>
          {labels[s]}
        </li>
      ))}
    </ul>
  );
}

function ChoiceList<T extends string>({
  options,
  value,
  locked,
  onChange,
}: {
  options: { id: T; label: string }[];
  value?: T;
  locked?: boolean;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inv-choices" role="radiogroup">
      {options.map((o) => (
        <label
          key={o.id}
          className={`inv-choice ${value === o.id ? 'selected' : ''} ${locked ? 'locked' : ''}`}
        >
          <input
            type="radio"
            name="choice"
            checked={value === o.id}
            disabled={locked}
            onChange={() => onChange(o.id)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function Mismatch({
  predicted,
  observed,
}: {
  predicted: string;
  observed: string;
}) {
  const agree = predicted === observed;
  return (
    <div className={`inv-mismatch ${agree ? 'agree' : ''}`}>
      <div className="pair">
        <div className="box">
          <span className="lab">You predicted</span>
          <span className="big">{predicted}</span>
        </div>
        <div className="box">
          <span className="lab">You observed</span>
          <span className="big">{observed}</span>
        </div>
      </div>
      <p className="need">
        {agree
          ? 'Your prediction matched this observation. Keep going — we will stress-test it.'
          : 'Your model predicted one thing. The experiment produced another. Something needs explaining.'}
      </p>
    </div>
  );
}

function BalloonStage({ caption }: { caption: string }) {
  return (
    <div className="vis-stage" aria-hidden>
      <div className="balloon" />
      <div className="balloon b2" />
      <span className="vis-caption">{caption}</span>
    </div>
  );
}

function earnChargeModel() {
  try {
    const raw = localStorage.getItem(MODEL_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes('charge')) {
      localStorage.setItem(MODEL_KEY, JSON.stringify([...list, 'charge']));
    }
  } catch {
    /* ignore */
  }
}

export default function E1Investigation() {
  const [run, setRun] = useState<RunState>(defaultRun);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRun(loadRun());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(run));
    } catch {
      /* ignore */
    }
  }, [run, hydrated]);

  const go = useCallback((step: Step) => setRun((r) => ({ ...r, step })), []);

  const reset = () => {
    if (confirm('Start E1 from the beginning? Your locked predictions will be cleared.')) {
      localStorage.removeItem(STORAGE_KEY);
      setRun(defaultRun());
    }
  };

  const stepIndex = STEPS.indexOf(run.step);

  const body = useMemo(() => {
    switch (run.step) {
      case 'entry':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Electricity · Investigation</p>
            <h1 className="inv-title">What is charge?</h1>
            <p className="inv-lead">
              …and how much of it is there? You will form expectations, try a real experiment, and
              only then earn a model.
            </p>
            <div className="inv-proto">
              <strong>You will need</strong>
              <ol>
                <li>Two balloons</li>
                <li>Thread (to hang them)</li>
                <li>Dry hair or wool to rub on</li>
              </ol>
              <p className="note-soft" style={{ marginTop: '0.6rem' }}>
                About 20–30 minutes with real objects. Humidity can kill the effect — a dry day
                helps.
              </p>
              <ApparatusScene />
            </div>
            <div className="inv-actions">
              <button type="button" className="inv-btn primary" onClick={() => go('encounter')}>
                Begin
              </button>
            </div>
          </div>
        );

      case 'encounter':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Encounter</p>
            <h2 className="inv-title">You’ve felt this before</h2>
            <p className="inv-lead">
              Rubbing something, then it pulls hair or paper. We will use two balloons — but before
              we name anything, we need your expectations.
            </p>
            {/* Hanging straight down: the result is not shown before the prediction. */}
            <PairScene angle={0} leftLabel="rubbed" rightLabel="rubbed" />
            <div className="inv-actions">
              <button type="button" className="inv-btn primary" onClick={() => go('predict1')}>
                Continue
              </button>
            </div>
          </div>
        );

      case 'predict1':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Prediction 1 of 2</p>
            <h2 className="inv-title">Two rubbed balloons</h2>
            <div className="inv-proto">
              <strong>You will:</strong>
              <ol>
                <li>Rub both balloons on hair (or wool)</li>
                <li>Hang them so they can swing freely</li>
                <li>Let go</li>
              </ol>
            </div>
            <p className="inv-lead">What do you think will happen between the two balloons?</p>
            {!run.p1Locked ? (
              <>
                <ChoiceList
                  options={[
                    { id: 'attract', label: 'Attract — move toward each other' },
                    { id: 'repel', label: 'Repel — move apart' },
                    { id: 'nothing', label: 'Nothing important will happen' },
                  ]}
                  value={run.p1}
                  onChange={(p1) => setRun((r) => ({ ...r, p1 }))}
                />
                <div className="inv-actions">
                  <button
                    type="button"
                    className="inv-btn primary"
                    disabled={!run.p1}
                    onClick={() => setRun((r) => ({ ...r, p1Locked: true }))}
                  >
                    Commit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="inv-lock">
                  <h3>Your prediction is locked</h3>
                  <div className="val">{labelTrio(run.p1!)}</div>
                  <p>Locked until after the observation. You cannot change it now.</p>
                </div>
                <div className="inv-actions">
                  <button type="button" className="inv-btn primary" onClick={() => go('observe1')}>
                    Go to the experiment
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'observe1':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Observe</p>
            <h2 className="inv-title">Do it</h2>
            <div className="inv-proto">
              <ol>
                <li>Rub both balloons.</li>
                <li>Suspend them on threads.</li>
                <li>Let go. Watch for a few seconds.</li>
              </ol>
            </div>
            {/* Draws what the student reports, after they report it — never before. */}
            {run.o1 && (
              <PairScene
                angle={run.o1 === 'repel' ? 17 : run.o1 === 'attract' ? -9 : 0}
                leftLabel="rubbed"
                rightLabel="rubbed"
              />
            )}
            <p className="inv-lead">What happened?</p>
            <ChoiceList
              options={[
                { id: 'attract', label: 'They attracted' },
                { id: 'repel', label: 'They repelled' },
                { id: 'nothing', label: 'Nothing / I couldn’t tell' },
              ]}
              value={run.o1}
              onChange={(o1) => setRun((r) => ({ ...r, o1 }))}
            />
            {run.o1 && run.p1 && (
              <Mismatch predicted={labelTrio(run.p1)} observed={labelTrio(run.o1)} />
            )}
            <p className="note-soft">
              If humidity kills the effect, note “couldn’t tell” and continue — or retry on a drier
              day. Do not invent a result you did not see.
            </p>
            <div className="inv-actions">
              <button
                type="button"
                className="inv-btn primary"
                disabled={!run.o1}
                onClick={() => go('predict2')}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'predict2':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Prediction 2 of 2</p>
            <h2 className="inv-title">Rubbed balloon and hair</h2>
            <p className="inv-lead">
              Take one rubbed balloon. Bring it near your hair (gently). What do you think will
              happen?
            </p>
            {/* lift = 0: the hair is drawn hanging, so the picture states the setup
                and not the outcome. */}
            <HairScene lift={0} />
            {!run.p2Locked ? (
              <>
                <ChoiceList
                  options={[
                    { id: 'attract', label: 'Attract' },
                    { id: 'repel', label: 'Repel' },
                    { id: 'nothing', label: 'Nothing' },
                  ]}
                  value={run.p2}
                  onChange={(p2) => setRun((r) => ({ ...r, p2 }))}
                />
                <div className="inv-actions">
                  <button
                    type="button"
                    className="inv-btn primary"
                    disabled={!run.p2}
                    onClick={() => setRun((r) => ({ ...r, p2Locked: true }))}
                  >
                    Commit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="inv-lock">
                  <h3>Your prediction is locked</h3>
                  <div className="val">{labelTrio(run.p2!)}</div>
                  <p>Locked until after the observation.</p>
                </div>
                <div className="inv-actions">
                  <button type="button" className="inv-btn primary" onClick={() => go('observe2')}>
                    Go to the experiment
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'observe2':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Observe</p>
            <h2 className="inv-title">Balloon near hair</h2>
            <div className="inv-proto">
              Bring the rubbed balloon near your hair. Watch what happens.
            </div>
            {run.o2 && <HairScene lift={run.o2 === 'attract' ? 1 : 0} />}
            <p className="inv-lead">What happened?</p>
            <ChoiceList
              options={[
                { id: 'attract', label: 'Attracted' },
                { id: 'repel', label: 'Repelled' },
                { id: 'nothing', label: 'Nothing / I couldn’t tell' },
              ]}
              value={run.o2}
              onChange={(o2) => setRun((r) => ({ ...r, o2 }))}
            />
            {run.o2 && run.p2 && (
              <Mismatch predicted={labelTrio(run.p2)} observed={labelTrio(run.o2)} />
            )}
            <div className="inv-actions">
              <button
                type="button"
                className="inv-btn primary"
                disabled={!run.o2}
                onClick={() => go('observe3')}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'observe3':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Quick check</p>
            <h2 className="inv-title">One more observation</h2>
            <div className="inv-proto">
              Rub <strong>only one</strong> balloon. Bring it near a balloon you did{' '}
              <strong>not</strong> rub.
            </div>
            {/* Same picture as observe1 but for the labels — which is the point.
                Nothing visible distinguishes a rubbed balloon from an unrubbed one. */}
            {run.o3 && (
              <PairScene
                angle={run.o3 === 'attract' ? -11 : run.o3 === 'repel' ? 17 : 0}
                leftLabel="rubbed"
                rightLabel="straight from the packet"
              />
            )}
            <p className="inv-lead">What do you see?</p>
            <ChoiceList
              options={[
                { id: 'attract', label: 'Attract' },
                { id: 'repel', label: 'Repel' },
                { id: 'nothing', label: 'Nothing / I couldn’t tell' },
              ]}
              value={run.o3}
              onChange={(o3) => setRun((r) => ({ ...r, o3 }))}
            />
            <div className="inv-actions">
              <button
                type="button"
                className="inv-btn primary"
                disabled={!run.o3}
                onClick={() => go('conflict')}
              >
                Put the results together
              </button>
            </div>
          </div>
        );

      case 'conflict':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Conflict</p>
            <h2 className="inv-title">Three rows. One story has to change.</h2>
            {/* The SAME rubbed balloon is on the left in all three. Only the partner
                changes — so rows 1 and 3 are near-identical pictures with opposite
                outcomes, which is exactly the point. The captions carry it, because
                nothing visible distinguishes a rubbed balloon from an unrubbed one. */}
            <div className="triad">
              <div className="triad-cell">
                <MiniScene kind="pair" />
                <div className="triad-out repel">PUSHED APART</div>
              </div>
              <div className="triad-cell">
                <MiniScene kind="hair" />
                <div className="triad-out attract">PULLED TOGETHER</div>
              </div>
              <div className="triad-cell">
                <MiniScene kind="plain" />
                <div className="triad-out attract">PULLED TOGETHER</div>
              </div>
            </div>
            <table className="conflict-table">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Typical result</th>
                  <th>You recorded</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>rubbed + rubbed</td>
                  <td>repulsion</td>
                  <td>{run.o1 ? labelTrio(run.o1) : '—'}</td>
                </tr>
                <tr>
                  <td>rubbed + hair</td>
                  <td>attraction</td>
                  <td>{run.o2 ? labelTrio(run.o2) : '—'}</td>
                </tr>
                <tr>
                  <td>rubbed + unrubbed</td>
                  <td>attraction</td>
                  <td>{run.o3 ? labelTrio(run.o3) : '—'}</td>
                </tr>
              </tbody>
            </table>
            <p className="inv-lead">
              A single idea — “rubbing makes things sticky” — cannot explain all three rows. Sticky
              vs sticky should behave one way everywhere. Here the same rubbed balloon can repel one
              thing and attract another.
            </p>
            <div className="inv-actions">
              <button type="button" className="inv-btn primary" onClick={() => go('judge')}>
                Compare explanations
              </button>
            </div>
          </div>
        );

      case 'judge':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Judge</p>
            <h2 className="inv-title">Which explanation survives?</h2>
            <div className="model-cards">
              <div className={`model-card ${run.judge === 'A' || run.judge === 'both' ? 'pick' : ''}`}>
                <h3>A</h3>
                <p>
                  Rubbing makes things “sticky.” Sticky things interact the same way with everything
                  sticky.
                </p>
              </div>
              <div className={`model-card ${run.judge === 'B' || run.judge === 'both' ? 'pick' : ''}`}>
                <h3>B</h3>
                <p>
                  Rubbing moves something between objects. Objects can end up with different kinds.
                  Same kinds push apart; different kinds pull together.
                </p>
              </div>
            </div>
            <p className="inv-lead">Which explains <strong>all three</strong> observations?</p>
            {!run.judgeLocked ? (
              <>
                <ChoiceList
                  options={[
                    { id: 'A', label: 'A only' },
                    { id: 'B', label: 'B only' },
                    { id: 'both', label: 'Both' },
                    { id: 'neither', label: 'Neither' },
                  ]}
                  value={run.judge}
                  onChange={(judge) => setRun((r) => ({ ...r, judge }))}
                />
                <div className="inv-actions">
                  <button
                    type="button"
                    className="inv-btn primary"
                    disabled={!run.judge}
                    onClick={() => setRun((r) => ({ ...r, judgeLocked: true }))}
                  >
                    Commit judgment
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="inv-lock">
                  <h3>Judgment locked</h3>
                  <div className="val">{labelJudge(run.judge!)}</div>
                </div>
                <div className="inv-mismatch agree" style={{ marginTop: '1rem' }}>
                  {run.judge === 'A' && (
                    <p className="need" style={{ color: '#92400e' }}>
                      A has one mechanism. You saw two different behaviours involving the same
                      rubbed balloon. A is under pressure.
                    </p>
                  )}
                  {(run.judge === 'B' || run.judge === 'both') && (
                    <p className="need">
                      B can speak about both repulsion and attraction. Next we ask whether it is
                      too easy to protect.
                    </p>
                  )}
                  {run.judge === 'neither' && (
                    <p className="need" style={{ color: '#92400e' }}>
                      Neither may feel complete — but B at least distinguishes kinds of interaction.
                      We will pressure-test B next.
                    </p>
                  )}
                </div>
                <div className="inv-actions">
                  <button type="button" className="inv-btn primary" onClick={() => go('falsify')}>
                    Pressure-test B
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'falsify':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Judge</p>
            <h2 className="inv-title">What would rule B out?</h2>
            <p className="inv-lead">
              A good model is not only one that fits. What would you have to see to discard B?
            </p>
            <ChoiceList
              options={[
                {
                  id: 'both-at-once',
                  label:
                    'Two objects that repel and attract each other at the same time in the same setup',
                },
                {
                  id: 'nothing-while-others',
                  label:
                    'A rubbed pair that does nothing (in good dry conditions) while other pairs still interact',
                },
                {
                  id: 'colour',
                  label: 'Finding that “kind” depends only on the colour of the balloon',
                },
                { id: 'other', label: 'Something else (you can refine later with a teacher)' },
              ]}
              value={run.falsify}
              onChange={(falsify) => setRun((r) => ({ ...r, falsify }))}
            />
            {run.falsify && (
              <p className="note-soft">
                B survives for now. It costs a commitment: something was rearranged between
                objects — not created from nowhere.
              </p>
            )}
            <div className="inv-actions">
              <button
                type="button"
                className="inv-btn primary"
                disabled={!run.falsify}
                onClick={() => go('model')}
              >
                Name what we found
              </button>
            </div>
          </div>
        );

      case 'model':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Model</p>
            <h2 className="inv-title">Now we can name it</h2>
            <p className="inv-lead">
              You observed A–A repel, A–hair attract, A–unrubbed attract. Explanation B accounts for
              the pattern. Only now do we introduce names.
            </p>
            <div className="earned">
              <h3 style={{ marginTop: 0 }}>Charge</h3>
              <ul style={{ marginBottom: 0 }}>
                <li>There is a property of matter we call <strong>charge</strong>.</li>
                <li>It comes in <strong>two kinds</strong>.</li>
                <li>
                  <strong>Like</strong> kinds repel; <strong>unlike</strong> kinds attract.
                </li>
                <li>
                  Rubbing can <strong>transfer</strong> charge (working model: rearranged, not
                  created).
                </li>
                <li>
                  An object can hold both kinds. <strong>Neutral means balanced, not empty.</strong>
                </li>
              </ul>
            </div>
            <p className="note-soft">
              This experiment does not show what carries the charge. We do not name microscopic
              particles here.
            </p>
            <div className="inv-actions">
              <button type="button" className="inv-btn primary" onClick={() => go('history')}>
                Continue
              </button>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Someone else had the same problem</p>
            <div className="human-turn">
              <h2 className="inv-title" style={{ fontSize: '1.35rem' }}>
                Philadelphia, 1747
              </h2>
              <p className="inv-lead">
                Benjamin Franklin also found that rubbing could leave bodies in different electrical
                states. He chose temporary names: plus and minus.
              </p>
              {/* Drawn, not photographed: the site ships no binary assets and makes
                  no network requests. Not a likeness, and the caption says so. */}
              <div className="figure-inline">
                <FranklinPortrait />
                <p className="note-soft">
                  An illustration, not a likeness — drawn in the site’s own line style.
                </p>
              </div>
              <blockquote>
                “These Terms we may use till your Philosophers give us better.”
                <br />
                <span style={{ fontStyle: 'normal', fontSize: '0.85rem', color: '#64748b' }}>
                  — Franklin to Collinson, 1747
                </span>
              </blockquote>
              {/* The quotation says "B … positively; A negatively" and the prose never
                  says who A and B are. The diagram names them. */}
              <FranklinExperiment />
              <p className="note-soft">
                Fire leaves <strong>A</strong>, who rubs the tube, and collects in{' '}
                <strong>B</strong>, who draws it off. <strong>C</strong>, standing on the floor,
                passes it back along: B → C → A.
              </p>
              <p className="inv-lead">What do you think he meant by “better”?</p>
              {!run.franklinLocked ? (
                <>
                  <ChoiceList
                    options={[
                      { id: 'tools', label: 'Better measuring tools' },
                      { id: 'names', label: 'Better names that would replace plus and minus' },
                      { id: 'theory', label: 'A better theory of what electricity is' },
                      { id: 'other', label: 'Something else' },
                    ]}
                    value={run.franklin}
                    onChange={(franklin) => setRun((r) => ({ ...r, franklin }))}
                  />
                  <div className="inv-actions">
                    <button
                      type="button"
                      className="inv-btn primary"
                      disabled={!run.franklin}
                      onClick={() => setRun((r) => ({ ...r, franklinLocked: true }))}
                    >
                      Commit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="inv-lock">
                    <h3>Your reading</h3>
                    <div className="val">
                      {run.franklin === 'names'
                        ? 'Better names'
                        : run.franklin === 'theory'
                          ? 'Better theory'
                          : run.franklin === 'tools'
                            ? 'Better tools'
                            : 'Something else'}
                    </div>
                  </div>
                  <p className="inv-lead" style={{ marginTop: '1rem' }}>
                    Franklin expected the names to be temporary. Nobody permanently replaced them.
                  </p>
                  <table className="survive-table">
                    <tbody>
                      <tr>
                        <td>Franklin’s physical model</td>
                        <td>
                          <strong>replaced</strong> later
                        </td>
                      </tr>
                      <tr>
                        <td>Plus / minus names</td>
                        <td>
                          <strong>survived</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Conservation idea</td>
                        <td>
                          <strong>refined and survived</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="note-soft">
                    Which kind is called positive is a convention. That there are two kinds, and
                    like/unlike behaviour, is not.
                  </p>
                  <div className="inv-actions">
                    <button type="button" className="inv-btn primary" onClick={() => go('math')}>
                      Compress what we found
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'math':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Compress</p>
            <h2 className="inv-title">Can we write this shorter?</h2>
            <p className="inv-lead">
              We need a way to talk about “how much of each kind” and “what is left over.”
            </p>
            <div className="math-block">
              Q<sub>net</sub> = Q<sub>+</sub> − Q<sub>−</sub>
              <span className="sub">
                Example: 500 of each kind → Q<sub>net</sub> = 0, but 1000 units are still present.
              </span>
            </div>
            {/* Ten pairs standing in for 500 of each. Every pair cancels and nothing
                is removed, so the box stays visibly full while the net reads zero. */}
            <CancellationScene />
            <p className="note-soft">
              Ten pairs are drawn, standing in for five hundred of each kind. The scale is a
              stand-in; the cancelling is not.
            </p>
            <p className="inv-lead">
              <strong>Zero net charge does not mean zero charge.</strong>
            </p>
            <div className="inv-actions">
              <button
                type="button"
                className="inv-btn primary"
                onClick={() => {
                  earnChargeModel();
                  go('done');
                }}
              >
                What do we actually know?
              </button>
            </div>
          </div>
        );

      case 'done':
        return (
          <div className="inv-card">
            <p className="inv-kicker">Scope</p>
            <h2 className="inv-title">What do we actually know?</h2>
            <div className="scope-grid">
              <div className="scope-box yes">
                <h3>Established here</h3>
                <ul>
                  <li>two kinds of charge</li>
                  <li>transfer / rearrangement as working model</li>
                  <li>like repels · unlike attracts</li>
                  <li>neutral ≠ empty · net ≠ total</li>
                  <li>plus/minus as inherited names</li>
                </ul>
              </div>
              <div className="scope-box no">
                <h3>Not established here</h3>
                <ul>
                  <li>what carries the charge</li>
                  <li>whether charge is quantised</li>
                  <li>why particular materials exchange which way</li>
                  <li>any microscopic particle names</li>
                </ul>
              </div>
            </div>
            <div className="earned">
              <strong>Model earned: Charge</strong>
              <p className="note-soft" style={{ marginBottom: 0 }}>
                Saved to your model inventory. Later investigations will reuse it instead of
                re-teaching from zero.
              </p>
            </div>
            <div className="inv-actions">
              <a className="inv-btn primary" href="/models/charge" style={{ textDecoration: 'none' }}>
                View Charge model
              </a>
              <a className="inv-btn" href="/" style={{ textDecoration: 'none' }}>
                Home
              </a>
            </div>
            <div className="reset-row">
              <button type="button" onClick={reset}>
                Reset this investigation (demo / retry)
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [run, go]);

  /* No "Loading…" gate here, deliberately.
   *
   * This component used to return `<p>Loading investigation…</p>` until the
   * hydration effect had run. The guard existed for a real reason — `loadRun()`
   * reads localStorage, which the server cannot see, so rendering the stored
   * step on the server would mismatch the client.
   *
   * But it made the entire lesson depend on JavaScript succeeding. On 12 Aug an
   * Astro upgrade broke hydration and E1 showed "Loading investigation…"
   * forever, with no content in the served HTML at all. E2, which renders its
   * screens server-side, showed screen 1 and merely failed to advance — the
   * same fault, far more diagnosable.
   *
   * So: server and first client render both use `defaultRun()`, which match, and
   * the stored run is applied by the effect afterwards. A student on a slow
   * connection sees the first screen instead of a spinner, and a broken build
   * degrades to a readable page rather than a blank one.
   */

  return (
    <div>
      {run.step !== 'entry' && <EpistemicStrip step={run.step} />}
      {run.step !== 'entry' && (
        <p className="note-soft" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>
          Step {Math.max(1, stepIndex)} · locked commitments stay locked until you reset
        </p>
      )}
      {body}
    </div>
  );
}
