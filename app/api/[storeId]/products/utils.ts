import prismadb from "@/lib/prismadb";
import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";

const getProducts = async (options: GetCachedOptions) => {
  return await prismadb.product.findMany({
    where: { storeId: options.keys.get(ApiKeys.StoreId), ...options?.filters },
    include: {
      category: true,
      variant: true,
      colour: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getProduct = async (options: GetCachedOptions) => {
  return await prismadb.product.findFirst({
    where: {
      id: options.keys.get(ApiKeys.ProductId),
    },
    include: {
      images: true,
    },
  });
};

export const getCachedProduct = async (options: GetCachedOptions) =>
  getCached(getProduct, options, "Product");

export const getCachedProducts = async (options: GetCachedOptions) =>
  getCached(getProducts, options, "Products");
