import prismadb from "@/lib/prismadb";
import CategoryForm from "./CategoryForm";
import { getCachedCategory } from "@/app/api/[storeId]/categories/utils";
import { getCachedBillboards } from "@/app/api/[storeId]/billboards/utils";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await getCachedCategory(params.categoryId);
  const billboards = await getCachedBillboards(params.storeId);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
