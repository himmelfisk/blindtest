import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';

export default function OrganizationDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  const org = state.organizations.find((o) => o.id === id);
  if (!org) {
    return <div className="page"><p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 40 }}>{t('organizations.notFound')}</p></div>;
  }

  const orgForms = state.forms.filter((f) => f.organizationId === id);
  const orgEvents = state.events.filter((e) => e.organizationId === id);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) {
      alert(t('organizations.nameEmailRequired'));
      return;
    }
    dispatch({
      type: 'ADD_MEMBER',
      payload: {
        organizationId: id!,
        member: { name: memberName.trim(), email: memberEmail.trim(), role: 'member' },
      },
    });
    setMemberName('');
    setMemberEmail('');
    setShowAddMember(false);
  };

  const handleDelete = () => {
    if (confirm(t('organizations.deleteConfirm'))) {
      dispatch({ type: 'DELETE_ORGANIZATION', payload: id! });
      navigate('/organizations');
    }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/organizations')}>{t('common.back')}</button>

      <h1 style={{ fontSize: '1.5rem' }}>{org.name}</h1>
      {org.description && (
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: '0.875rem' }}>
          {org.description}
        </p>
      )}

      <div className="stats-row">
        <div className="stat-card">
          <div className="number">{orgForms.length}</div>
          <div className="label">{t('organizations.forms')}</div>
        </div>
        <div className="stat-card">
          <div className="number">{orgEvents.length}</div>
          <div className="label">{t('organizations.events')}</div>
        </div>
        <div className="stat-card">
          <div className="number">{org.members.length}</div>
          <div className="label">{t('organizations.membersLabel')}</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">{t('organizations.membersLabel')}</h2>
        <button className="text-link" onClick={() => setShowAddMember(!showAddMember)}>
          {showAddMember ? t('common.cancel') : t('common.add')}
        </button>
      </div>

      {showAddMember && (
        <form onSubmit={handleAddMember} className="card" style={{ marginBottom: 16 }}>
          <div className="form-group">
            <input
              className="form-input"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder={t('organizations.memberNamePlaceholder')}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder={t('organizations.memberEmailPlaceholder')}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t('organizations.addMember')}</button>
        </form>
      )}

      {org.members.map((m) => (
        <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '0.9375rem' }}>{m.name}</strong>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{m.email}</div>
          </div>
          <span className={`badge badge-${m.role}`}>{m.role}</span>
        </div>
      ))}

      <button className="btn btn-danger btn-block" style={{ marginTop: 32 }} onClick={handleDelete}>
        {t('organizations.deleteGroup')}
      </button>
    </div>
  );
}
