import React, { FC } from "react";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { VariantColumn } from "./Columns";
import Variants from "./Variants";

const VariantsPage = async ({ params }: { params: { storeId: string } }) => {
  const variants = await prismadb.variant.findMany({
    where: { storeId: params.storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedVariants: VariantColumn[] = variants.map((item) => ({
    id: item.id,
    createdAt: format(item.createdAt, "d MMM yyyy"),
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Variants variants={formatedVariants} />
      </div>
    </div>
  );
};

export default VariantsPage;
