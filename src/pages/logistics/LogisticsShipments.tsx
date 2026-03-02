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
import { page, form, button } from '../../styles';

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
                className={button.actionSmallBlue}
              >
                Asignar Camión
              </button>
              <button
                onClick={() => handleStatusChange(sale.id, 'IN_TRANSIT')}
                className={button.actionSmallGreen}
              >
                En Tránsito
              </button>
            </>
          )}
          {sale.logisticsStatus === 'IN_TRANSIT' && (
            <button
              onClick={() => handleStatusChange(sale.id, 'DELIVERED')}
              className={button.actionSmallGreen}
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
      <h1 className={page.title}>Envíos</h1>
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
            <label className={form.label}>Seleccionar Camión</label>
            <select
              value={selectedTruck}
              onChange={(e) => setSelectedTruck(e.target.value)}
              className={form.inputGray}
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
              className={button.cancelOutline}
            >
              Cancelar
            </button>
            <button onClick={handleConfirmTruck} className={button.primaryMd}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
