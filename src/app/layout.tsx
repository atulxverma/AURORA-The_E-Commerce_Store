import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth"; 
import { BackgroundBeams } from "./components/ui/background-beams"; 
import Footer from "./components/Footer"; 
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// --- SINGLE METADATA EXPORT ---
export const metadata: Metadata = {
  title: "Aurora | Defining Luxury",
  description: "Experience the future of e-commerce. Curated, exclusive, and designed for the modern aesthetic.",
  openGraph: {
    title: "Aurora Store",
    description: "Premium Fashion & Tech. Redefining Shopping.",
    siteName: "Aurora",
    images: [
      {
        url: "/opengraph-image",
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
  
  // Note: Header user prop logic handled in pages
  // If you want header globally, check previous steps, 
  // but to avoid double header based on your last request, removing it here.

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white selection:bg-black selection:text-white flex flex-col`}>
        
        {/* --- MAIN CONTENT AREA (Contains Background) --- */}
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