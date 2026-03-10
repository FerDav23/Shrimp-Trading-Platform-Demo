import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { page, packerSales } from '../../styles';
import { dummySaleRequests } from '../../data/saleRequests';
import { SaleRequest, LogisticsDeliveryConfirm, SaleRequestStatus, isLogisticsTrackingStatus } from '../../types';
import { SaleRequestDetailModal } from './saleRequestDetailModal';
import { getStatusLabel as getRequestStatusLabel } from './saleRequestDetailModal/utils';
import {
  SALES_VIEW_TABS,
  slugToViewTab,
  viewTabToSlug,
  TAB_LOGISTICS_QUOTE,
  TAB_LOGISTICS_TRACKING,
  VIEW_ALL,
  type SalesViewTab,
  type WorkflowStatus,
} from './salesRoutes';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const TAB_LABELS: Record<WorkflowStatus, string> = {
  PENDING_ACCEPTANCE: 'Pending Acceptance',
  CATCH_SETTLEMENT_PENDING: 'Catch Settlement Pending',
  ADVANCE_PENDING: 'Advance Pending',
  BALANCE_PENDING: 'Balance Pending',
  SALE_COMPLETED: 'Sale Completed',
  REJECTED: 'Rejected',
};

const SECTION_TITLES: Record<WorkflowStatus, string> = {
  PENDING_ACCEPTANCE: 'Requests Pending Acceptance',
  CATCH_SETTLEMENT_PENDING: 'Requests with Catch Settlement Pending',
  ADVANCE_PENDING: 'Requests with Advance Pending',
  BALANCE_PENDING: 'Requests with Balance Pending',
  SALE_COMPLETED: 'Requests with Sale Completed',
  REJECTED: 'Rejected Requests',
};

const LOGISTICS_QUOTE_STATUSES: SaleRequestStatus[] = ['LOGISTICS_QUOTE_IN_PROGRESS', 'LOGISTICS_QUOTE_PENDING_ACCEPTANCE'];

function getTabLabel(status: SalesViewTab): string {
  if (status === VIEW_ALL) return 'All requests';
  if (status === TAB_LOGISTICS_QUOTE) return 'Logistics quote';
  if (status === TAB_LOGISTICS_TRACKING) return 'Logistics tracking';
  return TAB_LABELS[status as WorkflowStatus];
}

function getSectionTitle(tab: SalesViewTab): string {
  if (tab === VIEW_ALL) return 'All purchase requests';
  if (tab === TAB_LOGISTICS_QUOTE) return 'Requests in logistics quote';
  if (tab === TAB_LOGISTICS_TRACKING) return 'Requests with logistics pending';
  return SECTION_TITLES[tab as WorkflowStatus];
}

