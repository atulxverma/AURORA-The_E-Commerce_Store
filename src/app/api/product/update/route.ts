import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
        
    const updatedProduct = await prismaClient.product.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        category: body.category,
        tags: body.tags || [],
        images: body.images || [],
        thumbnail: body.images?.[0] || body.thumbnail || "",
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}