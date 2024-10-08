import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("StoreID is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    revalidateTag(`Stores-${userId}`);
    revalidateTag(`Store-${[userId, params.storeId].sort().join("-")}`);
    return NextResponse.json(store);
  } catch (e) {
    console.log("[STORE_PATCH]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("StoreID is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    revalidateTag(`Stores-${userId}`);
    revalidateTag(`Store-${userId}-${params.storeId}`);

    return NextResponse.json(store);
  } catch (e) {
    console.log("[STORE_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
