import type { Metadata, ResolvingMetadata } from 'next';
import prismaClient from "@/services/prisma";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  let product = null;
  
  if (id.length === 24) {
      product = await prismaClient.product.findUnique({ where: { id } });
  } 
  
  if (!product) {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (res.ok) product = await res.json();
  }

  if (!product) {
      return { title: "Item Not Found | Aurora" };
  }

  // --- FIX: ENSURE VALID IMAGE URL ---
  let imageUrl = product.thumbnail || product.images?.[0];

  // Agar image nahi hai to fallback
  if (!imageUrl) imageUrl = "https://placehold.co/600x400.png";

  return {
    title: `${product.title} | Aurora`,
    description: product.description?.slice(0, 160),
    
    openGraph: {
      title: product.title,
      description: `Get ${product.title} at the best price on Aurora.`,
      // --- FORCE ARRAY format for WhatsApp ---
      images: [
        {
          url: imageUrl, 
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description?.slice(0, 100),
      images: [imageUrl],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}