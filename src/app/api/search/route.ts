import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.url;
  const urlObj = new URL(url);
  const query = urlObj.searchParams.get("q") || "";
  if (!query) {
    return NextResponse.json({
      success: false,
      data: [],
      message: "No query provided",
    });
  }

  const data = await prismaClient.product.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  return NextResponse.json({
    success: true,
    data: data,
  });
}
