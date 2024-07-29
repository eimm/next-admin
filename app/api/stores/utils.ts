import prismadb from "@/lib/prismadb";
import { getCached } from "@/app/api/utils";

const getStores = async (userId: string) =>
  await prismadb.store.findMany({
    where: {
      userId,
    },
  });

const getStore = async (userId: string, storeId?: string) =>
  storeId
    ? await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId,
        },
      })
    : await prismadb.store.findFirst({
        where: {
          userId,
        },
      });

export const getCachedStore = async (userId: string, storeId?: string) =>
  getCached(getStore, "Store", userId, storeId);

export const getCachedStores = async (userId: string) =>
  getCached(getStores, "Stores", userId);
