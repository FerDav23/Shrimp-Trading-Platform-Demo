import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SaleRequest } from '../../../types';
import { CollapsibleSection } from './CollapsibleSection';

interface CatchInfoSectionProps {
  request: SaleRequest;
  expanded: boolean;
  onToggle: () => void;
}

export const CatchInfoSection: React.FC<CatchInfoSectionProps> = ({ request, expanded, onToggle }) => (
  <CollapsibleSection title="Información de Pesca" expanded={expanded} onToggle={onToggle}>
    <div className="px-6 pb-6">
      <div className="bg-white border border-sky-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Cantidad Estimada">
            <p className="py-2 text-sm text-gray-900 font-medium">{request.catchInfo.estimatedQuantityLb} lb</p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Rango de Tallas">
            <p className="py-2 text-sm text-gray-900">
              {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
            </p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha Estimada de Cosecha">
            <p className="py-2 text-sm text-gray-900">
              {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: es })}
            </p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Ciudad">
            <p className="py-2 text-sm text-gray-900">{request.catchInfo.harvestLocation.city}</p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Dirección de Cosecha" className="md:col-span-2">
            <p className="py-2 text-sm text-gray-900">{request.catchInfo.harvestLocation.address}</p>
          </FormRow>
          {request.catchInfo.notes && (
            <FormRow labelClassName="text-sm font-medium text-gray-700" label="Notas del Productor" className="md:col-span-2">
              <p className="py-2 text-sm text-gray-900 bg-gray-50 rounded p-3 border border-gray-200">
                {request.catchInfo.notes}
              </p>
            </FormRow>
          )}
          {request.catchInfo.attachments && request.catchInfo.attachments.length > 0 && (
            <FormRow labelClassName="text-sm font-medium text-gray-700" label="Archivos Adjuntos" className="md:col-span-2">
              <div className="py-2 space-y-2">
                {request.catchInfo.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Descargar ${attachment} (simulado)`);
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {attachment}
                  </a>
                ))}
              </div>
            </FormRow>
          )}
        </div>
      </div>
    </div>
  </CollapsibleSection>
);
