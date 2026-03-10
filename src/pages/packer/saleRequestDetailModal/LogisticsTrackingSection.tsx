import React, { RefObject } from 'react';
import type { SaleRequest, LogisticsTrackingStatus, PriceUnit } from '../../../types';
import { isLogisticsTrackingStatus } from '../../../types';
import { collapsible, button, form, saleRequestDetail, logisticsTracking } from '../../../styles';
import { FormRow } from '../../../components/FormRow';

type LogisticsDisplayStatus = 'PENDING_PICKUP' | 'PENDING_DELIVERY' | 'PICKED_UP';

const LOGISTICS_STATUS_CONFIG: Record<
  LogisticsDisplayStatus,
  { title: string; subtitle: string; icon: React.ReactNode; cardClass: string }
> = {
  PENDING_PICKUP: {
    title: 'Pending pickup',
    subtitle: 'Waiting for logistics to pick up the catch',
    icon: (
      <svg className={logisticsTracking.iconPendingPickup} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    cardClass: logisticsTracking.statusCardPendingPickup,
  },
  PENDING_DELIVERY: {
    title: 'Catch pending delivery',
    subtitle: 'Logistics on the way',
    icon: (
      <svg className={logisticsTracking.iconPendingDelivery} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    cardClass: logisticsTracking.statusCardPendingDelivery,
  },
  PICKED_UP: {
    title: 'Catch pending acceptance',
    subtitle: 'Truck arrived at plant. Record reception: weight, document and terms.',
    icon: (
      <svg className={logisticsTracking.iconPickedUp} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    cardClass: logisticsTracking.statusCardPickedUp,
  },
};

interface LogisticsTrackingSectionProps {
  request: SaleRequest;
  contentOnly?: boolean;
  catchWeight: string;
  onCatchWeightChange: (value: string) => void;
  /** Unidad de precio de la oferta vinculada (PER_LB o PER_KG) para alinear la unidad del peso del camión */
  linkedOfferPriceUnit?: PriceUnit;
  documentFile: File | null;
  onDocumentFileChange: (file: File | null) => void;
  documentPreviewUrl: string | null;
  documentInputRef: RefObject<HTMLInputElement>;
  termsAccepted: boolean;
  onTermsAcceptedChange: (value: boolean) => void;
  onConfirmDelivery?: () => void;
}

const TERMS_TEXT = `By confirming receipt of the cargo, I declare that:
• The registered truck weight corresponds to the vehicle that delivered the catch.
• I have verified the condition of the goods at the time of receipt.
• I accept the receipt terms set out in the purchase contract.`;

export const LogisticsTrackingSection: React.FC<LogisticsTrackingSectionProps> = ({
  request,
  contentOnly = false,
  catchWeight,
  onCatchWeightChange,
  linkedOfferPriceUnit,
  documentFile,
  onDocumentFileChange,
  documentPreviewUrl,
  documentInputRef,
  termsAccepted,
  onTermsAcceptedChange,
  onConfirmDelivery,
}) => {
  const isLogisticsStatus = isLogisticsTrackingStatus(request.status);
  const weightUnitLabel = linkedOfferPriceUnit === 'PER_KG' ? 'kg' : 'lb';

  // Cuando ya estamos en estados posteriores (liquidación, anticipo, saldo, venta finalizada),
  // solo se debe mostrar la pesca aceptada como registro (peso, documento, términos).
  if (!isLogisticsStatus) {
    const delivery = request.logisticsDelivery;

    const readOnlyContent = (
      <div className={collapsible.content}>
        {/* Stepper con los 3 pasos completados */}
        <div className={logisticsTracking.stepper}>
          {(['PENDING_PICKUP', 'PENDING_DELIVERY', 'PICKED_UP'] as LogisticsDisplayStatus[]).map((key, idx) => {
            const label =
              key === 'PENDING_PICKUP'
                ? 'Pending pickup'
                : key === 'PENDING_DELIVERY'
                  ? 'Catch pending delivery'
                  : 'Catch pending acceptance';
            return (
              <React.Fragment key={key}>
                <div className={logisticsTracking.stepWrapper}>
                  <div
                    className={`${logisticsTracking.stepCircle} ${logisticsTracking.stepCirclePast}`}
                  >
                    <svg className={logisticsTracking.stepCheckIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    className={`${logisticsTracking.stepLabel} ${logisticsTracking.stepLabelPast}`}
                  >
                    {label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`${logisticsTracking.stepConnector} ${logisticsTracking.stepConnectorPast}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className={saleRequestDetail.sectionCard}>
          <h4 className={collapsible.subsectionTitle}>Cargo reception record</h4>
          {delivery ? (
            <>
              <div className={saleRequestDetail.sectionGridTwoCols}>
                <div>
                  <p className={saleRequestDetail.sectionLabelSm}>
                    Received catch weight ({weightUnitLabel})
                  </p>
                  <p className={saleRequestDetail.sectionValueSm}>
                    {delivery.catchWeight.toLocaleString('es-EC')}
                  </p>
                </div>
                <div>
                  <p className={saleRequestDetail.sectionLabelSm}>Acceptance date</p>
                  <p className={saleRequestDetail.sectionValueSm}>
                    {delivery.termsAcceptedAt
                      ? new Date(delivery.termsAcceptedAt).toLocaleString('en-US')
                      : 'Accepted'}
                  </p>
                </div>
              </div>

              {delivery.documentPhotoUrl && (
                <div className="mt-3">
                  <p className={saleRequestDetail.sectionLabelSm}>Documento de entrega</p>
                  <div className={collapsible.proofImageLg}>
                    <img
                      src={delivery.documentPhotoUrl}
                      alt="Documento de entrega"
                      className={collapsible.proofImg}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p className={saleRequestDetail.sectionLabelSm}>
                  Términos y condiciones aceptados
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Aceptados
                  </span>
                </p>
                <div className={logisticsTracking.termsBox}>
                  <div className={logisticsTracking.termsText}>{TERMS_TEXT}</div>
                </div>
              </div>

              <p className={`${saleRequestDetail.sectionValueSm} mt-3`}>
                La recepción de carga se registró al aceptar la pesca. Esta información es solo de referencia.
              </p>
            </>
          ) : (
            <p className={saleRequestDetail.sectionValueSm}>
              Aún no se ha registrado la recepción de carga. No se puede avanzar en el flujo sin aceptar la pesca.
            </p>
          )}
        </div>
      </div>
    );

    if (contentOnly) return readOnlyContent;

    return (
      <section className={collapsible.sectionDefault}>
        <div className={collapsible.buttonDefault}>
          <h3 className={collapsible.title}>Tracking logístico</h3>
        </div>
        {readOnlyContent}
      </section>
    );
  }

  const status = request.status as LogisticsTrackingStatus;
  const displayStatus: LogisticsDisplayStatus = status === 'DELIVERED' ? 'PICKED_UP' : status;
  const config = LOGISTICS_STATUS_CONFIG[displayStatus];
  const isPickedUp = status === 'PICKED_UP';

  const showReceptionForm = isPickedUp;

  const canConfirm =
    showReceptionForm &&
    catchWeight &&
    Number(catchWeight) > 0 &&
    documentFile &&
    termsAccepted;

  const statusSteps: { key: LogisticsDisplayStatus; label: string }[] = [
    { key: 'PENDING_PICKUP', label: 'Pendiente de recoger' },
    { key: 'PENDING_DELIVERY', label: 'Pesca pendiente de entregar' },
    { key: 'PICKED_UP', label: 'Pesca pendiente de aceptar' },
  ];

  const currentStepIndex = status === 'DELIVERED' ? 2 : statusSteps.findIndex((s) => s.key === status);

  const content = (
    <div className={collapsible.content}>
      {/* Stepper: tres estados en la misma vista (solo mientras la logística está en curso) */}
      <div className={logisticsTracking.stepper}>
        {statusSteps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;
          return (
            <React.Fragment key={step.key}>
              <div className={logisticsTracking.stepWrapper}>
                <div
                  className={`${logisticsTracking.stepCircle} ${
                    isActive
                      ? logisticsTracking.stepCircleActive
                      : isPast
                        ? logisticsTracking.stepCirclePast
                        : logisticsTracking.stepCirclePending
                  }`}
                >
                  {isPast ? (
                    <svg className={logisticsTracking.stepCheckIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`${logisticsTracking.stepLabel} ${
                    isActive ? logisticsTracking.stepLabelActive : isPast ? logisticsTracking.stepLabelPast : logisticsTracking.stepLabelPending
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < statusSteps.length - 1 && (
                <div
                  className={`${logisticsTracking.stepConnector} ${
                    isPast ? logisticsTracking.stepConnectorPast : logisticsTracking.stepConnectorPending
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Card del estado actual (PENDING_PICKUP, PENDING_DELIVERY, PICKED_UP) */}
      {status !== 'DELIVERED' && config && (
        <div className={`${logisticsTracking.statusCard} ${config.cardClass}`}>
          <div className={logisticsTracking.statusCardInner}>
            <div className={logisticsTracking.statusCardIconWrap}>{config.icon}</div>
            <div className={logisticsTracking.statusCardBody}>
              <h4 className={logisticsTracking.statusCardTitle}>{config.title}</h4>
              <p className={logisticsTracking.statusCardSubtitle}>{config.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario para Pesca pendiente de aceptar (recibir en planta) */}
      {showReceptionForm && (
        <div className={logisticsTracking.receptionForm}>
          <div className={saleRequestDetail.sectionCard}>
            <h4 className={collapsible.subsectionTitle}>Cargo reception record</h4>

            <FormRow
              labelClassName={collapsible.fieldLabel}
              className="mb-4 mt-3"
              label={`Received catch weight (${weightUnitLabel})`}
            >
              <input
                type="number"
                min={1}
                value={catchWeight}
                onChange={(e) => onCatchWeightChange(e.target.value)}
                className={`${form.input} ${logisticsTracking.inputTruckWeight}`}
                placeholder="Ej: 8500"
              />
            </FormRow>

            <div className={logisticsTracking.documentSection}>
              <h5 className={collapsible.fieldLabelMb1}>Foto del documento de entrega</h5>
              <input
                ref={documentInputRef}
                type="file"
                accept="image/*"
                className={logisticsTracking.fileInputHidden}
                aria-hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith('image/')) onDocumentFileChange(file);
                  e.target.value = '';
                }}
              />
              <div className={logisticsTracking.documentUploadRow}>
                <div className={logisticsTracking.documentButtonsRow}>
                  <button
                    type="button"
                    onClick={() => requestAnimationFrame(() => documentInputRef.current?.click())}
                    className={button.skyUpload}
                  >
                    <svg
                      className={saleRequestDetail.iconMd}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload document
                  </button>
                  {documentFile && (
                    <>
                      <span className={saleRequestDetail.fileName}>{documentFile.name}</span>
                      <button
                        type="button"
                        onClick={() => onDocumentFileChange(null)}
                        className={button.linkRemove}
                      >
                        Quitar
                      </button>
                    </>
                  )}
                </div>
                {documentPreviewUrl && (
                  <div className={collapsible.proofImageLg}>
                    <img
                      src={documentPreviewUrl}
                      alt="Vista previa del documento"
                      className={collapsible.proofImg}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={logisticsTracking.termsBox}>
              <label className={logisticsTracking.termsLabel}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => onTermsAcceptedChange(e.target.checked)}
                  className={logisticsTracking.termsCheckbox}
                />
                <span className={logisticsTracking.termsText}>{TERMS_TEXT}</span>
              </label>
            </div>

            {onConfirmDelivery && (
              <div className={logisticsTracking.confirmButtonWrap}>
                <button
                  type="button"
                  onClick={onConfirmDelivery}
                  disabled={!canConfirm}
                  className={button.skyPrimary}
                >
                  Confirm cargo reception
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );

  if (contentOnly) return content;

  return (
    <section className={collapsible.sectionDefault}>
      <div className={collapsible.buttonDefault}>
        <h3 className={collapsible.title}>Tracking logístico</h3>
      </div>
      {content}
    </section>
  );
};
