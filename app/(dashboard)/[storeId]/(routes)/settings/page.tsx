import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import SettingsForm from "./SettingsForm";
import { getCachedStore } from "@/app/api/stores/utils";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { userId } = auth();
  if (!userId) return null;

  const store = await getCachedStore(userId, params.storeId);

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4 lg:max-w-[50%]">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}
