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
    <Modal isOpen={isOpen} onClose={onClose} title="Preview before publishing" size="xl">
      <div className="space-y-3">
        <p className={page.infoBox}>
          This is a preview of how the producer will see the offer. Scroll down to review the content,
          accept the checklist and click Publish to set the offer to published status.
        </p>

        <div className={page.previewBox}>
          <OfferPreviewContent offer={previewOffer} />
        </div>

        <div className={page.modalSection}>
          <p className="text-sm text-gray-700">
            By publishing, you confirm that the offer information is correct and complies with the
            platform terms of use. (Offer publication conditions will go here.)
          </p>
          <label className={page.checkboxLabel}>
            <input
              type="checkbox"
              checked={checklistAccepted}
              onChange={(e) => onChecklistChange(e.target.checked)}
              className={page.checkboxInput}
            />
            <span className="text-sm text-gray-700">
              I accept the above conditions and wish to publish this offer.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={page.modalCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmPublish}
              disabled={!checklistAccepted}
              className={page.modalConfirm}
            >
              Publish offer
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
