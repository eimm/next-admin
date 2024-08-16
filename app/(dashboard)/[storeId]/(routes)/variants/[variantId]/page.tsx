import { getCachedVariant } from "@/app/api/[storeId]/variants/utils";
import { ApiKeys } from "@/app/api/utils";

import VariantForm from "./VariantForm";

const VariantPage = async ({ params }: { params: { variantId: string } }) => {
  const variant = await getCachedVariant({
    keys: new Map([[ApiKeys.VariantId, params.variantId]]),
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VariantForm initialData={variant} />
      </div>
    </div>
  );
};

export default VariantPage;
