import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { page, typography } from '../../styles';

export const ProducerProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1 className={page.title}>My Profile</h1>
      <div className={page.grid2}>
        <Card>
          <h2 className={`${page.cardTitle} mb-4`}>Personal Information</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className={typography.body}>Name:</span>
              <span className="ml-2 font-medium">{user.name}</span>
            </div>
            <div>
              <span className={typography.body}>RUC/CI:</span>
              <span className="ml-2 font-medium">{user.ruc}</span>
            </div>
            <div>
              <span className={typography.body}>Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className={typography.body}>Phone:</span>
              <span className="ml-2 font-medium">{user.phone}</span>
            </div>
            {user.address && (
              <div>
                <span className={typography.body}>Address:</span>
                <span className="ml-2 font-medium">{user.address}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className={`${page.cardTitle} mb-4`}>Documents</h2>
          {user.docs && user.docs.length > 0 ? (
            <ul className="space-y-2">
              {user.docs.map((doc, idx) => (
                <li key={idx} className={typography.body}>
                  • {doc}
                </li>
              ))}
            </ul>
          ) : (
            <p className={page.cardEmpty}>No documents registered</p>
          )}
        </Card>

        <Card>
          <h2 className={`${page.cardTitle} mb-4`}>Bank Information</h2>
          {user.bankInfo && user.bankInfo.length > 0 ? (
            <ul className="space-y-2">
              {user.bankInfo.map((info, idx) => (
                <li key={idx} className={typography.body}>
                  • {info}
                </li>
              ))}
            </ul>
          ) : (
            <p className={page.cardEmpty}>No bank information registered</p>
          )}
        </Card>
      </div>
    </div>
  );
};
