import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { StatusBadge } from '../../../components/StatusBadge';
import { collapsible, saleRequestDetail } from '../../../styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SaleRequest } from '../../../types';
import { getProductFormLabel, getStatusLabel } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
interface GeneralInfoSectionProps {
  request: SaleRequest;
  expanded: boolean;
  onToggle: () => void;
  linkedOffer: { id: string; offerCode: string } | null;
  onOpenOfferModal: () => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  request,
  expanded,
  onToggle,
  linkedOffer,
  onOpenOfferModal,
}) => (
  <CollapsibleSection title="Información General" expanded={expanded} onToggle={onToggle}>
    <div className={collapsible.content}>
      <div className={collapsible.innerBox}>
        <div className={saleRequestDetail.gridForm}>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="ID Solicitud">
            <p className={saleRequestDetail.formRowValueBold}>#{request.id.split('-')[1]}</p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Estado">
            <div className={saleRequestDetail.formRowValue}>
              <StatusBadge status={request.status} label={getStatusLabel(request.status)} />
            </div>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Productor">
            <p className={saleRequestDetail.formRowValue}>{request.producerName}</p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Producto">
            <p className={saleRequestDetail.formRowValue}>{getProductFormLabel(request.productForm)}</p>
          </FormRow>
          <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Fecha de Solicitud">
            <p className={saleRequestDetail.formRowValue}>
              {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
            </p>
          </FormRow>
          {request.respondedAt && (
            <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Fecha de Respuesta">
              <p className={saleRequestDetail.formRowValue}>
                {format(new Date(request.respondedAt), 'dd MMM yyyy, HH:mm', { locale: es })}
              </p>
            </FormRow>
          )}
          <div className="md:col-span-2 mt-2">
            <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Oferta vinculada">
              <div className={saleRequestDetail.formRowInline}>
                {linkedOffer ? (
                  <>
                    <span className={saleRequestDetail.formRowValueBold}>{linkedOffer.offerCode}</span>
                    <button
                      type="button"
                      onClick={onOpenOfferModal}
                      className={collapsible.skyButton}
                    >
                      Ver oferta
                    </button>
                  </>
                ) : (
                  <span className={saleRequestDetail.mutedText}>Oferta no encontrada</span>
                )}
              </div>
            </FormRow>
          </div>
        </div>
      </div>
    </div>
  </CollapsibleSection>
);
