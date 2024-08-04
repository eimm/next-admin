import React, { FC } from "react";
import { format } from "date-fns";
import { OrderColumn } from "./Columns";
import { getCachedOrders } from "@/app/api/[storeId]/orders/utils";
import Orders from "./Orders";
import { ApiKeys } from "@/app/api/utils";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await getCachedOrders({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });
  const formatedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.items.map((i) => i.product.name).join(", "),
    totalPrice: formatter.format(
      item.items.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isCompleted: item.isCompleted,
    createdAt: format(item.createdAt, "d MMM yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Orders orders={formatedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
