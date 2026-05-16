import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import type {
  ColumnDef,
  OnChangeFn,
  Row,
  SortingState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  minWidth?: string;
  emptyState?: ReactNode;
  onRowClick?: (row: TData) => void;
};

const DataTable = <TData,>({
  data,
  columns,
  sorting,
  onSortingChange,
  minWidth,
  emptyState,
  onRowClick,
}: DataTableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <table className="w-full" style={minWidth ? { minWidth } : undefined}>
      <thead className="bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.column.getCanSort();
              const sortDir = header.column.getIsSorted();
              const align =
                (header.column.columnDef.meta as { align?: "left" | "right" })
                  ?.align ?? "left";

              const label = header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );

              return (
                <th
                  key={header.id}
                  className={`px-4 py-3 font-medium text-foreground text-sm ${align === "right" ? "text-right" : "text-left"}`}
                >
                  {canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={`inline-flex items-center gap-1 hover:text-primary ${align === "right" ? "flex-row-reverse" : ""}`}
                      aria-label={`Sort by ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.column.id}`}
                    >
                      {label}
                      <SortIcon dir={sortDir} />
                    </button>
                  ) : (
                    label
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <DataRow key={row.id} row={row} onRowClick={onRowClick} />
        ))}
      </tbody>
    </table>
  );
};

const SortIcon = ({ dir }: { dir: false | "asc" | "desc" }) => {
  if (dir === "asc") return <ChevronUp size={14} />;
  if (dir === "desc") return <ChevronDown size={14} />;
  return <ChevronsUpDown size={14} className="text-muted-foreground" />;
};

const DataRow = <TData,>({
  row,
  onRowClick,
}: {
  row: Row<TData>;
  onRowClick?: (row: TData) => void;
}) => (
  <tr
    className={`border-border border-t ${onRowClick ? "cursor-pointer hover:bg-muted" : ""}`}
    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
  >
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} className="px-4 py-3 text-sm">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);

export { DataTable };
export type { DataTableProps };
