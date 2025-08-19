// "use client";
// import { useState, useEffect } from "react";
// import ItemCard from "../components/Item-card";

// export default function Home() {
//   const [products, setProducts] = useState<any[]>([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/api/product")
//       .then((res) => res.json())
//       .then((data) => setProducts(data.data));
//   }, []);

//   const handleUpdate = (id: number, updatedData: any) => {
//     setProducts((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
//     );
//   };

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {products.map((item) => (
//         <ItemCard key={item.id} item={item} handleUpdate={handleUpdate} />
//       ))}
//     </div>
//   );
// }






"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ItemCard from "../components/Item-card";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-4 gap-6 p-6">
        {products.map((item) => (
          <ItemCard key={item.id} item={item} deleteItem={handleDelete} />
        ))}
      </div>
    </div>
  );
}
