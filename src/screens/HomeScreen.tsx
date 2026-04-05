import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';

export default function HomeScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const upcomingEvents = state.events.filter((e) => e.status !== 'completed');
  const isEmpty = state.organizations.length === 0 && state.forms.length === 0 && state.events.length === 0;

  return (
    <div>
      <div className="page-header">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>

      <div className="page">
        {isEmpty ? (
          /* First-time experience */
          <>
            <div className="card" style={{ textAlign: 'center', padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧪</div>
              <h2 style={{ fontSize: '1.125rem', marginBottom: 8 }}>{t('home.welcome')}</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                {t('home.stepsIntro')}
              </p>
            </div>

            <div
              className="card"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
              onClick={() => navigate('/organizations/new')}
            >
              <div className="step-number">1</div>
              <div style={{ flex: 1 }}>
                <strong>{t('home.step1Title')}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {t('home.step1Desc')}
                </div>
              </div>
              <span style={{ color: 'var(--color-text-light)' }}>→</span>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.6 }}>
              <div className="step-number">2</div>
              <div style={{ flex: 1 }}>
                <strong>{t('home.step2Title')}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {t('home.step2Desc')}
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.6 }}>
              <div className="step-number">3</div>
              <div style={{ flex: 1 }}>
                <strong>{t('home.step3Title')}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {t('home.step3Desc')}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Returning user */
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="number">{state.organizations.length}</div>
                <div className="label">{t('home.groups')}</div>
              </div>
              <div className="stat-card">
                <div className="number">{state.forms.length}</div>
                <div className="label">{t('home.forms')}</div>
              </div>
              <div className="stat-card">
                <div className="number">{state.events.length}</div>
                <div className="label">{t('home.events')}</div>
              </div>
            </div>

            <h2 className="section-title" style={{ marginBottom: 12 }}>{t('home.quickActions')}</h2>
            <div className="actions-row">
              <button className="action-card" onClick={() => navigate('/organizations/new')}>
                <div className="icon">👥</div>
                <div className="label">{t('home.newGroup')}</div>
              </button>
              <button className="action-card" onClick={() => navigate('/forms/new')}>
                <div className="icon">📋</div>
                <div className="label">{t('home.newForm')}</div>
              </button>
              <button className="action-card" onClick={() => navigate('/events/new')}>
                <div className="icon">🎉</div>
                <div className="label">{t('home.newEvent')}</div>
              </button>
            </div>

            <h2 className="section-title" style={{ marginTop: 24, marginBottom: 12 }}>{t('home.upcomingEvents')}</h2>
            {upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📅</div>
                <h3>{t('home.noUpcoming')}</h3>
                <p>{t('home.noUpcomingHint')}</p>
              </div>
            ) : (
              upcomingEvents.map((event) => {
                const org = state.organizations.find((o) => o.id === event.organizationId);
                const form = state.forms.find((f) => f.id === event.formId);
                return (
                  <div
                    key={event.id}
                    className="card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{event.name}</strong>
                      <span className={`badge badge-${event.status}`}>{event.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                      {org?.name ?? t('common.unknownGroup')} • {form?.name ?? t('common.unknownForm')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
