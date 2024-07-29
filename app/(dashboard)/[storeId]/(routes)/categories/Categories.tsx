"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./Columns";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ApiList";

interface CategoriesProps {
  categories: CategoryColumn[];
}

const Categories: FC<CategoriesProps> = ({ categories }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Your Categories"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categories} filterKey="name" />
      <Heading description="API routes for billoboards data" title="api" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default Categories;
