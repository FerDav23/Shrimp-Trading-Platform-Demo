import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { layout, button, topbar } from '../styles';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className={layout.topbar}>
      <div className="flex-1">
        {/* Breadcrumbs will be added per page */}
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={topbar.userButton}
        >
          <div className={button.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span>{user.name}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showMenu && (
          <div className={topbar.dropdown}>
            <div className={topbar.dropdownHeader}>
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              className={topbar.dropdownItem}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
