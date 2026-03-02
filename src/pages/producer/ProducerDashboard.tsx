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
import { page, typography } from '../../styles';

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
      <h1 className={page.title}>Dashboard</h1>
      <div className={page.gridStats}>
        <Card>
          <div className={page.statLabel}>Ofertas Activas</div>
          <div className={page.statValue}>{activeOffers.length}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Ventas en Curso</div>
          <div className={page.statValueBlue}>{salesInProgress.length}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Ventas Pagadas</div>
          <div className={page.statValueGreen}>{paidSales.length}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Pendientes de Pago</div>
          <div className={page.statValueYellow}>{unpaidSales.length}</div>
        </Card>
        <Card>
          <div className={page.statLabel}>Mensajes sin leer</div>
          <div className={page.statValueYellow}>{unreadMessages.length}</div>
        </Card>
      </div>

      <div className={page.gridCards}>
        <Card>
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>Ofertas Recientes</h2>
            <Link to="/producer/offers" className={page.cardLinkPrimary}>
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {activeOffers.slice(0, 3).map((offer) => (
              <div key={offer.id} className={page.listItemBorder}>
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/producer/offers/${offer.id}`} className={page.listItemLink}>
                      {offer.offerCode}
                    </Link>
                    <p className={typography.body}>
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
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>Mensajes Recientes</h2>
            <Link to="/producer/messages" className={page.cardLinkPrimary}>
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div key={message.id} className={page.listItemBorder}>
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
                      {!message.isRead && <span className={page.unreadDot} />}
                    </div>
                    <p className={typography.body}>{message.from}</p>
                    <p className={`${typography.bodyMuted} mt-1`}>{message.preview}</p>
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
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>Ventas Recientes</h2>
            <Link to="/producer/sales" className={page.cardLinkPrimary}>
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {mySales.slice(0, 3).map((sale) => (
              <div key={sale.id} className={page.listItemBorder}>
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/producer/sales/${sale.id}`} className={page.listItemLink}>
                      Venta #{sale.id.split('-')[1]}
                    </Link>
                    <p className={typography.body}>
                      {sale.quantityLb} lb - {sale.productForm}
                    </p>
                    <p className={typography.bodyMuted}>
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
