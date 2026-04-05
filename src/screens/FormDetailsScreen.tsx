import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function FormDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = state.forms.find((f) => f.id === id);
  if (!form) {
    return <div className="page"><p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>{t('forms.notFound')}</p></div>;
  }

  const org = state.organizations.find((o) => o.id === form.organizationId);

  const handleDelete = () => {
    if (confirm(t('forms.deleteConfirm'))) {
      dispatch({ type: 'DELETE_FORM', payload: id! });
      navigate('/forms');
    }
  };

  const maxTotal = form.criteria.reduce((sum, c) => sum + c.maxValue, 0);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/forms')}>{t('forms.backForms')}</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', flex: 1 }}>{getCategoryEmoji(form.category)} {form.name}</h1>
        <span className="badge badge-category">{t(`categories.${form.category}`)}</span>
      </div>

      {form.description && (
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 12, fontSize: '0.875rem' }}>
          {form.description}
        </p>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 8 }}>
        {t('forms.group')}: {org?.name ?? t('common.unknownGroup')} • {t('common.created')} {new Date(form.createdAt).toLocaleDateString()}
      </p>

      <div className="divider" />

      <h2 className="section-title" style={{ marginBottom: 16 }}>
        {t('forms.scoringCriteria')} ({form.criteria.length})
      </h2>

      {form.criteria.map((c, i) => (
        <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.875rem', marginRight: 12, flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '0.9375rem' }}>{c.name}</strong>
            {c.description && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{c.description}</div>
            )}
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 4 }}>
              {t('forms.scoreRange')}: {c.minValue} – {c.maxValue}
            </div>
          </div>
        </div>
      ))}

      <div
        style={{
          background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
          padding: 20, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{t('forms.maxTotalScore')}</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.75rem' }}>{maxTotal}</span>
      </div>

      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: 24 }}
        onClick={() => navigate('/events/new', { state: { preselectedFormId: id } })}
      >
        {t('forms.useInNewEvent')}
      </button>

      <button className="btn btn-danger btn-block" style={{ marginTop: 12 }} onClick={handleDelete}>
        {t('forms.deleteForm')}
      </button>
    </div>
  );
}
