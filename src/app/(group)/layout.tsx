//@ts-nocheck
import { useState } from "react";
import Header from "./component/Header";
import CartContextProvider from "../components/cart-context";
import prismaClient from "@/services/prisma";
//@ts-ignore
export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  mmodal: React.ReactNode;
}>) {
  const cartItem = await prismaClient.product.findMany();

  return (
    <div>
      <CartContextProvider initialCartItems={cartItem}>
        <div>{children}</div>
      </CartContextProvider>
    </div>
  );
}
