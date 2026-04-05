import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function FormsListScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1>{t('forms.title')}</h1>
        <p>{t('forms.subtitle')}</p>
      </div>

      <div className="page">
        {state.forms.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>{t('forms.empty')}</h3>
            <p>{t('forms.emptyHint')}</p>
          </div>
        ) : (
          state.forms.map((form) => {
            const org = state.organizations.find((o) => o.id === form.organizationId);
            return (
              <div
                key={form.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/forms/${form.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{getCategoryEmoji(form.category)} {form.name}</strong>
                  <span className="badge badge-category">{t(`categories.${form.category}`)}</span>
                </div>
                {form.description && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    {form.description}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                  <span>{form.criteria.length} {t('forms.criteria')}</span>
                  <span>{org?.name ?? t('common.noGroup')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        className="fab"
        onClick={() => {
          if (state.organizations.length === 0) {
            alert(t('forms.createGroupFirst'));
            navigate('/organizations/new');
          } else {
            navigate('/forms/new');
          }
        }}
      >
        +
      </button>
    </div>
  );
}
