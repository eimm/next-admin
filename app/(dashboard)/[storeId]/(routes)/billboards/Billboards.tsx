"use client";

import React, { FC } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/ApiList";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { BillboardColumn, columns } from "./Columns";

interface BillboardsProps {
  billboards: BillboardColumn[];
}

const Billboards: FC<BillboardsProps> = ({ billboards }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Your billboards"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboards} filterKey="label" />
      <Heading description="API routes for billoboards data" title="api" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};

export default Billboards;
