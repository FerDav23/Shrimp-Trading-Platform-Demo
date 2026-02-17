import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { dummySales } from '../../data/sales';
import { dummyMessages } from '../../data/messages';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProducerDashboard: React.FC = () => {
  const { user } = useAuth();
  const activeOffers = dummyOffers.filter((o) => o.status === 'PUBLISHED');
  const mySales = dummySales.filter((s) => s.producerId === user?.id);
  const salesInProgress = mySales.filter(
    (s) => s.logisticsStatus !== 'DELIVERED'
  );
  const paidSales = mySales.filter((s) => s.paymentStatus === 'PAID');
  const unpaidSales = mySales.filter(
    (s) => s.paymentStatus === 'PENDING' || s.paymentStatus === 'PARTIAL'
  );
  
  // Mensajes para el productor
  const producerMessages = dummyMessages.filter(
    (m) => m.toId === user?.id
  );
  const unreadMessages = producerMessages.filter((m) => !m.isRead);
  const recentMessages = producerMessages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ofertas Activas</div>
          <div className="text-3xl font-bold text-gray-900">{activeOffers.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ventas en Curso</div>
          <div className="text-3xl font-bold text-blue-600">{salesInProgress.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ventas Pagadas</div>
          <div className="text-3xl font-bold text-green-600">{paidSales.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Pendientes de Pago</div>
          <div className="text-3xl font-bold text-yellow-600">{unpaidSales.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Mensajes sin leer</div>
          <div className="text-3xl font-bold text-yellow-600">{unreadMessages.length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ofertas Recientes</h2>
            <Link
              to="/producer/offers"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {activeOffers.slice(0, 3).map((offer) => (
              <div
                key={offer.id}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/producer/offers/${offer.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {offer.offerCode}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {offer.packingCompany.name} - {offer.productForm}
                    </p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mensajes Recientes</h2>
            <Link
              to="/producer/messages"
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
                        to={`/producer/messages/${message.id}`}
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
            <h2 className="text-lg font-semibold text-gray-900">Ventas Recientes</h2>
            <Link
              to="/producer/sales"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {mySales.slice(0, 3).map((sale) => (
              <div
                key={sale.id}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/producer/sales/${sale.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      Venta #{sale.id.split('-')[1]}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {sale.quantityLb} lb - {sale.productForm}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(sale.createdAt), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <StatusBadge status={sale.logisticsStatus} />
                    <StatusBadge status={sale.paymentStatus} />
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
