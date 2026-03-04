import React from 'react';
import type { SaleRequest, Offer } from '../../../types';
import { CollapsibleSection } from './CollapsibleSection';
import { collapsible, saleRequestDetail } from '../../../styles';
import { DUMMY_ADVANCE_PROOF_IMAGE, COMMISSION_PER_LB, COMMISSION_PER_KG, LB_TO_KG } from './constants';

interface AdvanceReadOnlySectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
}

export const AdvanceReadOnlySection: React.FC<AdvanceReadOnlySectionProps> = ({
  request,
  linkedOffer,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
}) => {
  const estimatedQuantityLb = request.catchInfo.estimatedQuantityLb;
  const sizeRange = request.catchInfo.sizeRange;
  const activeTiers = linkedOffer?.priceTiers.filter((t) => t.isActive && t.price > 0) ?? [];
  const matchingTier = activeTiers.find(
    (t) => t.sizeMin === sizeRange.min && t.sizeMax === sizeRange.max
  );
  
  const advanceTerm = linkedOffer?.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const advancePercent = advanceTerm?.percent ?? 0;
  const priceUnit = linkedOffer?.priceUnit ?? 'PER_LB';
  const estimatedLotWeight =
    priceUnit === 'PER_KG' ? estimatedQuantityLb * LB_TO_KG : estimatedQuantityLb;
  const lotWeight = request.logisticsDelivery?.catchWeight ?? estimatedLotWeight;
  const commissionAmount =
    priceUnit === 'PER_KG' ? lotWeight * COMMISSION_PER_KG * (advancePercent / 100) : lotWeight * COMMISSION_PER_LB * (advancePercent / 100);
  const unitLabel = priceUnit === 'PER_KG' ? 'kg' : 'lb';
  
  /** Peso de la pesca: igual al peso de la pesca recibida (LogisticsTrackingSection) cuando existe */
  
  const unitPriceTalla = matchingTier ? matchingTier.price : 0;
  const commissionUnitRate = priceUnit === 'PER_KG' ? COMMISSION_PER_KG : COMMISSION_PER_LB;
  const totalValor = matchingTier ? matchingTier.price * lotWeight : 0;
  const advanceAmount = (advancePercent / 100) * totalValor;
  const totalToPay = advanceAmount + commissionAmount;

  const content = (
      <div className={collapsible.content}>
        <div className={saleRequestDetail.sectionCard}>
          <div className="space-y-4">
            <h4 className={collapsible.subsectionTitle}>
              Resumen del anticipo
            </h4>
            <div className={saleRequestDetail.gridFormDense}>
              <div>
                <p className={collapsible.fieldLabel}>Beneficiario (productor)</p>
                <p className={saleRequestDetail.fieldValue}>{request.producerName}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Talla seleccionada</p>
                <p className={saleRequestDetail.fieldValueText}>
                  {sizeRange.min}/{sizeRange.max}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Peso de la pesca</p>
                <p className={saleRequestDetail.fieldValueSemibold}>
                  {lotWeight.toFixed(2)} {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor unitario de la talla</p>
                <p className={saleRequestDetail.fieldValueSemibold}>
                  $ {unitPriceTalla.toFixed(2)} / {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor unitario de comisión</p>
                <p className={saleRequestDetail.fieldValueText}>
                  $ {commissionUnitRate.toFixed(3)} / {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor total estimado</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalValor.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Porcentaje de anticipo (oferta)</p>
                <p className="text-gray-900 tabular-nums">{advancePercent}%</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Monto del anticipo estimado</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {advanceAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Pago de comisión</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {commissionAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor final cancelado</p>
                <p className={saleRequestDetail.amountHighlight}>$ {totalToPay.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className={collapsible.subsectionTitle}>
              Comprobante de anticipo (ejemplo)
            </h4>
            <div className={collapsible.proofImage}>
              <img
                src={DUMMY_ADVANCE_PROOF_IMAGE}
                alt="Comprobante de anticipo (ejemplo)"
                className={collapsible.proofImgSm}
              />
            </div>
          </div>
        </div>
      </div>
  );

  if (contentOnly) return content;
  return (
    <CollapsibleSection title="Anticipo pagado" expanded={expanded} onToggle={onToggle}>
      {content}
    </CollapsibleSection>
  );
};

