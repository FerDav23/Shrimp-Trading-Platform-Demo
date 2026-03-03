import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { collapsible, typography, saleRequestDetail } from '../../../styles';
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
    <div className={collapsible.content}>
      <div className={collapsible.innerBox}>
        <div className={saleRequestDetail.gridForm}>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Cantidad Estimada">
            <p className={saleRequestDetail.formRowValueBold}>{request.catchInfo.estimatedQuantityLb} lb</p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Rango de Tallas">
            <p className={saleRequestDetail.formRowValue}>
              {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
            </p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Fecha Estimada de Cosecha">
            <p className={saleRequestDetail.formRowValue}>
              {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: es })}
            </p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Ciudad">
            <p className={saleRequestDetail.formRowValue}>{request.catchInfo.harvestLocation.city}</p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Dirección de Cosecha" className="md:col-span-2">
            <p className={saleRequestDetail.formRowValue}>{request.catchInfo.harvestLocation.address}</p>
          </FormRow>
          {request.catchInfo.notes && (
            <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Notas del Productor" className="md:col-span-2">
              <p className={collapsible.notesBox}>
                {request.catchInfo.notes}
              </p>
            </FormRow>
          )}
          {request.catchInfo.attachments && request.catchInfo.attachments.length > 0 && (
            <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Archivos Adjuntos" className="md:col-span-2">
              <div className={`${saleRequestDetail.formRowValue} space-y-2`}>
                {request.catchInfo.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Descargar ${attachment} (simulado)`);
                    }}
                    className={`${typography.linkPrimarySm} flex items-center gap-2`}
                  >
                    <svg className={saleRequestDetail.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
