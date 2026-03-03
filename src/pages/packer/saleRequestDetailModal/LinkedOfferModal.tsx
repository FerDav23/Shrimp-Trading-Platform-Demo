import React from 'react';
import { Modal } from '../../../components/Modal';
import { linkedOfferModal, button } from '../../../styles';
import { OfferPreviewContent } from '../../../components/OfferPreviewContent';
import type { Offer } from '../../../types';

interface LinkedOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
}

export const LinkedOfferModal: React.FC<LinkedOfferModalProps> = ({ isOpen, onClose, offer }) => {
  if (!offer) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className={linkedOfferModal.wrap}>
        <div className={linkedOfferModal.header}>
          <h3 className={linkedOfferModal.title}>Oferta aceptada</h3>
          <button
            type="button"
            onClick={onClose}
            className={linkedOfferModal.closeBtn}
            aria-label="Cerrar"
          >
            <span className={linkedOfferModal.closeIcon}>×</span>
          </button>
        </div>
        <OfferPreviewContent offer={offer} />
        <div className={linkedOfferModal.footer}>
          <button type="button" onClick={onClose} className={button.primaryMd}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
