//@ts-nocheck
"use client";
import { div } from "framer-motion/client";
import { useState } from "react";
import ItemCard from "./Item-card";

export default function HomePageProds({ initialProds }) {
  const [products, setProducts] = useState(initialProds);
  const [rating, setRating] = useState("1");

  let filteredProds = products.filter((prod) => {
    return prod.rating >= rating;
  });

  function deleteItem(id) {
    const updateItems = products.filter((prod) => prod.id !== id);
    setProducts(updateItems);
  }

  function handleUpdate(id, data) {
    const updatedProds = products.map((prod) => {
      if (prod.id === id) {
        return {
          id: prod.id,
          ...data,
        };
      }
      return prod;
    });
    setProducts(updatedProds);
  }

  return (
    <div>
      <div>
        <select
          name="rating"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-10">
        {filteredProds.map(function (item) {
          return (
            <ItemCard
              key={item.id}
              item={item}
              deleteItem={deleteItem}
              handleUpdate={handleUpdate}
            />
          );
        })}
      </div>
    </div>
  );
}
