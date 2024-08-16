import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";
import prismadb from "@/lib/prismadb";

const getBillboards = async (options: GetCachedOptions) =>
  await prismadb.billboard.findMany({
    where: { storeId: options.keys.get(ApiKeys.StoreId) },
    orderBy: {
      createdAt: "desc",
    },
  });

const getBillboard = async (options: GetCachedOptions) =>
  await prismadb.billboard.findFirst({
    where: {
      id: options.keys.get(ApiKeys.BillboardId),
    },
  });

export const getCachedBillboard = async (options: GetCachedOptions) =>
  getCached(getBillboard, options, ["Billboard"]);

export const getCachedBillboards = async (options: GetCachedOptions) =>
  getCached(getBillboards, options, ["Billboards"]);
