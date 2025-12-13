import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; 
import { getCurrentUser } from "@/lib/auth"; 
import { BackgroundBeams } from "./components/ui/background-beams"; 
import Footer from "./components/Footer"; // <--- IMPORT FOOTER

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
      <body className={`${inter.className} relative min-h-screen bg-white selection:bg-black selection:text-white`}>
        
        {/* Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <BackgroundBeams className="opacity-40" />
        </div>

        {/* Header */}
        {/* <Header user={user} />  */}
        
        {/* Main Content */}
        {children}

        {/* Footer (Added at the bottom) */}
        <Footer /> 
      
      </body>
    </html>
  );
}