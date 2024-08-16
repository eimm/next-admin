import { getCachedBillboards } from "@/app/api/[storeId]/billboards/utils";
import { getCachedCategory } from "@/app/api/[storeId]/categories/utils";
import { ApiKeys } from "@/app/api/utils";

import CategoryForm from "./CategoryForm";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await getCachedCategory({
    keys: new Map([[ApiKeys.CategoryId, params.categoryId]]),
  });
  const billboards = await getCachedBillboards({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
