import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ products: [] });

  try {
    // 1. DB Search (Loose match)
    const dbProducts = await prismaClient.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 50 // Increased limit for better results page
    });

    // 2. API Search
    const apiRes = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=50`);
    const apiData = await apiRes.json();
    
    const apiProducts = apiData.products.map((p: any) => ({
      id: String(p.id),
      title: p.title,
      price: p.price,
      thumbnail: p.thumbnail,
      category: p.category,
      description: p.description,
      rating: p.rating
    }));

    return NextResponse.json({ products: [...dbProducts, ...apiProducts] });

  } catch (error) {
    return NextResponse.json({ products: [] });
  }
}