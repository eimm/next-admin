import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { getCachedColour } from "../utils";
import { getCachedStore } from "@/app/api/stores/utils";
import { ApiKeys } from "@/app/api/utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colourId: string } }
) {
  try {
    if (!params.colourId) {
      return new NextResponse("colourId is required", { status: 400 });
    }

    const colour = await getCachedColour({
      keys: new Map([[ApiKeys.ColourId, params.colourId]]),
    });

    return NextResponse.json(colour);
  } catch (e) {
    console.log("colour get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colourId: string } }
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
    if (!params.colourId) {
      return new NextResponse("colourId is required", { status: 400 });
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

    const colour = await prismadb.colour.update({
      where: {
        id: params.colourId,
      },
      data: {
        name,
        value,
      },
    });
    revalidateTag(`Colours-${params.storeId}`);
    revalidateTag(`Colour-${params.colourId}`);
    return NextResponse.json(colour);
  } catch (e) {
    console.log("colour patch", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colourId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!params.colourId) {
      return new NextResponse("colourId is required", { status: 400 });
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
    const colour = await prismadb.colour.delete({
      where: {
        id: params.colourId,
      },
    });

    revalidateTag(`Colours-${params.storeId}`);
    revalidateTag(`Colour-${params.colourId}`);
    return NextResponse.json(colour);
  } catch (e) {
    console.log("colour delete", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
