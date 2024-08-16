import React from "react";
import { format } from "date-fns";

import { getCachedVariants } from "@/app/api/[storeId]/variants/utils";
import { ApiKeys } from "@/app/api/utils";

import { VariantColumn } from "./Columns";
import Variants from "./Variants";

const VariantsPage = async ({ params }: { params: { storeId: string } }) => {
  const variants = await getCachedVariants({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });

  const formatedVariants: VariantColumn[] = variants.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "d MMM yyyy"),
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Variants variants={formatedVariants} />
      </div>
    </div>
  );
};

export default VariantsPage;
