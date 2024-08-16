import prismadb from "@/lib/prismadb";
import { ApiKeys, getCached, GetCachedOptions } from "@/app/api/utils";

const getColours = async (options: GetCachedOptions) =>
  await prismadb.colour.findMany({
    where: { storeId: options.keys.get(ApiKeys.StoreId) },
    orderBy: {
      createdAt: "desc",
    },
  });

const getColour = async (options: GetCachedOptions) => {
  return await prismadb.colour.findFirst({
    where: {
      id: options.keys.get(ApiKeys.ColourId),
    },
  });
};

export const getCachedColour = async (options: GetCachedOptions) =>
  getCached(getColour, options, ["Colour"]);

export const getCachedColours = async (options: GetCachedOptions) =>
  getCached(getColours, options, ["Colours"]);
