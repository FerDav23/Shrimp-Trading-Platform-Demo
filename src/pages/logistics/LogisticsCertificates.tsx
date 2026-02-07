import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';

export const LogisticsCertificates: React.FC = () => {
  const { user } = useAuth();

  const certificates = user?.docs || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Certificados y Licencias</h1>
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Documentos Registrados
        </h2>
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md"
              >
                <div>
                  <p className="font-medium text-gray-900">{cert}</p>
                </div>
                <button
                  onClick={() => alert('Descargando PDF (simulado)')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
                >
                  Descargar PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay certificados registrados</p>
        )}
      </Card>
    </div>
  );
};
