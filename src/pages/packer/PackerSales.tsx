import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PackerSales: React.FC = () => {
  useAuth();
  const mySales = dummySales.filter((s) => s.packingCompanyId === 'packer-rosasud');

  const handleAction = (saleId: string, action: string) => {
    alert(`Acción "${action}" ejecutada para venta ${saleId} (simulado)`);
  };

  const columns = [
    {
      header: 'ID Venta',
      accessor: (sale: Sale) => (
        <Link
          to={`/packer/sales/${sale.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          #{sale.id.split('-')[1]}
        </Link>
      ),
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
    {
      header: 'Acciones',
      accessor: (sale: Sale) => (
        <div className="flex gap-2">
          {sale.paymentStatus === 'PENDING' && (
            <button
              onClick={() => handleAction(sale.id, 'Confirmar compra')}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Confirmar
            </button>
          )}
          {sale.paymentStatus === 'PARTIAL' && (
            <button
              onClick={() => handleAction(sale.id, 'Marcar pagado parcial')}
              className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
            >
              Pagado Parcial
            </button>
          )}
          {sale.paymentStatus !== 'PAID' && (
            <button
              onClick={() => handleAction(sale.id, 'Marcar pagado')}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Pagado
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ventas</h1>
      <Card>
        <DataTable data={mySales} columns={columns} />
      </Card>
    </div>
  );
};
