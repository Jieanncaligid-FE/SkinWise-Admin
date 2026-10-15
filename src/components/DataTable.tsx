import type { ReactNode } from 'react';

export interface DataTableColumn<Row> {
  key: keyof Row | string;
  header: string;
  render?: (row: Row) => ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<Row> {
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row) => string | number;
  emptyMessage?: string;
  renderActions?: (row: Row) => ReactNode;
  actionsLabel?: string;
}

const alignmentClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'No records found.',
  renderActions,
  actionsLabel = 'Actions',
}: DataTableProps<Row>) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#BA867B]/30 bg-white shadow-[0_3px_12px_rgba(30,12,8,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[11px]">
          <thead className="bg-[#F5ECE9] text-[9px] uppercase tracking-[0.06em] text-[#1E0C08]/60">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`px-3 py-2.5 font-semibold sm:px-4 ${alignmentClass[column.align ?? 'left']} ${column.className ?? ''}`}
                >
                  {column.header}
                </th>
              ))}
              {renderActions && <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">{actionsLabel}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BA867B]/30 text-[#1E0C08]">
            {rows.length > 0 ? rows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-[#ffffff]">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-3 py-2.5 sm:px-4 ${alignmentClass[column.align ?? 'left']} ${column.className ?? ''}`}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof Row] ?? '')}
                  </td>
                ))}
                {renderActions && <td className="px-3 py-2 sm:px-4"><div className="flex justify-end gap-1.5">{renderActions(row)}</div></td>}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-10 text-center text-sm text-[#1E0C08]/60">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}