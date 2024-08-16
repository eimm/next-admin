import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "@/app/api/utils";
import Navigation from "@/components/Navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navigation /> {children}
    </>
  );
}
