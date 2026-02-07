import React, { useState } from 'react';
import { dummySales } from '../../data/sales';
import { dummyTrucks } from '../../data/logistics';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const LogisticsShipments: React.FC = () => {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<string>('');

  const handleAssignTruck = (sale: Sale) => {
    setSelectedSale(sale);
    setShowTruckModal(true);
  };

  const handleConfirmTruck = () => {
    if (selectedSale && selectedTruck) {
      alert(
        `Camión ${selectedTruck} asignado a venta ${selectedSale.id} (simulado)`
      );
      setShowTruckModal(false);
      setSelectedSale(null);
      setSelectedTruck('');
    }
  };

  const handleStatusChange = (saleId: string, newStatus: string) => {
    alert(`Estado cambiado a ${newStatus} para venta ${saleId} (simulado)`);
  };

  const columns = [
    {
      header: 'ID Venta',
      accessor: (sale: Sale) => `#${sale.id.split('-')[1]}`,
    },
    {
      header: 'Origen',
      accessor: (sale: Sale) => sale.pickupLocation.city,
    },
    {
      header: 'Destino',
      accessor: (sale: Sale) => sale.deliveryPlant.city,
    },
    {
      header: 'Cantidad',
      accessor: (sale: Sale) => `${sale.quantityLb} lb`,
    },
    {
      header: 'Fecha',
      accessor: (sale: Sale) =>
        format(new Date(sale.createdAt), 'dd MMM yyyy', { locale: es }),
    },
    {
      header: 'Estado',
      accessor: (sale: Sale) => <StatusBadge status={sale.logisticsStatus} />,
    },
    {
      header: 'Acciones',
      accessor: (sale: Sale) => (
        <div className="flex gap-2">
          {sale.logisticsStatus === 'PENDING_PICKUP' && (
            <>
              <button
                onClick={() => handleAssignTruck(sale)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Asignar Camión
              </button>
              <button
                onClick={() => handleStatusChange(sale.id, 'IN_TRANSIT')}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                En Tránsito
              </button>
            </>
          )}
          {sale.logisticsStatus === 'IN_TRANSIT' && (
            <button
              onClick={() => handleStatusChange(sale.id, 'DELIVERED')}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Marcar Entregado
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Envíos</h1>
      <Card>
        <DataTable data={dummySales} columns={columns} />
      </Card>

      <Modal
        isOpen={showTruckModal}
        onClose={() => {
          setShowTruckModal(false);
          setSelectedSale(null);
          setSelectedTruck('');
        }}
        title="Asignar Camión"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Camión
            </label>
            <select
              value={selectedTruck}
              onChange={(e) => setSelectedTruck(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Selecciona un camión</option>
              {dummyTrucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.plate} - {truck.driver} (Capacidad: {truck.capacity} lb)
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowTruckModal(false);
                setSelectedSale(null);
                setSelectedTruck('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmTruck}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
