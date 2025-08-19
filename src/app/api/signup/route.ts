import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await prismaClient.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const user = await prismaClient.user.create({
      data: { name, username, email, password },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
