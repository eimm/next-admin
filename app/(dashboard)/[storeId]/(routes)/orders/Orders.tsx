"use client";

import React, { FC } from "react";

import { DataTable } from "@/components/DataTable";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns,OrderColumn } from "./Columns";

interface OrdersProps {
  orders: OrderColumn[];
}

const Orders: FC<OrdersProps> = ({ orders }) => {
  return (
    <>
      <Heading title={`Orders (${orders.length})`} description="Your orders" />
      <Separator />
      <DataTable columns={columns} data={orders} filterKey="products" />
    </>
  );
};

export default Orders;
