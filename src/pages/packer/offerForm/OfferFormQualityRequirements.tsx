import React from 'react';
import type { OfferFormData } from './types';
import { REQUISITOS_CALIDAD_BD } from './constants';

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
    className="flex flex-col p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm min-h-0 overflow-hidden"
  >
    <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30 shrink-0">
      Requisitos de Calidad
    </h3>
    <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4 flex-1 min-h-0 flex flex-col">
      <p className="text-sm text-slate-600 mb-4 shrink-0">
        Los requisitos se cargan desde el catálogo. Marque con un check los que aplican a esta
        oferta; solo los requisitos marcados se mostrarán al productor en la oferta publicada.
      </p>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 space-y-2 rounded-lg border border-sky-200/50 bg-white/30">
        {REQUISITOS_CALIDAD_BD.map((req) => {
          const isSelected = data.selectedQualityRequirementIds.includes(req.id);
          return (
            <label
              key={req.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected ? 'bg-sky-50/80 border-sky-300' : 'bg-white/50 border-sky-200'
              } ${isLocked ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleQualityRequirement(req.id)}
                disabled={isLocked}
                className="mt-1 rounded border-sky-300 text-sky-600 focus:ring-sky-400 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-slate-800">{req.text}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  </section>
);
