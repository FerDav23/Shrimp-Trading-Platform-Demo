import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { CATCH_SETTLEMENT_CLASSES } from '../../../types';
import type { CatchSettlement, CatchSettlementLine } from '../../../types';
import { createEmptyLine } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import type { SaleRequest } from '../../../types';

type SettlementKey = 'colaDirectaALines' | 'colaDirectaBLines' | 'ventaLocalLines';

interface SettlementFormSectionProps {
  request: SaleRequest;
  settlement: CatchSettlement;
  onSettlementChange: (s: CatchSettlement | ((prev: CatchSettlement) => CatchSettlement)) => void;
  isSettlementLocked: boolean;
  onSettlementLockedChange: (locked: boolean) => void;
  expanded: boolean;
  onToggle: () => void;
}

export const SettlementFormSection: React.FC<SettlementFormSectionProps> = ({
  request,
  settlement,
  onSettlementChange,
  isSettlementLocked,
  onSettlementLockedChange,
  expanded,
  onToggle,
}) => {
  const tableGroups: { key: SettlementKey; title: string }[] = [
    { key: 'colaDirectaALines', title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_A },
    { key: 'colaDirectaBLines', title: CATCH_SETTLEMENT_CLASSES.COLA_DIRECTA_B },
    { key: 'ventaLocalLines', title: CATCH_SETTLEMENT_CLASSES.VENTA_LOCAL },
  ];

  const remitidasLb = request.catchInfo.estimatedQuantityLb;
  const recibidasReferencial = Math.max(0, remitidasLb - settlement.basuraColaDirectaLb);
  const allLines = [
    ...settlement.colaDirectaALines,
    ...settlement.colaDirectaBLines,
    ...settlement.ventaLocalLines,
  ];
  const procesadasReales = allLines.reduce((sum, l) => sum + l.pounds, 0);
  const totalValor = allLines.reduce((sum, l) => sum + l.pounds * l.unitPrice, 0);
  const rendimientoPct = recibidasReferencial > 0 ? (procesadasReales / recibidasReferencial) * 100 : 0;
  const mermaPct = 100 - rendimientoPct;

  return (
    <CollapsibleSection title="Liquidación de pesca" expanded={expanded} onToggle={onToggle}>
      <div className="px-6 pb-6">
        <div className="bg-white border border-sky-200 rounded-lg p-4 space-y-6">
          <div className="flex justify-end">
            {isSettlementLocked ? (
              <button
                type="button"
                onClick={() => onSettlementLockedChange(false)}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium text-sm transition-colors"
              >
                Editar liquidación
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSettlementLockedChange(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium text-sm transition-colors"
              >
                Guardar
              </button>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del ingreso</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha ing.">
                <input
                  type="date"
                  value={settlement.entryDate}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, entryDate: e.target.value }))}
                  readOnly={isSettlementLocked}
                  className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="No. Lote">
                <input
                  type="text"
                  value={settlement.lotNumber}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, lotNumber: e.target.value }))}
                  placeholder="Ej. FC218233"
                  readOnly={isSettlementLocked}
                  className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Guía rem.">
                <input
                  type="text"
                  value={settlement.remissionGuide}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, remissionGuide: e.target.value }))}
                  placeholder="Ej. 484-483"
                  readOnly={isSettlementLocked}
                  className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Piscina">
                <input
                  type="text"
                  value={settlement.pond}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, pond: e.target.value }))}
                  placeholder="Ej. 2"
                  readOnly={isSettlementLocked}
                  className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormRow>
              <FormRow labelClassName="text-sm font-medium text-gray-700" label="Aguaje">
                <input
                  type="text"
                  value={settlement.aguaje}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, aguaje: e.target.value }))}
                  placeholder="Ej. 2024-14"
                  readOnly={isSettlementLocked}
                  className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormRow>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-gray-700">Detalle por clase y talla</h4>
            {tableGroups.map(({ key, title }) => {
              const lines = settlement[key];
              const updateLine = (lineId: string, field: keyof CatchSettlementLine, value: string | number) => {
                onSettlementChange((s) => ({
                  ...s,
                  [key]: s[key].map((l) =>
                    l.id === lineId ? { ...l, [field]: value } : l
                  ),
                }));
              };
              const addLine = () => {
                onSettlementChange((s) => ({ ...s, [key]: [...s[key], createEmptyLine()] }));
              };
              const removeLine = (lineId: string) => {
                onSettlementChange((s) => ({
                  ...s,
                  [key]: s[key].filter((l) => l.id !== lineId),
                }));
              };
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{title}</span>
                    {!isSettlementLocked && (
                      <button
                        type="button"
                        onClick={addLine}
                        className="text-xs px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700"
                      >
                        + Agregar línea
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="px-2 py-2 font-medium text-gray-700">Talla / Descripción</th>
                          <th className="px-2 py-2 font-medium text-gray-700">Libras</th>
                          <th className="px-2 py-2 font-medium text-gray-700">P. unit.</th>
                          <th className="px-2 py-2 font-medium text-gray-700">Valor total</th>
                          {!isSettlementLocked && <th className="w-10" />}
                        </tr>
                      </thead>
                      <tbody>
                        {lines.length === 0 ? (
                          <tr>
                            <td
                              colSpan={isSettlementLocked ? 4 : 5}
                              className="px-2 py-3 text-center text-gray-500"
                            >
                              Sin líneas
                            </td>
                          </tr>
                        ) : (
                          lines.map((line) => (
                            <tr key={line.id} className="border-t border-gray-100">
                              <td className="px-2 py-1.5">
                                {isSettlementLocked ? (
                                  <span className="text-gray-900">{line.sizeOrDesc || '—'}</span>
                                ) : (
                                  <input
                                    type="text"
                                    value={line.sizeOrDesc}
                                    onChange={(e) => updateLine(line.id, 'sizeOrDesc', e.target.value)}
                                    placeholder="31-35, Quebrado..."
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                  />
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                {isSettlementLocked ? (
                                  <span className="text-gray-900">{line.pounds}</span>
                                ) : (
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={line.pounds || ''}
                                    onChange={(e) => {
                                      const v = parseFloat(e.target.value);
                                      updateLine(line.id, 'pounds', Number.isNaN(v) ? 0 : v);
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                  />
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                {isSettlementLocked ? (
                                  <span className="text-gray-900">{line.unitPrice}</span>
                                ) : (
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={line.unitPrice || ''}
                                    onChange={(e) => {
                                      const v = parseFloat(e.target.value);
                                      updateLine(line.id, 'unitPrice', Number.isNaN(v) ? 0 : v);
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                  />
                                )}
                              </td>
                              <td className="px-2 py-1.5 font-medium text-gray-800">
                                {(line.pounds * line.unitPrice).toFixed(2)}
                              </td>
                              {!isSettlementLocked && (
                                <td className="px-2 py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => removeLine(line.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    aria-label="Quitar línea"
                                  >
                                    ×
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-sky-200">
            <FormRow labelClassName="text-sm font-medium text-gray-700" label="Remitidas referencial (lb)">
              <input
                type="text"
                readOnly
                value={remitidasLb}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-100 text-gray-700"
              />
            </FormRow>
            <FormRow labelClassName="text-sm font-medium text-gray-700" label="Basura cola directa (lb)">
              <input
                type="number"
                min={0}
                step={0.01}
                value={settlement.basuraColaDirectaLb || ''}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onSettlementChange((s) => ({ ...s, basuraColaDirectaLb: Number.isNaN(v) ? 0 : v }));
                }}
                readOnly={isSettlementLocked}
                className={`w-full px-2 py-1.5 border border-gray-300 rounded text-sm ${isSettlementLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </FormRow>
            <div className="text-sm text-gray-900">
              <span className="font-medium text-gray-700">Recibidas referencial (lb): </span>
              <span className="font-medium">{recibidasReferencial.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium text-gray-700">Procesadas reales (lb): </span>
              <span className="font-medium">{procesadasReales.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium text-gray-700">Total valor: </span>
              <span className="font-medium">$ {totalValor.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium text-gray-700">Rendimiento: </span>
              <span className="font-medium">{rendimientoPct.toFixed(2)}%</span>
            </div>
            <div className="text-sm text-gray-900">
              <span className="font-medium text-gray-700">Merma: </span>
              <span className="font-medium">{mermaPct.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
