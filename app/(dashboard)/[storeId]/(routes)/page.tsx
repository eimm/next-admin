import { auth } from "@clerk/nextjs/server";
import { ArchiveIcon, CookieIcon, RocketIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";

import Graphs from "@/components/Graphs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { formatter } from "@/lib/utils";

import { getGraphData, getIncome, getSold, getStock } from "./actions";

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;

  const income = await getIncome(params.storeId);
  const inStock = await getStock(params.storeId);
  const sold = await getSold(params.storeId);
  const graphData = await getGraphData(params.storeId);
  return (
    <div>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title="Dashboard" description="Store overview"></Heading>
          <Separator />
          <div className="grid gap-4 grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Sold</CardTitle>
                <CookieIcon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sold}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                <ArchiveIcon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inStock}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <RocketIcon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatter.format(income)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Graphs</CardTitle>
          </CardHeader>
          <CardContent>
            <Graphs data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
