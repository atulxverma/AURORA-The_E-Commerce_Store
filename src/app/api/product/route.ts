// import prismaClient from "@/services/prisma";
// import { NextResponse, NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const res = await prismaClient.product.findMany();
//     return NextResponse.json({
//       success: true,
//       data: res,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const product = await prismaClient.product.create({
//       data: {
//         title: body.title,
//         description: body.description,
//         price: body.price,
//         thumbnail: body.image_url,
//         category: body.category,
//         rating: 1,
//       },
//     });
//     return NextResponse.json({ success: true, data: product });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
//   }
// }






// @ts-nocheck
import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";


// GET all products
export async function GET() {
  try {
    const products = await prismaClient.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = await prismaClient.product.create({
      data: body,
    });
    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
