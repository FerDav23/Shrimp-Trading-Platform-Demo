import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { collapsible, settlementTable, saleRequestDetail } from '../../../styles';
import { CATCH_SETTLEMENT_CLASSES } from '../../../types';
import type { CatchSettlement, Offer } from '../../../types';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import { LB_TO_KG } from './constants';

type SettlementInput = CatchSettlement & {
  lineItems?: Array<{ id: string; class: string; sizeOrDesc: string; pounds: number; unitPrice: number }>;
};

interface SettlementReadOnlySectionProps {
  settlement: SettlementInput;
  remitidasLb: number;
  /** Peso de la pesca recibida en lb (LogisticsTrackingSection); usado como Recibidas referencial cuando existe */
  receivedCatchWeightLb?: number | null;
  /** Oferta vinculada: define la unidad (kg/lb) usada en la liquidación */
  linkedOffer?: Offer | null;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
}

export const SettlementReadOnlySection: React.FC<SettlementReadOnlySectionProps> = ({
  settlement,
  remitidasLb,
  receivedCatchWeightLb = null,
  linkedOffer = null,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
}) => {
  const priceUnit = linkedOffer?.priceUnit ?? 'PER_LB';
  const isKg = priceUnit === 'PER_KG';
  const unitLabel = isKg ? 'kg' : 'lb';
  const toDisplay = (lb: number) => (isKg ? lb * LB_TO_KG : lb);

  const s = normalizeSettlement(settlement);
  const allLines = [...s.colaDirectaALines, ...s.colaDirectaBLines, ...s.ventaLocalLines];
  const totalValor = allLines.reduce((sum, l) => sum + l.pounds * l.unitPrice, 0);
  /** Igual al peso de la pesca recibida (LogisticsTrackingSection) cuando existe; si no, remitidas - basura */
  const recibidasReferencialLb =
    receivedCatchWeightLb != null
      ? receivedCatchWeightLb
      : Math.max(0, remitidasLb - s.basuraColaDirectaLb);
  const procesadasRealesLb = allLines.reduce((sum, l) => sum + l.pounds, 0);
  const rendimientoPct = recibidasReferencialLb > 0 ? (procesadasRealesLb / recibidasReferencialLb) * 100 : 0;
  const mermaPct = 100 - rendimientoPct;

  const content = (
    <div className={collapsible.content}>
        <div className={`${saleRequestDetail.sectionCard} ${saleRequestDetail.innerBoxSpaceY}`}>
          <div>
            <h4 className={saleRequestDetail.subsectionSmall}>Datos del ingreso</h4>
            <div className={saleRequestDetail.gridSettlementReadOnly}>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Fecha ing.">
                <span>{s.entryDate}</span>
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="No. Lote">
                <span>{s.lotNumber || '—'}</span>
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Rem. guide">
                <span>{s.remissionGuide || '—'}</span>
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Piscina">
                <span>{s.pond || '—'}</span>
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Aguaje">
                <span>{s.aguaje || '—'}</span>
              </FormRow>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className={saleRequestDetail.subsectionSmallPlain}>Detail by class and size</h4>
            {[
              { key: 'colaDirectaALines' as const, title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_A },
              { key: 'colaDirectaBLines' as const, title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_B },
              { key: 'ventaLocalLines' as const, title: CATCH_SETTLEMENT_CLASSES.VENTA_LOCAL },
            ].map(({ key, title }) => (
              <div key={key}>
                <div className={`${saleRequestDetail.tableGroupTitle} mb-2`}>{title}</div>
                <div className="overflow-x-auto">
                  <table className={settlementTable.table}>
                    <thead>
                      <tr className={settlementTable.thead}>
                        <th className={settlementTable.th}>Talla / Descripción</th>
                        <th className={settlementTable.th}>Peso ({unitLabel})</th>
                        <th className={settlementTable.th}>P. unit.</th>
                        <th className={settlementTable.th}>Valor total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s[key].length === 0 ? (
                        <tr>
                          <td colSpan={4} className={settlementTable.emptyCell}>
                            Sin líneas
                          </td>
                        </tr>
                      ) : (
                        s[key].map((line) => (
                          <tr key={line.id} className={settlementTable.row}>
                            <td className={settlementTable.td}>{line.sizeOrDesc || '—'}</td>
                            <td className={settlementTable.td}>{toDisplay(line.pounds).toFixed(2)}</td>
                            <td className={settlementTable.td}>{line.unitPrice}</td>
                            <td className={settlementTable.tdMedium}>
                              {(line.pounds * line.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          <div className={`${saleRequestDetail.gridSettlementFooter} ${saleRequestDetail.summaryRow}`}>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Remitidas referencial ({unitLabel}): </span>
              {toDisplay(remitidasLb).toFixed(2)}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Basura cola directa ({unitLabel}): </span>
              {toDisplay(s.basuraColaDirectaLb).toFixed(2)}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Recibidas referencial ({unitLabel}): </span>
              {toDisplay(recibidasReferencialLb).toFixed(2)}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Procesadas reales ({unitLabel}): </span>
              {toDisplay(procesadasRealesLb).toFixed(2)}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Total valor: </span>$ {totalValor.toFixed(2)}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Rendimiento: </span>
              {rendimientoPct.toFixed(2)}%
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Merma: </span>
              {mermaPct.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
  );
  if (contentOnly) return content;
  return (
    <CollapsibleSection title="Catch settlement" expanded={expanded} onToggle={onToggle}>
      {content}
    </CollapsibleSection>
  );
};
