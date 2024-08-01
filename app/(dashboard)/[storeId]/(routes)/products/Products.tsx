"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./Columns";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ApiList";

interface ProductsProps {
  products: ProductColumn[];
}

const Products: FC<ProductsProps> = ({ products }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={products} filterKey="name" />
      <Heading description="API routes for products data" title="api" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default Products;
