import prismadb from "@/lib/prismadb";
import BillboardForm from "./BillboardForm";
import { getCachedBillboard } from "@/app/api/[storeId]/billboards/utils";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await getCachedBillboard(params.billboardId);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
