import { useState, useMemo, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string | ReactNode;
  render: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
  pageSize?: number;
}

const PAGE_SIZES = [5, 10, 20, 50];

export function DataTable<T>({ columns, data, onRowClick, rowKey, pageSize: defaultPageSize }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize ?? 10);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const pagedData = useMemo(
    () => data.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [data, page, rowsPerPage],
  );

  // Reset page when data changes
  const dataLen = data.length;
  const maxPage = Math.max(0, Math.ceil(dataLen / rowsPerPage) - 1);
  if (page > maxPage && page !== 0) setPage(maxPage);

  const from = dataLen === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, dataLen);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: (col.align ?? "left") as "left" | "center" | "right",
                    padding: "14px 16px",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "#637381",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                    width: col.width,
                    borderBottom: "1px solid rgba(145,158,171,0.2)",
                    background: "#F4F6F8",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "var(--color-text-tertiary)",
                    fontSize: 13,
                  }}
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
            {pagedData.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                  borderBottom: "1px dashed rgba(145,158,171,0.2)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(145,158,171,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "12px 16px",
                      verticalAlign: "middle",
                      textAlign: (col.align ?? "left") as "left" | "center" | "right",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {data.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "var(--space-4)",
            padding: "10px 16px",
            borderTop: "1px solid var(--color-border)",
            fontSize: 13,
            color: "var(--color-text-secondary)",
          }}
        >
          {/* Rows per page */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ color: "var(--color-text-tertiary)", fontSize: 12 }}>Số dòng mỗi trang</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-xs)",
                border: "1px solid var(--color-border)",
                fontSize: 13,
                background: "var(--color-bg-card)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
              }}
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Range display */}
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", minWidth: 80, textAlign: "right" }}>
            {from}–{to} của {dataLen}
          </span>

          {/* Prev / Next */}
          <div style={{ display: "flex", gap: 2 }}>
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: "var(--radius-xs)",
                border: "1px solid var(--color-border)", background: "var(--color-bg-card)",
                color: page === 0 ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
                cursor: page === 0 ? "default" : "pointer",
                opacity: page === 0 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: "var(--radius-xs)",
                border: "1px solid var(--color-border)", background: "var(--color-bg-card)",
                color: page >= totalPages - 1 ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
                cursor: page >= totalPages - 1 ? "default" : "pointer",
                opacity: page >= totalPages - 1 ? 0.4 : 1,
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
