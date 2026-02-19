import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
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
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione el motivo del rechazo
            </label>
            <select
              value={selectedRejectionReason}
              onChange={(e) => onSelectedRejectionReasonChange(e.target.value)}
              className="w-full px-3 py-2 border border-red-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {REJECTION_REASONS.map((opt) => (
                <option key={opt.value || 'empty'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios adicionales (opcional)
            </label>
            <textarea
              value={rejectNotes}
              onChange={(e) => onRejectNotesChange(e.target.value)}
              placeholder="Ingrese comentarios adicionales..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
      <div className="px-6 pb-6">
        <div className="bg-white border border-red-200 rounded-lg p-4">
          <p className="text-gray-900">{rejectionReasonDisplay ?? ''}</p>
        </div>
      </div>
    </CollapsibleSection>
  );
};
