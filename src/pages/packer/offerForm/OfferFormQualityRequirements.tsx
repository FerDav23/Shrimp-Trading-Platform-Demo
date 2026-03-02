import React from 'react';
import type { OfferFormData } from './types';
import { REQUISITOS_CALIDAD_BD } from './constants';
import { offerSection } from '../../../styles';

interface OfferFormQualityRequirementsProps {
  data: OfferFormData;
  isLocked: boolean;
  toggleQualityRequirement: (id: string) => void;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export const OfferFormQualityRequirements: React.FC<OfferFormQualityRequirementsProps> = ({
  data,
  isLocked,
  toggleQualityRequirement,
  sectionRef,
}) => (
  <section
    ref={sectionRef as React.RefObject<HTMLElement> | undefined}
    className={offerSection.containerFlex}
  >
    <h3 className={offerSection.titleShrink}>
      Requisitos de Calidad
    </h3>
    <div className={offerSection.innerFlex}>
      <p className={offerSection.textSm + ' mb-2 shrink-0'}>
        Los requisitos se cargan desde el catálogo. Marque con un check los que aplican a esta
        oferta; solo los requisitos marcados se mostrarán al productor en la oferta publicada.
      </p>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 space-y-2 rounded-lg border border-sky-200/50 bg-white/30">
        {REQUISITOS_CALIDAD_BD.map((req) => {
          const isSelected = data.selectedQualityRequirementIds.includes(req.id);
          return (
            <label
              key={req.id}
              className={`${offerSection.checkboxItem} ${
                isSelected ? offerSection.checkboxItemSelected : offerSection.checkboxItemUnselected
              } ${isLocked ? offerSection.checkboxItemLocked : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleQualityRequirement(req.id)}
                disabled={isLocked}
                className={offerSection.checkbox}
              />
              <div className="flex-1 min-w-0">
                <span className={offerSection.textBold}>{req.text}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  </section>
);
