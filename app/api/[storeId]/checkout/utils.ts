import prismadb from "@/lib/prismadb";
import { ApiKeys, GetCachedOptions } from "../../utils";
import { unstable_cache } from "next/cache";

const getProductsById = async (ids: string[]) => {
  return await prismadb.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const getCachedProductsById = async (ids: string[]) => {
  const get = unstable_cache(
    async () => getProductsById(ids),
    [`Product-${ids.sort().join("-")}`],
    { tags: ids.map((id) => `Product-${id}`) }
  );
  return get();
};
