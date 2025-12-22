import type { Metadata } from "next";
import "./globals.css";
import { BackgroundBeams } from "./components/ui/background-beams";
import Footer from "./components/Footer";
import { Toaster } from "sonner";

// --- METADATA ---
export const metadata: Metadata = {
  title: "Aurora | Defining Luxury",
  description:
    "Experience the future of e-commerce. Curated, exclusive, and designed for the modern aesthetic.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col">
        
        {/* MAIN */}
        <main className="flex-1 relative">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <BackgroundBeams className="opacity-40 h-full w-full object-cover" />
          </div>

          <div className="relative z-10">{children}</div>
        </main>

        {/* FOOTER */}
        <div className="relative z-20 bg-white">
          <Footer />
        </div>

        {/* TOASTER */}
        <Toaster position="top-center" richColors closeButton theme="light" />
      </body>
    </html>
  );
}
