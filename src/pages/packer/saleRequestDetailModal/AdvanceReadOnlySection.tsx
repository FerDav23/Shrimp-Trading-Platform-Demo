import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { DUMMY_ADVANCE_PROOF_IMAGE } from './constants';

interface AdvanceReadOnlySectionProps {
  expanded: boolean;
  onToggle: () => void;
}

export const AdvanceReadOnlySection: React.FC<AdvanceReadOnlySectionProps> = ({
  expanded,
  onToggle,
}) => (
  <CollapsibleSection title="Anticipo pagado" expanded={expanded} onToggle={onToggle}>
    <div className="px-6 pb-6">
      <div className="bg-white border border-sky-200 rounded-xl p-6 space-y-4 shadow-sm">
        <h4 className="text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2">
          Comprobante de anticipo
        </h4>
        <div className="border border-sky-200 rounded-lg overflow-hidden bg-gray-100 max-w-sm">
          <img
            src={DUMMY_ADVANCE_PROOF_IMAGE}
            alt="Comprobante de anticipo (ejemplo)"
            className="w-full h-auto max-h-48 object-contain"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              Fecha de envío
            </p>
            <p className="text-gray-900">15 Feb 2024, 10:30</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              Monto del anticipo
            </p>
            <p className="text-gray-900 font-semibold">$ 588.00</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Estado</p>
            <p className="text-gray-900 font-medium text-green-700">Anticipo enviado y confirmado</p>
          </div>
        </div>
      </div>
    </div>
  </CollapsibleSection>
);
