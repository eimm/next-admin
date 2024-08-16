"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./CellAction";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Creation date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction billboard={row.original} />,
  },
];
