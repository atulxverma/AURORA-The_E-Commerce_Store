"use client";
import React, { useState, useRef, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AiOutlinePlus, AiOutlineCloudUpload } from "react-icons/ai";
import { FiX, FiTrash2 } from "react-icons/fi";
import { addNewProduct } from "@/actions/prodactions";

export default function AddProdButton({ onProductAdded }: { onProductAdded?: (item: any) => void }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [addedImages, setAddedImages] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const defaultCategories = ["Clothing", "Shoes", "Accessories", "Electronics"];

  useEffect(() => setMounted(true), []);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => { reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(file); });
      if (result) newImages.push(result);
    }
    setAddedImages((prev) => [...prev, ...newImages]);
  };

  const handleAddUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    const val = urlInputRef.current?.value.trim();
    if (val) { setAddedImages((prev) => [...prev, val]); urlInputRef.current!.value = ""; }
  };

  const handleSubmit = () => {
    let finalImages = [...addedImages];
    const pendingUrl = urlInputRef.current?.value.trim();
    if (pendingUrl) finalImages.push(pendingUrl);
    finalImages = finalImages.filter(img => img && img.trim() !== "");

    if (!title || !price || finalImages.length === 0) return alert("Please enter Title, Price and at least 1 Image.");

    const formData = new FormData();
    formData.append("title", title); formData.append("description", description);
    formData.append("price", String(price)); formData.append("category", category || "General"); formData.append("image", finalImages[0]);

    startTransition(async () => {
      const res = await addNewProduct(formData);

      if (res.success && res.newProduct) {
        alert("Product Added Successfully!");
        setOpen(false);

        // --- 1. Direct Parent Update (For Profile Page) ---
        if (onProductAdded) {
          onProductAdded(res.newProduct);
        }

        // --- 2. GLOBAL EVENT UPDATE (For Home Page) ---
        if (typeof window !== "undefined") {
          // Hum naya product data event ke saath bhej rahe hain
          const event = new CustomEvent("product-added-optimistic", {
            detail: res.newProduct
          });
          window.dispatchEvent(event);
        }

        setTitle(""); setDescription(""); setPrice(""); setCategory(""); setTags(""); setAddedImages([]);
        if (urlInputRef.current) urlInputRef.current.value = "";

        router.refresh();
      } else {
        alert(res.message || "Failed to add product");
      }
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Price</label><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none" /></div>
                <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none"><option value="">Select...</option>{defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}<option value="Other">Other</option></select></div>
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Tags</label><input value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none" /></div>
            </div>
            <div className="space-y-5">
              <label className="text-xs font-bold uppercase text-gray-500">Product Images</label>
              <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50"><AiOutlineCloudUpload size={40} className="text-gray-400 mb-2" /><p className="font-medium text-gray-600">Click to Upload</p><input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} /></div>
              <div className="flex gap-2"><input ref={urlInputRef} className="flex-1 bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm outline-none" placeholder="Paste Image URL" /><button type="button" onClick={handleAddUrl} className="bg-black text-white px-4 rounded-lg text-sm font-medium">Add</button></div>
              <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">{addedImages.map((src, i) => (<div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"><img src={src} className="w-full h-full object-cover" alt="preview" /><button onClick={() => setAddedImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><FiTrash2 size={12} /></button></div>))}</div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 z-10">
          <button onClick={() => setOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={isPending} className="px-8 py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition shadow-lg disabled:opacity-50">{isPending ? "Publishing..." : "Publish Product"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        // Added: cursor-pointer hover:scale-110 active:scale-95
        className="flex items-center justify-center bg-black text-white w-10 h-10 rounded-full hover:scale-110 active:scale-95 transition shadow-lg cursor-pointer"
        title="Add New Product"
      >
        <AiOutlinePlus size={20} />
      </button>

      {open && mounted && createPortal(modalContent, document.body)}
    </>
  );
}