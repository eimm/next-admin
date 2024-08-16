import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";
import prismadb from "@/lib/prismadb";

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

const getCompletedOrders = async (options: GetCachedOptions) =>
  await prismadb.order.findMany({
    where: {
      storeId: options.keys.get(ApiKeys.StoreId),
      isCompleted: true,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

export const getCachedOrders = async (options: GetCachedOptions) =>
  getCached(getOrders, options, ["Orders"]);

export const getCachedCompletedOrders = async (options: GetCachedOptions) =>
  getCached(getCompletedOrders, options, ["Orders", "Completed"]);
