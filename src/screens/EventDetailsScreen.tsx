import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

export default function EventDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState('');

  const event = state.events.find((e) => e.id === id);
  if (!event) {
    return <div className="page"><p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>Event not found</p></div>;
  }

  const org = state.organizations.find((o) => o.id === event.organizationId);
  const form = state.forms.find((f) => f.id === event.formId);
  const submissions = state.submissions.filter((s) => s.eventId === id);

  const handleStatusChange = (status: 'upcoming' | 'active' | 'completed') => {
    dispatch({ type: 'UPDATE_EVENT', payload: { ...event, status } });
  };

  const handleAddInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    if (event.invitedEmails.includes(email)) { alert('Already invited.'); return; }
    dispatch({ type: 'ADD_INVITED_EMAIL', payload: { eventId: id!, email } });
    setInviteEmail('');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: id! });
      navigate('/events');
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', flex: 1 }}>{event.name}</h1>
        <span className={`badge badge-${event.status}`}>{event.status}</span>
      </div>

      {event.description && (
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: '0.875rem' }}>
          {event.description}
        </p>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 8 }}>
        {org?.name ?? 'Unknown group'} • {form?.name ?? 'Unknown form'} • {new Date(event.date).toLocaleDateString()}
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <div className="number">{event.samples.length}</div>
          <div className="label">Samples</div>
        </div>
        <div className="stat-card">
          <div className="number">{event.invitedEmails.length}</div>
          <div className="label">Invited</div>
        </div>
        <div className="stat-card">
          <div className="number">{submissions.length}</div>
          <div className="label">Responses</div>
        </div>
      </div>

      {/* Status controls */}
      <div className="section-header" style={{ marginTop: 8 }}>
        <h2 className="section-title">Status</h2>
      </div>
      <div className="picker-row" style={{ marginBottom: 16 }}>
        {(['upcoming', 'active', 'completed'] as const).map((s) => (
          <button
            key={s}
            className={`picker-option${event.status === s ? ' selected' : ''}`}
            onClick={() => handleStatusChange(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Samples */}
      <div className="divider" />
      <h2 className="section-title" style={{ marginBottom: 12 }}>Samples</h2>
      {event.samples.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>No samples added.</p>
      ) : (
        event.samples.map((s) => (
          <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}>
            <div>
              <strong>Sample {s.code}</strong>
              {s.revealName && (
                <span style={{ marginLeft: 8, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  ({s.revealName})
                </span>
              )}
            </div>
          </div>
        ))
      )}

      {/* Invitations */}
      <div className="divider" />
      <h2 className="section-title" style={{ marginBottom: 12 }}>Invited Participants</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="form-input"
          style={{ flex: 1 }}
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="participant@email.com"
        />
        <button className="btn btn-outline" onClick={handleAddInvite}>Invite</button>
      </div>

      {event.invitedEmails.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>No one invited yet.</p>
      ) : (
        event.invitedEmails.map((email) => (
          <div key={email} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}>
            <span style={{ fontSize: '0.875rem' }}>{email}</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_INVITED_EMAIL', payload: { eventId: id!, email } })}
              style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface-variant)',
                border: 'none', fontSize: '0.75rem', color: 'var(--color-text-secondary)', cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))
      )}

      {/* Start Testing button */}
      {event.status === 'active' && (
        <button
          className="btn btn-secondary btn-block"
          style={{ marginTop: 24 }}
          onClick={() => navigate(`/events/${id}/test`)}
        >
          Start Blind Testing
        </button>
      )}

      <button className="btn btn-danger btn-block" style={{ marginTop: 12 }} onClick={handleDelete}>
        Delete Event
      </button>
    </div>
  );
}
