import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';

export default function EventDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inviteEmail, setInviteEmail] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const event = state.events.find((e) => e.id === id);
  if (!event) {
    return <div className="page"><p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>{t('events.notFound')}</p></div>;
  }

  const org = state.organizations.find((o) => o.id === event.organizationId);
  const form = state.forms.find((f) => f.id === event.formId);
  const submissions = state.submissions.filter((s) => s.eventId === id);
  const emoji = form ? getCategoryEmoji(form.category) : '🧪';

  const handleStatusChange = (status: 'upcoming' | 'active' | 'completed') => {
    dispatch({ type: 'UPDATE_EVENT', payload: { ...event, status } });
  };

  const handleAddInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    if (event.invitedEmails.includes(email)) { alert(t('events.alreadyInvited')); return; }
    dispatch({ type: 'ADD_INVITED_EMAIL', payload: { eventId: id!, email } });
    setInviteEmail('');
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/events/${id}/test`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      prompt(t('events.copyPrompt'), url);
    }
  };

  const handleDelete = () => {
    if (confirm(t('events.deleteConfirm'))) {
      dispatch({ type: 'DELETE_EVENT', payload: id! });
      navigate('/events');
    }
  };

  const statusLabels: Record<string, string> = {
    upcoming: t('events.upcoming'),
    active: t('events.active'),
    completed: t('events.completed'),
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/events')}>{t('events.backEvents')}</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', flex: 1 }}>{emoji} {event.name}</h1>
        <span className={`badge badge-${event.status}`}>{event.status}</span>
      </div>

      {event.description && (
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: '0.875rem' }}>
          {event.description}
        </p>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 8 }}>
        {org?.name ?? t('common.unknownGroup')} • {form?.name ?? t('common.unknownForm')} • {new Date(event.date).toLocaleDateString()}
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <div className="number">{event.samples.length}</div>
          <div className="label">{t('events.samplesLabel')}</div>
        </div>
        <div className="stat-card">
          <div className="number">{event.invitedEmails.length}</div>
          <div className="label">{t('events.invited')}</div>
        </div>
        <div className="stat-card">
          <div className="number">{submissions.length}</div>
          <div className="label">{t('events.responsesLabel')}</div>
        </div>
      </div>

      {event.status === 'active' && (
        <div className="actions-row" style={{ marginBottom: 16 }}>
          <button className="action-card" onClick={() => navigate(`/events/${id}/test`)}>
            <div className="icon">🧪</div>
            <div className="label">{t('events.startTasting')}</div>
          </button>
          <button className="action-card" onClick={handleCopyLink}>
            <div className="icon">{linkCopied ? '✅' : '🔗'}</div>
            <div className="label">{linkCopied ? t('events.copied') : t('events.copyLink')}</div>
          </button>
          <button
            className="action-card"
            onClick={() => navigate(`/events/${id}/results`)}
          >
            <div className="icon">📊</div>
            <div className="label">{t('events.results')}</div>
          </button>
        </div>
      )}

      {event.status === 'completed' && submissions.length > 0 && (
        <button
          className="btn btn-secondary btn-block"
          style={{ marginBottom: 16 }}
          onClick={() => navigate(`/events/${id}/results`)}
        >
          {t('events.viewResults')} ({submissions.length} {submissions.length !== 1 ? t('events.responses') : t('events.response')})
        </button>
      )}

      <div className="section-header" style={{ marginTop: 8 }}>
        <h2 className="section-title">{t('events.status')}</h2>
      </div>
      <div className="picker-row" style={{ marginBottom: 16 }}>
        {(['upcoming', 'active', 'completed'] as const).map((s) => (
          <button
            key={s}
            className={`picker-option${event.status === s ? ' selected' : ''}`}
            onClick={() => handleStatusChange(s)}
          >
            {s === 'upcoming' ? '📅 ' : s === 'active' ? '🟢 ' : '✅ '}
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="divider" />
      <h2 className="section-title" style={{ marginBottom: 12 }}>{t('events.samplesLabel')}</h2>
      {event.samples.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{t('events.noSamples')}</p>
      ) : (
        event.samples.map((s) => (
          <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}>
            <div>
              <strong>{t('common.sample')} {s.code}</strong>
              {s.revealName && (
                <span style={{ marginLeft: 8, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  ({s.revealName})
                </span>
              )}
            </div>
          </div>
        ))
      )}

      <div className="divider" />
      <h2 className="section-title" style={{ marginBottom: 12 }}>{t('events.invitedParticipants')}</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="form-input"
          style={{ flex: 1 }}
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder={t('events.emailPlaceholder')}
        />
        <button className="btn btn-outline" onClick={handleAddInvite}>{t('common.invite')}</button>
      </div>

      {event.invitedEmails.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{t('events.noInvited')}</p>
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

      {event.status !== 'active' && (
        <button
          className="btn btn-outline btn-block"
          style={{ marginTop: 16 }}
          onClick={handleCopyLink}
        >
          {linkCopied ? t('events.linkCopied') : t('events.copyTastingLink')}
        </button>
      )}

      {event.status !== 'completed' && submissions.length > 0 && (
        <button
          className="btn btn-outline btn-block"
          style={{ marginTop: 12 }}
          onClick={() => navigate(`/events/${id}/results`)}
        >
          {t('events.viewResultsCount')} ({submissions.length})
        </button>
      )}

      <button className="btn btn-danger btn-block" style={{ marginTop: 24 }} onClick={handleDelete}>
        {t('events.deleteEvent')}
      </button>
    </div>
  );
}
