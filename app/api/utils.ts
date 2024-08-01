import { unstable_cache } from "next/cache";

export const ApiKeys = {
  StoreId: "storeId",
  BillboardId: "billboardId",
  ColourId: "colourId",
  CategoryId: "categoryId",
  VariantId: "variantId",
  ProductId: "productId",
  UserId: "userId",
} as const;

export type ApiKeys = (typeof ApiKeys)[keyof typeof ApiKeys];

export interface GetCachedOptions {
  keys: Map<ApiKeys, string>;
  filters?: Record<string, string | boolean | undefined>;
}

export const getCached: <TData>(
  getFunction: (options: GetCachedOptions) => Promise<TData>,
  options: GetCachedOptions,
  keyParts: string
) => Promise<TData> = async (getFunction, options, keyParts) => {
  const keysArr = Array.from(options.keys.values());
  const getUnstableCache = unstable_cache(
    async (options: GetCachedOptions) => getFunction(options),
    [
      `${keyParts}`,
      ...keysArr,
      // options.filters ? JSON.stringify(options.filters) : "",
    ],
    {
      tags: [`${keyParts}-${keysArr.join("-")}`],
    }
  );
  return getUnstableCache(options);
};
