import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { page, button } from '../../styles';

export const LogisticsCertificates: React.FC = () => {
  const { user } = useAuth();

  const certificates = user?.docs || [];

  return (
    <div>
      <h1 className={page.title}>Certificates and Licenses</h1>
      <Card>
        <h2 className={`${page.cardTitle} mb-4`}>Registered Documents</h2>
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert, idx) => (
              <div key={idx} className={page.certificateItem}>
                <div>
                  <p className="font-medium text-gray-900">{cert}</p>
                </div>
                <button
                  onClick={() => alert('Descargando PDF (simulado)')}
                  className={button.primaryMd}
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={page.cardEmpty}>No certificates registered</p>
        )}
      </Card>
    </div>
  );
};
