import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dummySaleRequests } from '../../data/saleRequests';
import { SaleRequest } from '../../types';
import { SaleRequestDetailModal } from './SaleRequestDetailModal';
import { slugToStatus, DEFAULT_SALES_VIEW, statusToPath, type SalesViewFilter } from './salesRoutes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PackerSales: React.FC = () => {
  useAuth();
  const { statusFilter } = useParams<{ statusFilter?: string }>();
  const resolvedFilter = slugToStatus(statusFilter);
  const activeFilter: SalesViewFilter = resolvedFilter ?? DEFAULT_SALES_VIEW;

  const packerId = 'packer-rosasud';
  const allRequests = dummySaleRequests.filter((r) => r.packingCompanyId === packerId);

  const [selectedRequest, setSelectedRequest] = useState<SaleRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  /** IDs de solicitudes cuya liquidación ya fue enviada (en espera de confirmación del productor) */
  const [settlementSentIds, setSettlementSentIds] = useState<Set<string>>(new Set());

  const getStatusLabel = (status: SalesViewFilter): string => {
    const labels: Record<SalesViewFilter, string> = {
      PENDING_ACCEPTANCE: 'Pendientes de Aceptar',
      CATCH_SETTLEMENT_PENDING: 'Liquidación de Pesca pendiente',
      ADVANCE_PENDING: 'Anticipo Pendiente',
      BALANCE_PENDING: 'Saldo Restante Pendiente',
      SALE_COMPLETED: 'Venta Finalizada',
      REJECTED: 'Rechazada',
    };
    return labels[status];
  };

  const getSectionTitle = (status: SalesViewFilter): string => {
    const titles: Record<SalesViewFilter, string> = {
      PENDING_ACCEPTANCE: 'Solicitudes Pendientes de Aceptar',
      CATCH_SETTLEMENT_PENDING: 'Solicitudes con Liquidación de Pesca pendiente',
      ADVANCE_PENDING: 'Solicitudes con Anticipo Pendiente',
      BALANCE_PENDING: 'Solicitudes con Saldo Restante Pendiente',
      SALE_COMPLETED: 'Solicitudes con Venta Finalizada',
      REJECTED: 'Solicitudes Rechazadas',
    };
    return titles[status];
  };

  const filteredRequests = allRequests.filter((r) => r.status === activeFilter);

  if (resolvedFilter === null) {
    return <Navigate to={statusToPath(DEFAULT_SALES_VIEW)} replace />;
  }

  const handleRowClick = (request: SaleRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleAccept = (requestId: string) => {
    alert(`Solicitud ${requestId} aceptada (simulado)`);
    // En producción, aquí actualizarías el estado de la solicitud
  };

  const handleReject = (requestId: string, notes?: string) => {
    alert(`Solicitud ${requestId} rechazada${notes ? `: ${notes}` : ''} (simulado)`);
    // En producción, aquí actualizarías el estado de la solicitud
  };

  const handleSendSettlement = (requestId: string) => {
    setSettlementSentIds((prev) => new Set(prev).add(requestId));
  };

  const handleCancelPurchase = (requestId: string) => {
    alert(`Cancelar compra para solicitud ${requestId} (simulado)`);
    // En producción, aquí actualizarías el estado de la solicitud
  };

  const handleSendAdvanceProof = (requestId: string) => {
    alert(`Prueba de anticipo enviada para solicitud ${requestId} (simulado)`);
    // En producción, aquí subirías el archivo y actualizarías el estado
  };

  const columns = [
    {
      header: 'ID Solicitud',
      accessor: (request: SaleRequest) => (
        <span className="text-sky-700 font-semibold">#{request.id.split('-')[1]}</span>
      ),
    },
    {
      header: 'Productor',
      accessor: (request: SaleRequest) => (
        <div>
          <div className="font-medium text-slate-800">{request.producerName}</div>
        </div>
      ),
    },
    {
      header: 'Producto',
      accessor: (request: SaleRequest) => (
        <span className="text-sm text-slate-700 font-medium">{request.productForm}</span>
      ),
    },
    {
      header: 'Información de Pesca',
      accessor: (request: SaleRequest) => (
        <div className="text-sm">
          <div className="text-slate-800 font-semibold">
            {request.catchInfo.estimatedQuantityLb} lb
          </div>
          <div className="text-slate-600">
            Talla: {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
          </div>
          <div className="text-slate-500 text-xs mt-1">
            Cosecha: {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: es })}
          </div>
        </div>
      ),
    },
    {
      header: 'Ubicación',
      accessor: (request: SaleRequest) => (
        <div className="text-sm">
          <div className="text-slate-800 font-medium">{request.catchInfo.harvestLocation.city}</div>
          <div className="text-slate-600 text-xs">{request.catchInfo.harvestLocation.address}</div>
        </div>
      ),
    },
    {
      header: 'Fecha Solicitud',
      accessor: (request: SaleRequest) => (
        <span className="text-slate-700">
          {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: es })}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (request: SaleRequest) => {
        const awaiting = settlementSentIds.has(request.id);
        return (
          <span className={awaiting ? 'text-amber-700 font-medium' : 'text-slate-700'}>
            {awaiting ? 'En espera de confirmación' : getStatusLabel(activeFilter)}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header con título de la sección actual */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
        <p className="text-sm text-gray-600 mt-1">{getSectionTitle(activeFilter)}</p>
      </div>

      {/* Tabla de solicitudes */}
      <div className="pt-2">
        <section className="p-6 rounded-xl bg-transparent">
          <h3 className="text-lg font-semibold text-sky-900 mb-4 pb-3 border-b border-gray-400">
            {getSectionTitle(activeFilter)}
          </h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-600 bg-gray-50">
                <p className="text-sm">
                  No hay solicitudes {getStatusLabel(activeFilter).toLowerCase()} disponibles.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sky-300">
                  <thead className="bg-sky-100">
                    <tr>
                      {columns.map((column, idx) => (
                        <th
                          key={idx}
                          className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide"
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-300">
                    {filteredRequests.map((request) => {
                      const isAwaitingConfirmation = settlementSentIds.has(request.id);
                      return (
                      <tr
                        key={request.id}
                        onClick={() => !isAwaitingConfirmation && handleRowClick(request)}
                        className={
                          isAwaitingConfirmation
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'hover:bg-sky-50 cursor-pointer transition-colors'
                        }
                      >
                        {columns.map((column, colIdx) => (
                          <td
                            key={colIdx}
                            className="px-6 py-4 whitespace-nowrap text-sm text-slate-800"
                          >
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
        </section>
      </div>

      {/* Modal de detalles */}
      <SaleRequestDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onAccept={handleAccept}
        onReject={handleReject}
        onSendSettlement={handleSendSettlement}
        onCancelPurchase={handleCancelPurchase}
        onSendAdvanceProof={handleSendAdvanceProof}
      />
    </div>
  );
};
