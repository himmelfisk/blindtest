import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';

export default function CreateOrganizationScreen() {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminName.trim() || !adminEmail.trim()) {
      alert(t('organizations.requiredFields'));
      return;
    }
    dispatch({
      type: 'ADD_ORGANIZATION',
      payload: {
        name: name.trim(),
        description: description.trim(),
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
      },
    });
    navigate('/organizations');
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/organizations')}>{t('common.back')}</button>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{t('organizations.createTitle')}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
        {t('organizations.createDesc')}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('organizations.groupName')}</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('organizations.groupNamePlaceholder')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('common.description')}</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('organizations.descriptionPlaceholder')}
          />
        </div>

        <div className="divider" />

        <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>{t('organizations.adminInfo')}</h2>

        <div className="form-group">
          <label className="form-label">{t('organizations.yourName')}</label>
          <input
            className="form-input"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder={t('organizations.yourNamePlaceholder')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('organizations.yourEmail')}</label>
          <input
            className="form-input"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder={t('organizations.yourEmailPlaceholder')}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          {t('organizations.createGroup')}
        </button>
      </form>
    </div>
  );
}
