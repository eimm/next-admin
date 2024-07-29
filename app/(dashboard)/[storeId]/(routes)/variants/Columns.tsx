"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";

export type VariantColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<VariantColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Creation date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction variant={row.original} />,
  },
];
