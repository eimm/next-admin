"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ApiList";

interface OrdersProps {
  orders: OrderColumn[];
}

const Orders: FC<OrdersProps> = ({ orders }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <Heading title={`Orders (${orders.length})`} description="Your orders" />
      <Separator />
      <DataTable columns={columns} data={orders} filterKey="products" />
    </>
  );
};

export default Orders;
