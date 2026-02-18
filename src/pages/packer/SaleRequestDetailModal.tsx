import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../components/Modal';
import { FormRow } from '../../components/FormRow';
import { StatusBadge } from '../../components/StatusBadge';
import { OfferPreviewContent } from '../../components/OfferPreviewContent';
import { SaleRequest, SaleRequestStatus, CatchSettlement, CatchSettlementLine, CATCH_SETTLEMENT_CLASSES } from '../../types';
import { dummyRequestMessages, RequestMessage } from '../../data/requestMessages';
import { dummyOffers } from '../../data/offers';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SaleRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: SaleRequest | null;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string, notes?: string) => void;
}

const MAX_MESSAGE_LENGTH = 500;

type SectionKey = 'general' | 'catch' | 'packerNotes' | 'settlement' | 'messages' | 'rejectForm';

const defaultExpanded: Record<SectionKey, boolean> = {
  general: false,
  catch: false,
  packerNotes: false,
  settlement: false,
  messages: false,
  rejectForm: false,
};

function createEmptySettlement(request?: SaleRequest | null): CatchSettlement {
  const remitidasReferencialLb = request?.catchInfo?.estimatedQuantityLb ?? 0;
  return {
    entryDate: new Date().toISOString().slice(0, 10),
    lotNumber: '',
    remissionGuide: '',
    pond: '',
    aguaje: '',
    colaDirectaALines: [],
    colaDirectaBLines: [],
    ventaLocalLines: [],
    remitidasReferencialLb,
    basuraColaDirectaLb: 0,
  };
}

function createEmptyLine(): CatchSettlementLine {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sizeOrDesc: '',
    pounds: 0,
    unitPrice: 0,
  };
}

