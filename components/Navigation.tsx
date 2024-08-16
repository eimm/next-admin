import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

import { ModeToggle } from "./ModeToggle";
import Routes from "./Routes";
import StoresSelect from "./StoresSelect";

export default async function Navigation() {
  const { userId } = auth();
  if (!userId) return null;

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoresSelect items={stores} />
        <Routes className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
