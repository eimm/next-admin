import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "@/app/api/utils";
import { getCachedCategory } from "../utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }

    const category = await getCachedCategory({
      keys: new Map([[ApiKeys.CategoryId, params.categoryId]]),
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("category get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
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

    const category = await prismadb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    revalidateTag(`Categories-${params.storeId}`);
    revalidateTag(`Category-${params.categoryId}`);
    return NextResponse.json(category);
  } catch (e) {
    console.log("categories patch", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!params.categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
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
    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    revalidateTag(`Categories-${params.storeId}`);
    revalidateTag(`Category-${params.categoryId}`);

    return NextResponse.json(category);
  } catch (e) {
    console.log("category delete", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
