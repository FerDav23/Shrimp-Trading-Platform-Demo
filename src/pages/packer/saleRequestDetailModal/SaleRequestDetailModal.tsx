import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../components/Modal';
import { dummyRequestMessages, RequestMessage } from '../../../data/requestMessages';
import { dummyOffers } from '../../../data/offers';
import { useAuth } from '../../../contexts/AuthContext';
import type { SaleRequestDetailModalProps } from './types';
import type { SectionKey } from './types';
import { SECTION_LABELS, REJECTION_REASONS, ADVANCE_DEADLINE_HOURS, BALANCE_DEADLINE_HOURS, LB_TO_KG } from './constants';
import { createEmptySettlement, normalizeSettlement } from './utils';
import { GeneralInfoSection } from './GeneralInfoSection';
import { CatchInfoSection } from './CatchInfoSection';
import { PackerNotesSection } from './PackerNotesSection';
import { SettlementReadOnlySection } from './SettlementReadOnlySection';
import { AdvanceTransferSection } from './AdvanceTransferSection';
import { AdvanceReadOnlySection } from './AdvanceReadOnlySection';
import { BalanceTransferSection } from './BalanceTransferSection';
import { BalanceReadOnlySection } from './BalanceReadOnlySection';
import { SettlementFormSection } from './SettlementFormSection';
import { MessagesSection } from './MessagesSection';
import { RejectFormSection } from './RejectFormSection';
import { LogisticsTrackingSection } from './LogisticsTrackingSection';
import { DetailActions } from './DetailActions';
import { LinkedOfferModal } from './LinkedOfferModal';
import type { CatchSettlement } from '../../../types';
import { isLogisticsTrackingStatus } from '../../../types';
import { saleRequestDetail } from '../../../styles';

