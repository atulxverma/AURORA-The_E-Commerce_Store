import type { Metadata, ResolvingMetadata } from 'next';
import prismaClient from "@/services/prisma";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

// --- SEO GENERATOR ---
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await params for Next.js 15
  const { id } = await params;

  let product = null;
  
  // Check DB
  if (id.length === 24) {
      product = await prismaClient.product.findUnique({ where: { id } });
  } 
  
  // Check API
  if (!product) {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (res.ok) product = await res.json();
  }

  // Fallback
  if (!product) {
      return { 
          title: "Item Not Found | Aurora Store",
          description: "This product does not exist." 
      };
  }

  const image = product.thumbnail || product.images?.[0] || "https://placehold.co/600x400";

  return {
    title: `${product.title} | Aurora`,
    description: product.description?.slice(0, 160) + "...",
    openGraph: {
      images: [image],
      title: product.title,
      description: `Shop ${product.title} at Aurora. Premium quality assured.`,
      url: `https://aurora-store.vercel.app/product/${id}`, // Update with your Vercel URL
      siteName: "Aurora Store",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description?.slice(0, 100),
      images: [image],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}