import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function FormsListScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1>Testing Forms</h1>
        <p>Define scoring criteria for blind tests</p>
      </div>

      <div className="page">
        {state.forms.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No testing forms yet</h3>
            <p>Create a form to define how your friends will rate each sample</p>
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
                  <span className="badge badge-category">{form.category}</span>
                </div>
                {form.description && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    {form.description}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                  <span>{form.criteria.length} criteria</span>
                  <span>{org?.name ?? 'No group'}</span>
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
            alert('Please create a group first before creating a form.');
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
