import prismadb from "@/lib/prismadb";
import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";

const getOrders = async (options: GetCachedOptions) =>
  await prismadb.order.findMany({
    where: { storeId: options.keys.get(ApiKeys.StoreId) },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: { include: { product: true } },
    },
  });

// const getOrder = async (options: GetCachedOptions) =>
//   await prismadb.order.findFirst({
//     where: {
//       id: options.keys.get(ApiKeys.OrderId),
//     },
//   });

// export const getCachedOrder = async (options: GetCachedOptions) =>
//   getCached(getOrder, options, "Order");

export const getCachedOrders = async (options: GetCachedOptions) =>
  getCached(getOrders, options, "Orders");
