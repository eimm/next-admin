import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { getCachedColours } from "./utils";
import { revalidateTag } from "next/cache";
import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "../../utils";

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
    const colour = await prismadb.colour.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    revalidateTag(`Colours-${params.storeId}`);
    return NextResponse.json(colour);
  } catch (e) {
    console.log("colours post", e);
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
    const colours = await getCachedColours({
      keys: new Map([[ApiKeys.StoreId, params.storeId]]),
    });

    return NextResponse.json(colours);
  } catch (e) {
    console.log("colours get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
