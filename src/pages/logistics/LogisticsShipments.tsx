import React, { useState } from 'react';
import { dummySales } from '../../data/sales';
import { dummyTrucks } from '../../data/logistics';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
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
        `Truck ${selectedTruck} assigned to sale ${selectedSale.id} (simulated)`
      );
      setShowTruckModal(false);
      setSelectedSale(null);
      setSelectedTruck('');
    }
  };

  const handleStatusChange = (saleId: string, newStatus: string) => {
    alert(`Status changed to ${newStatus} for sale ${saleId} (simulated)`);
  };

  const columns = [
    {
      header: 'Sale ID',
      accessor: (sale: Sale) => `#${sale.id.split('-')[1]}`,
    },
    {
      header: 'Origin',
      accessor: (sale: Sale) => sale.pickupLocation.city,
    },
    {
      header: 'Destination',
      accessor: (sale: Sale) => sale.deliveryPlant.city,
    },
    {
      header: 'Quantity',
      accessor: (sale: Sale) => `${sale.quantityLb} lb`,
    },
    {
      header: 'Date',
      accessor: (sale: Sale) =>
        format(new Date(sale.createdAt), 'dd MMM yyyy', { locale: enUS }),
    },
    {
      header: 'Status',
      accessor: (sale: Sale) => <StatusBadge status={sale.logisticsStatus} />,
    },
    {
      header: 'Actions',
      accessor: (sale: Sale) => (
        <div className="flex gap-2">
          {sale.logisticsStatus === 'PENDING_PICKUP' && (
            <>
              <button
                onClick={() => handleAssignTruck(sale)}
                className={button.actionSmallBlue}
              >
                Assign Truck
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
        title="Assign Truck"
      >
        <div className="space-y-4">
          <div>
            <label className={form.label}>Select Truck</label>
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
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
