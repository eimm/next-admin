import prismadb from "@/lib/prismadb";
import { getCached } from "@/app/api/utils";

const getCategories = async (storeId: string) =>
  await prismadb.category.findMany({
    where: { storeId: storeId },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const getCategory = async (categoryId: string) =>
  await prismadb.category.findFirst({
    where: {
      id: categoryId,
    },
  });

export const getCachedCategory = async (variantId: string) =>
  getCached(getCategory, "Category", variantId);

export const getCachedCategories = async (storeId: string) =>
  getCached(getCategories, "Categories", storeId);
