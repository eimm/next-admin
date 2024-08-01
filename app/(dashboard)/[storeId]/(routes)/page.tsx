import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "@/app/api/utils";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;
  const store = await getCachedStore({
    keys: new Map<ApiKeys, string>([
      [ApiKeys.UserId, userId],
      [ApiKeys.StoreId, params.storeId],
    ]),
  });
  return <div>Current store: {store?.name}</div>;
}
