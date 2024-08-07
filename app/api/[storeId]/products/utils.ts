import prismadb from "@/lib/prismadb";
import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";

export interface ProductFilters {
  categoryId?: string;
  colourId?: string;
  variantId?: string;
  isFeatured?: boolean;
  isArchived?: boolean;
}

const getProducts = async (options: GetCachedOptions<ProductFilters>) => {
  console.log("test");
  return await prismadb.product.findMany({
    where: {
      storeId: options.keys.get(ApiKeys.StoreId),
      categoryId: options.filters?.categoryId,
      colourId: options.filters?.colourId,
      variantId: options.filters?.variantId,
      isArchived: options.filters?.isArchived,
      isFeatured: options.filters?.isFeatured,
    },
    include: {
      images: true,
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
      category: true,
      variant: true,
      colour: true,
    },
  });
};

export const getCachedProduct = async (options: GetCachedOptions) =>
  getCached(getProduct, options, "Product");

export const getCachedProducts = async (
  options: GetCachedOptions<ProductFilters>
) => getCached(getProducts, options, "Products");
