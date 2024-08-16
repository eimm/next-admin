import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";
import prismadb from "@/lib/prismadb";

const getVariants = async (options: GetCachedOptions) =>
  await prismadb.variant.findMany({
    where: { storeId: options.keys.get(ApiKeys.StoreId) },
    orderBy: {
      createdAt: "desc",
    },
  });

const getVariant = async (options: GetCachedOptions) => {
  return await prismadb.variant.findFirst({
    where: {
      id: options.keys.get(ApiKeys.VariantId),
    },
  });
};

export const getCachedVariant = async (options: GetCachedOptions) =>
  getCached(getVariant, options, ["Variant"]);

export const getCachedVariants = async (options: GetCachedOptions) =>
  getCached(getVariants, options, ["Variants"]);
