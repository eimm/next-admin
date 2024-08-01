import React, { FC } from "react";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { ColourColumn } from "./Columns";
import Colours from "./Colours";
import { getCachedColours } from "@/app/api/[storeId]/colours/utils";
import { ApiKeys } from "@/app/api/utils";

const ColoursPage = async ({ params }: { params: { storeId: string } }) => {
  const colours = await getCachedColours({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });

  const formatedColours: ColourColumn[] = colours.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "d MMM yyyy"),
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Colours colours={formatedColours} />
      </div>
    </div>
  );
};

export default ColoursPage;
