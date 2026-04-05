import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';
import type { SampleEvaluation, CriterionScore } from '../models/types';

export default function BlindTestScreen() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const event = state.events.find((e) => e.id === id);
  const form = event ? state.forms.find((f) => f.id === event.formId) : undefined;

  const [participantName, setParticipantName] = useState('');
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<SampleEvaluation[]>([]);
  const [currentScores, setCurrentScores] = useState<CriterionScore[]>([]);
  const [currentComment, setCurrentComment] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [finalEvaluations, setFinalEvaluations] = useState<SampleEvaluation[]>([]);

  if (!event || !form) {
    return <div className="page"><p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>{t('blindTest.notFound')}</p></div>;
  }

  const samples = event.samples;
  const currentSample = samples[currentSampleIndex];

  const initScores = (): CriterionScore[] =>
    form.criteria.map((c) => ({ criterionId: c.id, value: Math.ceil((c.minValue + c.maxValue) / 2), note: '' }));

  const handleStart = () => {
    if (!participantName.trim()) { alert(t('blindTest.alertName')); return; }
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
      setFinalEvaluations(newEvaluations);
      setSubmitted(true);
    }
  };

  const maxScore = form.criteria.reduce((sum, c) => sum + c.maxValue, 0);

  /* ── Submitted: Personal Score Recap ── */
  if (submitted) {
    const grandTotal = finalEvaluations.reduce(
      (sum, ev) => sum + ev.scores.reduce((s, sc) => s + sc.value, 0), 0
    );
    const grandMax = maxScore * samples.length;

    return (
      <div className="page" style={{ paddingBottom: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎉</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{t('blindTest.niceOne', { name: participantName })}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            {t('blindTest.tastingComplete')}
          </p>
        </div>

        <div
          style={{
            background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
            padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <span style={{ color: '#fff', fontSize: '0.9375rem', fontWeight: 600 }}>{t('blindTest.yourTotal')}</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem' }}>
            {grandTotal} / {grandMax}
          </span>
        </div>

        {finalEvaluations.map((ev, idx) => {
          const sample = samples[idx];
          const sampleTotal = ev.scores.reduce((s, sc) => s + sc.value, 0);
          return (
            <div key={sample.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong>{t('common.sample')} {sample.code}</strong>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                  {sampleTotal} / {maxScore}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ev.scores.map((sc) => {
                  const criterion = form.criteria.find((c) => c.id === sc.criterionId);
                  return (
                    <span
                      key={sc.criterionId}
                      style={{
                        fontSize: '0.6875rem', background: 'var(--color-surface-variant)',
                        padding: '3px 8px', borderRadius: 'var(--radius-full)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {criterion?.name}: {sc.value}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => navigate(`/events/${id}`)}
          >
            {t('blindTest.backToEvent')}
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => navigate(`/events/${id}/results`)}
          >
            {t('blindTest.viewResults')}
          </button>
        </div>
      </div>
    );
  }

  /* ── Intro Screen ── */
  if (!started) {
    const emoji = getCategoryEmoji(form.category);
    return (
      <div className="page">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>{emoji}</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{t('blindTest.blindTasting')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', fontWeight: 600 }}>
            {event.name}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{samples.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t('blindTest.samplesLabel')}</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{form.criteria.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t('blindTest.criteriaLabel')}</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{maxScore}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t('blindTest.maxScoreLabel')}</div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('blindTest.whatsYourName')}</label>
          <input
            className="form-input"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder={t('blindTest.enterName')}
          />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleStart}>
          {t('blindTest.letsGo')}
        </button>
      </div>
    );
  }

  /* ── Scoring Screen ── */
  const totalScore = currentScores.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.25rem' }}>{t('common.sample')} {currentSample.code}</h1>
        <span className="badge badge-category">
          {currentSampleIndex + 1} / {samples.length}
        </span>
      </div>

      <div style={{ background: 'var(--color-border)', borderRadius: 4, height: 6, marginBottom: 24 }}>
        <div
          style={{
            background: 'var(--color-primary)', borderRadius: 4, height: 6,
            width: `${((currentSampleIndex + 1) / samples.length) * 100}%`, transition: 'width 0.3s',
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
              placeholder={t('blindTest.notesPlaceholder')}
            />
          </div>
        );
      })}

      <div className="form-group" style={{ marginTop: 8 }}>
        <label className="form-label">{t('blindTest.overallComment')}</label>
        <textarea
          className="form-input"
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder={t('blindTest.overallCommentPlaceholder')}
        />
      </div>

      <div
        style={{
          background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span style={{ color: '#fff', fontSize: '0.875rem' }}>{t('blindTest.totalScore')}</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>
          {totalScore} / {maxScore}
        </span>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleNextSample}>
        {currentSampleIndex < samples.length - 1 ? t('blindTest.nextSample') : t('blindTest.submitEvaluation')}
      </button>
    </div>
  );
}
