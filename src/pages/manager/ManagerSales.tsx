import React, { useState } from 'react';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { page, form } from '../../styles';

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
      header: 'Sale ID',
      accessor: (sale: Sale) => `#${sale.id.split('-')[1]}`,
    },
    {
      header: 'Product',
      accessor: (sale: Sale) => sale.productForm,
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
      <h1 className={page.title}>All Sales</h1>
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={form.label}>Filter by Payment</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div>
            <label className={form.label}>Filter by Logistics</label>
            <select
              value={filterLogistics}
              onChange={(e) => setFilterLogistics(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">All</option>
              <option value="PENDING_PICKUP">Pending Pickup</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
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
