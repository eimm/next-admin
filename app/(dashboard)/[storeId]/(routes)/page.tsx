import prismadb from "@/lib/prismadb";

// interface DashboardPageProps {
//   params: { storeId: string };
// }

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return <div>Current store: {store?.name}</div>;
}
