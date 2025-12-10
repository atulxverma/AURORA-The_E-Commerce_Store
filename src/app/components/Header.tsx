"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/prodactions";

import HeaderLogo from "./header/HeaderLogo";
import HeaderNav from "./header/HeaderNav";
import HeaderSearch from "./header/HeaderSearch";
import HeaderIcons from "./header/HeaderIcons";
import MobileMenu from "./header/MobileMenu";

export default function Header({ user }: { user: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(user);
  const router = useRouter();

  useEffect(() => { setCurrentUser(user); }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (!currentUser) setCurrentUser(data.user);
        }
      } catch (e) { console.error(e); }
    }
    checkUser();
  }, []);

  async function handleLogout() {
    await logoutUser();
    setCurrentUser(null);
    router.refresh();
  }

  return (
    <div className="w-full relative z-40">
      <header
        className={`fixed top-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-b ${
            scrolled
            ? "bg-white/80 backdrop-blur-xl py-3 border-gray-200 shadow-sm"
            : "bg-white/0 backdrop-blur-none py-6 border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-8">
          <HeaderLogo onOpenMobileMenu={() => setMobileMenu(true)} />
          <HeaderNav />
          <div className="flex items-center gap-4 lg:gap-6 justify-end flex-1">
            <HeaderSearch />
            <HeaderIcons currentUser={currentUser} handleLogout={handleLogout} />
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenu} 
        onClose={() => setMobileMenu(false)} 
        currentUser={currentUser} 
        handleLogout={handleLogout} 
      />
    </div>
  );
}