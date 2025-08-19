'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useTransition } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { addProductToDb } from '@/actions/prodactions';

export default function AddProdButton() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image_url, setimage_url] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // ✅ async lagao yaha
  async function handleSubmit() {
    const data = {
      title,
      description,
      price: parseFloat(price),
      category,
      image_url: image_url,
    };
    const res = await addProductToDb(data);

    try {
      const res = await fetch("http://localhost:3000/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ important
        },
        body: JSON.stringify(data),
      });

      const x = await res.json();

      if (x.success) {
        alert("Product added successfully!");
        // reset form
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory('');
        setimage_url('');
        router.refresh(); // ✅ page refresh karega
      } else {
        alert(x.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
      alert("Failed to add product");
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Product
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full bg-white p-6 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-lg font-bold mb-2">Add Product</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Fill in the product details.
          </Dialog.Description>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Title</span>
              <input
                className="border border-gray-300 rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Description</span>
              <input
                className="border border-gray-300 rounded px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Price</span>
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Category</span>
              <input
                className="border border-gray-300 rounded px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Image URL</span>
              <input
                className="border border-gray-300 rounded px-3 py-2"
                value={image_url}
                onChange={(e) => setimage_url(e.target.value)}
                placeholder="Enter image URL"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}







