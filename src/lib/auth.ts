import { cookies } from "next/headers";
import { verifyToken } from "@/services/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("❌ AUTH FAIL: No Token Found");
    return null;
  }

  try {
    const decoded = verifyToken(token);
    // console.log("✅ AUTH SUCCESS: Decoded User:", decoded);
    return decoded as { id: string; email: string; username: string };
  } catch (error) {
    console.log("❌ AUTH FAIL: Invalid Token");
    return null;
  }
}