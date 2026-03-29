import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

export default function CreateOrganizationScreen() {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminName.trim() || !adminEmail.trim()) {
      alert('Please fill in all required fields.');
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
      <button className="back-btn" onClick={() => navigate('/organizations')}>← Back</button>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Create a New Group</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
        Groups let you organize people and run blind testing events together.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Group Name *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Beer Tasting Club, Wine Society"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this group about?"
          />
        </div>

        <div className="divider" />

        <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>Your Info (Admin)</h2>

        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            className="form-input"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Email *</label>
          <input
            className="form-input"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Create Group
        </button>
      </form>
    </div>
  );
}
