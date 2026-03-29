import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

export default function CreateEventScreen() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedFormId = (location.state as { preselectedFormId?: string } | null)?.preselectedFormId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [formId, setFormId] = useState(preselectedFormId ?? (state.forms[0]?.id ?? ''));
  const [organizationId, setOrganizationId] = useState(
    preselectedFormId
      ? state.forms.find((f) => f.id === preselectedFormId)?.organizationId ?? (state.organizations[0]?.id ?? '')
      : state.organizations[0]?.id ?? ''
  );
  const [sampleCodes, setSampleCodes] = useState<string[]>(['A', 'B', 'C']);
  const [newSampleCode, setNewSampleCode] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  if (state.forms.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>Create a testing form first</h3>
          <p>You need at least one testing form before creating an event.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/forms/new')}>
            Create Form
          </button>
        </div>
      </div>
    );
  }

  const orgForms = state.forms.filter((f) => f.organizationId === organizationId);

  const handleAddSample = () => {
    const code = newSampleCode.trim();
    if (!code) { alert('Please enter a sample code.'); return; }
    if (sampleCodes.includes(code)) { alert('This sample code already exists.'); return; }
    setSampleCodes([...sampleCodes, code]);
    setNewSampleCode('');
  };

  const handleAddInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) { alert('Please enter an email.'); return; }
    if (invitedEmails.includes(email)) { alert('This email has already been invited.'); return; }
    setInvitedEmails([...invitedEmails, email]);
    setInviteEmail('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter an event name.'); return; }
    if (!date) { alert('Please select a date.'); return; }
    if (!formId) { alert('Please select a testing form.'); return; }
    if (sampleCodes.length === 0) { alert('Please add at least one sample.'); return; }

    dispatch({
      type: 'ADD_EVENT',
      payload: {
        name: name.trim(),
        description: description.trim(),
        date,
        formId,
        organizationId,
        status: 'upcoming',
        samples: sampleCodes.map((code) => ({ id: '', code })),
        invitedEmails,
      },
    });
    navigate('/events');
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Create Testing Event</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
        Set up a blind testing event and invite participants.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Friday IPA Showdown" />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the event" />
        </div>

        <div className="form-group">
          <label className="form-label">Date *</label>
          <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Group *</label>
          <div className="picker-row">
            {state.organizations.map((org) => (
              <button
                type="button"
                key={org.id}
                className={`picker-option${organizationId === org.id ? ' selected' : ''}`}
                onClick={() => {
                  setOrganizationId(org.id);
                  const firstOrgForm = state.forms.find((f) => f.organizationId === org.id);
                  setFormId(firstOrgForm?.id ?? '');
                }}
              >
                {org.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Testing Form *</label>
          {orgForms.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
              No forms for this group.{' '}
              <button type="button" className="text-link" onClick={() => navigate('/forms/new')}>Create one</button>
            </p>
          ) : (
            <div className="picker-row">
              {orgForms.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  className={`picker-option${formId === f.id ? ' selected' : ''}`}
                  onClick={() => setFormId(f.id)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="divider" />

        <div className="section-header">
          <h2 className="section-title">Samples ({sampleCodes.length})</h2>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          Add anonymous sample codes. Names can be revealed after testing.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            value={newSampleCode}
            onChange={(e) => setNewSampleCode(e.target.value)}
            placeholder="Sample code (e.g., D, E)"
          />
          <button type="button" className="btn btn-outline" onClick={handleAddSample}>Add</button>
        </div>

        <div className="chip-row" style={{ marginBottom: 16 }}>
          {sampleCodes.map((code) => (
            <div
              key={code}
              className="chip selected"
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              onClick={() => setSampleCodes(sampleCodes.filter((c) => c !== code))}
            >
              {code} ✕
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="section-header">
          <h2 className="section-title">Invite Participants ({invitedEmails.length})</h2>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="participant@email.com"
          />
          <button type="button" className="btn btn-outline" onClick={handleAddInvite}>Invite</button>
        </div>

        {invitedEmails.map((email) => (
          <div key={email} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}>
            <span style={{ fontSize: '0.875rem' }}>{email}</span>
            <button
              type="button"
              onClick={() => setInvitedEmails(invitedEmails.filter((e) => e !== email))}
              style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface-variant)',
                border: 'none', fontSize: '0.75rem', color: 'var(--color-text-secondary)', cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))}

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
          Create Event
        </button>
      </form>
    </div>
  );
}
