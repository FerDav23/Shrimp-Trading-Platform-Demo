import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { collapsible, typography, saleRequestDetail } from '../../../styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SaleRequest } from '../../../types';
import { CollapsibleSection } from './CollapsibleSection';

interface CatchInfoSectionProps {
  request: SaleRequest;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
}

const CatchInfoContent: React.FC<{ request: SaleRequest }> = ({ request }) => (
  <div className={collapsible.content}>
    <div className={saleRequestDetail.sectionCard}>
      <div className={saleRequestDetail.sectionGridTwoCols}>
        <FormRow
          labelClassName={saleRequestDetail.sectionLabelSm}
          className={saleRequestDetail.sectionRowCompact}
          label="Cantidad Estimada"
        >
          <p className={saleRequestDetail.sectionValueSm}>
            {request.catchInfo.estimatedQuantityLb} lb
          </p>
        </FormRow>
        <FormRow
          labelClassName={saleRequestDetail.sectionLabelSm}
          className={saleRequestDetail.sectionRowCompact}
          label="Rango de Tallas"
        >
          <p className={saleRequestDetail.sectionValueSm}>
            {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
          </p>
        </FormRow>
        <FormRow
          labelClassName={saleRequestDetail.sectionLabelSm}
          className={saleRequestDetail.sectionRowCompact}
          label="Fecha Estimada de Cosecha"
        >
          <p className={saleRequestDetail.sectionValueSm}>
            {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: es })}
          </p>
        </FormRow>
        <FormRow
          labelClassName={saleRequestDetail.sectionLabelSm}
          className={saleRequestDetail.sectionRowCompact}
          label="Ciudad"
        >
          <p className={saleRequestDetail.sectionValueSm}>
            {request.catchInfo.harvestLocation.city}
          </p>
        </FormRow>
        <div className={`md:col-span-2 ${saleRequestDetail.sectionRowCompact}`}>
          <FormRow
            labelClassName={saleRequestDetail.sectionLabelSm}
            className={saleRequestDetail.sectionRowCompact}
            label="Dirección de Cosecha"
          >
            <p className={saleRequestDetail.sectionValueSm}>
              {request.catchInfo.harvestLocation.address}
            </p>
          </FormRow>
        </div>
        {request.catchInfo.attachments && request.catchInfo.attachments.length > 0 && (
          <div className={`md:col-span-2 ${saleRequestDetail.sectionRowCompact}`}>
            <FormRow
              labelClassName={saleRequestDetail.sectionLabelSm}
              className={saleRequestDetail.sectionRowCompact}
              label="Archivos Adjuntos"
            >
              <div className="space-y-1.5">
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
          </div>
        )}
      </div>
    </div>
  </div>
);

export const CatchInfoSection: React.FC<CatchInfoSectionProps> = ({
  request,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
}) => {
  if (contentOnly) {
    return <CatchInfoContent request={request} />;
  }
  return (
    <CollapsibleSection title="Información de Pesca" expanded={expanded} onToggle={onToggle}>
      <CatchInfoContent request={request} />
    </CollapsibleSection>
  );
};
