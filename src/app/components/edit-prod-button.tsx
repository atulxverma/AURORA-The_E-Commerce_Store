"use client";
import React, { useState, useRef, useTransition, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- IMPORT ADDED
import { useRouter } from "next/navigation";
import { FiEdit, FiX, FiTrash2 } from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { updateProductInDb } from "@/actions/prodactions";

export default function EditProdButton({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [category, setCategory] = useState(product.category || "");
  const [tags, setTags] = useState(product.tags?.join(", ") || "");

  const initialImages = [product.thumbnail, product.image_url, ...(product.images || [])]
    .filter((img) => img && typeof img === 'string' && img.trim() !== "")
    .filter((val, index, self) => self.indexOf(val) === index);

  const [images, setImages] = useState<string[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const newImgs: string[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => { reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(file); });
      if(result) newImgs.push(result);
    }
    setImages((prev) => [...prev, ...newImgs]);
  };

  const handleAddUrl = () => {
    const val = urlInputRef.current?.value.trim();
    if (val) { setImages((prev) => [...prev, val]); urlInputRef.current!.value = ""; }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdate = () => {
    const finalImages = images.filter(Boolean);
    const mainImage = finalImages[0] || ""; 
    const payload = { id: product.id, title, description, price: Number(price), category, tags: tags.split(",").map(t => t.trim()).filter(Boolean), image_url: mainImage, images: finalImages };

    startTransition(async () => {
      const res = await updateProductInDb(payload);
      if (res.success) {
        alert("Product Updated!"); setOpen(false);
        if (typeof window !== "undefined") window.dispatchEvent(new Event("product-updated"));
        router.refresh();
      } else { alert(res.message || "Update Failed"); }
    });
  };

  // --- PORTAL CONTENT ---
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
                <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none" /></div>
                <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Price</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Category</label><input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none" /></div>
                </div>
                <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Tags</label><input value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none" /></div>
            </div>
            <div className="space-y-5">
                <label className="text-xs font-bold text-gray-500 uppercase">Manage Images</label>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50"><AiOutlineCloudUpload size={32} className="text-gray-400" /><span className="text-sm text-gray-600 mt-2">Upload New Images</span><input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} /></div>
                <div className="flex gap-2"><input ref={urlInputRef} className="flex-1 bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm outline-none" placeholder="Add Image URL" /><button onClick={handleAddUrl} type="button" className="bg-black text-white px-4 rounded-lg text-sm">Add</button></div>
                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">{images.map((src, i) => (<div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"><img src={src} className="w-full h-full object-cover" alt="img" /><button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><FiTrash2 size={12} /></button></div>))}</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 z-10">
          <button onClick={() => setOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleUpdate} disabled={isPending} className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg disabled:opacity-50">{isPending ? "Saving..." : "Update Product"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-md" title="Edit Product"><FiEdit size={18} /></button>
      {open && mounted && createPortal(modalContent, document.body)}
    </>
  );
}