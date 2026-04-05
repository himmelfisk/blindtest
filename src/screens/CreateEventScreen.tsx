import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/useAppContext';

interface SampleDraft {
  code: string;
  revealName: string;
}

const DEFAULT_SAMPLES: SampleDraft[] = [
  { code: 'A', revealName: '' },
  { code: 'B', revealName: '' },
  { code: 'C', revealName: '' },
];

export default function CreateEventScreen() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
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
  const [samples, setSamples] = useState<SampleDraft[]>(
    DEFAULT_SAMPLES.map((s) => ({ ...s }))
  );
  const [newSampleCode, setNewSampleCode] = useState('');
  const [newSampleReveal, setNewSampleReveal] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  if (state.forms.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>{t('events.noFormFirst')}</h3>
          <p>{t('events.noFormFirstHint')}</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/forms/new')}>
            {t('forms.createForm')}
          </button>
        </div>
      </div>
    );
  }

  const orgForms = state.forms.filter((f) => f.organizationId === organizationId);

  const handleAddSample = () => {
    const code = newSampleCode.trim();
    if (!code) { alert(t('events.alertSampleCode')); return; }
    if (samples.some((s) => s.code === code)) { alert(t('events.alertSampleExists')); return; }
    setSamples([...samples, { code, revealName: newSampleReveal.trim() }]);
    setNewSampleCode('');
    setNewSampleReveal('');
  };

  const handleAddInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) { alert(t('events.alertEmail')); return; }
    if (invitedEmails.includes(email)) { alert(t('events.alertEmailExists')); return; }
    setInvitedEmails([...invitedEmails, email]);
    setInviteEmail('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert(t('events.alertEventName')); return; }
    if (!date) { alert(t('events.alertDate')); return; }
    if (!formId) { alert(t('events.alertForm')); return; }
    if (samples.length === 0) { alert(t('events.alertSample')); return; }

    dispatch({
      type: 'ADD_EVENT',
      payload: {
        name: name.trim(),
        description: description.trim(),
        date,
        formId,
        organizationId,
        status: 'upcoming',
        samples: samples.map((s) => ({
          id: uuidv4(),
          code: s.code,
          ...(s.revealName ? { revealName: s.revealName } : {}),
        })),
        invitedEmails,
      },
    });
    navigate('/events');
  };

  return (
    <div className="page">
      <button type="button" className="back-btn" onClick={() => navigate('/events')}>{t('common.back')}</button>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{t('events.createTitle')}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
        {t('events.createDesc')}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('events.eventName')}</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('events.eventNamePlaceholder')} />
        </div>

        <div className="form-group">
          <label className="form-label">{t('common.description')}</label>
          <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('events.descriptionPlaceholder')} />
        </div>

        <div className="form-group">
          <label className="form-label">{t('events.date')}</label>
          <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">{t('forms.group')}</label>
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
          <label className="form-label">{t('events.testingForm')}</label>
          {orgForms.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
              {t('events.noFormsForGroup')}{' '}
              <button type="button" className="text-link" onClick={() => navigate('/forms/new')}>{t('events.createOne')}</button>
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
          <h2 className="section-title">{t('events.samplesSection')} ({samples.length})</h2>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          {t('events.samplesHelp')}
        </p>

        {/* Existing samples */}
        {samples.map((sample) => (
          <div
            key={sample.code}
            className="card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', marginBottom: 8 }}
          >
            <div>
              <strong>{t('common.sample')} {sample.code}</strong>
              {sample.revealName && (
                <span style={{ marginLeft: 8, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  🎭 {sample.revealName}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSamples(samples.filter((s) => s.code !== sample.code))}
              style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface-variant)',
                border: 'none', fontSize: '0.75rem', color: 'var(--color-text-secondary)', cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add new sample */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              className="form-input"
              style={{ width: 80, flexShrink: 0 }}
              value={newSampleCode}
              onChange={(e) => setNewSampleCode(e.target.value)}
              placeholder={t('events.sampleCode')}
            />
            <input
              className="form-input"
              style={{ flex: 1 }}
              value={newSampleReveal}
              onChange={(e) => setNewSampleReveal(e.target.value)}
              placeholder={t('events.realNamePlaceholder')}
            />
          </div>
          <button type="button" className="btn btn-outline btn-block" onClick={handleAddSample}>
            {t('events.addSample')}
          </button>
        </div>

        <div className="divider" />

        <div className="section-header">
          <h2 className="section-title">{t('events.inviteSection')} ({invitedEmails.length})</h2>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          {t('events.inviteHelp')}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder={t('events.emailPlaceholder')}
          />
          <button type="button" className="btn btn-outline" onClick={handleAddInvite}>{t('common.invite')}</button>
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
          {t('events.createEvent')}
        </button>
      </form>
    </div>
  );
}
