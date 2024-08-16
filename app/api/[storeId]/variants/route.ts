import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getCachedStore } from "@/app/api/stores/utils";
import prismadb from "@/lib/prismadb";

import { ApiKeys } from "../../utils";

import { getCachedVariants } from "./utils";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
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
    const variant = await prismadb.variant.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    revalidateTag(`Variants-${params.storeId}`);
    return NextResponse.json(variant);
  } catch (e) {
    console.log("variants post", e);
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
    const variants = await getCachedVariants({
      keys: new Map([[ApiKeys.StoreId, params.storeId]]),
    });
    return NextResponse.json(variants);
  } catch (e) {
    console.log("variants get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
