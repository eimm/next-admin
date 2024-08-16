import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getCachedStore } from "@/app/api/stores/utils";
import prismadb from "@/lib/prismadb";

import { ApiKeys } from "../../utils";

import { getCachedCategories } from "./utils";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });
    revalidateTag(`Categories-${params.storeId}`);
    return NextResponse.json(category);
  } catch (e) {
    console.log("categories post", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }
    const categories = await getCachedCategories({
      keys: new Map([[ApiKeys.StoreId, params.storeId]]),
    });
    return NextResponse.json(categories);
  } catch (e) {
    console.log("categories get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
