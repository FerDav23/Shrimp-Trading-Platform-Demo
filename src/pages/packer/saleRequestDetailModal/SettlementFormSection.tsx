import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { collapsible, form, settlementTable, button, saleRequestDetail } from '../../../styles';
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
      <div className={collapsible.content}>
        <div className={`${collapsible.innerBox} ${saleRequestDetail.innerBoxSpaceY}`}>
          <div className={saleRequestDetail.flexEnd}>
            {isSettlementLocked ? (
              <button
                type="button"
                onClick={() => onSettlementLockedChange(false)}
                className={button.skySmall}
              >
                Editar liquidación
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSettlementLockedChange(true)}
                className={button.skySmall}
              >
                Guardar
              </button>
            )}
          </div>

          <div>
            <h4 className={saleRequestDetail.subsectionSmall}>Datos del ingreso</h4>
            <div className={saleRequestDetail.gridSettlement}>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Fecha ing.">
                <input
                  type="date"
                  value={settlement.entryDate}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, entryDate: e.target.value }))}
                  readOnly={isSettlementLocked}
                  className={`${form.inputEditable} ${isSettlementLocked ? saleRequestDetail.inputLocked : ''}`}
                />
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="No. Lote">
                <input
                  type="text"
                  value={settlement.lotNumber}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, lotNumber: e.target.value }))}
                  placeholder="Ej. FC218233"
                  readOnly={isSettlementLocked}
                  className={`${form.inputEditable} ${isSettlementLocked ? saleRequestDetail.inputLocked : ''}`}
                />
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Guía rem.">
                <input
                  type="text"
                  value={settlement.remissionGuide}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, remissionGuide: e.target.value }))}
                  placeholder="Ej. 484-483"
                  readOnly={isSettlementLocked}
                  className={`${form.inputEditable} ${isSettlementLocked ? saleRequestDetail.inputLocked : ''}`}
                />
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Piscina">
                <input
                  type="text"
                  value={settlement.pond}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, pond: e.target.value }))}
                  placeholder="Ej. 2"
                  readOnly={isSettlementLocked}
                  className={`${form.inputEditable} ${isSettlementLocked ? saleRequestDetail.inputLocked : ''}`}
                />
              </FormRow>
              <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Aguaje">
                <input
                  type="text"
                  value={settlement.aguaje}
                  onChange={(e) => onSettlementChange((s) => ({ ...s, aguaje: e.target.value }))}
                  placeholder="Ej. 2024-14"
                  readOnly={isSettlementLocked}
                  className={`${form.inputEditable} ${isSettlementLocked ? saleRequestDetail.inputLocked : ''}`}
                />
              </FormRow>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className={saleRequestDetail.subsectionSmallPlain}>Detalle por clase y talla</h4>
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
                  <div className={saleRequestDetail.tableGroupHeader}>
                    <span className={saleRequestDetail.tableGroupTitle}>{title}</span>
                    {!isSettlementLocked && (
                      <button
                        type="button"
                        onClick={addLine}
                        className={settlementTable.addLineBtn}
                      >
                        + Agregar línea
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className={settlementTable.tableOverflow}>
                      <thead>
                        <tr className={settlementTable.thead}>
                          <th className={settlementTable.th}>Talla / Descripción</th>
                          <th className={settlementTable.th}>Libras</th>
                          <th className={settlementTable.th}>P. unit.</th>
                          <th className={settlementTable.th}>Valor total</th>
                            {!isSettlementLocked && <th className={settlementTable.thActions} />}
                        </tr>
                      </thead>
                      <tbody>
                        {lines.length === 0 ? (
                          <tr>
                            <td
                              colSpan={isSettlementLocked ? 4 : 5}
                              className={settlementTable.emptyCell}
                            >
                              Sin líneas
                            </td>
                          </tr>
                        ) : (
                          lines.map((line) => (
                            <tr key={line.id} className={settlementTable.row}>
                              <td className={settlementTable.td}>
                                {isSettlementLocked ? (
                                  <span className={saleRequestDetail.fieldValueText}>{line.sizeOrDesc || '—'}</span>
                                ) : (
                                  <input
                                    type="text"
                                    value={line.sizeOrDesc}
                                    onChange={(e) => updateLine(line.id, 'sizeOrDesc', e.target.value)}
                                    placeholder="31-35, Quebrado..."
                                    className={form.inputTableCell}
                                  />
                                )}
                              </td>
                              <td className={settlementTable.td}>
                                {isSettlementLocked ? (
                                  <span className={saleRequestDetail.fieldValueText}>{line.pounds}</span>
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
                                    className={form.inputSmallGray}
                                  />
                                )}
                              </td>
                              <td className={settlementTable.td}>
                                {isSettlementLocked ? (
                                  <span className={saleRequestDetail.fieldValueText}>{line.unitPrice}</span>
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
                                    className={form.inputSmallGray}
                                  />
                                )}
                              </td>
                              <td className={settlementTable.tdMedium}>
                                {(line.pounds * line.unitPrice).toFixed(2)}
                              </td>
                              {!isSettlementLocked && (
                                <td className={settlementTable.td}>
                                  <button
                                    type="button"
                                    onClick={() => removeLine(line.id)}
                                    className={settlementTable.removeBtn}
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

          <div className={saleRequestDetail.gridSettlementFooter}>
            <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Remitidas referencial (lb)">
              <input
                type="text"
                readOnly
                value={remitidasLb}
                className={form.inputReadonlyGray}
              />
            </FormRow>
            <FormRow labelClassName={saleRequestDetail.formRowLabel} label="Basura cola directa (lb)">
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
                className={`${form.inputEditable} ${isSettlementLocked ? saleRequestDetail.inputLocked : ''}`}
              />
            </FormRow>
            <div className={saleRequestDetail.summaryRow}>
              <span className={saleRequestDetail.summaryLabel}>Recibidas referencial (lb): </span>
              <span className={saleRequestDetail.summaryValue}>{recibidasReferencial.toFixed(2)}</span>
            </div>
            <div className={saleRequestDetail.summaryRow}>
              <span className={saleRequestDetail.summaryLabel}>Procesadas reales (lb): </span>
              <span className={saleRequestDetail.summaryValue}>{procesadasReales.toFixed(2)}</span>
            </div>
            <div className={saleRequestDetail.summaryRow}>
              <span className={saleRequestDetail.summaryLabel}>Total valor: </span>
              <span className={saleRequestDetail.summaryValue}>$ {totalValor.toFixed(2)}</span>
            </div>
            <div className={saleRequestDetail.summaryRow}>
              <span className={saleRequestDetail.summaryLabel}>Rendimiento: </span>
              <span className={saleRequestDetail.summaryValue}>{rendimientoPct.toFixed(2)}%</span>
            </div>
            <div className={saleRequestDetail.summaryRow}>
              <span className={saleRequestDetail.summaryLabel}>Merma: </span>
              <span className={saleRequestDetail.summaryValue}>{mermaPct.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
