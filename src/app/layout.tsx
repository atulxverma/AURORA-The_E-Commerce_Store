import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth"; 
import { BackgroundBeams } from "./components/ui/background-beams"; 
import Footer from "./components/Footer"; 
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // --- FIX: ADD THIS LINE (Apna Vercel domain yahan daal) ---
  metadataBase: new URL('https://aurora-the-e-commerce-store.vercel.app'), 
  // Agar upar wala link change ho jaye, to jo final link hai wo daalna
  
  title: "Aurora | Defining Luxury",
  manifest: "/manifest.json",
  themeColor: "#000000", 
  description: "Experience the future of e-commerce. Curated, exclusive, and designed for the modern aesthetic.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aurora",
  },
  
  openGraph: {
    title: "Aurora Store",
    description: "Premium Fashion & Tech. Redefining Shopping.",
    siteName: "Aurora",
    images: [
      {
        url: "/opengraph-image", // Ye ab automatically full URL ban jayega
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser(); 

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white selection:bg-black selection:text-white flex flex-col`}>
        <main className="flex-1 relative">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <BackgroundBeams className="opacity-40 h-full w-full object-cover" />
            </div>
            <div className="relative z-10">{children}</div>
        </main>
        <div className="relative z-20 bg-white"><Footer /></div>
        <Toaster position="top-center" richColors closeButton theme="light" />
      </body>
    </html>
  );
}