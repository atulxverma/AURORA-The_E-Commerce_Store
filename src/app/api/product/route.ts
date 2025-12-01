import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Fetch Local DB Products (Latest first)
    const dbProductsPromise = prismaClient.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch External API Products (Limit 30 items)
    const apiProductsPromise = fetch('https://dummyjson.com/products?limit=30')
      .then(res => res.json())
      .then(data => data.products)
      .catch(() => []); // Error aaye to empty array

    // Wait for both
    const [dbProducts, apiProducts] = await Promise.all([
      dbProductsPromise, 
      apiProductsPromise
    ]);

    // 3. Map API Data to match our DB Schema
    // (Zaroori hai taaki frontend pe UI na fte)
    const formattedApiProducts = apiProducts.map((p: any) => ({
      id: String(p.id), // Number to String ID
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      thumbnail: p.thumbnail,
      images: p.images,
      rating: p.rating,
      tags: p.tags || [],
      ownerId: null, // API products ka koi owner nahi hota
      createdAt: new Date().toISOString() // Fake date for sorting
    }));

    // 4. Combine (Local products pehle dikhenge)
    const allProducts = [...dbProducts, ...formattedApiProducts];

    return NextResponse.json({ success: true, products: allProducts });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}