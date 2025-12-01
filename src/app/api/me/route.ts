import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Ye zaroori hai taaki Next.js isko cache na kare
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ user: null, message: "Not logged in" }, { status: 401 });
  }
  
  return NextResponse.json({ user });
}