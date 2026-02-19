import React from 'react';
import { Modal } from '../../../components/Modal';
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
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-2">
          <h3 className="text-lg font-medium text-gray-900">Oferta aceptada</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Cerrar"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>
        <OfferPreviewContent offer={offer} />
        <div className="flex justify-end pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
