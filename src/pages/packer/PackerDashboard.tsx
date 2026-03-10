import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { page, packerSales } from '../../styles';
import { dummyOffers } from '../../data/offers';
import { dummySaleRequests } from '../../data/saleRequests';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { SALES_STATUS_TABS, statusToPath, SLUG_LOGISTICS_TRACKING } from './salesRoutes';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { SaleRequestStatus } from '../../types';
import { isLogisticsTrackingStatus } from '../../types';
import type { WorkflowStatus } from './salesRoutes';
import { getStatusLabel } from './saleRequestDetailModal/utils';

const STATUS_CLASS: Record<SaleRequestStatus, string> = {
  LOGISTICS_QUOTE_IN_PROGRESS: packerSales.colStatusLogisticsQuoteInProgress,
  LOGISTICS_QUOTE_PENDING_ACCEPTANCE: packerSales.colStatusLogisticsQuotePendingAcceptance,
  PENDING_ACCEPTANCE: packerSales.colStatusPendingAcceptance,
  CATCH_SETTLEMENT_PENDING: packerSales.colStatusCatchSettlement,
  ADVANCE_PENDING: packerSales.colStatusAdvancePending,
  BALANCE_PENDING: packerSales.colStatusBalancePending,
  SALE_COMPLETED: packerSales.colStatusSaleCompleted,
  REJECTED: packerSales.colStatusRejected,
  PENDING_PICKUP: packerSales.colStatusLogisticsPendingPickup,
  PENDING_DELIVERY: packerSales.colStatusLogisticsPendingDelivery,
  PICKED_UP: packerSales.colStatusLogisticsPickedUp,
  DELIVERED: packerSales.colStatusLogisticsDelivered,
};

const PRODUCT_FORM_LABELS: Record<string, string> = {
  ENTERO: 'Whole',
  COLA_DIRECTA: 'Direct tail',
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
  const requestsByStatus = SALES_STATUS_TABS.reduce<Record<WorkflowStatus, number>>(
    (acc, { tab }) => {
      acc[tab] = mySaleRequests.filter((r) => r.status === tab).length;
      return acc;
    },
    {} as Record<WorkflowStatus, number>
  );
  const pendingAcceptance = requestsByStatus.PENDING_ACCEPTANCE ?? 0;
  const recentRequests = [...mySaleRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className={page.titleLg}>Dashboard</h1>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" aria-label="Summary">
        <Link to="/packer/offers" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className={page.statLabel}>Published offers</p>
            <p className={page.statValueEmerald}>{publishedOffers.length}</p>
            <p className={page.statDesc}>
              {publishedOffers.length === 0
                ? 'No active offers'
                : `${offersEntero} Whole${offersCola > 0 ? ` · ${offersCola} Direct tail` : ''}`}
            </p>
          </Card>
        </Link>
        <Link to={statusToPath('PENDING_ACCEPTANCE')} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className={page.statLabel}>Pending acceptance</p>
            <p className={page.statValueAmber}>{pendingAcceptance}</p>
            <p className={page.statDesc}>Requests to review</p>
          </Card>
        </Link>
        <Link to="/packer/sales" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <p className={page.statLabel}>Total requests</p>
            <p className={page.statValueSky}>{mySaleRequests.length}</p>
            <p className={page.statDesc}>All purchases</p>
          </Card>
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My offers (current packer only) */}
        <Card>
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>My offers</h2>
            <Link to="/packer/offers" className={page.cardLink}>
              Manage offers
            </Link>
          </div>
          {publishedOffers.length === 0 ? (
            <p className={page.cardEmpty}>You have no published offers.</p>
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
                        {offer.offerCode} · Valid until {format(new Date(offer.validTo), 'dd MMM yyyy', { locale: enUS })}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-emerald-600">Published</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Purchases by status + recent */}
        <Card>
          <div className={page.cardHeader}>
            <h2 className={page.cardTitle}>Purchases</h2>
            <Link to="/packer/sales" className={page.cardLink}>
              View all
            </Link>
          </div>

          <div className="mb-6">
            <h3 className={page.sectionSubtitle}>By status</h3>
            <ul className="space-y-2">
              {SALES_STATUS_TABS.map(({ tab, label }) => {
                const count = requestsByStatus[tab] ?? 0;
                return (
                  <li key={tab}>
                    <Link
                      to={statusToPath(tab)}
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
            <h3 className={page.sectionSubtitle}>Recent requests</h3>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No requests.</p>
            ) : (
              <ul className="space-y-0 divide-y divide-gray-100">
                {recentRequests.map((request) => (
                  <li key={request.id}>
                    <Link
                      to={`/packer/sales?view=${isLogisticsTrackingStatus(request.status) ? SLUG_LOGISTICS_TRACKING : statusToPath(request.status as WorkflowStatus)}`}
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
                          {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: enUS })}
                        </p>
                      </div>
                      <StatusBadge
                        status={request.status}
                        label={getStatusLabel(request.status)}
                        fullClassName={STATUS_CLASS[request.status]}
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
