import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function EventsListScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1>{t('events.title')}</h1>
        <p>{t('events.subtitle')}</p>
      </div>

      <div className="page">
        {state.events.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎉</div>
            <h3>{t('events.empty')}</h3>
            <p>{t('events.emptyHint')}</p>
          </div>
        ) : (
          state.events.map((event) => {
            const org = state.organizations.find((o) => o.id === event.organizationId);
            const form = state.forms.find((f) => f.id === event.formId);
            const emoji = form ? getCategoryEmoji(form.category) : '🧪';
            const submissions = state.submissions.filter((s) => s.eventId === event.id);
            return (
              <div
                key={event.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{emoji} {event.name}</strong>
                  <span className={`badge badge-${event.status}`}>{event.status}</span>
                </div>
                {event.description && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    {event.description}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                  <span>{org?.name ?? t('common.noGroup')} • {form?.name ?? t('common.noForm')}</span>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                  {event.samples.length} {t('events.samples')} • {submissions.length} {submissions.length !== 1 ? t('events.responses') : t('events.response')}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        className="fab"
        onClick={() => {
          if (state.forms.length === 0) {
            alert(t('events.createFormFirst'));
            navigate('/forms/new');
          } else {
            navigate('/events/new');
          }
        }}
      >
        +
      </button>
    </div>
  );
}
