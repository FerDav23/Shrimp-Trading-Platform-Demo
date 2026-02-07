import React from 'react';
import { Link } from 'react-router-dom';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const LogisticsDashboard: React.FC = () => {
  const allSales = dummySales;
  const pendingPickup = allSales.filter((s) => s.logisticsStatus === 'PENDING_PICKUP');
  const inTransit = allSales.filter((s) => s.logisticsStatus === 'IN_TRANSIT');
  const delivered = allSales.filter((s) => s.logisticsStatus === 'DELIVERED');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Logística</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Pendientes de Recolección</div>
          <div className="text-3xl font-bold text-yellow-600">{pendingPickup.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">En Tránsito</div>
          <div className="text-3xl font-bold text-blue-600">{inTransit.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Entregados</div>
          <div className="text-3xl font-bold text-green-600">{delivered.length}</div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Envíos Recientes</h2>
          <Link
            to="/logistics/shipments"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Ver todos
          </Link>
        </div>
        <div className="space-y-3">
          {allSales.slice(0, 5).map((sale) => (
            <div
              key={sale.id}
              className="border-b border-gray-200 pb-3 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/logistics/shipments/${sale.id}`}
                    className="font-medium text-gray-900 hover:text-primary-600"
                  >
                    Envío #{sale.id.split('-')[1]}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {sale.quantityLb} lb - {sale.pickupLocation.city} →{' '}
                    {sale.deliveryPlant.city}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(sale.createdAt), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
                <StatusBadge status={sale.logisticsStatus} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
