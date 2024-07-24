"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";

interface BillboardsProps {}

const Billboards: FC<BillboardsProps> = ({}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="flex items-center justify-between">
      <Heading title="Billboards" description="Your billboards" />
      <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
};

export default Billboards;
