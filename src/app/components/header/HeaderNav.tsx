"use client";
import Link from "next/link";

export default function HeaderNav() {
  const navLinks = [
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Accessories", href: "/accessories" },
  ];

  return (
    <nav className="hidden lg:flex gap-10 text-sm font-bold uppercase tracking-widest text-gray-500">
      {navLinks.map((item) => (
        <Link
          href={item.href}
          key={item.name}
          className="relative hover:text-black transition-colors cursor-pointer group"
        >
          {item.name}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
      
      <Link 
        href="/sale" 
        className="text-red-600 hover:text-red-700 relative cursor-pointer group"
      >
        Sale
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
      </Link>
    </nav>
  );
}