/** Clase de badge para cualquier estado (flujo + logística + cotización) */
const STATUS_CLASSES: Record<SaleRequestStatus, string> = {
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

function getStatusClass(status: SalesViewTab): string {
  if (status === VIEW_ALL) return packerSales.colStatus;
  if (status === TAB_LOGISTICS_QUOTE) return packerSales.colStatus;
  if (status === TAB_LOGISTICS_TRACKING) return packerSales.colStatusLogisticsTracking;
  return STATUS_CLASSES[status as SaleRequestStatus] ?? packerSales.colStatus;
}

export const PackerSales: React.FC = () => {
  useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewSlug = searchParams.get('view') ?? undefined;
  const activeTab: SalesViewTab = slugToViewTab(viewSlug);

  const packerId = 'packer-rosasud';
  const allRequests = useMemo(
    () => dummySaleRequests.filter((r) => r.packingCompanyId === packerId),
    []
  );

  const filteredRequests =
    activeTab === VIEW_ALL
      ? allRequests
      : activeTab === TAB_LOGISTICS_QUOTE
        ? allRequests.filter((r) => LOGISTICS_QUOTE_STATUSES.includes(r.status))
        : activeTab === TAB_LOGISTICS_TRACKING
          ? allRequests.filter((r) => isLogisticsTrackingStatus(r.status))
          : allRequests.filter((r) => r.status === activeTab);

  const [selectedRequest, setSelectedRequest] = useState<SaleRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settlementSentIds, setSettlementSentIds] = useState<Set<string>>(new Set());
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [deliveryConfirmed, setDeliveryConfirmed] = useState<Record<string, LogisticsDeliveryConfirm>>({});

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollArrows = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateScrollArrows();
    const ro = new ResizeObserver(updateScrollArrows);
    ro.observe(el);
    el.addEventListener('scroll', updateScrollArrows);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', updateScrollArrows);
    };
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 2.5;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  const setActiveTab = (tab: SalesViewTab) => {
    setSearchParams({ view: viewTabToSlug(tab) });
  };

  const handleRowClick = (request: SaleRequest) => {
    const confirmed = deliveryConfirmed[request.id];
    setSelectedRequest(
      confirmed
        ? { ...request, status: 'DELIVERED', logisticsDelivery: confirmed }
        : request
    );
    setIsModalOpen(true);
  };

  const handleAccept = (requestId: string) => {
    alert(`Request ${requestId} accepted (simulated)`);
  };

  const handleReject = (requestId: string, reason?: string, notes?: string) => {
    if (reason) setRejectionReasons((prev) => ({ ...prev, [requestId]: reason }));
    alert(`Request ${requestId} rejected${reason ? `: ${reason}` : ''}${notes ? ` | ${notes}` : ''} (simulated)`);
  };

  const handleSendSettlement = (requestId: string) => {
    setSettlementSentIds((prev) => new Set(prev).add(requestId));
  };

  const handleCancelPurchase = (requestId: string) => {
    alert(`Cancel purchase for request ${requestId} (simulated)`);
  };

  const handleSendAdvanceProof = (requestId: string) => {
    alert(`Advance proof sent for request ${requestId} (simulated)`);
  };

  const handleSendBalanceProof = (requestId: string) => {
    alert(`Balance proof sent for request ${requestId} (simulated)`);
  };

  const handleConfirmDelivery = (requestId: string, data: LogisticsDeliveryConfirm) => {
    setDeliveryConfirmed((prev) => ({ ...prev, [requestId]: data }));
    alert(`Cargo reception recorded for request ${requestId} (simulated)`);
  };

  const handleRejectLogisticsQuote = (requestId: string, reason?: string, notes?: string) => {
    if (reason) setRejectionReasons((prev) => ({ ...prev, [requestId]: reason }));
    alert(`Quote rejected for request ${requestId}${reason ? `: ${reason}` : ''}${notes ? ` | ${notes}` : ''} (simulated)`);
  };

  const handleAcceptLogisticsQuote = (requestId: string) => {
    alert(`Quote accepted for request ${requestId} (simulated)`);
  };

  const isAllView = activeTab === VIEW_ALL;

  const columns = [
    {
      header: 'Producer',
      accessor: (request: SaleRequest) => (
        <div>
          <div className={packerSales.colProducerName}>{request.producerName}</div>
        </div>
      ),
    },
    {
      header: 'Product',
      accessor: (request: SaleRequest) => (
        <span className={packerSales.colProduct}>{request.productForm}</span>
      ),
    },
    {
      header: 'Catch Info',
      accessor: (request: SaleRequest) => (
        <div className="text-sm">
          <div className={packerSales.colCatchQty}>
            {request.catchInfo.estimatedQuantityLb} lb
          </div>
          <div className={packerSales.colCatchSub}>
            Size: {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
          </div>
          <div className={packerSales.colCatchMeta}>
            Harvest: {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: enUS })}
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: (request: SaleRequest) => (
        <div className="text-sm">
          <div className={packerSales.colLocationMain}>{request.catchInfo.harvestLocation.city}</div>
          <div className={packerSales.colLocationSub}>{request.catchInfo.harvestLocation.address}</div>
        </div>
      ),
    },
    {
      header: 'Request Date',
      accessor: (request: SaleRequest) => (
        <span className={packerSales.colDate}>
          {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: enUS })}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (request: SaleRequest) => {
        const awaiting = settlementSentIds.has(request.id);
        const showRequestStatus =
          isAllView || activeTab === TAB_LOGISTICS_QUOTE || activeTab === TAB_LOGISTICS_TRACKING;
        const statusLabel = awaiting
          ? 'Awaiting confirmation'
          : showRequestStatus
            ? getRequestStatusLabel(request.status)
            : getTabLabel(activeTab);
        const statusClass = awaiting
          ? packerSales.colStatusAwaiting
          : showRequestStatus
            ? STATUS_CLASSES[request.status]
            : getStatusClass(activeTab);
        return (
          <span className={statusClass}>
            {statusLabel}
          </span>
        );
      },
    },
  ];

  const emptyMessage =
    activeTab === VIEW_ALL
      ? 'No purchase requests.'
      : activeTab === TAB_LOGISTICS_QUOTE
        ? 'No requests in logistics quote.'
        : activeTab === TAB_LOGISTICS_TRACKING
          ? 'No requests with logistics tracking. Accept a request to see the Purchases tab.'
          : `No ${getTabLabel(activeTab).toLowerCase()} requests available.`;

  return (
    <div className={packerSales.pageLayout}>
      <div className={page.headerWithSubtitle}>
        <h1 className={page.headerTitle}>Purchases</h1>
        <p className={page.headerSubtitle}>{getSectionTitle(activeTab)}</p>
      </div>

      {/* Tabs + título de sección fijos; solo la tabla hace scroll */}
      <div className={packerSales.stickyHeader}>
        <div className={packerSales.tabsOuter}>
          <div className={packerSales.tabsBar}>
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className={packerSales.tabArrow}
                aria-label="Ver opciones anteriores"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div
              ref={tabsScrollRef}
              className={packerSales.tabScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SALES_VIEW_TABS.map(({ tab, label }) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab === VIEW_ALL ? 'ALL' : tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`${packerSales.tabButton} ${isActive ? packerSales.tabButtonActive : packerSales.tabButtonInactive}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className={packerSales.tabArrow}
                aria-label="View more options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <h3 className={packerSales.sectionTitle}>
          {getSectionTitle(activeTab)}
        </h3>
      </div>

      <div className={packerSales.tableScrollWrap}>
        <div className={packerSales.tableOuter}>
          {filteredRequests.length === 0 ? (
            <div className={packerSales.tableEmpty}>
              <p className={packerSales.tableEmptyText}>{emptyMessage}</p>
            </div>
          ) : (
            <div className={packerSales.tableScroll}>
              <table className={packerSales.table}>
                <thead className={packerSales.thead}>
                  <tr>
                    {columns.map((column, idx) => (
                      <th key={idx} className={packerSales.th}>
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={packerSales.tbody}>
                  {filteredRequests.map((request) => {
                    const isAwaitingConfirmation = settlementSentIds.has(request.id);
                    return (
                      <tr
                        key={request.id}
                        onClick={() => !isAwaitingConfirmation && handleRowClick(request)}
                        className={isAwaitingConfirmation ? packerSales.trDisabled : packerSales.trClickable}
                      >
                        {columns.map((column, colIdx) => (
                          <td key={colIdx} className={packerSales.td}>
                            {typeof column.accessor === 'function'
                              ? column.accessor(request)
                              : String(request[column.accessor as keyof SaleRequest])}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <SaleRequestDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onAccept={handleAccept}
        onReject={handleReject}
        rejectionReasons={rejectionReasons}
        onSendSettlement={handleSendSettlement}
        onCancelPurchase={handleCancelPurchase}
        onSendAdvanceProof={handleSendAdvanceProof}
        onSendBalanceProof={handleSendBalanceProof}
        onConfirmDelivery={handleConfirmDelivery}
        onRejectLogisticsQuote={handleRejectLogisticsQuote}
        onAcceptLogisticsQuote={handleAcceptLogisticsQuote}
      />
    </div>
  );
};
