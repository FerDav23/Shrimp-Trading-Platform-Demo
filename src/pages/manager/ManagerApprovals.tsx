import React from 'react';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { page, button, typography } from '../../styles';

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
    documentType: 'Aquaculture Permit',
    submittedAt: '2024-01-15',
    status: 'PENDING',
  },
  {
    id: 'app-2',
    user: 'ROSASUD S.A.S.',
    documentType: 'Plant Permit',
    submittedAt: '2024-01-20',
    status: 'APPROVED',
  },
  {
    id: 'app-3',
    user: 'Grupo FJ Logística',
    documentType: 'Transport License',
    submittedAt: '2024-02-01',
    status: 'PENDING',
  },
];

export const ManagerApprovals: React.FC = () => {
  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    alert(`Document ${id} ${action === 'APPROVED' ? 'approved' : 'rejected'} (simulated)`);
  };

  const columns = [
    {
      header: 'User',
      accessor: (item: ApprovalItem) => item.user,
    },
    {
      header: 'Document Type',
      accessor: (item: ApprovalItem) => item.documentType,
    },
    {
      header: 'Submitted',
      accessor: (item: ApprovalItem) => item.submittedAt,
    },
    {
      header: 'Status',
      accessor: (item: ApprovalItem) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Actions',
      accessor: (item: ApprovalItem) =>
        item.status === 'PENDING' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(item.id, 'APPROVED')}
              className={button.actionSmallGreen}
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(item.id, 'REJECTED')}
              className={button.actionSmallRed}
            >
              Reject
            </button>
          </div>
        ) : (
          <span className={typography.bodyMuted}>-</span>
        ),
    },
  ];

  return (
    <div>
      <h1 className={page.title}>Approvals</h1>
      <Card>
        <DataTable data={dummyApprovals} columns={columns} />
      </Card>
    </div>
  );
};
