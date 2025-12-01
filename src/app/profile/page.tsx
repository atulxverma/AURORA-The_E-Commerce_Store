import React from "react";
import Header from "../components/Header";
import prismaClient from "@/services/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // 1. Check Session
  const session = await getCurrentUser();
  if (!session) redirect("/login");

  // 2. Get Full User Details from DB
  const userDetails = await prismaClient.user.findUnique({ where: { id: session.id } });

  // --- CRITICAL FIX: Agar DB me user nahi mila (deleted), to Login pe bhejo ---
  if (!userDetails) {
    redirect("/login");
  }

  // 3. Get User's Products
  const myProducts = await prismaClient.product.findMany({
    where: { ownerId: session.id },
    orderBy: { createdAt: "desc" }
  });

  // 4. Get User's Orders
  const myOrders = await prismaClient.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={userDetails} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <ProfileClient 
            user={userDetails} 
            products={myProducts} 
            orders={myOrders} 
        />
      </div>
    </div>
  );
}