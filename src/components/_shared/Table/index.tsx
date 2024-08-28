import { Table as MantineTable } from "@mantine/core";

import RCTable from "rc-table";
import { TableProps as RCTableProps } from "rc-table/lib/Table";

export type { ColumnsType } from "rc-table/es/interface";

export type TableProps<T> = {
  loading?: boolean;
} & RCTableProps<T>;

function Table<T>({ loading, ...rest }: TableProps<T>) {
  return (
    <div>
      <RCTable<T>
        components={{
          table: (props: any) => <MantineTable highlightOnHover {...props} />,
        }}
        emptyText="Não existem dados a serem exibidos."
        tableLayout="fixed"
        {...rest}
      />
    </div>
  );
}

export default Table;
