import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth"; 
import { BackgroundBeams } from "./components/ui/background-beams"; 
import Footer from "./components/Footer"; 
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// --- MERGED METADATA (SEO + OG IMAGE) ---
export const metadata: Metadata = {
  title: "Aurora | Defining Luxury",
  description: "Experience the future of e-commerce. Curated, exclusive, and designed for the modern aesthetic.",
  openGraph: {
    title: "Aurora Store",
    description: "Premium Fashion & Tech. Redefining Shopping.",
    siteName: "Aurora",
    images: [
      {
        url: "/opengraph-image", // This will use the generated image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Note: Header is removed here because you are including it inside Pages individually 
  // (to avoid double header issue). If you want it global, uncomment it and remove from pages.
  // Assuming current setup: Header is inside pages.

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white selection:bg-black selection:text-white flex flex-col`}>
        
        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 relative">
            
            {/* Background Beams */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <BackgroundBeams className="opacity-40 h-full w-full object-cover" />
            </div>

            {/* Page Content */}
            <div className="relative z-10">
                {children}
            </div>

        </main>

        {/* --- FOOTER --- */}
        <div className="relative z-20 bg-white">
            <Footer /> 
        </div>
        
        {/* --- TOASTER --- */}
        <Toaster position="top-center" richColors closeButton theme="light" />
      
      </body>
    </html>
  );
}