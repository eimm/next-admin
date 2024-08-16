import { getCachedCategories } from "@/app/api/[storeId]/categories/utils";
import { getCachedColours } from "@/app/api/[storeId]/colours/utils";
import { getCachedProduct } from "@/app/api/[storeId]/products/utils";
import { getCachedVariants } from "@/app/api/[storeId]/variants/utils";
import { ApiKeys } from "@/app/api/utils";

import ProductForm from "./ProductForm";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await getCachedProduct({
    keys: new Map([[ApiKeys.ProductId, params.productId]]),
  });
  const categories = await getCachedCategories({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });
  const variants = await getCachedVariants({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });
  const colours = await getCachedColours({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={JSON.parse(JSON.stringify(product))}
          categories={categories}
          variants={variants}
          colours={colours}
        />
      </div>
    </div>
  );
};

export default ProductPage;
