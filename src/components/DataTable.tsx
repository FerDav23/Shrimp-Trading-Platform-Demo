import { ReactNode } from 'react';
import { table } from '../styles';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
}: DataTableProps<T>) {
  return (
    <div className={`${table.wrapper} ${className || ''}`}>
      <table className={table.base}>
        <thead className={table.thead}>
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`${table.th} ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={table.tbody}>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className={table.tr}>
              {columns.map((column, colIdx) => (
                <td
                  key={colIdx}
                  className={`${table.td} ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
