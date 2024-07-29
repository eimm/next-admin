import { getCachedStore } from "@/app/api/stores/utils";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

// interface DashboardPageProps {
//   params: { storeId: string };
// }

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;
  const store = await getCachedStore(userId, params.storeId);

  return <div>Current store: {store?.name}</div>;
}
