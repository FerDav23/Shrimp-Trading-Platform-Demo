import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';
import { SALES_NAV_ITEMS, statusToPath } from '../pages/packer/salesRoutes';
import { layout, sidebar } from '../styles';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface NavItemWithChildren {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

const getNavItems = (role: string): (NavItem | NavItemWithChildren)[] => {
  switch (role) {
    case 'PRODUCER':
      return [
        { label: 'Dashboard', path: '/producer/dashboard' },
        { label: 'Ofertas', path: '/producer/offers' },
        { label: 'Ventas', path: '/producer/sales' },
        { label: 'Perfil', path: '/producer/profile' },
      ];
    case 'PACKER':
      return [
        { label: 'Dashboard', path: '/packer/dashboard' },
        { label: 'Mis Ofertas', path: '/packer/offers' },
        {
          label: 'Compras',
          path: '/packer/sales',
          children: SALES_NAV_ITEMS.map((item) => ({
            label: item.label,
            path: statusToPath(item.status),
          })),
        },
      ];
    case 'LOGISTICS':
      return [
        { label: 'Dashboard', path: '/logistics/dashboard' },
        { label: 'Envíos', path: '/logistics/shipments' },
        { label: 'Tarifas', path: '/logistics/pricing' },
        { label: 'Certificados', path: '/logistics/certificates' },
      ];
    case 'MANAGER':
      return [
        { label: 'Dashboard', path: '/manager/dashboard' },
        { label: 'Usuarios', path: '/manager/users' },
        { label: 'Ofertas', path: '/manager/offers' },
        { label: 'Ventas', path: '/manager/sales' },
        { label: 'Aprobaciones', path: '/manager/approvals' },
      ];
    default:
      return [];
  }
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedCompras, setExpandedCompras] = useState(false);

  const isSalesPath = location.pathname.startsWith('/packer/sales');

  useEffect(() => {
    if (isSalesPath) setExpandedCompras(true);
  }, [isSalesPath]);

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <div className={layout.sidebar}>
      <div className="p-6">
        <h1 className="text-xl font-bold">Camarón Platform</h1>
        <p className="text-sm text-gray-400 mt-1">{user.role}</p>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const hasChildren = 'children' in item && item.children && item.children.length > 0;
          if (hasChildren && item.children) {
            const isExpanded = item.path === '/packer/sales' ? expandedCompras : false;
            const isParentActive = location.pathname.startsWith(item.path);
            return (
              <div key={item.path}>
                <button
                  type="button"
                  onClick={() => item.path === '/packer/sales' && setExpandedCompras((e) => !e)}
                  className={clsx(
                    sidebar.navItemWithChildren,
                    isParentActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <span>{item.label}</span>
                  <svg
                    className={clsx('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className={sidebar.submenu}>
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={clsx(
                            sidebar.navChild,
                            isChildActive ? sidebar.navChildActive : sidebar.navChildInactive
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                sidebar.navItem,
                isActive ? sidebar.navItemActive : sidebar.navItemInactive
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
