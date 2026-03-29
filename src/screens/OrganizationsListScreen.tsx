import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

export default function OrganizationsListScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1>Groups</h1>
        <p>Manage your testing groups</p>
      </div>

      <div className="page">
        {state.organizations.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No groups yet</h3>
            <p>Create a group to start organizing blind tests</p>
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
                  {org.members.length} member{org.members.length !== 1 ? 's' : ''}
                </span>
              </div>
              {org.description && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                  {org.description}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 8 }}>
                Created {new Date(org.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <button className="fab" onClick={() => navigate('/organizations/new')}>+</button>
    </div>
  );
}
