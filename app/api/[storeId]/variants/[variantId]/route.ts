import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { getCachedVariant } from "../utils";
import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "@/app/api/utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; variantId: string } }
) {
  try {
    if (!params.variantId) {
      return new NextResponse("variantId is required", { status: 400 });
    }

    const variant = await getCachedVariant({
      keys: new Map([[ApiKeys.VariantId, params.variantId]]),
    });

    return NextResponse.json(variant);
  } catch (e) {
    console.log("variant get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; variantId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value is required", { status: 400 });
    }
    if (!params.variantId) {
      return new NextResponse("variantId is required", { status: 400 });
    }

    const storeByUserId = await getCachedStore({
      keys: new Map<ApiKeys, string>([
        [ApiKeys.UserId, userId],
        [ApiKeys.StoreId, params.storeId],
      ]),
    });

    if (!storeByUserId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const variant = await prismadb.variant.updateMany({
      where: {
        id: params.variantId,
      },
      data: {
        name,
        value,
      },
    });
    revalidateTag(`Variants-${params.storeId}`);
    revalidateTag(`Variant-${params.variantId}`);
    return NextResponse.json(variant);
  } catch (e) {
    console.log("variant patch", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; variantId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!params.variantId) {
      return new NextResponse("variantId is required", { status: 400 });
    }

    const storeByUserId = await getCachedStore({
      keys: new Map<ApiKeys, string>([
        [ApiKeys.UserId, userId],
        [ApiKeys.StoreId, params.storeId],
      ]),
    });
    if (!storeByUserId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const variant = await prismadb.variant.deleteMany({
      where: {
        id: params.variantId,
      },
    });

    revalidateTag(`Variants-${params.storeId}`);
    revalidateTag(`Variant-${params.variantId}`);
    return NextResponse.json(variant);
  } catch (e) {
    console.log("variant delete", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
