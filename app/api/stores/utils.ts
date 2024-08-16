import prismadb from "@/lib/prismadb";
import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";

const getStores = async (options: GetCachedOptions) =>
  await prismadb.store.findMany({
    where: {
      userId: options.keys.get(ApiKeys.UserId),
    },
  });

const getStore = async (options: GetCachedOptions) =>
  options.keys.has(ApiKeys.StoreId)
    ? await prismadb.store.findFirst({
        where: {
          id: options.keys.get(ApiKeys.StoreId),
          userId: options.keys.get(ApiKeys.UserId),
        },
      })
    : await prismadb.store.findFirst({
        where: {
          userId: options.keys.get(ApiKeys.UserId),
        },
      });

export const getCachedStore = async (options: GetCachedOptions) =>
  getCached(getStore, options, ["Store"]);

export const getCachedStores = async (options: GetCachedOptions) =>
  getCached(getStores, options, ["Stores"]);
