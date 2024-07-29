import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { getCachedCategories } from "./utils";
import { revalidateTag } from "next/cache";
import { getCachedStore } from "@/app/api/stores/utils";

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

    const store = await getCachedStore(userId, params.storeId);

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
    const categories = await getCachedCategories(params.storeId);
    return NextResponse.json(categories);
  } catch (e) {
    console.log("categories get", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
