import prismaClient from "@/services/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const updatedProd = {
    title: body.title,
    description: body.description,
    price: body.price,
    thumbnail: body.image_url,
    category: body.category,
    rating: 1,
  };
  const data = prismaClient.product.update({
    where: {
      id: body.id,
    },
    data: updatedProd,
  });
}

