"use client";
import React from "react";
import Link from "next/link";
import { FiInstagram, FiTwitter, FiFacebook, FiArrowRight, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-gray-100 bg-white">
      
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            
            {/* Brand */}
            <div className="md:col-span-5 space-y-8 pr-4">
                <Link href="/" className="text-3xl font-black tracking-tighter uppercase flex items-center gap-1 group w-fit">
                    AURORA<span className="text-blue-600 transition-transform group-hover:-translate-y-1">.</span>
                </Link>
                <p className="text-gray-500 text-sm leading-7 font-medium max-w-sm">
                    Defining the future of digital retail. Curated collections for the modern aesthetic.
                </p>
                <div className="flex gap-3">
                    <SocialIcon icon={<FiInstagram />} href="#" />
                    <SocialIcon icon={<FiTwitter />} href="#" />
                    <SocialIcon icon={<FiFacebook />} href="#" />
                </div>
            </div>

            {/* Links */}
            <div className="md:col-span-2 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Shop</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                    <li><FooterLink href="/new-arrivals">New Arrivals</FooterLink></li>
                    <li><FooterLink href="/men">Men</FooterLink></li>
                    <li><FooterLink href="/women">Women</FooterLink></li>
                    <li><FooterLink href="/accessories">Accessories</FooterLink></li>
                    <li><FooterLink href="/sale" className="text-red-500 hover:text-red-700">Sale</FooterLink></li>
                </ul>
            </div>

            <div className="md:col-span-2 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                    <li><FooterLink href="#">About</FooterLink></li>
                    <li><FooterLink href="#">Careers</FooterLink></li>
                    <li><FooterLink href="#">Support</FooterLink></li>
                    <li><FooterLink href="#">Contact</FooterLink></li>
                </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-3 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Newsletter</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Subscribe for exclusive drops.
                </p>
                
                <form className="relative group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 text-sm font-medium outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all placeholder:text-gray-400"
                    />
                    <button 
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
                    >
                        <FiArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            
            {/* Left */}
            <p>&copy; {new Date().getFullYear()} AURORA INC.</p>
            
            {/* Center - Made by Atul */}
            <p className="hidden md:block text-gray-900">
                Made by <span className="text-blue-600">Atul</span>
            </p>

            {/* Right */}
            <div className="flex gap-8">
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms</FooterLink>
            </div>
        </div>
      </div>
    </footer>
  );
}

// Helpers
const FooterLink = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <Link 
        href={href} 
        className={`block w-fit hover:text-black transition-colors ${className}`}
    >
        {children}
    </Link>
);

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
    <Link 
        href={href}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 bg-white hover:bg-black hover:text-white hover:border-black hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-pointer"
    >
        {icon}
    </Link>
);