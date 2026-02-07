import React, { useState } from 'react';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ManagerSales: React.FC = () => {
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterLogistics, setFilterLogistics] = useState<string>('all');

  const filteredSales = dummySales.filter((sale) => {
    if (filterPayment !== 'all' && sale.paymentStatus !== filterPayment) {
      return false;
    }
    if (filterLogistics !== 'all' && sale.logisticsStatus !== filterLogistics) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'ID Venta',
      accessor: (sale: Sale) => `#${sale.id.split('-')[1]}`,
    },
    {
      header: 'Producto',
      accessor: (sale: Sale) => sale.productForm,
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
      header: 'Logística',
      accessor: (sale: Sale) => <StatusBadge status={sale.logisticsStatus} />,
    },
    {
      header: 'Pago',
      accessor: (sale: Sale) => <StatusBadge status={sale.paymentStatus} />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Todas las Ventas</h1>
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtro por Pago
            </label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="PARTIAL">Parcial</option>
              <option value="PAID">Pagado</option>
              <option value="OVERDUE">Vencido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtro por Logística
            </label>
            <select
              value={filterLogistics}
              onChange={(e) => setFilterLogistics(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="PENDING_PICKUP">Pendiente Recolección</option>
              <option value="IN_TRANSIT">En Tránsito</option>
              <option value="DELIVERED">Entregado</option>
            </select>
          </div>
        </div>
      </Card>
      <Card>
        <DataTable data={filteredSales} columns={columns} />
      </Card>
    </div>
  );
};
