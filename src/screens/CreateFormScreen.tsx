import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';
import type { CriterionDefinition } from '../models/types';

const PRESET_CATEGORIES = [
  'Beer', 'Wine', 'Coffee', 'Whiskey', 'Chocolate', 'Cheese', 'Olive Oil', 'Tea', 'Other',
];

function getPresetCriteria(category: string): CriterionDefinition[] {
  const presets: Record<string, Array<{ name: string; description: string }>> = {
    Beer: [
      { name: 'Appearance', description: 'Color, clarity, foam/head' },
      { name: 'Aroma', description: 'Smell before tasting' },
      { name: 'Taste', description: 'Overall flavor profile' },
      { name: 'Mouthfeel', description: 'Body, carbonation, texture' },
      { name: 'Aftertaste', description: 'Finish and lingering flavors' },
      { name: 'Overall Impression', description: 'General rating' },
    ],
    Wine: [
      { name: 'Appearance', description: 'Color, clarity, viscosity' },
      { name: 'Nose', description: 'Aroma intensity and complexity' },
      { name: 'Palate', description: 'Flavor, sweetness, acidity' },
      { name: 'Tannins', description: 'Tannin level and quality' },
      { name: 'Finish', description: 'Length and quality of aftertaste' },
      { name: 'Overall Impression', description: 'General rating' },
    ],
    Coffee: [
      { name: 'Aroma', description: 'Smell of the brewed coffee' },
      { name: 'Acidity', description: 'Brightness and sharpness' },
      { name: 'Body', description: 'Weight and texture in the mouth' },
      { name: 'Flavor', description: 'Overall taste experience' },
      { name: 'Aftertaste', description: 'Lingering taste after swallowing' },
      { name: 'Overall Impression', description: 'General rating' },
    ],
  };

  const items = presets[category] ?? [
    { name: 'Appearance', description: 'Visual qualities' },
    { name: 'Aroma', description: 'Smell/fragrance' },
    { name: 'Taste', description: 'Flavor profile' },
    { name: 'Overall Impression', description: 'General rating' },
  ];

  return items.map((item) => ({
    id: uuidv4(),
    name: item.name,
    description: item.description,
    minValue: 1,
    maxValue: 10,
  }));
}

export default function CreateFormScreen() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beer');
  const [organizationId, setOrganizationId] = useState(
    state.organizations[0]?.id ?? ''
  );
  const [criteria, setCriteria] = useState<CriterionDefinition[]>(
    getPresetCriteria('Beer')
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMax, setNewMax] = useState('10');

  if (state.organizations.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">👥</div>
          <h3>Create a group first</h3>
          <p>You need at least one group before creating a testing form.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/organizations/new')}>
            Create Group
          </button>
        </div>
      </div>
    );
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCriteria(getPresetCriteria(cat));
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { alert('Please enter a criterion name.'); return; }
    const max = parseInt(newMax, 10);
    if (isNaN(max) || max < 1) { alert('Please enter a valid max value.'); return; }
    setCriteria([
      ...criteria,
      { id: uuidv4(), name: newName.trim(), description: newDesc.trim(), minValue: 1, maxValue: max },
    ]);
    setNewName('');
    setNewDesc('');
    setNewMax('10');
    setShowAdd(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter a form name.'); return; }
    if (!organizationId) { alert('Please select a group.'); return; }
    if (criteria.length === 0) { alert('Please add at least one criterion.'); return; }
    dispatch({
      type: 'ADD_FORM',
      payload: { name: name.trim(), description: description.trim(), category, criteria, organizationId },
    });
    navigate('/forms');
  };

  return (
    <div className="page">
      <button type="button" className="back-btn" onClick={() => navigate('/forms')}>← Back</button>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Create Testing Form</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
        Define the criteria participants will use to evaluate samples.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Form Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., IPA Blind Tasting, Coffee Cupping" />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you testing?" />
        </div>

        <div className="form-group">
          <label className="form-label">Group *</label>
          <div className="picker-row">
            {state.organizations.map((org) => (
              <button
                type="button"
                key={org.id}
                className={`picker-option${organizationId === org.id ? ' selected' : ''}`}
                onClick={() => setOrganizationId(org.id)}
              >
                {org.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="chip-row">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`chip${category === cat ? ' selected' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {getCategoryEmoji(cat)} {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="section-header">
          <h2 className="section-title">Scoring Criteria ({criteria.length})</h2>
          <button type="button" className="text-link" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showAdd && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <input className="form-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Criterion name" />
            </div>
            <div className="form-group">
              <input className="form-input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Max score:</label>
              <input className="form-input" style={{ maxWidth: 80 }} value={newMax} onChange={(e) => setNewMax(e.target.value)} type="number" min="1" />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={handleAddCriterion}>
              Add Criterion
            </button>
          </div>
        )}

        {criteria.map((c) => (
          <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.9375rem' }}>{c.name}</strong>
              {c.description && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{c.description}</div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 4 }}>
                Score: {c.minValue} – {c.maxValue}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCriteria(criteria.filter((cr) => cr.id !== c.id))}
              style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--color-surface-variant)',
                border: 'none', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer', marginLeft: 12,
              }}
            >
              ✕
            </button>
          </div>
        ))}

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
          Create Form
        </button>
      </form>
    </div>
  );
}
