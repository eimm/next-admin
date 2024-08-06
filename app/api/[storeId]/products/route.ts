import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { ProductFormSchema } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/ProductForm";
import { getCachedProducts } from "./utils";
import { revalidateTag } from "next/cache";
import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "../../utils";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = (await req.json()) as ProductFormSchema;
    const requiredFields = {
      ...body,
      images: !!body.images.length,
      isFeatured: true,
      isArchived: true,
    };
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!Object.values(requiredFields).every(Boolean)) {
      return new NextResponse("missing a required field", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const store = await getCachedStore({
      keys: new Map<ApiKeys, string>([
        [ApiKeys.UserId, userId],
        [ApiKeys.StoreId, params.storeId],
      ]),
    });

    if (!store) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const product = await prismadb.product.create({
      data: {
        ...body,
        storeId: params.storeId,
        images: { createMany: { data: body.images } },
      },
    });
    revalidateTag(`Products-${params.storeId}`);
    return NextResponse.json(product);
  } catch (e) {
    console.log("products post", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const productFilters = {
      categoryId: searchParams.get("categoryId") || undefined,
      colourId: searchParams.get("colourId") || undefined,
      variantId: searchParams.get("variantId") || undefined,
      isFeatured: searchParams.get("isFeatured")
        ? searchParams.get("isFeatured") === "true" || false
        : undefined,
      isArchived: false,
    };

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }
    const products = await getCachedProducts({
      keys: new Map([[ApiKeys.StoreId, params.storeId]]),
      filters: productFilters,
    });

    return NextResponse.json(products);
  } catch (e) {
    console.log("products get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
