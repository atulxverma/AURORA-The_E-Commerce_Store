import prismaClient from "@/services/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const updatedProd = await prismaClient.product.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        category: body.category,
        brand: body.brand,
        tags: body.tags || [],
        images: body.images || [],
        thumbnail: body.images?.[0] || body.thumbnail || "",
        rating: body.rating ?? 0,
      },
    });

    return NextResponse.json({ success: true, product: updatedProd });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}
