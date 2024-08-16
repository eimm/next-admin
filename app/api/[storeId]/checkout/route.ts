import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

import { getCachedProductsById } from "./utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = (await req.json()) as { productIds: string[] };

  if (!productIds?.length) {
    return new NextResponse("Products are required", { status: 400 });
  }

  const products = await getCachedProductsById(productIds);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((p) => {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: p.name,
        },
        unit_amount: Number(p.price) * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isCompleted: false,
      items: {
        create: productIds.map((id) => ({
          product: {
            connect: {
              id: id,
            },
          },
        })),
      },
    },
  });

  revalidateTag(`Orders-${params.storeId}`);

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    metadata: {
      orderId: order.id,
      storeId: params.storeId,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
