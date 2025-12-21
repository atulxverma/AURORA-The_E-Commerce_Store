import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";
import prismaClient from "@/services/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Fetch Cart from DB to get REAL total
    const cartItems = await prismaClient.cart.findMany({
        where: { userId: user.id }
    });

    if (cartItems.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // 2. Calculate Final Amount (Add Shipping/Tax if needed)
    // Example: Total + 50 (Shipping)
    const finalAmount = Math.ceil(total * 1.18); // Example 18% Tax

    const options = {
      amount: finalAmount * 100, // Amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}