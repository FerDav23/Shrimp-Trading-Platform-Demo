import React from 'react';
import { Modal } from '../../../components/Modal';
import { OfferPreviewContent } from '../../../components/OfferPreviewContent';
import type { OfferFormData, OfferFormSectionProps } from './types';
import type { Offer } from '../../../types';
import { buildPreviewOffer, getOfferLabel } from './utils';

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
        <p className="text-sm text-gray-600 bg-sky-50 border border-sky-200 rounded-lg p-3">
          Esto es una vista previa de cómo el productor verá la oferta. Desplázate hacia abajo para
          revisar el contenido, acepta el checklist y pulsa Publicar para que la oferta pase a
          estado publicado.
        </p>

        <div className="max-h-[50vh] overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
          <OfferPreviewContent offer={previewOffer} />
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-2">
          <p className="text-sm text-gray-700">
            Al publicar, usted confirma que la información de la oferta es correcta y que cumple con
            las condiciones de uso de la plataforma. (Aquí irán las condiciones de publicación de
            oferta.)
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checklistAccepted}
              onChange={(e) => onChecklistChange(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Acepto las condiciones anteriores y deseo publicar esta oferta.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmPublish}
              disabled={!checklistAccepted}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar oferta
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
