import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function ResultsScreen() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [revealedSamples, setRevealedSamples] = useState<Set<string>>(new Set());
  const [showAllReveals, setShowAllReveals] = useState(false);

  const event = state.events.find((e) => e.id === id);
  const form = event ? state.forms.find((f) => f.id === event.formId) : undefined;
  const submissions = state.submissions.filter((s) => s.eventId === id);

  if (!event || !form) {
    return (
      <div className="page">
        <p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>
          {t('results.notFound')}
        </p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate(`/events/${id}`)}>{t('common.back')}</button>
        <div className="empty-state">
          <div className="icon">📊</div>
          <h3>{t('results.noResults')}</h3>
          <p>{t('results.noResultsHint')}</p>
        </div>
      </div>
    );
  }

  const maxScore = form.criteria.reduce((sum, c) => sum + c.maxValue, 0);

  const sampleResults = event.samples.map((sample) => {
    const sampleEvals = submissions
      .map((sub) => sub.evaluations.find((ev) => ev.sampleId === sample.id))
      .filter(Boolean);

    const avgTotal =
      sampleEvals.length > 0
        ? sampleEvals.reduce(
            (sum, ev) => sum + ev!.scores.reduce((s, sc) => s + sc.value, 0),
            0
          ) / sampleEvals.length
        : 0;

    const criterionAverages = form.criteria.map((criterion) => {
      const values = sampleEvals
        .map((ev) => ev!.scores.find((s) => s.criterionId === criterion.id)?.value ?? 0);
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      return { criterion, avg };
    });

    return { sample, avgTotal, sampleEvals, criterionAverages, evalCount: sampleEvals.length };
  });

  const ranked = [...sampleResults].sort((a, b) => b.avgTotal - a.avgTotal);

  const getMedal = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const toggleReveal = (sampleId: string) => {
    setRevealedSamples((prev) => {
      const next = new Set(prev);
      if (next.has(sampleId)) next.delete(sampleId);
      else next.add(sampleId);
      return next;
    });
  };

  const handleRevealAll = () => {
    if (showAllReveals) {
      setRevealedSamples(new Set());
      setShowAllReveals(false);
    } else {
      setRevealedSamples(new Set(event.samples.map((s) => s.id)));
      setShowAllReveals(true);
    }
  };

  const hasRevealNames = event.samples.some((s) => s.revealName);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(`/events/${id}`)}>{t('common.back')}</button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏆</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{t('results.title')}</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          {getCategoryEmoji(form.category)} {event.name} • {submissions.length} {submissions.length !== 1 ? t('results.tasters') : t('results.taster')}
        </p>
      </div>

      {hasRevealNames && (
        <button
          className="btn btn-secondary btn-block"
          style={{ marginBottom: 20 }}
          onClick={handleRevealAll}
        >
          {showAllReveals ? t('results.hideAllNames') : t('results.revealAllNames')}
        </button>
      )}

      {ranked.map((result, index) => {
        const pct = maxScore > 0 ? (result.avgTotal / maxScore) * 100 : 0;
        const isRevealed = revealedSamples.has(result.sample.id);
        return (
          <div
            key={result.sample.id}
            className="card"
            style={{
              marginBottom: 12,
              border: index === 0 ? '2px solid var(--color-secondary)' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: index < 3 ? '1.5rem' : '1rem', minWidth: 32, textAlign: 'center' }}>
                {getMedal(index)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: '1.0625rem' }}>{t('common.sample')} {result.sample.code}</strong>
                  {result.sample.revealName && (
                    <button
                      onClick={() => toggleReveal(result.sample.id)}
                      className="badge badge-category"
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {isRevealed ? result.sample.revealName : t('results.tapToReveal')}
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {result.evalCount} {result.evalCount !== 1 ? t('results.evaluations') : t('results.evaluation')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {result.avgTotal.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-light)' }}>
                  / {maxScore}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-border)', borderRadius: 4, height: 8, marginBottom: 8 }}>
              <div
                style={{
                  background: index === 0 ? 'var(--color-secondary)' : 'var(--color-primary)',
                  borderRadius: 4,
                  height: 8,
                  width: `${pct}%`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.criterionAverages.map(({ criterion, avg }) => (
                <span
                  key={criterion.id}
                  style={{
                    fontSize: '0.6875rem',
                    background: 'var(--color-surface-variant)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {criterion.name}: {avg.toFixed(1)}/{criterion.maxValue}
                </span>
              ))}
            </div>
          </div>
        );
      })}

      <div className="divider" />
      <h2 className="section-title" style={{ marginBottom: 16 }}>{t('results.individualScores')}</h2>

      {submissions.map((sub) => {
        const totalScore = sub.evaluations.reduce(
          (sum, ev) => sum + ev.scores.reduce((s, sc) => s + sc.value, 0),
          0
        );
        const totalMax = maxScore * event.samples.length;
        return (
          <div key={sub.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>{sub.participantName}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                {t('results.total')}: {totalScore}/{totalMax}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {event.samples.map((sample) => {
                const ev = sub.evaluations.find((e) => e.sampleId === sample.id);
                const score = ev ? ev.scores.reduce((s, sc) => s + sc.value, 0) : 0;
                return (
                  <span
                    key={sample.id}
                    style={{
                      fontSize: '0.75rem',
                      background: 'var(--color-surface-variant)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {sample.code}: {score}/{maxScore}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
