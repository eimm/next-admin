import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getCachedStore } from "@/app/api/stores/utils";
import prismadb from "@/lib/prismadb";

import { ApiKeys } from "../../utils";

import { getCachedBillboards } from "./utils";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
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
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });
    revalidateTag(`Billboards-${params.storeId}`);
    return NextResponse.json(billboard);
  } catch (e) {
    console.log("billboards post", e);
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
    const billboards = await getCachedBillboards({
      keys: new Map([[ApiKeys.StoreId, params.storeId]]),
    });
    return NextResponse.json(billboards);
  } catch (e) {
    console.log("billboards get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
