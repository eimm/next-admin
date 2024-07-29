import React, { FC } from "react";
import { format } from "date-fns";
import { CategoryColumn } from "./Columns";
import Categories from "./Categories";
import { getCachedCategories } from "@/app/api/[storeId]/categories/utils";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await getCachedCategories(params.storeId);

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