/** Migra liquidación antigua (lineItems) al formato de tres tablas, si aplica */
function normalizeSettlement(s: CatchSettlement & { lineItems?: Array<{ id: string; class: string; sizeOrDesc: string; pounds: number; unitPrice: number }> }): CatchSettlement {
  if (!s.lineItems || s.lineItems.length === 0) {
    const out = { ...s } as CatchSettlement;
    if (!('colaDirectaALines' in out)) (out as CatchSettlement).colaDirectaALines = [];
    if (!('colaDirectaBLines' in out)) (out as CatchSettlement).colaDirectaBLines = [];
    if (!('ventaLocalLines' in out)) (out as CatchSettlement).ventaLocalLines = [];
    return out;
  }
  const colaDirectaALines: CatchSettlementLine[] = [];
  const colaDirectaBLines: CatchSettlementLine[] = [];
  const ventaLocalLines: CatchSettlementLine[] = [];
  for (const it of s.lineItems) {
    const line: CatchSettlementLine = { id: it.id, sizeOrDesc: it.sizeOrDesc, pounds: it.pounds, unitPrice: it.unitPrice };
    if (it.class.includes('A COLA') || it.class === 'A COLA DIRECTA') colaDirectaALines.push(line);
    else if (it.class.includes('B COLA') || it.class === 'B COLA DIRECTA') colaDirectaBLines.push(line);
    else ventaLocalLines.push(line);
  }
  const { lineItems: _, ...rest } = s;
  return {
    ...rest,
    colaDirectaALines,
    colaDirectaBLines,
    ventaLocalLines,
  } as CatchSettlement;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export const SaleRequestDetailModal: React.FC<SaleRequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject,
}) => {
  const { user } = useAuth();
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>(defaultExpanded);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [settlement, setSettlement] = useState<CatchSettlement>(() => createEmptySettlement());
  const [isSettlementLocked, setIsSettlementLocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const linkedOffer = request ? dummyOffers.find((o) => o.id === request.offerId) : null;

  const toggleSection = (key: SectionKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Cargar mensajes relacionados con la solicitud
  useEffect(() => {
    if (request) {
      const requestMessages = dummyRequestMessages
        .filter((msg) => msg.requestId === request.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setMessages(requestMessages);
    }
  }, [request]);

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar liquidación desde la solicitud al abrir
  useEffect(() => {
    if (request?.catchSettlement) {
      setSettlement(normalizeSettlement(request.catchSettlement as Parameters<typeof normalizeSettlement>[0]));
      setIsSettlementLocked(true);
    } else if (request && request.status === 'CATCH_SETTLEMENT_PENDING') {
      setSettlement(createEmptySettlement(request));
      setIsSettlementLocked(false);
    }
  }, [request?.id, request?.status, request?.catchSettlement, isOpen]);

  // Resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setRejectNotes('');
      setShowRejectForm(false);
      setMessageText('');
      setExpanded(defaultExpanded);
      setShowOfferModal(false);
      setIsSettlementLocked(false);
    }
  }, [isOpen]);

  if (!request) return null;

  const handleAccept = () => {
    onAccept(request.id);
    onClose();
  };

  const handleReject = () => {
    if (showRejectForm) {
      onReject(request.id, rejectNotes || undefined);
      setRejectNotes('');
      setShowRejectForm(false);
      onClose();
    } else {
      setShowRejectForm(true);
    }
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectNotes('');
  };

  const handleSendMessage = () => {
    if (!request || !messageText.trim() || messageText.length > MAX_MESSAGE_LENGTH) return;

    const newMessage: RequestMessage = {
      id: `req-msg-${Date.now()}`,
      requestId: request.id,
      senderId: user?.id || 'packer-rosasud',
      senderName: user?.name || 'ROSASUD S.A.S.',
      senderRole: 'PACKER',
      text: messageText.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    // En producción, aquí harías la llamada a la API
    alert('Mensaje enviado (simulado)');
  };

  const getProductFormLabel = (form: string): string => {
    const labels: Record<string, string> = {
      ENTERO: 'Entero',
      COLA_DIRECTA: 'Cola Directa',
      CAMARON_VIVO: 'Camarón Vivo',
      SOBRANTE: 'Sobrante',
      COLA_SOBRANTE: 'Cola Sobrante',
    };
    return labels[form] || form;
  };

  const getStatusLabel = (status: SaleRequestStatus): string => {
    const labels: Record<SaleRequestStatus, string> = {
      PENDING_ACCEPTANCE: 'Pendientes de Aceptar',
      CATCH_SETTLEMENT_PENDING: 'Liquidación de Pesca pendiente',
      ADVANCE_PENDING: 'Anticipo Pendiente',
      BALANCE_PENDING: 'Saldo Restante Pendiente',
      SALE_COMPLETED: 'Venta Finalizada',
      REJECTED: 'Rechazada',
    };
    return labels[status];
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de Solicitud de Compra" size="xl">
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {/* Información General */}
        <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('general')}
            className="w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Información General</h3>
            <span className="text-gray-700"><ChevronIcon expanded={expanded.general} /></span>
          </button>
          {expanded.general && (
          <div className="px-6 pb-6">
          <div className="bg-white border border-sky-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="ID Solicitud">
                <p className="py-2 text-sm text-gray-900 font-medium">#{request.id.split('-')[1]}</p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Estado">
                <div className="py-2">
                  <StatusBadge status={request.status} label={getStatusLabel(request.status)} />
                </div>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Productor">
                <p className="py-2 text-sm text-gray-900">{request.producerName}</p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Producto">
                <p className="py-2 text-sm text-gray-900">{getProductFormLabel(request.productForm)}</p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha de Solicitud">
                <p className="py-2 text-sm text-gray-900">
                  {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                </p>
              </FormRow>
              {request.respondedAt && (
                <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha de Respuesta">
                  <p className="py-2 text-sm text-gray-900">
                    {format(new Date(request.respondedAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                  </p>
                </FormRow>
              )}
              <div className="md:col-span-2 mt-2">
                <FormRow labelClassName="text-sm font-medium text-gray-700" label="Oferta vinculada">
                  <div className="flex items-center gap-2 py-2">
                    {linkedOffer ? (
                      <>
                        <span className="text-sm text-gray-900 font-medium">{linkedOffer.offerCode}</span>
                        <button
                          type="button"
                          onClick={() => setShowOfferModal(true)}
                          className="text-sm px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors"
                        >
                          Ver oferta
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Oferta no encontrada</span>
                    )}
                  </div>
                </FormRow>
              </div>
            </div>
          </div>
          </div>
          )}
        </section>

        {/* Información de Pesca */}
        <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('catch')}
            className="w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Información de Pesca</h3>
            <span className="text-gray-700"><ChevronIcon expanded={expanded.catch} /></span>
          </button>
          {expanded.catch && (
          <div className="px-6 pb-6">
          <div className="bg-white border border-sky-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Cantidad Estimada">
                <p className="py-2 text-sm text-gray-900 font-medium">{request.catchInfo.estimatedQuantityLb} lb</p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Rango de Tallas">
                <p className="py-2 text-sm text-gray-900">
                  {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
                </p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha Estimada de Cosecha">
                <p className="py-2 text-sm text-gray-900">
                  {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: es })}
                </p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Ciudad">
                <p className="py-2 text-sm text-gray-900">{request.catchInfo.harvestLocation.city}</p>
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Dirección de Cosecha" className="md:col-span-2">
                <p className="py-2 text-sm text-gray-900">{request.catchInfo.harvestLocation.address}</p>
              </FormRow>
              {request.catchInfo.notes && (
                <FormRow labelClassName="text-sm font-medium text-gray-700" label="Notas del Productor" className="md:col-span-2">
                  <p className="py-2 text-sm text-gray-900 bg-gray-50 rounded p-3 border border-gray-200">
                    {request.catchInfo.notes}
                  </p>
                </FormRow>
              )}
              {request.catchInfo.attachments && request.catchInfo.attachments.length > 0 && (
                <FormRow labelClassName="text-sm font-medium text-gray-700" label="Archivos Adjuntos" className="md:col-span-2">
                  <div className="py-2 space-y-2">
                    {request.catchInfo.attachments.map((attachment, idx) => (
                      <a
                        key={idx}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Descargar ${attachment} (simulado)`);
                        }}
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {attachment}
                      </a>
                    ))}
                  </div>
                </FormRow>
              )}
            </div>
          </div>
          </div>
          )}
        </section>

        {/* Notas del Packer (si existen) */}
        {request.packerNotes && (
          <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('packerNotes')}
              className="w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Notas del Packer</h3>
              <span className="text-gray-700"><ChevronIcon expanded={expanded.packerNotes} /></span>
            </button>
            {expanded.packerNotes && (
              <div className="px-6 pb-6">
                <div className="bg-white border border-sky-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{request.packerNotes}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Liquidación de pesca (solo cuando el estado es Liquidación de Pesca pendiente) */}
        {request.status === 'CATCH_SETTLEMENT_PENDING' && (
          <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('settlement')}
              className="w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Liquidación de pesca</h3>
              <span className="text-gray-700"><ChevronIcon expanded={expanded.settlement} /></span>
            </button>
            {expanded.settlement && (
              <div className="px-6 pb-6">
                <div className="bg-white border border-sky-200 rounded-lg p-4 space-y-6">
                  {/* Botón Guardar / Editar liquidación */}
                  <div className="flex justify-end">
                    {isSettlementLocked ? (
                      <button
                        type="button"
                        onClick={() => setIsSettlementLocked(false)}
                        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium text-sm transition-colors"
                      >
                        Editar liquidación
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsSettlementLocked(true)}
                        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium text-sm transition-colors"
                      >
                        Guardar
                      </button>
                    )}
                  </div>

                  {/* Datos generales del ingreso */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del ingreso</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha ing.">
                        <input
                          type="date"
                          value={settlement.entryDate}
                          onChange={(e) => setSettlement((s) => ({ ...s, entryDate: e.target.value }))}
                          readOnly={isSettlementLocked}
                          className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </FormRow>
                      <FormRow labelClassName="text-sm font-medium text-gray-700" label="No. Lote">
                        <input
                          type="text"
                          value={settlement.lotNumber}
                          onChange={(e) => setSettlement((s) => ({ ...s, lotNumber: e.target.value }))}
                          placeholder="Ej. FC218233"
                          readOnly={isSettlementLocked}
                          className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </FormRow>
                      <FormRow labelClassName="text-sm font-medium text-gray-700" label="Guía rem.">
                        <input
                          type="text"
                          value={settlement.remissionGuide}
                          onChange={(e) => setSettlement((s) => ({ ...s, remissionGuide: e.target.value }))}
                          placeholder="Ej. 484-483"
                          readOnly={isSettlementLocked}
                          className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </FormRow>
                      <FormRow labelClassName="text-sm font-medium text-gray-700" label="Piscina">
                        <input
                          type="text"
                          value={settlement.pond}
                          onChange={(e) => setSettlement((s) => ({ ...s, pond: e.target.value }))}
                          placeholder="Ej. 2"
                          readOnly={isSettlementLocked}
                          className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </FormRow>
                      <FormRow labelClassName="text-sm font-medium text-gray-700" label="Aguaje">
                        <input
                          type="text"
                          value={settlement.aguaje}
                          onChange={(e) => setSettlement((s) => ({ ...s, aguaje: e.target.value }))}
                          placeholder="Ej. 2024-14"
                          readOnly={isSettlementLocked}
                          className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </FormRow>
                    </div>
                  </div>

                  {/* Detalle por clase y talla: tres tablas fijas */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-gray-700">Detalle por clase y talla</h4>
                    {[
                      { key: 'colaDirectaALines' as const, title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_A },
                      { key: 'colaDirectaBLines' as const, title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_B },
                      { key: 'ventaLocalLines' as const, title: CATCH_SETTLEMENT_CLASSES.VENTA_LOCAL },
                    ].map(({ key, title }) => {
                      const lines = settlement[key];
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">{title}</span>
                            {!isSettlementLocked && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSettlement((s) => ({ ...s, [key]: [...s[key], createEmptyLine()] }))
                                }
                                className="text-xs px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700"
                              >
                                + Agregar línea
                              </button>
                            )}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                              <thead>
                                <tr className="bg-gray-100 text-left">
                                  <th className="px-2 py-2 font-medium text-gray-700">Talla / Descripción</th>
                                  <th className="px-2 py-2 font-medium text-gray-700">Libras</th>
                                  <th className="px-2 py-2 font-medium text-gray-700">P. unit.</th>
                                  <th className="px-2 py-2 font-medium text-gray-700">Valor total</th>
                                  {!isSettlementLocked && <th className="w-10" />}
                                </tr>
                              </thead>
                              <tbody>
                                {lines.length === 0 ? (
                                  <tr>
                                    <td colSpan={isSettlementLocked ? 4 : 5} className="px-2 py-3 text-center text-gray-500">
                                      Sin líneas
                                    </td>
                                  </tr>
                                ) : (
                                  lines.map((line) => (
                                    <tr key={line.id} className="border-t border-gray-100">
                                      <td className="px-2 py-1.5">
                                        {isSettlementLocked ? (
                                          <span className="text-gray-900">{line.sizeOrDesc || '—'}</span>
                                        ) : (
                                          <input
                                            type="text"
                                            value={line.sizeOrDesc}
                                            onChange={(e) => {
                                              setSettlement((s) => ({
                                                ...s,
                                                [key]: s[key].map((l) =>
                                                  l.id === line.id ? { ...l, sizeOrDesc: e.target.value } : l
                                                ),
                                              }));
                                            }}
                                            placeholder="31-35, Quebrado..."
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                          />
                                        )}
                                      </td>
                                      <td className="px-2 py-1.5">
                                        {isSettlementLocked ? (
                                          <span className="text-gray-900">{line.pounds}</span>
                                        ) : (
                                          <input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={line.pounds || ''}
                                            onChange={(e) => {
                                              const v = parseFloat(e.target.value);
                                              setSettlement((s) => ({
                                                ...s,
                                                [key]: s[key].map((l) =>
                                                  l.id === line.id ? { ...l, pounds: Number.isNaN(v) ? 0 : v } : l
                                                ),
                                              }));
                                            }}
                                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                          />
                                        )}
                                      </td>
                                      <td className="px-2 py-1.5">
                                        {isSettlementLocked ? (
                                          <span className="text-gray-900">{line.unitPrice}</span>
                                        ) : (
                                          <input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={line.unitPrice || ''}
                                            onChange={(e) => {
                                              const v = parseFloat(e.target.value);
                                              setSettlement((s) => ({
                                                ...s,
                                                [key]: s[key].map((l) =>
                                                  l.id === line.id ? { ...l, unitPrice: Number.isNaN(v) ? 0 : v } : l
                                                ),
                                              }));
                                            }}
                                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                          />
                                        )}
                                      </td>
                                      <td className="px-2 py-1.5 font-medium text-gray-800">
                                        {(line.pounds * line.unitPrice).toFixed(2)}
                                      </td>
                                      {!isSettlementLocked && (
                                        <td className="px-2 py-1.5">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setSettlement((s) => ({
                                                ...s,
                                                [key]: s[key].filter((l) => l.id !== line.id),
                                              }))
                                            }
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            aria-label="Quitar línea"
                                          >
                                            ×
                                          </button>
                                        </td>
                                      )}
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resumen */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-sky-200">
                    <FormRow labelClassName="text-sm font-medium text-gray-700" label="Remitidas referencial (lb)">
                      <input
                        type="text"
                        readOnly
                        value={request.catchInfo.estimatedQuantityLb}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-100 text-gray-700"
                      />
                    </FormRow>
                    <FormRow labelClassName="text-sm font-medium text-gray-700" label="Basura cola directa (lb)">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={settlement.basuraColaDirectaLb || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setSettlement((s) => ({ ...s, basuraColaDirectaLb: Number.isNaN(v) ? 0 : v }));
                        }}
                        readOnly={isSettlementLocked}
                        className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                    </FormRow>
                    {(() => {
                      const remitidasLb = request.catchInfo.estimatedQuantityLb;
                      const recibidasReferencial = Math.max(0, remitidasLb - settlement.basuraColaDirectaLb);
                      const allLines = [...settlement.colaDirectaALines, ...settlement.colaDirectaBLines, ...settlement.ventaLocalLines];
                      const procesadasReales = allLines.reduce((sum, l) => sum + l.pounds, 0);
                      const totalValor = allLines.reduce((sum, l) => sum + l.pounds * l.unitPrice, 0);
                      const rendimientoPct = recibidasReferencial > 0 ? (procesadasReales / recibidasReferencial) * 100 : 0;
                      const mermaPct = 100 - rendimientoPct;
                      return (
                        <>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium text-gray-700">Recibidas referencial (lb): </span>
                            <span className="font-medium">{recibidasReferencial.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium text-gray-700">Procesadas reales (lb): </span>
                            <span className="font-medium">{procesadasReales.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium text-gray-700">Total valor: </span>
                            <span className="font-medium">$ {totalValor.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium text-gray-700">Rendimiento: </span>
                            <span className="font-medium">{rendimientoPct.toFixed(2)}%</span>
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium text-gray-700">Merma: </span>
                            <span className="font-medium">{mermaPct.toFixed(2)}%</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Sección de Chat */}
        {(() => {
          const isMessagesActive = request.status === 'PENDING_ACCEPTANCE' || request.status === 'CATCH_SETTLEMENT_PENDING';
          return (
            <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('messages')}
                className={`w-full flex items-center justify-between p-4 text-left text-gray-900 transition-colors ${
                  isMessagesActive
                    ? 'hover:bg-sky-100/50'
                    : 'hover:bg-sky-100/50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mensajes sobre esta Solicitud
                  </h3>
                  {!isMessagesActive && (
                    <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
                      Solo lectura
                    </span>
                  )}
                </div>
                <span className="text-gray-700">
                  <ChevronIcon expanded={expanded.messages} />
                </span>
              </button>
              {expanded.messages && (
                <div className="px-6 pb-6">
                  <div
                    className="rounded-lg overflow-hidden border bg-white border-sky-200"
                  >
                    {/* Área de mensajes (historial siempre visible) */}
                    <div
                      className={`h-64 overflow-y-auto p-4 space-y-3 ${
                        isMessagesActive ? 'bg-gray-50/50' : 'bg-gray-100/50'
                      }`}
                    >
                      {messages.length === 0 ? (
                        <div
                          className={`text-center py-8 text-sm ${
                            isMessagesActive ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          {isMessagesActive
                            ? 'No hay mensajes aún. Inicia la conversación enviando un mensaje.'
                            : 'No hay mensajes en el historial de esta solicitud.'}
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isPacker = msg.senderRole === 'PACKER';
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isPacker ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[75%] rounded-lg p-3 ${
                                  isMessagesActive
                                    ? isPacker
                                      ? 'bg-sky-500 text-white'
                                      : 'bg-white border border-gray-200 text-gray-900'
                                    : isPacker
                                      ? 'bg-gray-400 text-gray-100'
                                      : 'bg-gray-200 text-gray-700 border border-gray-300'
                                }`}
                              >
                                <div className="text-xs font-semibold mb-1 opacity-80">
                                  {msg.senderName}
                                </div>
                                <div className="text-sm">{msg.text}</div>
                                <div className="text-xs mt-1 opacity-70">
                                  {format(new Date(msg.createdAt), 'dd MMM yyyy, HH:mm', {
                                    locale: es,
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Campo de entrada (solo si la solicitud está pendiente) */}
                    {isMessagesActive && (
                      <div className="p-4 border-t border-sky-200 bg-white">
                        <div className="flex gap-2">
                          <textarea
                            value={messageText}
                            onChange={(e) => {
                              if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                                setMessageText(e.target.value);
                              }
                            }}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={
                              !messageText.trim() || messageText.length > MAX_MESSAGE_LENGTH
                            }
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                          >
                            Enviar
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 text-right">
                          {messageText.length}/{MAX_MESSAGE_LENGTH} caracteres
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          );
        })()}

        {/* Formulario de Rechazo */}
        {showRejectForm && (
          <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => toggleSection('rejectForm')}
              className="w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Motivo del Rechazo (Opcional)</h3>
              <span className="text-gray-700"><ChevronIcon expanded={expanded.rejectForm} /></span>
            </button>
            {expanded.rejectForm && (
              <div className="px-4 pb-4">
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Ingrese el motivo del rechazo..."
              className="w-full px-3 py-2 border border-red-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
            />
              </div>
            )}
          </section>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {request.status === 'PENDING_ACCEPTANCE' && !showRejectForm && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                Rechazar solicitud de compra
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
              >
                Aceptar solicitud de compra
              </button>
            </>
          )}
          {request.status === 'PENDING_ACCEPTANCE' && showRejectForm && (
            <>
              <button
                type="button"
                onClick={handleCancelReject}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                Confirmar rechazo de solicitud de compra
              </button>
            </>
          )}
          {request.status !== 'PENDING_ACCEPTANCE' && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </Modal>
    {linkedOffer && (
      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-2">
            <h3 className="text-lg font-medium text-gray-900">Oferta aceptada</h3>
            <button
              type="button"
              onClick={() => setShowOfferModal(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Cerrar"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>
          <OfferPreviewContent offer={linkedOffer} />
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowOfferModal(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    )}
  </>
  );
};
