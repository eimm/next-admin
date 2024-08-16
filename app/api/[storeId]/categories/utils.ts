import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";
import prismadb from "@/lib/prismadb";

const getCategories = async (options: GetCachedOptions) =>
  await prismadb.category.findMany({
    where: { storeId: options.keys.get(ApiKeys.StoreId) },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const getCategory = async (options: GetCachedOptions) =>
  await prismadb.category.findFirst({
    where: {
      id: options.keys.get(ApiKeys.CategoryId),
    },
    include: {
      billboard: true,
    },
  });

export const getCachedCategory = async (options: GetCachedOptions) =>
  getCached(getCategory, options, ["Category"]);

export const getCachedCategories = async (options: GetCachedOptions) =>
  getCached(getCategories, options, ["Categories"]);
