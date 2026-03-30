import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function EventsListScreen() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1>Events</h1>
        <p>Your blind tasting events</p>
      </div>

      <div className="page">
        {state.events.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎉</div>
            <h3>No events yet</h3>
            <p>Create a testing form first, then organize a blind tasting with friends!</p>
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
                  <span>{org?.name ?? 'No group'} • {form?.name ?? 'No form'}</span>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                  {event.samples.length} samples • {submissions.length} response{submissions.length !== 1 ? 's' : ''}
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
            alert('Please create a testing form first before creating an event.');
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
