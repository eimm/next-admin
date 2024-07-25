"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./Columns";
import { DataTable } from "@/components/DataTable";
import { Separator } from "@/components/ui/separator";

interface BillboardsProps {
  billboards: BillboardColumn[];
}

const Billboards: FC<BillboardsProps> = ({ billboards }) => {
  const router = useRouter();
  const params = useParams();

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
    </>
  );
};

export default Billboards;
