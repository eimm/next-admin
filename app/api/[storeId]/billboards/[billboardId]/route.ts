import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { getCachedBillboard } from "../utils";
import { revalidateTag } from "next/cache";
import { getCachedStore } from "@/app/api/stores/utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
    }

    const billboard = getCachedBillboard(params.billboardId);

    return NextResponse.json(billboard);
  } catch (e) {
    console.log("[BILLBOARD_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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
    if (!params.billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
    }

    const store = await getCachedStore(userId, params.storeId);

    if (!store) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    revalidateTag(`Billboards-${params.storeId}`);
    revalidateTag(`Billboard-${params.billboardId}`);
    return NextResponse.json(billboard);
  } catch (e) {
    console.log("billboards patch", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!params.billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
    }

    const store = await getCachedStore(userId, params.storeId);

    if (!store) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    revalidateTag(`Billboards-${params.storeId}`);
    revalidateTag(`Billboard-${params.billboardId}`);
    return NextResponse.json(billboard);
  } catch (e) {
    console.log("[BILLBOARD_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
