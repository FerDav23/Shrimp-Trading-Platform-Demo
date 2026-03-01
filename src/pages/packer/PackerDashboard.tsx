import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Tarjetas de resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" aria-label="Resumen">
        <Link to="/packer/offers" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ofertas publicadas</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{publishedOffers.length}</p>
            <p className="mt-2 text-sm text-gray-600">
              {publishedOffers.length === 0
                ? 'Sin ofertas activas'
                : `${offersEntero} Entero${offersCola > 0 ? ` · ${offersCola} Cola directa` : ''}`}
            </p>
          </Card>
        </Link>
        <Link to={statusToPath('PENDING_ACCEPTANCE')} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pendientes de aceptar</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{pendingAcceptance}</p>
            <p className="mt-2 text-sm text-gray-600">Solicitudes por revisar</p>
          </Card>
        </Link>
        <Link to="/packer/sales" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total solicitudes</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">{mySaleRequests.length}</p>
            <p className="mt-2 text-sm text-gray-600">Todas las compras</p>
          </Card>
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis ofertas (solo del packer actual) */}
        <Card>
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mis ofertas</h2>
            <Link to="/packer/offers" className="text-sm font-medium text-sky-600 hover:text-sky-700">
              Gestionar ofertas
            </Link>
          </div>
          {publishedOffers.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No tienes ofertas publicadas.</p>
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
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compras</h2>
            <Link to="/packer/sales" className="text-sm font-medium text-sky-600 hover:text-sky-700">
              Ver todas
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Por estado</h3>
            <ul className="space-y-2">
              {SALES_NAV_ITEMS.map(({ status, label }) => {
                const count = requestsByStatus[status] ?? 0;
                return (
                  <li key={status}>
                    <Link
                      to={statusToPath(status)}
                      className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm text-gray-700 truncate pr-2">{label}</span>
                      <span className="text-sm font-semibold text-sky-600 tabular-nums">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Solicitudes recientes</h3>
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
