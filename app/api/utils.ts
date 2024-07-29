import { unstable_cache } from "next/cache";

export const getCached: <TData>(
  getFunction: (key: string, secondKey?: string) => Promise<TData>,
  keyParts: string,
  key: string,
  secondKey?: string
) => Promise<TData> = async (getFunction, keyParts, key, secondKey) => {
  const getUnstableCache = unstable_cache(
    async (key: string, secondKey?: string) => getFunction(key, secondKey),
    [`${keyParts}`],
    {
      tags: secondKey
        ? [`${keyParts}-${key}-${secondKey}`]
        : [`${keyParts}-${key}`],
    }
  );
  return getUnstableCache(key, secondKey);
};
