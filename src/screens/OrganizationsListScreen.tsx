import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';

export default function OrganizationsListScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1>{t('organizations.title')}</h1>
        <p>{t('organizations.subtitle')}</p>
      </div>

      <div className="page">
        {state.organizations.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>{t('organizations.empty')}</h3>
            <p>{t('organizations.emptyHint')}</p>
          </div>
        ) : (
          state.organizations.map((org) => (
            <div
              key={org.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/organizations/${org.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{org.name}</strong>
                <span className="badge badge-member">
                  {org.members.length} {org.members.length !== 1 ? t('organizations.members') : t('organizations.member')}
                </span>
              </div>
              {org.description && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                  {org.description}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 8 }}>
                {t('common.created')} {new Date(org.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <button className="fab" onClick={() => navigate('/organizations/new')}>+</button>
    </div>
  );
}
