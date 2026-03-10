import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { page, typography } from '../../styles';

export const ProducerSales: React.FC = () => {
  const { user } = useAuth();
  const mySales = dummySales.filter((s) => s.producerId === user?.id);

  const columns = [
    {
      header: 'Sale ID',
      accessor: (sale: Sale) => (
        <Link to={`/producer/sales/${sale.id}`} className={typography.linkPrimary}>
          #{sale.id.split('-')[1]}
        </Link>
      ),
    },
    {
      header: 'Product',
      accessor: (sale: Sale) => sale.productForm,
    },
    {
      header: 'Size',
      accessor: (sale: Sale) => `${sale.sizeRangeSelected.min}/${sale.sizeRangeSelected.max}`,
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
      header: 'Logistics',
      accessor: (sale: Sale) => <StatusBadge status={sale.logisticsStatus} />,
    },
    {
      header: 'Payment',
      accessor: (sale: Sale) => <StatusBadge status={sale.paymentStatus} />,
    },
  ];

  return (
    <div>
      <h1 className={page.title}>My Sales</h1>
      <Card>
        <DataTable data={mySales} columns={columns} />
      </Card>
    </div>
  );
};
