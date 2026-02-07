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

export const ProducerSales: React.FC = () => {
  const { user } = useAuth();
  const mySales = dummySales.filter((s) => s.producerId === user?.id);

  const columns = [
    {
      header: 'ID Venta',
      accessor: (sale: Sale) => (
        <Link
          to={`/producer/sales/${sale.id}`}
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
      header: 'Talla',
      accessor: (sale: Sale) => `${sale.sizeRangeSelected.min}/${sale.sizeRangeSelected.max}`,
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Ventas</h1>
      <Card>
        <DataTable data={mySales} columns={columns} />
      </Card>
    </div>
  );
};
