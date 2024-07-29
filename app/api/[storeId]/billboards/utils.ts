import prismadb from "@/lib/prismadb";
import { getCached } from "@/app/api/utils";

const getBillboards = async (storeId: string) =>
  await prismadb.billboard.findMany({
    where: { storeId: storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

const getBillboard = async (billboardId: string) =>
  await prismadb.billboard.findFirst({
    where: {
      id: billboardId,
    },
  });

export const getCachedBillboard = async (billboardId: string) =>
  getCached(getBillboard, "Billboard", billboardId);

export const getCachedBillboards = async (storeId: string) =>
  getCached(getBillboards, "Billboards", storeId);
