import React, { FC } from "react";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "./Columns";
import Billboards from "./Billboards";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: {
      createdAt: "desc",
    },
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
