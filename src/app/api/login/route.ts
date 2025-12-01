import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";
import { generateToken } from "@/services/jwt"; 
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // CRITICAL STEP: Token me ID store kar rahe hain
    const token = generateToken({ 
        id: user.id, 
        email: user.email, 
        username: user.username 
    });

    // Cookie Set kar rahe hain
    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true, path: "/" });

    console.log("✅ LOGIN SUCCESS - User ID:", user.id); // Debug Log

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}