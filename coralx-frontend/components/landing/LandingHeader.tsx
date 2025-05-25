"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseconfig";

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Students", href: "#for-students" },
    {name: "For Educators", href: "#for-educators"},
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6",
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur"
      )}
    >
      <div className="w-full flex items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/LearnXLogo.png" // swap to light-friendly logo
            alt="Link-X Logo"
            width={288}
            height={197}
            className="max-h-[8vh] w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/settings"
                className="text-gray-800 hover:text-blue-600 transition-colors mr-2"
                aria-label="Settings"
              >
                <Settings size={20} />
              </Link>
              <Button
                variant="ghost"
                className="text-sm font-medium text-gray-800 hover:text-blue-600"
                onClick={handleLogout}
              >
                Log Out
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium text-gray-800 hover:text-blue-600"
                asChild
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out pt-20",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="px-6 py-4 space-y-6">
          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-gray-800 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col space-y-4 pt-6 border-t border-gray-300">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" className="justify-center text-gray-800" onClick={handleLogout}>
                  Log Out
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 justify-center" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-center text-gray-800" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 justify-center" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
