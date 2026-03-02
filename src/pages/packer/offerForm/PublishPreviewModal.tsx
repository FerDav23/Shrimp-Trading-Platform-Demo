import React from 'react';
import { Modal } from '../../../components/Modal';
import { OfferPreviewContent } from '../../../components/OfferPreviewContent';
import type { OfferFormData, OfferFormSectionProps } from './types';
import type { Offer } from '../../../types';
import { buildPreviewOffer, getOfferLabel } from './utils';
import { page } from '../../../styles';

interface PublishPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklistAccepted: boolean;
  onChecklistChange: (accepted: boolean) => void;
  onConfirmPublish: () => void;
  data: OfferFormData;
  formType: OfferFormSectionProps['formType'];
  packingCompany: OfferFormSectionProps['packingCompany'];
}

export const PublishPreviewModal: React.FC<PublishPreviewModalProps> = ({
  isOpen,
  onClose,
  checklistAccepted,
  onChecklistChange,
  onConfirmPublish,
  data,
  formType,
  packingCompany,
}) => {
  const previewOffer: Offer = buildPreviewOffer(
    data,
    packingCompany,
    getOfferLabel(formType)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vista previa antes de publicar" size="xl">
      <div className="space-y-3">
        <p className={page.infoBox}>
          Esto es una vista previa de cómo el productor verá la oferta. Desplázate hacia abajo para
          revisar el contenido, acepta el checklist y pulsa Publicar para que la oferta pase a
          estado publicado.
        </p>

        <div className={page.previewBox}>
          <OfferPreviewContent offer={previewOffer} />
        </div>

        <div className={page.modalSection}>
          <p className="text-sm text-gray-700">
            Al publicar, usted confirma que la información de la oferta es correcta y que cumple con
            las condiciones de uso de la plataforma. (Aquí irán las condiciones de publicación de
            oferta.)
          </p>
          <label className={page.checkboxLabel}>
            <input
              type="checkbox"
              checked={checklistAccepted}
              onChange={(e) => onChecklistChange(e.target.checked)}
              className={page.checkboxInput}
            />
            <span className="text-sm text-gray-700">
              Acepto las condiciones anteriores y deseo publicar esta oferta.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={page.modalCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmPublish}
              disabled={!checklistAccepted}
              className={page.modalConfirm}
            >
              Publicar oferta
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
