import prismadb from "@/lib/prismadb";
import VariantForm from "./VariantForm";

const VariantPage = async ({ params }: { params: { variantId: string } }) => {
  const variant = await prismadb.variant.findUnique({
    where: { id: params.variantId },
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
