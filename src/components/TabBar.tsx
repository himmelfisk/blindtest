import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TabBar() {
  const { t } = useTranslation();

  return (
    <nav className="tab-bar">
      <NavLink to="/" end className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">🏠</span>
        {t('tabs.home')}
      </NavLink>
      <NavLink to="/organizations" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">👥</span>
        {t('tabs.groups')}
      </NavLink>
      <NavLink to="/forms" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">📋</span>
        {t('tabs.forms')}
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">🎉</span>
        {t('tabs.events')}
      </NavLink>
    </nav>
  );
}
