import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { collapsible, form, saleRequestDetail } from '../../../styles';
import { REJECTION_REASONS } from './constants';

interface RejectFormSectionProps {
  /** When true: show the form to select reason and submit. When false: show read-only rejection reason (for REJECTED status). */
  isForm: boolean;
  expanded: boolean;
  onToggle: () => void;
  selectedRejectionReason: string;
  onSelectedRejectionReasonChange: (value: string) => void;
  rejectNotes: string;
  onRejectNotesChange: (value: string) => void;
  /** For read-only display when request is REJECTED */
  rejectionReasonDisplay?: string;
}

export const RejectFormSection: React.FC<RejectFormSectionProps> = ({
  isForm,
  expanded,
  onToggle,
  selectedRejectionReason,
  onSelectedRejectionReasonChange,
  rejectNotes,
  onRejectNotesChange,
  rejectionReasonDisplay,
}) => {
  if (isForm) {
    return (
      <CollapsibleSection
        title="Motivo del rechazo"
        expanded={expanded}
        onToggle={onToggle}
        variant="default"
      >
        <div className={collapsible.contentPadSpace}>
          <div>
            <label className={`block ${form.label} mb-2`}>
              Seleccione el motivo del rechazo
            </label>
            <select
              value={selectedRejectionReason}
              onChange={(e) => onSelectedRejectionReasonChange(e.target.value)}
              className={collapsible.rejectSelect}
            >
              {REJECTION_REASONS.map((opt) => (
                <option key={opt.value || 'empty'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block ${form.label} mb-2`}>
              Comentarios adicionales (opcional)
            </label>
            <textarea
              value={rejectNotes}
              onChange={(e) => onRejectNotesChange(e.target.value)}
              placeholder="Ingrese comentarios adicionales..."
              className={collapsible.rejectTextarea}
              rows={3}
            />
          </div>
        </div>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection
      title="Motivo del rechazo"
      expanded={expanded}
      onToggle={onToggle}
      variant="rejection"
    >
      <div className={collapsible.contentPad}>
        <div className={collapsible.rejectReadonlyBox}>
          <p className={saleRequestDetail.rejectReadonlyText}>{rejectionReasonDisplay ?? ''}</p>
        </div>
      </div>
    </CollapsibleSection>
  );
};
