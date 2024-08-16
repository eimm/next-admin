import React from "react";
import { format } from "date-fns";

import { getCachedProducts } from "@/app/api/[storeId]/products/utils";
import { ApiKeys } from "@/app/api/utils";
import { formatter } from "@/lib/utils";

import { ProductColumn } from "./Columns";
import Products from "./Products";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await getCachedProducts({
    keys: new Map([[ApiKeys.StoreId, params.storeId]]),
  });
  const formatedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(Number(item.price)),
    category: item.category.name,
    variant: item.variant.name,
    colour: item.colour.value,
    quantity: String(item.quantity),
    createdAt: format(item.createdAt, "d MMM yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Products products={formatedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
