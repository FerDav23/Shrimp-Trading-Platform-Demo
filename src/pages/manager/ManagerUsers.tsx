import React from 'react';
import { dummyUsers } from '../../data/users';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { User } from '../../types';
import { page, typography, button } from '../../styles';

export const ManagerUsers: React.FC = () => {
  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => user.name,
    },
    {
      header: 'Role',
      accessor: (user: User) => user.role,
    },
    {
      header: 'RUC/ID',
      accessor: (user: User) => user.ruc,
    },
    {
      header: 'Email',
      accessor: (user: User) => user.email,
    },
    {
      header: 'Phone',
      accessor: (user: User) => user.phone,
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <button
          onClick={() => alert(`Edit user ${user.id} (simulated)`)}
          className={typography.linkPrimarySm}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={page.title}>Users</h1>
        <button
          onClick={() => alert('Create new user (simulated)')}
          className={button.primaryMd}
        >
          Create User
        </button>
      </div>
      <Card>
        <DataTable data={dummyUsers} columns={columns} />
      </Card>
    </div>
  );
};
