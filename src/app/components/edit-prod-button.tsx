// //@ts-nocheck
// "use client";

// import * as Dialog from "@radix-ui/react-dialog";
// import { useState } from "react";
// import React from "react";
// import { updateProductInDb } from "@/actions/prodactions";
// import { useRouter } from "next/router";

// export default function EditProdButton({ item ,handleUpdate}) {
//   const [title, setTitle] = useState(item?.title || "");
//   const [description, setDescription] = useState(item?.description || "");
//   const [price, setPrice] = useState(item?.price?.toString() || "");
//   const [category, setCategory] = useState(item?.category || "");
//   const [image_url, setimage_url] = useState(item?.image_url || "");
//   // const router = useRouter();

//   async function handleSubmit() {
//     const parsedPrice = parseFloat(price);

//     const data = {
//       title,
//       description,
//       price: parsedPrice,
//       category,
//       image_url: image_url,
//     };

//     handleUpdate(item.id , data)
//     data.id = IdleDeadline;
//     const res = await fetch("http://localhost:3000/api/products/update",{
//       method : "POST",
//       body : JSON.stringify ({
//         ...data,
//         id : item.id
//       })
//     })
  
//     // const res = await updateProductInDb(item.id, data);
//     // if(res.success){
//     //   alert("Product updated successfully");
//     //   handleUpdate(item.id , data)
//     // } else{
//     //   console.log(res)
//     //   alert("Wrong")
//     // }
//   }

//   return (
//     <Dialog.Root>
//       <Dialog.Trigger asChild>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//           Edit Product
//         </button>
//       </Dialog.Trigger>

//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//         <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full bg-white p-6 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
//           <Dialog.Title className="text-lg font-bold mb-2">
//             Edit Product
//           </Dialog.Title>
//           <Dialog.Description className="text-sm text-gray-600 mb-4">
//             Update product details below.
//           </Dialog.Description>

//           <div className="flex flex-col gap-4">
//             <label className="flex flex-col">
//               <span className="text-sm font-medium mb-1">Title</span>
//               <input
//                 className="border border-gray-300 rounded px-3 py-2"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter product title"
//               />
//             </label>

//             <label className="flex flex-col">
//               <span className="text-sm font-medium mb-1">Description</span>
//               <input
//                 className="border border-gray-300 rounded px-3 py-2"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Enter product description"
//               />
//             </label>

//             <label className="flex flex-col">
//               <span className="text-sm font-medium mb-1">Price</span>
//               <input
//                 type="number"
//                 className="border border-gray-300 rounded px-3 py-2"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 placeholder="Enter price"
//               />
//             </label>

//             <label className="flex flex-col">
//               <span className="text-sm font-medium mb-1">Category</span>
//               <input
//                 className="border border-gray-300 rounded px-3 py-2"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 placeholder="Enter category"
//               />
//             </label>

//             <label className="flex flex-col">
//               <span className="text-sm font-medium mb-1">Image URL</span>
//               <input
//                 className="border border-gray-300 rounded px-3 py-2"
//                 value={image_url}
//                 onChange={(e) => setimage_url(e.target.value)}
//                 placeholder="Enter image URL"
//               />
//             </label>
//           </div>

//           <div className="flex justify-end gap-3 mt-6">
//             <Dialog.Close asChild>
//               <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
//                 Cancel
//               </button>
//             </Dialog.Close>
//             <Dialog.Close asChild>
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </Dialog.Close>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }





"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export default function EditProdButton({
  product,
  onUpdate,
}: {
  product: any;
  onUpdate: (updatedItem: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    image_url: product.image_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await onUpdate(formData); // call parent update function
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition">
          Edit
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-96 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">Edit Product</Dialog.Title>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="border px-3 py-2 rounded-md"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border px-3 py-2 rounded-md"
            />
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              className="border px-3 py-2 rounded-md"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
