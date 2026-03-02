import React from 'react';
import { Link } from 'react-router-dom';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { page, typography } from '../../styles';

export const LogisticsDashboard: React.FC = () => {
  const allSales = dummySales;
  const pendingPickup = allSales.filter((s) => s.logisticsStatus === 'PENDING_PICKUP');
  const inTransit = allSales.filter((s) => s.logisticsStatus === 'IN_TRANSIT');
  const delivered = allSales.filter((s) => s.logisticsStatus === 'DELIVERED');

  return (
    <div>
      <h1 className={page.title}>Dashboard Logística</h1>
      <div className={page.gridStats3}>
        <Card>
          <div className={page.statLabel}>Pendientes de Recolección</div>
          <div className={page.statValueYellow}>{pendingPickup.length}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>En Tránsito</div>
          <div className={page.statValueBlue}>{inTransit.length}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Entregados</div>
          <div className={page.statValueGreen}>{delivered.length}</div>
        </Card>
      </div>

      <Card>
        <div className={page.cardHeader}>
          <h2 className={page.cardTitle}>Envíos Recientes</h2>
          <Link to="/logistics/shipments" className={page.cardLinkPrimary}>
            Ver todos
          </Link>
        </div>
        <div className="space-y-3">
          {allSales.slice(0, 5).map((sale) => (
            <div key={sale.id} className={page.listItemBorder}>
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/logistics/shipments/${sale.id}`}
                    className={page.listItemLink}
                  >
                    Envío #{sale.id.split('-')[1]}
                  </Link>
                  <p className={typography.body}>
                    {sale.quantityLb} lb - {sale.pickupLocation.city} →{' '}
                    {sale.deliveryPlant.city}
                  </p>
                  <p className={typography.bodyMuted}>
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
