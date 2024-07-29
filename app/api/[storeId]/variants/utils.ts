import prismadb from "@/lib/prismadb";
import { getCached } from "@/app/api/utils";

const getVariants = async (storeId: string) =>
  await prismadb.variant.findMany({
    where: { storeId: storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

const getVariant = async (variantId: string) => {
  return await prismadb.variant.findFirst({
    where: {
      id: variantId,
    },
  });
};

export const getCachedVariant = async (variantId: string) =>
  getCached(getVariant, "Variant", variantId);

export const getCachedVariants = async (storeId: string) =>
  getCached(getVariants, "Variants", storeId);
