import React from "react";
import { format } from "date-fns";

import { getCachedBillboards } from "@/app/api/[storeId]/billboards/utils";
import { ApiKeys } from "@/app/api/utils";

import Billboards from "./Billboards";
import { BillboardColumn } from "./Columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await getCachedBillboards({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });
  const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "d MMM yyyy"),
    label: item.label,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Billboards billboards={formatedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
