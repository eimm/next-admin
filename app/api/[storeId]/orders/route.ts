// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import prismadb from "@/lib/prismadb";
// import { getCachedOrders } from "./utils";
// import { revalidateTag } from "next/cache";
// import { getCachedStore } from "@/app/api/stores/utils";
// import { ApiKeys } from "../../utils";

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { label, imageUrl } = body;
//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }
//     if (!label) {
//       return new NextResponse("label is required", { status: 400 });
//     }
//     if (!imageUrl) {
//       return new NextResponse("imageUrl is required", { status: 400 });
//     }
//     if (!params.storeId) {
//       return new NextResponse("storeId is required", { status: 400 });
//     }

//     const store = await getCachedStore({
//       keys: new Map<ApiKeys, string>([
//         [ApiKeys.UserId, userId],
//         [ApiKeys.StoreId, params.storeId],
//       ]),
//     });

//     if (!store) {
//       return new NextResponse("Unathorized", { status: 401 });
//     }
//     const order = await prismadb.order.create({
//       data: {
//         label,
//         imageUrl,
//         storeId: params.storeId,
//       },
//     });
//     revalidateTag(`Orders-${params.storeId}`);
//     return NextResponse.json(order);
//   } catch (e) {
//     console.log("orders post", e);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function GET(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     if (!params.storeId) {
//       return new NextResponse("storeId is required", { status: 400 });
//     }
//     const orders = await getCachedOrders({
//       keys: new Map([[ApiKeys.StoreId, params.storeId]]),
//     });
//     return NextResponse.json(orders);
//   } catch (e) {
//     console.log("orders get", e);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
