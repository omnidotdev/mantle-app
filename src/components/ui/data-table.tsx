import {
  createSortedRowModel,
  flexRender,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import cn from "@/lib/utils";

import type {
  ColumnDef,
  OnChangeFn,
  Row,
  RowData,
  SortingState,
} from "@tanstack/react-table";
import type { KeyboardEvent, ReactNode } from "react";

type DataTableColumnMeta = {
  /** Horizontal alignment of the header and cells */
  align?: "left" | "right";
};

/**
 * Table features every `DataTable` is built with: client-side sorting and typed
 * column meta. Every built-in sort function is registered so `sortFn: "auto"`
 * keeps picking text, datetime, alphanumeric, or basic sorting per column
 */
const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
    textCaseSensitive: sortFn_textCaseSensitive,
  },
  columnMeta: metaHelper<DataTableColumnMeta>(),
});

type DataTableColumnDef<TData extends RowData> = ColumnDef<
  typeof dataTableFeatures,
  TData
>;

type DataTableProps<TData extends RowData> = {
  data: TData[];
  columns: DataTableColumnDef<TData>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  /** Minimum table width before it scrolls sideways (desktop table only) */
  minWidth?: string;
  /** Rendered in place of the entire table (including headers) when data is empty */
  emptyState?: ReactNode;
  /** Called when a row is clicked; interactive children must call e.stopPropagation() to avoid double-fire */
  onRowClick?: (row: TData) => void;
  /** Accessible name for a clickable row (e.g. "Open invoice INV-0042") */
  rowLabel?: (row: TData) => string;
  /**
   * Phone layout: render each row as a stacked card below the `md` breakpoint
   * instead of a sideways-scrolling table. Return the card body; the row click
   * and dividers are handled here
   */
  renderMobileRow?: (row: TData) => ReactNode;
};

/**
 * Sortable table that becomes a list of stacked cards on phones (when
 * `renderMobileRow` is given). Rows are clickable and keyboard reachable when
 * `onRowClick` is set. Meant to sit flush inside a `SectionCard`
 */
const DataTable = <TData extends RowData>({
  data,
  columns,
  sorting,
  onSortingChange,
  minWidth,
  emptyState,
  onRowClick,
  rowLabel,
  renderMobileRow,
}: DataTableProps<TData>) => {
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: { sorting },
    onSortingChange,
  });

  if (data.length === 0 && emptyState) return <>{emptyState}</>;

  const rows = table.getRowModel().rows;

  return (
    <>
      <div
        className={cn("overflow-x-auto", renderMobileRow && "max-md:hidden")}
      >
        <table className="w-full" style={minWidth ? { minWidth } : undefined}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  const align = header.column.columnDef.meta?.align ?? "left";

                  const label = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      );

                  return (
                    <th
                      key={header.id}
                      aria-sort={
                        sortDir === "asc"
                          ? "ascending"
                          : sortDir === "desc"
                            ? "descending"
                            : canSort
                              ? "none"
                              : undefined
                      }
                      className={cn(
                        "px-4 py-3 text-xs font-medium whitespace-nowrap text-muted-foreground first:pl-5 last:pr-5",
                        align === "right" ? "text-right" : "text-left",
                      )}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1 hover:text-foreground",
                            align === "right" && "flex-row-reverse",
                          )}
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
            {rows.map((row) => (
              <DataRow
                key={row.id}
                row={row}
                onRowClick={onRowClick}
                rowLabel={rowLabel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {renderMobileRow && (
        <ul className="divide-y divide-border md:hidden">
          {rows.map((row) => (
            <li key={row.id}>
              {onRowClick ? (
                <button
                  type="button"
                  onClick={() => onRowClick(row.original)}
                  aria-label={rowLabel?.(row.original)}
                  className="block w-full px-4 py-3 text-left transition-colors active:bg-accent"
                >
                  {renderMobileRow(row.original)}
                </button>
              ) : (
                <div className="px-4 py-3">{renderMobileRow(row.original)}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const SortIcon = ({ dir }: { dir: false | "asc" | "desc" }) => {
  if (dir === "asc") return <ChevronUp size={14} />;
  if (dir === "desc") return <ChevronDown size={14} />;
  return <ChevronsUpDown size={14} className="opacity-50" />;
};

const DataRow = <TData extends RowData>({
  row,
  onRowClick,
  rowLabel,
}: {
  row: Row<typeof dataTableFeatures, TData>;
  onRowClick?: (row: TData) => void;
  rowLabel?: (row: TData) => string;
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(row.original);
    }
  };

  return (
    <tr
      className={cn(
        "group/row border-b border-border transition-colors last:border-b-0",
        onRowClick &&
          "cursor-pointer hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none",
      )}
      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      onKeyDown={onRowClick ? handleKeyDown : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      aria-label={onRowClick ? rowLabel?.(row.original) : undefined}
    >
      {row.getAllCells().map((cell) => {
        const align = cell.column.columnDef.meta?.align ?? "left";

        return (
          <td
            key={cell.id}
            className={cn(
              "h-14 px-4 text-sm whitespace-nowrap first:pl-5 last:pr-5",
              align === "right" && "text-right",
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
};

export type { DataTableColumnDef, DataTableProps };
export { DataTable };
