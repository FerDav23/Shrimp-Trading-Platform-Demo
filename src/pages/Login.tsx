import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { dummyUsers } from '../data/users';
import { Card } from '../components/Card';
import { login as loginStyles, typography, button } from '../styles';

export const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const rolePath = user.role.toLowerCase();
      navigate(`/${rolePath}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = (userId: string) => {
    try {
      login(userId);
      const user = dummyUsers.find((u) => u.id === userId);
      if (user) {
        const rolePath = user.role.toLowerCase();
        navigate(`/${rolePath}/dashboard`);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      PRODUCER: 'Producer',
      PACKER: 'Packer',
    };
    return labels[role] || role;
  };

  return (
    <div className={loginStyles.container}>
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className={loginStyles.title}>
            Shrimp Commercialization Platform
          </h1>
          <p className={loginStyles.subtitle}>Select a user to continue</p>
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-2xl mx-auto">
            <strong>Demo.</strong> This is a simplified demo of the original system. The full system is not included here in order to protect sensitive company information and system architecture.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyUsers
            .filter((u) => u.role === 'PRODUCER' || u.role === 'PACKER')
            .map((user) => (
            <Card
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className={loginStyles.cardHover}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {user.name}
                  </h3>
                  <p className={clsx(typography.body, 'mb-2')}>
                    {getRoleLabel(user.role)}
                  </p>
                  <p className={typography.bodyMuted}>RUC: {user.ruc}</p>
                  <p className={typography.bodyMuted}>{user.email}</p>
                </div>
                <div className={button.avatarLg}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
