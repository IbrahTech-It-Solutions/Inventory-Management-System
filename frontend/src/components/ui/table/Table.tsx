import type { ReactNode } from "react";
import styles from "./Table.module.css";

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
};

const Table = <T,>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No records found.",
}: TableProps<T>) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ width: column.width }}
                className={
                  column.align
                    ? styles[column.align]
                    : undefined
                }
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={getRowKey(item)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={
                      column.align
                        ? styles[column.align]
                        : undefined
                    }
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.empty}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;