"use client";
import Link from "next/link";
import React from "react";

//@ts-ignore
export default function AddToCart({ item }) {
  function handleAdd() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let updatedCart = [...cart, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

      const existingItem = updatedCart.find(function(elem){
      return (elem.id == item.id);
    })

    if(existingItem){
      existingItem.quantity =existingItem.quantity +1 ;
    } else {
      const itemToAdd = {
        ...item,
      quantity : 1
      }
      updatedCart.push(itemToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert(`${item.title} added to cart!`);
  }
  

  return (
    <button
      onClick={handleAdd}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
    >
      Review Product
    </button>
  );
}
