import React from 'react';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';

interface ApprovalItem {
  id: string;
  user: string;
  documentType: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const dummyApprovals: ApprovalItem[] = [
  {
    id: 'app-1',
    user: 'Juan Pérez',
    documentType: 'Permiso de Acuicultura',
    submittedAt: '2024-01-15',
    status: 'PENDING',
  },
  {
    id: 'app-2',
    user: 'ROSASUD S.A.S.',
    documentType: 'Permiso de Planta',
    submittedAt: '2024-01-20',
    status: 'APPROVED',
  },
  {
    id: 'app-3',
    user: 'Grupo FJ Logística',
    documentType: 'Licencia de Transporte',
    submittedAt: '2024-02-01',
    status: 'PENDING',
  },
];

export const ManagerApprovals: React.FC = () => {
  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    alert(`Documento ${id} ${action === 'APPROVED' ? 'aprobado' : 'rechazado'} (simulado)`);
  };

  const columns = [
    {
      header: 'Usuario',
      accessor: (item: ApprovalItem) => item.user,
    },
    {
      header: 'Tipo de Documento',
      accessor: (item: ApprovalItem) => item.documentType,
    },
    {
      header: 'Fecha de Envío',
      accessor: (item: ApprovalItem) => item.submittedAt,
    },
    {
      header: 'Estado',
      accessor: (item: ApprovalItem) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Acciones',
      accessor: (item: ApprovalItem) =>
        item.status === 'PENDING' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(item.id, 'APPROVED')}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Aprobar
            </button>
            <button
              onClick={() => handleAction(item.id, 'REJECTED')}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Rechazar
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Aprobaciones</h1>
      <Card>
        <DataTable data={dummyApprovals} columns={columns} />
      </Card>
    </div>
  );
};
