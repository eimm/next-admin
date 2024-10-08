import React from "react";
import { format } from "date-fns";

import { getCachedCategories } from "@/app/api/[storeId]/categories/utils";
import { ApiKeys } from "@/app/api/utils";

import Categories from "./Categories";
import { CategoryColumn } from "./Columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await getCachedCategories({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });

  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "d MMM yyyy"),
    name: item.name,
    billboardLabel: item.billboard.label,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Categories categories={formatedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
