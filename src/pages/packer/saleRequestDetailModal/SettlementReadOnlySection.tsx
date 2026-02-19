import React from 'react';
import { FormRow } from '../../../components/FormRow';
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
      <div className="px-6 pb-6">
        <div className="bg-white border border-sky-200 rounded-lg p-4 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del ingreso</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-900">
              <FormRow labelClassName="font-medium text-gray-700" label="Fecha ing.">
                <span>{s.entryDate}</span>
              </FormRow>
              <FormRow labelClassName="font-medium text-gray-700" label="No. Lote">
                <span>{s.lotNumber || '—'}</span>
              </FormRow>
              <FormRow labelClassName="font-medium text-gray-700" label="Guía rem.">
                <span>{s.remissionGuide || '—'}</span>
              </FormRow>
              <FormRow labelClassName="font-medium text-gray-700" label="Piscina">
                <span>{s.pond || '—'}</span>
              </FormRow>
              <FormRow labelClassName="font-medium text-gray-700" label="Aguaje">
                <span>{s.aguaje || '—'}</span>
              </FormRow>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Detalle por clase y talla</h4>
            {[
              { key: 'colaDirectaALines' as const, title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_A },
              { key: 'colaDirectaBLines' as const, title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_B },
              { key: 'ventaLocalLines' as const, title: CATCH_SETTLEMENT_CLASSES.VENTA_LOCAL },
            ].map(({ key, title }) => (
              <div key={key}>
                <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-2 py-2 font-medium text-gray-700">Talla / Descripción</th>
                        <th className="px-2 py-2 font-medium text-gray-700">Libras</th>
                        <th className="px-2 py-2 font-medium text-gray-700">P. unit.</th>
                        <th className="px-2 py-2 font-medium text-gray-700">Valor total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s[key].length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-2 py-3 text-center text-gray-500">
                            Sin líneas
                          </td>
                        </tr>
                      ) : (
                        s[key].map((line) => (
                          <tr key={line.id} className="border-t border-gray-100">
                            <td className="px-2 py-1.5 text-gray-900">{line.sizeOrDesc || '—'}</td>
                            <td className="px-2 py-1.5 text-gray-900">{line.pounds}</td>
                            <td className="px-2 py-1.5 text-gray-900">{line.unitPrice}</td>
                            <td className="px-2 py-1.5 font-medium text-gray-800">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-sky-200 text-sm text-gray-900">
            <div>
              <span className="font-medium text-gray-700">Remitidas referencial (lb): </span>
              {remitidasLb}
            </div>
            <div>
              <span className="font-medium text-gray-700">Basura cola directa (lb): </span>
              {s.basuraColaDirectaLb}
            </div>
            <div>
              <span className="font-medium text-gray-700">Recibidas referencial (lb): </span>
              {recibidasReferencial.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-gray-700">Procesadas reales (lb): </span>
              {procesadasReales.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-gray-700">Total valor: </span>$ {totalValor.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-gray-700">Rendimiento: </span>
              {rendimientoPct.toFixed(2)}%
            </div>
            <div>
              <span className="font-medium text-gray-700">Merma: </span>
              {mermaPct.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
