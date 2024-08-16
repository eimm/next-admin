import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { ProductFormSchema } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/ProductForm";
import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "@/app/api/utils";
import prismadb from "@/lib/prismadb";

import { getCachedProduct } from "../utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("productId is required", { status: 400 });
    }

    const product = await getCachedProduct({
      keys: new Map([[ApiKeys.ProductId, params.productId]]),
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCT_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        ...body,
        images: { deleteMany: {} },
      },
    });
    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        images: { createMany: { data: body.images } },
      },
    });

    revalidateTag(`Products-${params.storeId}`);
    revalidateTag(`Product-${params.productId}`);
    return NextResponse.json(product);
  } catch (e) {
    console.log("products patch", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!params.productId) {
      return new NextResponse("productId is required", { status: 400 });
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    revalidateTag(`Products-${params.storeId}`);
    revalidateTag(`Product-${params.productId}`);
    return NextResponse.json(product);
  } catch (e) {
    console.log("[BILLBOARD_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
