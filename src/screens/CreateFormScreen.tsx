import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/useAppContext';
import { getCategoryEmoji } from '../utils/categoryEmoji';
import type { CriterionDefinition } from '../models/types';

const PRESET_CATEGORIES = [
  'Beer', 'Wine', 'Coffee', 'Whiskey', 'Chocolate', 'Cheese', 'Olive Oil', 'Tea', 'Other',
];

const PRESET_KEYS: Record<string, Array<{ nameKey: string; descKey: string }>> = {
  Beer: [
    { nameKey: 'Appearance', descKey: 'AppearanceDesc' },
    { nameKey: 'Aroma', descKey: 'AromaDesc' },
    { nameKey: 'Taste', descKey: 'TasteDesc' },
    { nameKey: 'Mouthfeel', descKey: 'MouthfeelDesc' },
    { nameKey: 'Aftertaste', descKey: 'AftertasteDesc' },
    { nameKey: 'Overall Impression', descKey: 'Overall ImpressionDesc' },
  ],
  Wine: [
    { nameKey: 'Appearance', descKey: 'AppearanceDesc' },
    { nameKey: 'Nose', descKey: 'NoseDesc' },
    { nameKey: 'Palate', descKey: 'PalateDesc' },
    { nameKey: 'Tannins', descKey: 'TanninsDesc' },
    { nameKey: 'Finish', descKey: 'FinishDesc' },
    { nameKey: 'Overall Impression', descKey: 'Overall ImpressionDesc' },
  ],
  Coffee: [
    { nameKey: 'Aroma', descKey: 'AromaDesc' },
    { nameKey: 'Acidity', descKey: 'AcidityDesc' },
    { nameKey: 'Body', descKey: 'BodyDesc' },
    { nameKey: 'Flavor', descKey: 'FlavorDesc' },
    { nameKey: 'Aftertaste', descKey: 'AftertasteDesc' },
    { nameKey: 'Overall Impression', descKey: 'Overall ImpressionDesc' },
  ],
};

const DEFAULT_PRESET_KEYS = [
  { nameKey: 'Appearance', descKey: 'AppearanceDesc' },
  { nameKey: 'Aroma', descKey: 'AromaDesc' },
  { nameKey: 'Taste', descKey: 'TasteDesc' },
  { nameKey: 'Overall Impression', descKey: 'Overall ImpressionDesc' },
];

export default function CreateFormScreen() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getPresetCriteria = (category: string): CriterionDefinition[] => {
    const keys = PRESET_KEYS[category] ?? DEFAULT_PRESET_KEYS;
    const presetCategory = PRESET_KEYS[category] ? category : 'Default';
    return keys.map((item) => ({
      id: uuidv4(),
      name: t(`presets.${presetCategory}.${item.nameKey}`),
      description: t(`presets.${presetCategory}.${item.descKey}`),
      minValue: 1,
      maxValue: 10,
    }));
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beer');
  const [organizationId, setOrganizationId] = useState(
    state.organizations[0]?.id ?? ''
  );
  const [criteria, setCriteria] = useState<CriterionDefinition[]>(() =>
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
          <h3>{t('forms.noGroupFirst')}</h3>
          <p>{t('forms.noGroupFirstHint')}</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/organizations/new')}>
            {t('organizations.createGroup')}
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
    if (!newName.trim()) { alert(t('forms.alertCriterionName')); return; }
    const max = parseInt(newMax, 10);
    if (isNaN(max) || max < 1) { alert(t('forms.alertMaxValue')); return; }
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
    if (!name.trim()) { alert(t('forms.alertFormName')); return; }
    if (!organizationId) { alert(t('forms.alertSelectGroup')); return; }
    if (criteria.length === 0) { alert(t('forms.alertAddCriterion')); return; }
    dispatch({
      type: 'ADD_FORM',
      payload: { name: name.trim(), description: description.trim(), category, criteria, organizationId },
    });
    navigate('/forms');
  };

  return (
    <div className="page">
      <button type="button" className="back-btn" onClick={() => navigate('/forms')}>{t('common.back')}</button>

      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{t('forms.createTitle')}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
        {t('forms.createDesc')}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('forms.formName')}</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('forms.formNamePlaceholder')} />
        </div>

        <div className="form-group">
          <label className="form-label">{t('common.description')}</label>
          <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('forms.descriptionPlaceholder')} />
        </div>

        <div className="form-group">
          <label className="form-label">{t('forms.group')}</label>
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
          <label className="form-label">{t('forms.category')}</label>
          <div className="chip-row">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`chip${category === cat ? ' selected' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {getCategoryEmoji(cat)} {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="section-header">
          <h2 className="section-title">{t('forms.scoringCriteria')} ({criteria.length})</h2>
          <button type="button" className="text-link" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? t('common.cancel') : t('common.add')}
          </button>
        </div>

        {showAdd && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <input className="form-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('forms.criterionNamePlaceholder')} />
            </div>
            <div className="form-group">
              <input className="form-input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder={t('forms.criterionDescPlaceholder')} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>{t('forms.maxScore')}</label>
              <input className="form-input" style={{ maxWidth: 80 }} value={newMax} onChange={(e) => setNewMax(e.target.value)} type="number" min="1" />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={handleAddCriterion}>
              {t('forms.addCriterion')}
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
                {t('common.score')}: {c.minValue} – {c.maxValue}
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
          {t('forms.createForm')}
        </button>
      </form>
    </div>
  );
}
