"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./CellAction";

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: string;
  variant: string;
  colour: string;
  createdAt: string;
  quantity: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "variant",
    header: "Variant",
  },
  {
    accessorKey: "colour",
    header: "Colour",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colour}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.colour }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Creation date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction product={row.original} />,
  },
];
