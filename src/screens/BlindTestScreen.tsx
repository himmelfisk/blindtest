import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import type { SampleEvaluation, CriterionScore } from '../models/types';

export default function BlindTestScreen() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const event = state.events.find((e) => e.id === id);
  const form = event ? state.forms.find((f) => f.id === event.formId) : undefined;

  const [participantName, setParticipantName] = useState('');
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<SampleEvaluation[]>([]);
  const [currentScores, setCurrentScores] = useState<CriterionScore[]>([]);
  const [currentComment, setCurrentComment] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!event || !form) {
    return <div className="page"><p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>Event or form not found</p></div>;
  }

  const samples = event.samples;
  const currentSample = samples[currentSampleIndex];

  const initScores = (): CriterionScore[] =>
    form.criteria.map((c) => ({ criterionId: c.id, value: Math.ceil((c.minValue + c.maxValue) / 2), note: '' }));

  const handleStart = () => {
    if (!participantName.trim()) { alert('Please enter your name.'); return; }
    setCurrentScores(initScores());
    setStarted(true);
  };

  const handleScoreChange = (criterionId: string, value: number) => {
    setCurrentScores(currentScores.map((s) =>
      s.criterionId === criterionId ? { ...s, value } : s
    ));
  };

  const handleNoteChange = (criterionId: string, note: string) => {
    setCurrentScores(currentScores.map((s) =>
      s.criterionId === criterionId ? { ...s, note } : s
    ));
  };

  const handleNextSample = () => {
    const evaluation: SampleEvaluation = {
      sampleId: currentSample.id,
      scores: currentScores,
      overallComment: currentComment,
    };
    const newEvaluations = [...evaluations, evaluation];

    if (currentSampleIndex < samples.length - 1) {
      setEvaluations(newEvaluations);
      setCurrentSampleIndex(currentSampleIndex + 1);
      setCurrentScores(initScores());
      setCurrentComment('');
    } else {
      dispatch({
        type: 'ADD_SUBMISSION',
        payload: {
          eventId: event.id,
          participantName: participantName.trim(),
          evaluations: newEvaluations,
        },
      });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">🎉</div>
          <h3>Thank you!</h3>
          <p>Your evaluation has been submitted successfully.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate(`/events/${id}`)}>
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="page">
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Blind Tasting</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8, fontSize: '0.875rem' }}>
          <strong>{event.name}</strong>
        </p>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
          You will evaluate {samples.length} samples using {form.criteria.length} criteria.
        </p>

        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            className="form-input"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleStart}>
          Begin Tasting
        </button>
      </div>
    );
  }

  const totalScore = currentScores.reduce((sum, s) => sum + s.value, 0);
  const maxScore = form.criteria.reduce((sum, c) => sum + c.maxValue, 0);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.25rem' }}>Sample {currentSample.code}</h1>
        <span className="badge badge-category">
          {currentSampleIndex + 1} / {samples.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--color-border)', borderRadius: 4, height: 6, marginBottom: 24 }}>
        <div
          style={{
            background: 'var(--color-primary)', borderRadius: 4, height: 6,
            width: `${((currentSampleIndex) / samples.length) * 100}%`, transition: 'width 0.3s',
          }}
        />
      </div>

      {form.criteria.map((criterion) => {
        const score = currentScores.find((s) => s.criterionId === criterion.id);
        return (
          <div key={criterion.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9375rem' }}>{criterion.name}</strong>
            </div>
            {criterion.description && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {criterion.description}
              </div>
            )}
            <div className="score-row">
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{criterion.minValue}</span>
              <input
                type="range"
                className="score-slider"
                min={criterion.minValue}
                max={criterion.maxValue}
                value={score?.value ?? criterion.minValue}
                onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value, 10))}
              />
              <span className="score-value">{score?.value ?? criterion.minValue}</span>
            </div>
            <input
              className="form-input"
              style={{ marginTop: 8, fontSize: '0.8125rem' }}
              value={score?.note ?? ''}
              onChange={(e) => handleNoteChange(criterion.id, e.target.value)}
              placeholder="Notes (optional)"
            />
          </div>
        );
      })}

      <div className="form-group" style={{ marginTop: 8 }}>
        <label className="form-label">Overall Comment</label>
        <textarea
          className="form-input"
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder="Any additional thoughts on this sample..."
        />
      </div>

      <div
        style={{
          background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ color: '#fff', fontSize: '0.875rem' }}>Total Score</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>
          {totalScore} / {maxScore}
        </span>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleNextSample}>
        {currentSampleIndex < samples.length - 1 ? 'Next Sample' : 'Submit Evaluation'}
      </button>
    </div>
  );
}
