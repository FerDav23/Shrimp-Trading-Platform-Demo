import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { collapsible, saleRequestDetail } from '../../../styles';
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
    <div className={collapsible.content}>
      <div className={collapsible.innerBoxXl}>
        <h4 className={collapsible.subsectionTitle}>
          Comprobante de anticipo
        </h4>
        <div className={collapsible.proofImage}>
          <img
            src={DUMMY_ADVANCE_PROOF_IMAGE}
            alt="Comprobante de anticipo (ejemplo)"
            className={collapsible.proofImgSm}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className={collapsible.fieldLabel}>Fecha de envío</p>
            <p className={saleRequestDetail.fieldValueText}>15 Feb 2024, 10:30</p>
          </div>
          <div>
            <p className={collapsible.fieldLabel}>Monto del anticipo</p>
            <p className="text-gray-900 font-semibold">$ 588.00</p>
          </div>
          <div className="md:col-span-2">
            <p className={collapsible.fieldLabel}>Estado</p>
            <p className={`${saleRequestDetail.fieldValue} ${saleRequestDetail.statusSuccess}`}>Anticipo enviado y confirmado</p>
          </div>
        </div>
      </div>
    </div>
  </CollapsibleSection>
);
