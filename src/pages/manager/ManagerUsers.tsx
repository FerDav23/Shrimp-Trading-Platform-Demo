import React from 'react';
import { dummyUsers } from '../../data/users';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { User } from '../../types';

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
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <button
          onClick={() => alert('Crear nuevo usuario (simulado)')}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
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
