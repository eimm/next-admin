import { ApiKeys } from "@/app/api/utils";
import ColourForm from "./ColourForm";
import { getCachedColour } from "@/app/api/[storeId]/colours/utils";

const ColourPage = async ({ params }: { params: { colourId: string } }) => {
  const colour = await getCachedColour({
    keys: new Map([[ApiKeys.ColourId, params.colourId]]),
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColourForm initialData={colour} />
      </div>
    </div>
  );
};

export default ColourPage;
