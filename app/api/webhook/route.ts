import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const body = await req.text();
  const sign = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sign,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e: any) {
    return new NextResponse(`Webhook error: ${e.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressString = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isCompleted: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        items: true,
      },
    });

    const productIds = order.items.map((i) => i.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        quantity: { decrement: 1 },
      },
    });

    await prismadb.product.updateMany({
      where: {
        quantity: 0,
      },
      data: {
        isArchived: true,
      },
    });

    revalidateTag(`Products-${session?.metadata?.storeId}`);
    productIds.forEach((id) => revalidateTag(`Product-${id}`));
  }

  return new NextResponse(null, { status: 200 });
}
