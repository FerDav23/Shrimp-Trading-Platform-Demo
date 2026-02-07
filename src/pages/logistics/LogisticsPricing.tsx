import React, { useState } from 'react';
import { dummyLogisticsPricing } from '../../data/logistics';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { Money } from '../../components/Money';
import { FormRow } from '../../components/FormRow';

export const LogisticsPricing: React.FC = () => {
  const [calculatorLb, setCalculatorLb] = useState<string>('');
  const [calculatorSector, setCalculatorSector] = useState<string>('');

  const calculateCost = () => {
    if (!calculatorLb || !calculatorSector) return 0;
    const sector = dummyLogisticsPricing.sectors.find(
      (s) => s.id === calculatorSector
    );
    if (!sector) return 0;
    return sector.fixedPrice + sector.pricePerLb * parseFloat(calculatorLb);
  };

  const columns = [
    {
      header: 'Sector',
      accessor: (sector: typeof dummyLogisticsPricing.sectors[0]) => sector.name,
    },
    {
      header: 'Precio Fijo',
      accessor: (sector: typeof dummyLogisticsPricing.sectors[0]) => (
        <Money amount={sector.fixedPrice} />
      ),
    },
    {
      header: 'Precio por Libra',
      accessor: (sector: typeof dummyLogisticsPricing.sectors[0]) => (
        <Money amount={sector.pricePerLb} />
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tarifas Logísticas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tarifas por Sector
          </h2>
          <DataTable data={dummyLogisticsPricing.sectors} columns={columns} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Calculadora de Costo
          </h2>
          <FormRow label="Cantidad (lb)">
            <input
              type="number"
              value={calculatorLb}
              onChange={(e) => setCalculatorLb(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              min="0"
              step="0.01"
            />
          </FormRow>
          <FormRow label="Sector">
            <select
              value={calculatorSector}
              onChange={(e) => setCalculatorSector(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Selecciona un sector</option>
              {dummyLogisticsPricing.sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </FormRow>
          {calculatorLb && calculatorSector && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600 mb-1">Costo Estimado:</div>
              <div className="text-2xl font-bold text-gray-900">
                <Money amount={calculateCost()} />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
