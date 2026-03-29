import { NavLink } from 'react-router-dom';

export default function TabBar() {
  return (
    <nav className="tab-bar">
      <NavLink to="/" end className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">🏠</span>
        Home
      </NavLink>
      <NavLink to="/organizations" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">👥</span>
        Groups
      </NavLink>
      <NavLink to="/forms" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">📋</span>
        Forms
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
        <span className="tab-icon">🎉</span>
        Events
      </NavLink>
    </nav>
  );
}
