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

export interface GetCachedOptions<TFilter = {}> {
  keys: Map<ApiKeys, string>;
  filters?: TFilter;
}

export const getCached: <TData, TFilter>(
  getFunction: (options: GetCachedOptions<TFilter>) => Promise<TData>,
  options: GetCachedOptions<TFilter>,
  keyParts: string
) => Promise<TData> = async (getFunction, options, keyParts) => {
  const keysArr = Array.from(options.keys.values()).sort();
  const filters = options.filters
    ? Object.values(options.filters).map((f) => String(f))
    : [];
  const getUnstableCache = unstable_cache(
    async () => getFunction(options),
    [`${keyParts}`, ...keysArr, ...filters],
    {
      tags: [`${keyParts}-${keysArr.join("-")}`],
    }
  );
  return getUnstableCache();
};
