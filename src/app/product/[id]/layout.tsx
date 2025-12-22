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

  const image = product.thumbnail || product.images?.[0] || "https://placehold.co/600x400";

  return {
    title: `${product.title} | Aurora`,
    description: product.description?.slice(0, 160),
    
    // --- OPEN GRAPH FIX ---
    openGraph: {
      images: [
          {
              url: image, // Yahan direct image URL jayega
              width: 800,
              height: 600,
              alt: product.title,
          }
      ],
      title: product.title,
      description: `Buy ${product.title} at Aurora.`,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}