import React from 'react';
import { dummyUsers } from '../../data/users';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { User } from '../../types';
import { page, typography, button } from '../../styles';

export const ManagerUsers: React.FC = () => {
  const columns = [
    {
      header: 'Nombre',
      accessor: (user: User) => user.name,
    },
    {
      header: 'Rol',
      accessor: (user: User) => user.role,
    },
    {
      header: 'RUC/CI',
      accessor: (user: User) => user.ruc,
    },
    {
      header: 'Email',
      accessor: (user: User) => user.email,
    },
    {
      header: 'Teléfono',
      accessor: (user: User) => user.phone,
    },
    {
      header: 'Acciones',
      accessor: (user: User) => (
        <button
          onClick={() => alert(`Editar usuario ${user.id} (simulado)`)}
          className={typography.linkPrimarySm}
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={page.title}>Usuarios</h1>
        <button
          onClick={() => alert('Crear nuevo usuario (simulado)')}
          className={button.primaryMd}
        >
          Crear Usuario
        </button>
      </div>
      <Card>
        <DataTable data={dummyUsers} columns={columns} />
      </Card>
    </div>
  );
};
