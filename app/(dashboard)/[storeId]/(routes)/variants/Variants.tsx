"use client";

import React, { FC } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/ApiList";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns,VariantColumn } from "./Columns";

interface VariantsProps {
  variants: VariantColumn[];
}

const Variants: FC<VariantsProps> = ({ variants }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Variants (${variants.length})`}
          description="Your variants"
        />
        <Button onClick={() => router.push(`/${params.storeId}/variants/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={variants} filterKey="name" />
      <Heading description="API routes for variants data" title="api" />
      <Separator />
      <ApiList entityName="variants" entityIdName="variantId" />
    </>
  );
};

export default Variants;
