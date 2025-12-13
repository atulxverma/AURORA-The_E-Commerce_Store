"use client";
import React from "react";
import Link from "next/link";
import { FiInstagram, FiTwitter, FiFacebook, FiArrowRight, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-gray-200 bg-white/60 backdrop-blur-xl">
      
      {/* Decorative Gradient Line on Top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        
        {/* Top Section: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="md:col-span-5 space-y-6">
                <Link href="/" className="text-3xl font-black tracking-tighter uppercase flex items-center gap-1">
                    AURORA<span className="text-blue-600">.</span>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
                    Redefining the modern e-commerce experience. Curated collections for those who demand excellence, style, and quality.
                </p>
                <div className="flex gap-3">
                    <SocialIcon icon={<FiInstagram />} href="#" />
                    <SocialIcon icon={<FiTwitter />} href="#" />
                    <SocialIcon icon={<FiFacebook />} href="#" />
                </div>
            </div>

            {/* Links Section */}
            <div className="md:col-span-2">
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-900 mb-6">Collections</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                    <li><Link href="/new-arrivals" className="hover:text-blue-600 transition-colors">New Arrivals</Link></li>
                    <li><Link href="/men" className="hover:text-blue-600 transition-colors">Men</Link></li>
                    <li><Link href="/women" className="hover:text-blue-600 transition-colors">Women</Link></li>
                    <li><Link href="/accessories" className="hover:text-blue-600 transition-colors">Accessories</Link></li>
                    <li><Link href="/sale" className="text-red-500 hover:text-red-700 transition-colors">Sale</Link></li>
                </ul>
            </div>

            <div className="md:col-span-2">
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-900 mb-6">Support</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                    <li><Link href="#" className="hover:text-blue-600 transition-colors">Order Status</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition-colors">Shipping & Returns</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-3">
                <h4 className="font-bold uppercase tracking-widest text-xs text-gray-900 mb-6">Newsletter</h4>
                <p className="text-gray-500 text-xs mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                
                <div className="relative group">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-12 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black text-white rounded-lg hover:scale-105 transition-transform shadow-md">
                        <FiArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
            <p>&copy; {new Date().getFullYear()} Aurora Store. All rights reserved.</p>
            <div className="flex gap-8">
                <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-black transition-colors">Cookie Policy</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
    <Link 
        href={href}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
    >
        {icon}
    </Link>
);