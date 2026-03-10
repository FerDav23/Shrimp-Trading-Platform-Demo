import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';
import { layout, sidebar } from '../styles';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'PRODUCER':
      return [
        { label: 'Dashboard', path: '/producer/dashboard' },
        { label: 'Offers', path: '/producer/offers' },
        { label: 'Sales', path: '/producer/sales' },
        { label: 'Profile', path: '/producer/profile' },
      ];
    case 'PACKER':
      return [
        { label: 'Dashboard', path: '/packer/dashboard' },
        { label: 'My Offers', path: '/packer/offers' },
        { label: 'Purchases', path: '/packer/sales' },
      ];
    case 'LOGISTICS':
      return [
        { label: 'Dashboard', path: '/logistics/dashboard' },
        { label: 'Shipments', path: '/logistics/shipments' },
        { label: 'Pricing', path: '/logistics/pricing' },
        { label: 'Certificates', path: '/logistics/certificates' },
      ];
    case 'MANAGER':
      return [
        { label: 'Dashboard', path: '/manager/dashboard' },
        { label: 'Users', path: '/manager/users' },
        { label: 'Offers', path: '/manager/offers' },
        { label: 'Sales', path: '/manager/sales' },
        { label: 'Approvals', path: '/manager/approvals' },
      ];
    default:
      return [];
  }
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

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
          const isActive =
            item.path === '/packer/sales'
              ? location.pathname.startsWith('/packer/sales')
              : location.pathname === item.path;
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
