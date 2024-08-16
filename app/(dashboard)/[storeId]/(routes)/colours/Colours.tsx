"use client";

import React, { FC } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/ApiList";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ColourColumn, columns } from "./Columns";

interface ColoursProps {
  colours: ColourColumn[];
}

const Colours: FC<ColoursProps> = ({ colours }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colours (${colours.length})`}
          description="Your colours"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colours/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colours} filterKey="name" />
      <Heading description="API routes for colours data" title="api" />
      <Separator />
      <ApiList entityName="colours" entityIdName="colourId" />
    </>
  );
};

export default Colours;
