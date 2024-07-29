import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import { getCachedStore } from "@/app/api/stores/utils";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;

  const store = await getCachedStore(userId, params.storeId);

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navigation /> {children}
    </>
  );
}
