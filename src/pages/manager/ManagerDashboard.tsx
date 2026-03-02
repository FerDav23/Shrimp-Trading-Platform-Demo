import React from 'react';
import { dummyOffers } from '../../data/offers';
import { dummySales } from '../../data/sales';
import { dummyUsers } from '../../data/users';
import { Card } from '../../components/Card';
import { page } from '../../styles';

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
      <h1 className={page.title}>Dashboard Administrador</h1>
      <div className={page.gridStats4}>
        <Card>
          <div className={page.statLabel}>Total Ventas</div>
          <div className={page.statValue}>{totalSales}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Ventas Pagadas</div>
          <div className={page.statValueGreen}>{paidSales}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Pendientes de Pago</div>
          <div className={page.statValueYellow}>{unpaidSales}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Volumen Total (lb)</div>
          <div className={page.statValueBlue}>{totalVolume.toLocaleString()}</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className={page.statLabel}>Ofertas Activas</div>
          <div className={page.statValuePrimary}>{activeOffers}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Total Usuarios</div>
          <div className={page.statValuePurple}>{totalUsers}</div>
        </Card>
      </div>
    </div>
  );
};
