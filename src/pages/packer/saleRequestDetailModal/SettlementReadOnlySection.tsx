import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { collapsible, settlementTable, saleRequestDetail } from '../../../styles';
import { CATCH_SETTLEMENT_CLASSES } from '../../../types';
import type { CatchSettlement } from '../../../types';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';

type SettlementInput = CatchSettlement & {
  lineItems?: Array<{ id: string; class: string; sizeOrDesc: string; pounds: number; unitPrice: number }>;
};

interface SettlementReadOnlySectionProps {
  settlement: SettlementInput;
  remitidasLb: number;
  expanded: boolean;
  onToggle: () => void;
}

export const SettlementReadOnlySection: React.FC<SettlementReadOnlySectionProps> = ({
  settlement,
  remitidasLb,
  expanded,
  onToggle,
}) => {
  const s = normalizeSettlement(settlement);
  const allLines = [...s.colaDirectaALines, ...s.colaDirectaBLines, ...s.ventaLocalLines];
  const totalValor = allLines.reduce((sum, l) => sum + l.pounds * l.unitPrice, 0);
  const recibidasReferencial = Math.max(0, remitidasLb - s.basuraColaDirectaLb);
  const procesadasReales = allLines.reduce((sum, l) => sum + l.pounds, 0);
  const rendimientoPct = recibidasReferencial > 0 ? (procesadasReales / recibidasReferencial) * 100 : 0;
  const mermaPct = 100 - rendimientoPct;

  return (
    <CollapsibleSection title="Liquidación de pesca" expanded={expanded} onToggle={onToggle}>
      <div className={collapsible.content}>
        <div className={`${collapsible.innerBox} ${saleRequestDetail.innerBoxSpaceY}`}>
          <div>
            <h4 className={saleRequestDetail.subsectionSmall}>Datos del ingreso</h4>
            <div className={saleRequestDetail.gridSettlementReadOnly}>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Fecha ing.">
                <span>{s.entryDate}</span>
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="No. Lote">
                <span>{s.lotNumber || '—'}</span>
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Guía rem.">
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
            <h4 className={saleRequestDetail.subsectionSmallPlain}>Detalle por clase y talla</h4>
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
                        <th className={settlementTable.th}>Libras</th>
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
                            <td className={settlementTable.td}>{line.pounds}</td>
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
              <span className={saleRequestDetail.summaryLabel}>Remitidas referencial (lb): </span>
              {remitidasLb}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Basura cola directa (lb): </span>
              {s.basuraColaDirectaLb}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Recibidas referencial (lb): </span>
              {recibidasReferencial.toFixed(2)}
            </div>
            <div>
              <span className={saleRequestDetail.summaryLabel}>Procesadas reales (lb): </span>
              {procesadasReales.toFixed(2)}
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
    </CollapsibleSection>
  );
};
