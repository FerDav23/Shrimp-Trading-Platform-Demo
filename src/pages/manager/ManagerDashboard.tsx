import React from 'react';
import { dummyOffers } from '../../data/offers';
import { dummySales } from '../../data/sales';
import { dummyUsers } from '../../data/users';
import { Card } from '../../components/Card';

export const ManagerDashboard: React.FC = () => {
  const totalSales = dummySales.length;
  const paidSales = dummySales.filter((s) => s.paymentStatus === 'PAID').length;
  const unpaidSales = dummySales.filter(
    (s) => s.paymentStatus === 'PENDING' || s.paymentStatus === 'PARTIAL'
  ).length;
  const totalVolume = dummySales.reduce((sum, s) => sum + s.quantityLb, 0);
  const activeOffers = dummyOffers.filter((o) => o.status === 'PUBLISHED').length;
  const totalUsers = dummyUsers.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total Ventas</div>
          <div className="text-3xl font-bold text-gray-900">{totalSales}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ventas Pagadas</div>
          <div className="text-3xl font-bold text-green-600">{paidSales}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Pendientes de Pago</div>
          <div className="text-3xl font-bold text-yellow-600">{unpaidSales}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Volumen Total (lb)</div>
          <div className="text-3xl font-bold text-blue-600">
            {totalVolume.toLocaleString()}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ofertas Activas</div>
          <div className="text-3xl font-bold text-primary-600">{activeOffers}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total Usuarios</div>
          <div className="text-3xl font-bold text-purple-600">{totalUsers}</div>
        </Card>
      </div>
    </div>
  );
};
