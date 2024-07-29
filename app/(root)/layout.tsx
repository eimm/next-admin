import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCachedStore } from "../api/stores/utils";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) return null;

  const store = await getCachedStore(userId);

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
