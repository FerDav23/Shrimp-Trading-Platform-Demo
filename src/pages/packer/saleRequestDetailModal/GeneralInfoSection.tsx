import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { StatusBadge } from '../../../components/StatusBadge';
import { collapsible, saleRequestDetail, packerSales } from '../../../styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SaleRequest, SaleRequestStatus } from '../../../types';
import { getProductFormLabel, getStatusLabel } from './utils';
import { CollapsibleSection } from './CollapsibleSection';

const STATUS_CLASS: Record<SaleRequestStatus, string> = {
  PENDING_ACCEPTANCE: packerSales.colStatusPendingAcceptance,
  CATCH_SETTLEMENT_PENDING: packerSales.colStatusCatchSettlement,
  ADVANCE_PENDING: packerSales.colStatusAdvancePending,
  BALANCE_PENDING: packerSales.colStatusBalancePending,
  SALE_COMPLETED: packerSales.colStatusSaleCompleted,
  REJECTED: packerSales.colStatusRejected,
  PENDING_PICKUP: packerSales.colStatusLogisticsPendingPickup,
  PENDING_DELIVERY: packerSales.colStatusLogisticsPendingDelivery,
  PICKED_UP: packerSales.colStatusLogisticsPickedUp,
  DELIVERED: packerSales.colStatusLogisticsDelivered,
};
interface GeneralInfoSectionProps {
  request: SaleRequest;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
  linkedOffer: { id: string; offerCode: string } | null;
  onOpenOfferModal: () => void;
}

const GeneralInfoContent: React.FC<{
  request: SaleRequest;
  linkedOffer: { id: string; offerCode: string } | null;
  onOpenOfferModal: () => void;
}> = ({ request, linkedOffer, onOpenOfferModal }) => {
  const showLogisticsDelivery =
    request.logisticsDelivery &&
    (request.status === 'CATCH_SETTLEMENT_PENDING' ||
      request.status === 'ADVANCE_PENDING' ||
      request.status === 'BALANCE_PENDING' ||
      request.status === 'SALE_COMPLETED' ||
      request.status === 'DELIVERED');

  return (
    <div className={collapsible.content}>
      <div className={saleRequestDetail.generalInfoCard}>
        <div className={saleRequestDetail.generalInfoGrid}>
          <FormRow
            labelClassName={saleRequestDetail.generalInfoLabel}
            className={saleRequestDetail.generalInfoRow}
            label="ID Solicitud"
          >
            <p className={saleRequestDetail.generalInfoValueBold}>#{request.id.split('-')[1]}</p>
          </FormRow>
          <FormRow
            labelClassName={saleRequestDetail.generalInfoLabel}
            className={saleRequestDetail.generalInfoRow}
            label="Estado"
          >
            <div className={saleRequestDetail.generalInfoValue}>
              <StatusBadge
                status={request.status}
                label={getStatusLabel(request.status)}
                fullClassName={STATUS_CLASS[request.status]}
              />
            </div>
          </FormRow>
          <FormRow
            labelClassName={saleRequestDetail.generalInfoLabel}
            className={saleRequestDetail.generalInfoRow}
            label="Productor"
          >
            <p className={saleRequestDetail.generalInfoValue}>{request.producerName}</p>
          </FormRow>
          <FormRow
            labelClassName={saleRequestDetail.generalInfoLabel}
            className={saleRequestDetail.generalInfoRow}
            label="Producto"
          >
            <p className={saleRequestDetail.generalInfoValue}>{getProductFormLabel(request.productForm)}</p>
          </FormRow>
          <FormRow
            labelClassName={saleRequestDetail.generalInfoLabel}
            className={saleRequestDetail.generalInfoRow}
            label="Fecha de Solicitud"
          >
            <p className={saleRequestDetail.generalInfoValue}>
              {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
            </p>
          </FormRow>
          {request.respondedAt && (
            <FormRow
              labelClassName={saleRequestDetail.generalInfoLabel}
              className={saleRequestDetail.generalInfoRow}
              label="Fecha de Respuesta"
            >
              <p className={saleRequestDetail.generalInfoValue}>
                {format(new Date(request.respondedAt), 'dd MMM yyyy, HH:mm', { locale: es })}
              </p>
            </FormRow>
          )}
          <div className={`md:col-span-2 ${saleRequestDetail.generalInfoRow}`}>
            <FormRow
              labelClassName={saleRequestDetail.generalInfoLabel}
              className={saleRequestDetail.generalInfoRow}
              label="Oferta vinculada"
            >
              <div className={saleRequestDetail.generalInfoInline}>
                {linkedOffer ? (
                  <>
                    <span className={saleRequestDetail.generalInfoValueBold}>{linkedOffer.offerCode}</span>
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

        {showLogisticsDelivery && (
          <div className={`${saleRequestDetail.sectionCard} mt-4`}>
            <p className={saleRequestDetail.sectionLabelSm}>Registro de logística (recepción en planta)</p>
            <div className={saleRequestDetail.sectionGridTwoCols}>
              <div>
                <p className={saleRequestDetail.sectionLabelSm}>Peso de la pesca recibida (lb)</p>
                <p className={saleRequestDetail.sectionValueSm}>
                  {request.logisticsDelivery?.catchWeight.toLocaleString('es-EC')}
                </p>
              </div>
              <div>
                <p className={saleRequestDetail.sectionLabelSm}>Términos y condiciones</p>
                <p className={saleRequestDetail.sectionValueSm}>
                  {request.logisticsDelivery?.termsAcceptedAt
                    ? `Aceptados el ${format(new Date(request.logisticsDelivery.termsAcceptedAt), 'dd MMM yyyy, HH:mm', {
                        locale: es,
                      })}`
                    : 'Aceptados'}
                </p>
              </div>
            </div>
            {request.logisticsDelivery?.documentPhotoUrl && (
              <div className="mt-3">
                <p className={saleRequestDetail.sectionLabelSm}>Documento de entrega</p>
                <div className={collapsible.proofImageLg}>
                  <img
                    src={request.logisticsDelivery.documentPhotoUrl}
                    alt="Documento de entrega"
                    className={collapsible.proofImg}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  request,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
  linkedOffer,
  onOpenOfferModal,
}) => {
  if (contentOnly) {
    return <GeneralInfoContent request={request} linkedOffer={linkedOffer} onOpenOfferModal={onOpenOfferModal} />;
  }
  return (
    <CollapsibleSection title="Información General" expanded={expanded} onToggle={onToggle}>
      <GeneralInfoContent request={request} linkedOffer={linkedOffer} onOpenOfferModal={onOpenOfferModal} />
    </CollapsibleSection>
  );
};
