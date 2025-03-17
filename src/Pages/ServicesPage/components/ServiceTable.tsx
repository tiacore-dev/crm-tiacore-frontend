import React from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, SortingState, ColumnDef, flexRender } from "@tanstack/react-table";
import { IService } from "../../../api/servicesApi";
import "../../../components/Table.css";

interface ServiceTableProps {
  services?: IService[];
  onRowClick: (service_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({ services, onRowClick, onSortChange }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<IService>[]>(
    () => [
      {
        accessorKey: "service_name",
        header: "Название услуги",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: services || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted() as string] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} onClick={() => onRowClick(row.original.service_id)} style={{ cursor: "pointer" }}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};