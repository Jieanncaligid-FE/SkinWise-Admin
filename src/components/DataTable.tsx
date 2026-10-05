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
    <div className="overflow-hidden rounded-lg border border-[#efdfd4] bg-white shadow-[0_3px_12px_rgba(93,62,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[11px]">
          <thead className="bg-[#fbf0e8] text-[9px] uppercase tracking-[0.06em] text-[#806e61]">
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
          <tbody className="divide-y divide-[#f1e7df] text-[#59483d]">
            {rows.length > 0 ? rows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-[#fffdfa]">
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
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-10 text-center text-sm text-[#927f70]">
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