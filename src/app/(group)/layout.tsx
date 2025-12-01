"use client"; 
import "../globals.css";

import { useState } from "react";
import CartContextProvider from "../components/cart-context";

export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <div>
      <CartContextProvider initialCartItems={[]}>
        <div>{children}</div>
      </CartContextProvider>
    </div>
  );
}