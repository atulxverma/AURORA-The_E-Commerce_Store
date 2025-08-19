// //@ts-nocheck
// "use client";

// import { button } from "framer-motion/client";
// import { deleteProductFromDb } from "@/actions/prodactions";
// import React from "react";

// export default function DeleteItem({id, deleteItem}) {
//   async function handleDelete(id) {
//     // deleteItem(id);
//     const res = await deleteProductFromDb(id);
//     deleteItem(id);

//     if (res.success) {
//       alert("deleted successfully");
//     } else{
//         alert("Something went wrong");
//     }
//   }
//   return(
//     <div>
//         <button  onClick={handleDelete}>Delete</button>
//     </div>
//   )
// }








//@ts-nocheck
"use client";
import React from "react";
import { deleteProductFromDb } from "@/actions/prodactions";

export default function DeleteItem({
  id,
  deleteItem,
  removeFromCart,
}: {
  id: string;
  deleteItem: (id: string) => void;
  removeFromCart?: (id: string) => void;
}) {
  const handleDelete = async () => {
    const res = await deleteProductFromDb(id);

    if (res.success) {
      deleteItem(id); // update parent product list
      if (removeFromCart) removeFromCart(id); // remove from cart if exists
      alert("Deleted successfully");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
    >
      Delete
    </button>
  );
}
