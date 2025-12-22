import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prismaClient from "@/services/prisma";
import Header from "../components/Header";
import AdminDashboardClient from "./components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();

  // --- SECURITY CHECK ---
  // Replace with your exact email
  if (!user || user.email !== "atulv9926@gmail.com") {
      return redirect("/"); 
  }

  // --- FETCH DATA (Database se) ---
  const [productsCount, usersCount, orders] = await Promise.all([
      prismaClient.product.count(),
      prismaClient.user.count(),
      prismaClient.order.findMany({ 
          orderBy: { createdAt: 'desc' },
          include: { user: true }
      })
  ]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-black selection:text-white">
      <Header user={user} />
      
      {/* Pass data to Client Component */}
      <AdminDashboardClient 
        productsCount={productsCount} 
        usersCount={usersCount} 
        orders={orders} 
        user={user}
      />
    </div>
  );
}