export const SaleRequestDetailModal: React.FC<SaleRequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject,
  rejectionReasons,
  onSendSettlement,
  onCancelPurchase,
  onSendAdvanceProof,
  onSendBalanceProof,
  onConfirmDelivery,
}) => {
  const { user } = useAuth();
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedRejectionReason, setSelectedRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [activeTab, setActiveTab] = useState<SectionKey>('general');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [settlement, setSettlement] = useState<CatchSettlement>(() => createEmptySettlement());
  const [isSettlementLocked, setIsSettlementLocked] = useState(false);
  const [advanceProofFile, setAdvanceProofFile] = useState<File | null>(null);
  const [advanceProofPreviewUrl, setAdvanceProofPreviewUrl] = useState<string | null>(null);
  const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);
  const [advancePaymentEndsAt, setAdvancePaymentEndsAt] = useState<number | null>(null);
  const [advanceTimerTick, setAdvanceTimerTick] = useState(0);
  const [balancePaymentEndsAt, setBalancePaymentEndsAt] = useState<number | null>(null);
  const [balanceTimerTick, setBalanceTimerTick] = useState(0);
  const [balanceProofFile, setBalanceProofFile] = useState<File | null>(null);
  const [balanceProofPreviewUrl, setBalanceProofPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const advanceProofInputRef = useRef<HTMLInputElement>(null);
  const balanceProofInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [catchWeight, setCatchWeight] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const linkedOffer = request ? dummyOffers.find((o) => o.id === request.offerId) ?? null : null;
  /** Peso de la pesca recibida en lb (igual al de LogisticsTrackingSection), para Recibidas referencial en liquidación */
  const receivedCatchWeightLb =
    request?.logisticsDelivery != null
      ? linkedOffer?.priceUnit === 'PER_KG'
        ? request.logisticsDelivery.catchWeight / LB_TO_KG
        : request.logisticsDelivery.catchWeight
      : null;

  const updateTabsScrollArrows = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateTabsScrollArrows();
    const ro = new ResizeObserver(updateTabsScrollArrows);
    ro.observe(el);
    el.addEventListener('scroll', updateTabsScrollArrows);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', updateTabsScrollArrows);
    };
  }, [isOpen, activeTab]);

  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };


  useEffect(() => {
    if (request) {
      const requestMessages = dummyRequestMessages
        .filter((msg) => msg.requestId === request.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setMessages(requestMessages);
    }
  }, [request]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setSelectedBankIndex(0);
  }, [request?.id]);

  useEffect(() => {
    if (request?.id) setActiveTab('general');
  }, [request?.id]);

  useEffect(() => {
    if (isOpen && request?.status === 'ADVANCE_PENDING') {
      setAdvancePaymentEndsAt(Date.now() + ADVANCE_DEADLINE_HOURS * 60 * 60 * 1000);
    } else {
      setAdvancePaymentEndsAt(null);
    }
  }, [isOpen, request?.id, request?.status]);

  useEffect(() => {
    if (advancePaymentEndsAt == null) return;
    const interval = setInterval(() => setAdvanceTimerTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [advancePaymentEndsAt]);

  useEffect(() => {
    if (isOpen && request?.status === 'BALANCE_PENDING') {
      setBalancePaymentEndsAt(Date.now() + BALANCE_DEADLINE_HOURS * 60 * 60 * 1000);
    } else {
      setBalancePaymentEndsAt(null);
    }
  }, [isOpen, request?.id, request?.status]);

  useEffect(() => {
    if (balancePaymentEndsAt == null) return;
    const interval = setInterval(() => setBalanceTimerTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [balancePaymentEndsAt]);

  useEffect(() => {
    if (request?.catchSettlement) {
      setSettlement(
        normalizeSettlement(request.catchSettlement as Parameters<typeof normalizeSettlement>[0])
      );
      setIsSettlementLocked(true);
    } else if (request && request.status === 'CATCH_SETTLEMENT_PENDING') {
      setSettlement(createEmptySettlement(request));
      setIsSettlementLocked(false);
    }
  }, [request?.id, request?.status, request?.catchSettlement, isOpen]);

  useEffect(() => {
    if (!advanceProofFile) {
      setAdvanceProofPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    if (!advanceProofFile.type.startsWith('image/')) {
      setAdvanceProofPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(advanceProofFile);
    setAdvanceProofPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [advanceProofFile]);

  useEffect(() => {
    if (!balanceProofFile) {
      setBalanceProofPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    if (!balanceProofFile.type.startsWith('image/')) {
      setBalanceProofPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(balanceProofFile);
    setBalanceProofPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [balanceProofFile]);

  useEffect(() => {
    if (!documentFile) {
      setDocumentPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    if (!documentFile.type.startsWith('image/')) {
      setDocumentPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(documentFile);
    setDocumentPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [documentFile]);

  useEffect(() => {
    if (!isOpen) {
      setRejectNotes('');
      setSelectedRejectionReason('');
      setShowRejectForm(false);
      setMessageText('');
      setActiveTab('general');
      setShowOfferModal(false);
      setIsSettlementLocked(false);
      setAdvanceProofFile(null);
      setAdvanceProofPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setSelectedBankIndex(0);
      setAdvancePaymentEndsAt(null);
      setBalancePaymentEndsAt(null);
      setBalanceProofFile(null);
      setBalanceProofPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setCatchWeight('');
      setDocumentFile(null);
      setDocumentPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setTermsAccepted(false);
    }
  }, [isOpen]);

  if (!request) return null;

  const handleAccept = () => {
    onAccept(request.id);
    onClose();
  };

  const handleReject = () => {
    if (showRejectForm) {
      const reasonLabel =
        REJECTION_REASONS.find((r) => r.value === selectedRejectionReason)?.label ??
        selectedRejectionReason;
      onReject(request.id, reasonLabel || undefined, rejectNotes || undefined);
      setRejectNotes('');
      setSelectedRejectionReason('');
      setShowRejectForm(false);
      onClose();
    } else {
      setShowRejectForm(true);
    }
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectNotes('');
    setSelectedRejectionReason('');
  };

  const canConfirmReject = selectedRejectionReason !== '';

  const rejectionReasonDisplay =
    rejectionReasons?.[request.id] ?? request.rejectionReason ?? request.packerNotes;

  const handleSendSettlement = () => {
    if (!request || !onSendSettlement) return;
    if (
      window.confirm(
        'Una vez que se envía la liquidación debe esperar la respuesta del productor antes de poder proseguir con la compra de la pesca. ¿Desea enviar la liquidación?'
      )
    ) {
      onSendSettlement(request.id);
      onClose();
    }
  };

  const handleCancelPurchase = () => {
    if (!request || !onCancelPurchase) return;
    onCancelPurchase(request.id);
    onClose();
  };

  const handleSendAdvanceProof = () => {
    if (!request || !onSendAdvanceProof) return;
    onSendAdvanceProof(request.id);
    onClose();
  };

  const handleSendBalanceProof = () => {
    if (!request || !onSendBalanceProof) return;
    onSendBalanceProof(request.id);
    onClose();
  };

  const handleConfirmDelivery = () => {
    if (!request || !onConfirmDelivery || !catchWeight || !documentFile || !termsAccepted) return;
    const weight = Number(catchWeight);
    if (weight <= 0) return;
    onConfirmDelivery(request.id, {
      catchWeight: weight,
      documentPhotoUrl: URL.createObjectURL(documentFile),
      termsAcceptedAt: new Date().toISOString(),
    });
    setCatchWeight('');
    setDocumentFile(null);
    setTermsAccepted(false);
    onClose();
  };

  const handleSendMessage = () => {
    if (!request || !messageText.trim() || messageText.length > 500) return;
    const newMessage: RequestMessage = {
      id: `req-msg-${Date.now()}`,
      requestId: request.id,
      senderId: user?.id || 'packer-rosasud',
      senderName: user?.name || 'ROSASUD S.A.S.',
      senderRole: 'PACKER',
      text: messageText.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
    alert('Mensaje enviado (simulado)');
  };

  const isMessagesActive =
    request.status === 'PENDING_ACCEPTANCE' ||
    request.status === 'CATCH_SETTLEMENT_PENDING' ||
    request.status === 'ADVANCE_PENDING' ||
    request.status === 'BALANCE_PENDING';

  const settlementReadOnlySettlement = request.catchSettlement
    ? (request.catchSettlement as Parameters<typeof normalizeSettlement>[0])
    : null;

  const isRequestAccepted =
    request.status !== 'PENDING_ACCEPTANCE' && request.status !== 'REJECTED';

  const isLogisticsActive =
    isLogisticsTrackingStatus(request.status) &&
    !(request.status === 'DELIVERED' && request.logisticsDelivery);

  const showPaymentTabs = !isLogisticsActive;

  const visibleTabs: SectionKey[] = [
    'general',
    'catch',
    ...(request.packerNotes ? (['packerNotes'] as const) : []),
    ...(isRequestAccepted ? (['logisticsTracking'] as const) : []),
    // Para estado "Liquidación de pesca pendiente", mostrar primero "Anticipo pagado"
    // y luego "Liquidación de pesca" en el orden de pestañas.
    ...(!isLogisticsActive && request.status === 'CATCH_SETTLEMENT_PENDING'
      ? (['advanceReadOnly', 'settlement'] as const)
      : []),
    // Para saldo restante pendiente y venta finalizada: Anticipo pagado a la izquierda de Liquidación de pesca
    ...(!isLogisticsActive && request.status === 'ADVANCE_PENDING' && settlementReadOnlySettlement
      ? (['settlementReadOnly'] as const)
      : []),
    ...(!isLogisticsActive &&
    (request.status === 'BALANCE_PENDING' || request.status === 'SALE_COMPLETED') &&
    settlementReadOnlySettlement
      ? (['advanceReadOnly', 'settlementReadOnly'] as const)
      : []),
    ...(showPaymentTabs && request.status === 'ADVANCE_PENDING' ? (['advanceTransfer'] as const) : []),
    ...(showPaymentTabs && request.status === 'BALANCE_PENDING' ? (['balanceTransfer'] as const) : []),
    ...(showPaymentTabs && request.status === 'SALE_COMPLETED' ? (['balanceReadOnly'] as const) : []),
    'messages',
    ...(showRejectForm || (request.status === 'REJECTED' && rejectionReasonDisplay)
      ? (['rejectForm'] as const)
      : []),
  ];

  const isTabVisible = (key: SectionKey) => visibleTabs.includes(key);
  const effectiveActiveTab = isTabVisible(activeTab) ? activeTab : 'general';

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles de Solicitud de Compra" size="xl">
        <div className={saleRequestDetail.modalBody}>
          <div className={saleRequestDetail.tabsBar}>
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className={saleRequestDetail.tabArrow}
                aria-label="Ver secciones anteriores"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div
              ref={tabsScrollRef}
              className={saleRequestDetail.tabsScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {visibleTabs.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`${saleRequestDetail.tabButton} ${
                    effectiveActiveTab === key
                      ? saleRequestDetail.tabButtonActive
                      : saleRequestDetail.tabButtonInactive
                  }`}
                >
                  {SECTION_LABELS[key]}
                </button>
              ))}
            </div>
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className={saleRequestDetail.tabArrow}
                aria-label="Ver más secciones"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          <div className={saleRequestDetail.tabContent}>
            {effectiveActiveTab === 'general' && (
              <GeneralInfoSection
                request={request}
                contentOnly
                linkedOffer={linkedOffer}
                onOpenOfferModal={() => setShowOfferModal(true)}
              />
            )}
            {effectiveActiveTab === 'catch' && (
              <CatchInfoSection request={request} contentOnly />
            )}
            {effectiveActiveTab === 'logisticsTracking' && isRequestAccepted && (
              <LogisticsTrackingSection
                request={request}
                contentOnly
                catchWeight={catchWeight}
                onCatchWeightChange={setCatchWeight}
                linkedOfferPriceUnit={linkedOffer?.priceUnit}
                documentFile={documentFile}
                onDocumentFileChange={setDocumentFile}
                documentPreviewUrl={documentPreviewUrl}
                documentInputRef={documentInputRef}
                termsAccepted={termsAccepted}
                onTermsAcceptedChange={setTermsAccepted}
                onConfirmDelivery={onConfirmDelivery ? handleConfirmDelivery : undefined}
              />
            )}
            {effectiveActiveTab === 'packerNotes' && request.packerNotes && (
              <PackerNotesSection packerNotes={request.packerNotes} contentOnly />
            )}
            {effectiveActiveTab === 'settlementReadOnly' && settlementReadOnlySettlement && (
              <SettlementReadOnlySection
                settlement={settlementReadOnlySettlement}
                remitidasLb={request.catchInfo.estimatedQuantityLb}
                receivedCatchWeightLb={receivedCatchWeightLb}
                linkedOffer={linkedOffer}
                contentOnly
              />
            )}
            {effectiveActiveTab === 'advanceTransfer' && request.status === 'ADVANCE_PENDING' && (
              <AdvanceTransferSection
                request={request}
                linkedOffer={linkedOffer}
                contentOnly
                advancePaymentEndsAt={advancePaymentEndsAt}
                advanceTimerTick={advanceTimerTick}
                selectedBankIndex={selectedBankIndex}
                onSelectedBankIndexChange={setSelectedBankIndex}
                advanceProofFile={advanceProofFile}
                onAdvanceProofFileChange={setAdvanceProofFile}
                advanceProofPreviewUrl={advanceProofPreviewUrl}
                advanceProofInputRef={advanceProofInputRef}
              />
            )}
            {effectiveActiveTab === 'advanceReadOnly' && (
              <AdvanceReadOnlySection
                request={request}
                linkedOffer={linkedOffer}
                contentOnly
              />
            )}
            {effectiveActiveTab === 'balanceTransfer' && request.status === 'BALANCE_PENDING' && (
              <BalanceTransferSection
                request={request}
                linkedOffer={linkedOffer}
                contentOnly
                balancePaymentEndsAt={balancePaymentEndsAt}
                balanceTimerTick={balanceTimerTick}
                selectedBankIndex={selectedBankIndex}
                onSelectedBankIndexChange={setSelectedBankIndex}
                balanceProofFile={balanceProofFile}
                onBalanceProofFileChange={setBalanceProofFile}
                balanceProofPreviewUrl={balanceProofPreviewUrl}
                balanceProofInputRef={balanceProofInputRef}
              />
            )}
            {effectiveActiveTab === 'balanceReadOnly' && request.status === 'SALE_COMPLETED' && (
              <BalanceReadOnlySection
                request={request}
                linkedOffer={linkedOffer}
                contentOnly
              />
            )}
            {effectiveActiveTab === 'settlement' && request.status === 'CATCH_SETTLEMENT_PENDING' && (
              <SettlementFormSection
                request={request}
                settlement={settlement}
                onSettlementChange={setSettlement}
                isSettlementLocked={isSettlementLocked}
                onSettlementLockedChange={setIsSettlementLocked}
                receivedCatchWeightLb={receivedCatchWeightLb}
                linkedOffer={linkedOffer}
                contentOnly
              />
            )}
            {effectiveActiveTab === 'messages' && (
              <MessagesSection
                messages={messages}
                messageText={messageText}
                onMessageTextChange={setMessageText}
                onSendMessage={handleSendMessage}
                contentOnly
                isMessagesActive={isMessagesActive}
                messagesEndRef={messagesEndRef}
              />
            )}
            {effectiveActiveTab === 'rejectForm' && (
              showRejectForm ? (
                <RejectFormSection
                  isForm
                  contentOnly
                  selectedRejectionReason={selectedRejectionReason}
                  onSelectedRejectionReasonChange={setSelectedRejectionReason}
                  rejectNotes={rejectNotes}
                  onRejectNotesChange={setRejectNotes}
                />
              ) : request.status === 'REJECTED' && rejectionReasonDisplay ? (
                <RejectFormSection
                  isForm={false}
                  contentOnly
                  selectedRejectionReason=""
                  onSelectedRejectionReasonChange={() => {}}
                  rejectNotes=""
                  onRejectNotesChange={() => {}}
                  rejectionReasonDisplay={rejectionReasonDisplay}
                />
              ) : null
            )}
          </div>

          <div className={saleRequestDetail.detailActionsWrap}>
            <DetailActions
            status={request.status}
            showRejectForm={showRejectForm}
            canConfirmReject={canConfirmReject}
            isSettlementLocked={isSettlementLocked}
            advanceProofFile={advanceProofFile}
            balanceProofFile={balanceProofFile}
            onClose={onClose}
            onAccept={handleAccept}
            onReject={handleReject}
            onCancelReject={handleCancelReject}
            onSendSettlement={onSendSettlement ? handleSendSettlement : undefined}
            onCancelPurchase={onCancelPurchase ? handleCancelPurchase : undefined}
            onSendAdvanceProof={onSendAdvanceProof ? handleSendAdvanceProof : undefined}
            onSendBalanceProof={onSendBalanceProof ? handleSendBalanceProof : undefined}
          />
          </div>
        </div>
      </Modal>
      <LinkedOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        offer={linkedOffer}
      />
    </>
  );
};
