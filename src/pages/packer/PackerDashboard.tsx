import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { dummySaleRequests } from '../../data/saleRequests';
import { dummyMessages } from '../../data/messages';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import type { SaleRequestStatus } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SALE_REQUEST_STATUS_LABELS: Record<SaleRequestStatus, string> = {
  PENDING_ACCEPTANCE: 'Pendientes de Aceptar',
  CATCH_SETTLEMENT_PENDING: 'Liquidación de Pesca pendiente',
  ADVANCE_PENDING: 'Anticipo Pendiente',
  BALANCE_PENDING: 'Saldo Restante Pendiente',
  SALE_COMPLETED: 'Venta Finalizada',
  REJECTED: 'Rechazada',
};

export const PackerDashboard: React.FC = () => {
  useAuth();
  const packerId = 'packer-rosasud';
  const myOffers = dummyOffers.filter(
    (o) => o.packingCompany.id === packerId
  );
  const publishedOffers = myOffers.filter((o) => o.status === 'PUBLISHED');
  const mySaleRequests = dummySaleRequests.filter(
    (r) => r.packingCompanyId === packerId
  );
  const pendingRequests = mySaleRequests.filter((r) => r.status === 'PENDING_ACCEPTANCE');
  
  // Mensajes para el packer
  const packerMessages = dummyMessages.filter(
    (m) => m.toId === 'packer-rosasud'
  );
  const unreadMessages = packerMessages.filter((m) => !m.isRead);
  const recentMessages = packerMessages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="/packer/offers">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1">Ofertas Publicadas</div>
            <div className="text-3xl font-bold text-green-600">{publishedOffers.length}</div>
          </Card>
        </Link>
        <Link to="/packer/messages">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1">Mensajes sin leer</div>
            <div className="text-3xl font-bold text-yellow-600">{unreadMessages.length}</div>
          </Card>
        </Link>
        <Link to="/packer/sales">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1">Solicitudes Pendientes</div>
            <div className="text-3xl font-bold text-blue-600">{pendingRequests.length}</div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mensajes Recientes</h2>
            <Link
              to="/packer/messages"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/packer/messages/${message.id}`}
                        className={`font-medium hover:text-primary-600 ${
                          message.isRead ? 'text-gray-700' : 'text-gray-900 font-semibold'
                        }`}
                      >
                        {message.subject}
                      </Link>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{message.from}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.preview}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(message.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Solicitudes Recientes</h2>
            <Link
              to="/packer/sales"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {mySaleRequests
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map((request) => (
                <div
                  key={request.id}
                  className="border-b border-gray-200 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/packer/sales/${request.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        Solicitud #{request.id.split('-')[1]}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {request.producerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.catchInfo.estimatedQuantityLb} lb - {request.productForm}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <StatusBadge status={request.status} label={SALE_REQUEST_STATUS_LABELS[request.status]} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
