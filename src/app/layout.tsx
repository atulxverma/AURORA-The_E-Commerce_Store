import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; 
import { getCurrentUser } from "@/lib/auth"; 
import { BackgroundBeams } from "./components/ui/background-beams"; 
import Footer from "./components/Footer"; 
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aurora Store",
  description: "Premium E-commerce Store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const user = await getCurrentUser(); 

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white selection:bg-black selection:text-white flex flex-col`}>
        
        {/* --- HEADER --- */}
        {/* <Header user={user} />  */}
        
        {/* --- MAIN CONTENT AREA (Contains Background) --- */}
        <main className="flex-1 relative">
            
            {/* Background Beams only inside MAIN, not Footer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <BackgroundBeams className="opacity-40 h-full w-full object-cover" />
            </div>

            {/* Page Content sits on top of beams */}
            <div className="relative z-10">
                {children}
            </div>

        </main>

        {/* --- FOOTER (Outside Main, Solid White) --- */}
        <div className="relative z-20 bg-white">
            <Footer /> 
        </div>
        <Toaster position="top-center" richColors closeButton theme="light" />
      
      </body>
    </html>
  );
}