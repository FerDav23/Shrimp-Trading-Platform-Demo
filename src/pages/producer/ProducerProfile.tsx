import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';

export const ProducerProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información Personal
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600">Nombre:</span>
              <span className="ml-2 font-medium">{user.name}</span>
            </div>
            <div>
              <span className="text-gray-600">RUC/CI:</span>
              <span className="ml-2 font-medium">{user.ruc}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Teléfono:</span>
              <span className="ml-2 font-medium">{user.phone}</span>
            </div>
            {user.address && (
              <div>
                <span className="text-gray-600">Dirección:</span>
                <span className="ml-2 font-medium">{user.address}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Documentos
          </h2>
          {user.docs && user.docs.length > 0 ? (
            <ul className="space-y-2">
              {user.docs.map((doc, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  • {doc}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No hay documentos registrados</p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información Bancaria
          </h2>
          {user.bankInfo && user.bankInfo.length > 0 ? (
            <ul className="space-y-2">
              {user.bankInfo.map((info, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  • {info}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No hay información bancaria registrada</p>
          )}
        </Card>
      </div>
    </div>
  );
};
