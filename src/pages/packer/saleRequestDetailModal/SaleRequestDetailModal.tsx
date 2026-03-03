import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../components/Modal';
import { dummyRequestMessages, RequestMessage } from '../../../data/requestMessages';
import { dummyOffers } from '../../../data/offers';
import { useAuth } from '../../../contexts/AuthContext';
import type { SaleRequestDetailModalProps } from './types';
import type { SectionKey } from './types';
import { defaultExpanded, REJECTION_REASONS, ADVANCE_DEADLINE_HOURS, BALANCE_DEADLINE_HOURS } from './constants';
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
import { DetailActions } from './DetailActions';
import { LinkedOfferModal } from './LinkedOfferModal';
import type { CatchSettlement } from '../../../types';
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
}) => {
  const { user } = useAuth();
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedRejectionReason, setSelectedRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>(defaultExpanded);
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

  const linkedOffer = request ? dummyOffers.find((o) => o.id === request.offerId) ?? null : null;

  const toggleSection = (key: SectionKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
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
    if (!isOpen) {
      setRejectNotes('');
      setSelectedRejectionReason('');
      setShowRejectForm(false);
      setMessageText('');
      setExpanded(defaultExpanded);
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles de Solicitud de Compra" size="xl">
        <div className={saleRequestDetail.modalBody}>
          <GeneralInfoSection
            request={request}
            expanded={expanded.general}
            onToggle={() => toggleSection('general')}
            linkedOffer={linkedOffer}
            onOpenOfferModal={() => setShowOfferModal(true)}
          />

          <CatchInfoSection
            request={request}
            expanded={expanded.catch}
            onToggle={() => toggleSection('catch')}
          />

          {request.packerNotes && (
            <PackerNotesSection
              packerNotes={request.packerNotes}
              expanded={expanded.packerNotes}
              onToggle={() => toggleSection('packerNotes')}
            />
          )}

          {/* ADVANCE_PENDING: settlement read-only + advance transfer */}
          {request.status === 'ADVANCE_PENDING' && (
            <>
              {settlementReadOnlySettlement && (
                <SettlementReadOnlySection
                  settlement={settlementReadOnlySettlement}
                  remitidasLb={request.catchInfo.estimatedQuantityLb}
                  expanded={expanded.settlementReadOnly}
                  onToggle={() => toggleSection('settlementReadOnly')}
                />
              )}
              <AdvanceTransferSection
                request={request}
                linkedOffer={linkedOffer}
                expanded={expanded.advanceTransfer}
                onToggle={() => toggleSection('advanceTransfer')}
                advancePaymentEndsAt={advancePaymentEndsAt}
                advanceTimerTick={advanceTimerTick}
                selectedBankIndex={selectedBankIndex}
                onSelectedBankIndexChange={setSelectedBankIndex}
                advanceProofFile={advanceProofFile}
                onAdvanceProofFileChange={setAdvanceProofFile}
                advanceProofPreviewUrl={advanceProofPreviewUrl}
                advanceProofInputRef={advanceProofInputRef}
              />
            </>
          )}

          {/* BALANCE_PENDING: settlement read-only + advance read-only + balance transfer */}
          {request.status === 'BALANCE_PENDING' && (
            <>
              {settlementReadOnlySettlement && (
                <SettlementReadOnlySection
                  settlement={settlementReadOnlySettlement}
                  remitidasLb={request.catchInfo.estimatedQuantityLb}
                  expanded={expanded.settlementReadOnly}
                  onToggle={() => toggleSection('settlementReadOnly')}
                />
              )}
              <AdvanceReadOnlySection
                expanded={expanded.advanceReadOnly}
                onToggle={() => toggleSection('advanceReadOnly')}
              />
              <BalanceTransferSection
                request={request}
                linkedOffer={linkedOffer}
                expanded={expanded.balanceTransfer}
                onToggle={() => toggleSection('balanceTransfer')}
                balancePaymentEndsAt={balancePaymentEndsAt}
                balanceTimerTick={balanceTimerTick}
                selectedBankIndex={selectedBankIndex}
                onSelectedBankIndexChange={setSelectedBankIndex}
                balanceProofFile={balanceProofFile}
                onBalanceProofFileChange={setBalanceProofFile}
                balanceProofPreviewUrl={balanceProofPreviewUrl}
                balanceProofInputRef={balanceProofInputRef}
              />
            </>
          )}

          {/* SALE_COMPLETED: settlement + advance + balance all read-only */}
          {request.status === 'SALE_COMPLETED' && (
            <>
              {settlementReadOnlySettlement && (
                <SettlementReadOnlySection
                  settlement={settlementReadOnlySettlement}
                  remitidasLb={request.catchInfo.estimatedQuantityLb}
                  expanded={expanded.settlementReadOnly}
                  onToggle={() => toggleSection('settlementReadOnly')}
                />
              )}
              <AdvanceReadOnlySection
                expanded={expanded.advanceReadOnly}
                onToggle={() => toggleSection('advanceReadOnly')}
              />
              <BalanceReadOnlySection
                request={request}
                linkedOffer={linkedOffer}
                expanded={expanded.balanceReadOnly}
                onToggle={() => toggleSection('balanceReadOnly')}
              />
            </>
          )}

          {/* CATCH_SETTLEMENT_PENDING: editable settlement form */}
          {request.status === 'CATCH_SETTLEMENT_PENDING' && (
            <SettlementFormSection
              request={request}
              settlement={settlement}
              onSettlementChange={setSettlement}
              isSettlementLocked={isSettlementLocked}
              onSettlementLockedChange={setIsSettlementLocked}
              expanded={expanded.settlement}
              onToggle={() => toggleSection('settlement')}
            />
          )}

          <MessagesSection
            messages={messages}
            messageText={messageText}
            onMessageTextChange={setMessageText}
            onSendMessage={handleSendMessage}
            expanded={expanded.messages}
            onToggle={() => toggleSection('messages')}
            isMessagesActive={isMessagesActive}
            messagesEndRef={messagesEndRef}
          />

          {showRejectForm && (
            <RejectFormSection
              isForm
              expanded={expanded.rejectForm}
              onToggle={() => toggleSection('rejectForm')}
              selectedRejectionReason={selectedRejectionReason}
              onSelectedRejectionReasonChange={setSelectedRejectionReason}
              rejectNotes={rejectNotes}
              onRejectNotesChange={setRejectNotes}
            />
          )}

          {request.status === 'REJECTED' && rejectionReasonDisplay && (
            <RejectFormSection
              isForm={false}
              expanded={expanded.rejectForm}
              onToggle={() => toggleSection('rejectForm')}
              selectedRejectionReason=""
              onSelectedRejectionReasonChange={() => {}}
              rejectNotes=""
              onRejectNotesChange={() => {}}
              rejectionReasonDisplay={rejectionReasonDisplay}
            />
          )}

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
      </Modal>
      <LinkedOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        offer={linkedOffer}
      />
    </>
  );
};
