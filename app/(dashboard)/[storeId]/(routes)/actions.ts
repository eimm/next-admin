import { format, getUnixTime } from "date-fns";
import { getCachedCompletedOrders } from "@/app/api/[storeId]/orders/utils";
import { getCachedProducts } from "@/app/api/[storeId]/products/utils";
import { ApiKeys } from "@/app/api/utils";

export async function getIncome(storeId: string) {
  const paidOrders = await getCachedCompletedOrders({
    keys: new Map([[ApiKeys.StoreId, storeId]]),
  });

  return paidOrders.reduce(
    (acc, o) =>
      acc + o.items.reduce((acc, i) => acc + Number(i.product.price), 0),
    0
  );
}

export async function getSold(storeId: string) {
  const paidOrders = await getCachedCompletedOrders({
    keys: new Map([[ApiKeys.StoreId, storeId]]),
  });

  return paidOrders.reduce(
    (acc, o) => acc + o.items.reduce((acc, i) => (acc += 1), 0),
    0
  );
}

export async function getStock(storeId: string) {
  const products = await getCachedProducts({
    keys: new Map([[ApiKeys.StoreId, storeId]]),
  });

  return products.reduce((acc, p) => Number(p.quantity) + acc, 0);
}

export interface GraphData {
  name: string;
  total: number;
}

export async function getGraphData(storeId: string): Promise<GraphData[]> {
  const paidOrders = await getCachedCompletedOrders({
    keys: new Map([[ApiKeys.StoreId, storeId]]),
  });

  const sortedPaidOrders = paidOrders.sort((a, b) => {
    return getUnixTime(b.createdAt) - getUnixTime(a.createdAt);
  });

  const incomeByMonths = new Map<string, number>();

  for (const order of sortedPaidOrders) {
    const month = format(order.createdAt, "MMM, yyyy");
    const orderValue = order.items.reduce(
      (acc, i) => acc + Number(i.product.price),
      0
    );
    const monthIncome = incomeByMonths.get(month);
    incomeByMonths.set(month, orderValue + (monthIncome || 0));
  }

  const sortedMonths = Array.from(incomeByMonths.entries());

  return sortedMonths.map((m) => ({
    name: m[0],
    total: m[1],
  }));
}
