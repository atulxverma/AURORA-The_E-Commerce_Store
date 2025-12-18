import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  // --- FIX: Correct Type for Next 15 ---
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // --- FIX: Await Params ---
    const { id } = await params; 

    let product = null;
    
    // Check DB (24 chars)
    if (id.length === 24) {
      product = await prismaClient.product.findUnique({
        where: { id: id },
        include: {
            reviews: {
                include: { user: { select: { name: true } } },
                orderBy: { createdAt: 'desc' }
            }
        }
      });
    }

    // Fallback to DummyJSON
    if (!product) {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (res.ok) {
        product = await res.json();
        product.reviews = []; 
      }
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "Error fetching product" },
      { status: 500 }
    );
  }
}