// //@ts-nocheck
// 'use client'
// import prismaClient from '@/services/prisma';
// import { useState } from 'react';
// import { createContext } from 'react'
// export const NewCartContext = createContext();
// export default function CartContextProvider({children, initialCartItems})
// {
//     const [cart,setCart] = useState(initialCartItems)
//   return (
//     <div>
//         <NewCartContext.Provider value={{cart,setCart}}>
//             {children}
//         </NewCartContext.Provider>
//     </div>
//     )
// }




"use client";
import React, { createContext, useState, useEffect } from "react";

export const NewCartContext = createContext({
  cart: [] as any[],
  setCart: (cart: any[]) => {},
});

export default function CartContextProvider({
  children,
  initialCartItems = [],
}: {
  children: React.ReactNode;
  initialCartItems?: any[];
}) {
  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : initialCartItems;
    }
    return initialCartItems;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <NewCartContext.Provider value={{ cart, setCart }}>
      {children}
    </NewCartContext.Provider>
  );
}
