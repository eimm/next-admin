import prismadb from "@/lib/prismadb";
import { getCached } from "@/app/api/utils";

const getColours = async (storeId: string) =>
  await prismadb.colour.findMany({
    where: { storeId: storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

const getColour = async (colourId: string) => {
  return await prismadb.colour.findFirst({
    where: {
      id: colourId,
    },
  });
};

export const getCachedColour = async (colourId: string) =>
  getCached(getColour, "Colour", colourId);

export const getCachedColours = async (storeId: string) =>
  getCached(getColours, "Colours", storeId);
