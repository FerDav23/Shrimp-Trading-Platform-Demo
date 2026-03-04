import React, { RefObject } from 'react';
import type { SaleRequest, LogisticsTrackingStatus } from '../../../types';
import { isLogisticsTrackingStatus } from '../../../types';
import { collapsible, button, form, saleRequestDetail, logisticsTracking } from '../../../styles';
import { FormRow } from '../../../components/FormRow';

type LogisticsDisplayStatus = 'PENDING_PICKUP' | 'PENDING_DELIVERY' | 'PICKED_UP';

const LOGISTICS_STATUS_CONFIG: Record<
  LogisticsDisplayStatus,
  { title: string; subtitle: string; icon: React.ReactNode; cardClass: string }
> = {
  PENDING_PICKUP: {
    title: 'Pendiente de recoger',
    subtitle: 'A la espera de que logística recoja la pesca',
    icon: (
      <svg className={logisticsTracking.iconPendingPickup} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    cardClass: logisticsTracking.statusCardPendingPickup,
  },
  PENDING_DELIVERY: {
    title: 'Pesca pendiente de entregar',
    subtitle: 'Logística en camino',
    icon: (
      <svg className={logisticsTracking.iconPendingDelivery} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    cardClass: logisticsTracking.statusCardPendingDelivery,
  },
  PICKED_UP: {
    title: 'Pesca pendiente de aceptar',
    subtitle: 'El camión llegó a planta. Registre la recepción: peso, documento y términos.',
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
  truckWeightLb: string;
  onTruckWeightLbChange: (value: string) => void;
  documentFile: File | null;
  onDocumentFileChange: (file: File | null) => void;
  documentPreviewUrl: string | null;
  documentInputRef: RefObject<HTMLInputElement>;
  termsAccepted: boolean;
  onTermsAcceptedChange: (value: boolean) => void;
  onConfirmDelivery?: () => void;
}

const TERMS_TEXT = `Al confirmar la recepción de la carga, declaro que:
• El peso del camión registrado corresponde al vehículo que entregó la pesca.
• He verificado el estado de la mercadería al momento de la recepción.
• Acepto los términos de recepción establecidos en el contrato de compra.`;

export const LogisticsTrackingSection: React.FC<LogisticsTrackingSectionProps> = ({
  request,
  contentOnly = false,
  truckWeightLb,
  onTruckWeightLbChange,
  documentFile,
  onDocumentFileChange,
  documentPreviewUrl,
  documentInputRef,
  termsAccepted,
  onTermsAcceptedChange,
  onConfirmDelivery,
}) => {
  const status = (isLogisticsTrackingStatus(request.status) ? request.status : 'PENDING_PICKUP') as LogisticsTrackingStatus;
  const displayStatus: LogisticsDisplayStatus = status === 'DELIVERED' ? 'PICKED_UP' : status;
  const config = LOGISTICS_STATUS_CONFIG[displayStatus];
  const isPickedUp = status === 'PICKED_UP';

  const showReceptionForm = isPickedUp;

  const canConfirm =
    showReceptionForm &&
    truckWeightLb &&
    Number(truckWeightLb) > 0 &&
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
      {/* Stepper: tres estados en la misma vista */}
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
            <h4 className={collapsible.subsectionTitle}>Registro de recepción de carga</h4>

            <FormRow
              labelClassName={collapsible.fieldLabel}
              className="mb-4 mt-3"
              label="Peso del camión (lb)"
            >
              <input
                type="number"
                min={1}
                value={truckWeightLb}
                onChange={(e) => onTruckWeightLbChange(e.target.value)}
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
                    Subir documento
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
                  Confirmar recepción de carga
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
