import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { page } from '../../styles';
import { dummyOffers } from '../../data/offers';
import { dummySaleRequests } from '../../data/saleRequests';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { SALES_NAV_ITEMS, statusToPath } from './salesRoutes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SaleRequestStatus } from '../../types';

const SALE_REQUEST_STATUS_LABELS: Record<SaleRequestStatus, string> = {
  PENDING_ACCEPTANCE: 'Pendientes de Aceptar',
  CATCH_SETTLEMENT_PENDING: 'Liquidación de Pesca pendiente',
  ADVANCE_PENDING: 'Anticipo Pendiente',
  BALANCE_PENDING: 'Saldo Restante Pendiente',
  SALE_COMPLETED: 'Venta Finalizada',
  REJECTED: 'Rechazada',
};

const PRODUCT_FORM_LABELS: Record<string, string> = {
  ENTERO: 'Entero',
  COLA_DIRECTA: 'Cola directa',
};

/** ID del packer logueado (en producción vendría del AuthContext) */
const PACKER_ID = 'packer-rosasud';

export const PackerDashboard: React.FC = () => {
  useAuth();

  const myOffers = dummyOffers.filter((o) => o.packingCompany.id === PACKER_ID);
  const publishedOffers = myOffers.filter((o) => o.status === 'PUBLISHED');
  const offersEntero = publishedOffers.filter((o) => o.productForm === 'ENTERO').length;
  const offersCola = publishedOffers.filter((o) => o.productForm === 'COLA_DIRECTA').length;

  const mySaleRequests = dummySaleRequests.filter((r) => r.packingCompanyId === PACKER_ID);
  const requestsByStatus = SALES_NAV_ITEMS.reduce<Record<SaleRequestStatus, number>>(
    (acc, { status }) => {
      acc[status] = mySaleRequests.filter((r) => r.status === status).length;
      return acc;
    },
    {} as Record<SaleRequestStatus, number>
  );
  const pendingAcceptance = requestsByStatus.PENDING_ACCEPTANCE ?? 0;
  const recentRequests = [...mySaleRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className={page.titleLg}>Dashboard</h1>

      {/* Tarjetas de resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" aria-label="Resumen">
        <Link to="/packer/offers" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className={page.statLabel}>Ofertas publicadas</p>
            <p className={page.statValueEmerald}>{publishedOffers.length}</p>
            <p className={page.statDesc}>
              {publishedOffers.length === 0
                ? 'Sin ofertas activas'
                : `${offersEntero} Entero${offersCola > 0 ? ` · ${offersCola} Cola directa` : ''}`}
            </p>
          </Card>
        </Link>
        <Link to={statusToPath('PENDING_ACCEPTANCE')} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className={page.statLabel}>Pendientes de aceptar</p>
            <p className={page.statValueAmber}>{pendingAcceptance}</p>
            <p className={page.statDesc}>Solicitudes por revisar</p>
          </Card>
        </Link>
        <Link to="/packer/sales" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className={page.statLabel}>Total solicitudes</p>
            <p className={page.statValueSky}>{mySaleRequests.length}</p>
            <p className={page.statDesc}>Todas las compras</p>
          </Card>
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis ofertas (solo del packer actual) */}
        <Card>
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>Mis ofertas</h2>
            <Link to="/packer/offers" className={page.cardLink}>
              Gestionar ofertas
            </Link>
          </div>
          {publishedOffers.length === 0 ? (
            <p className={page.cardEmpty}>No tienes ofertas publicadas.</p>
          ) : (
            <ul className="space-y-0 divide-y divide-gray-100">
              {publishedOffers.slice(0, 5).map((offer) => (
                <li key={offer.id} className="py-3 first:pt-0">
                  <div className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {PRODUCT_FORM_LABELS[offer.productForm] ?? offer.productForm}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {offer.offerCode} · Válida hasta {format(new Date(offer.validTo), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-emerald-600">Publicada</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Compras por estado + recientes */}
        <Card>
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>Compras</h2>
            <Link to="/packer/sales" className={page.cardLink}>
              Ver todas
            </Link>
          </div>

          <div className="mb-6">
            <h3 className={page.sectionSubtitle}>Por estado</h3>
            <ul className="space-y-2">
              {SALES_NAV_ITEMS.map(({ status, label }) => {
                const count = requestsByStatus[status] ?? 0;
                return (
                  <li key={status}>
                    <Link
                      to={statusToPath(status)}
                      className={page.listItem}
                    >
                      <span className={page.listItemLabel}>{label}</span>
                      <span className={page.listItemCount}>{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className={page.sectionSubtitle}>Solicitudes recientes</h3>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">Ninguna solicitud.</p>
            ) : (
              <ul className="space-y-0 divide-y divide-gray-100">
                {recentRequests.map((request) => (
                  <li key={request.id}>
                    <Link
                      to={statusToPath(request.status)}
                      className="flex justify-between items-start gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          #{request.id.split('-')[1]} · {request.producerName}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {request.catchInfo.estimatedQuantityLb} lb · {PRODUCT_FORM_LABELS[request.productForm] ?? request.productForm}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: es })}
                        </p>
                      </div>
                      <StatusBadge
                        status={request.status}
                        label={SALE_REQUEST_STATUS_LABELS[request.status]}
                        className="shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};
