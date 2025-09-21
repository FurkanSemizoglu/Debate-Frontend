"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Get full name (handle both name and surname if available)
  const getFullName = () => {
    if (!user) return '';
    return user.surname ? `${user.name} ${user.surname}` : user.name;
  };

  const getInitials = () => {
    if (!user) return '';
    if (user.surname) {
      return `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  // Check if the current path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    console.log("User menu ref:", userMenuRef.current);
    console.log("Is user menu open:", isUserMenuOpen);
    console.log("Is user authenticated:", isAuthenticated);
    console.log("User data:", user);
    console.log("logout " , logout);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Münazaram
                </span>
              </Link>
            </motion.div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`${
                  isActivePath('/') 
                    ? 'border-b-2 border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/explore" 
                className={`${
                  isActivePath('/explore') 
                    ? 'border-b-2 border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Keşfet
              </Link>
              <Link 
                href="/popular" 
                className={`${
                  isActivePath('/popular') 
                    ? 'border-b-2 border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Popüler
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/create">
                  <motion.button
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Münazara Oluştur
                  </motion.button>
                </Link>
                <div className="relative" ref={userMenuRef}>
                <motion.button
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getInitials()}
                    </span>
                  </div>
                  <span className="cursor-pointer">{getFullName()}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{getFullName()}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        addToast("Başarıyla çıkış yaptınız!", "info");
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                    >
                      Çıkış Yap
                    </button>
                  </motion.div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <motion.button
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Giriş
                  </motion.button>
                </Link>
                
                <Link href="/auth/register">
                  <motion.button
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Kayıt Ol
                  </motion.button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Menüyü Aç</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      {isMenuOpen && (
        <motion.div 
          className="sm:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`${
                isActivePath('/') 
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/explore" 
              className={`${
                isActivePath('/explore') 
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Keşfet
            </Link>
            <Link 
              href="/popular" 
              className={`${
                isActivePath('/popular') 
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Popüler
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getInitials()}
                    </span>
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-800">{getFullName()}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <Link href="/create" className="block px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 w-full rounded-md text-center">
                  Münazara Oluştur
                </Link>
                <button
                  onClick={() => {
                    addToast("Başarıyla çıkış yaptınız!", "info");
                    logout();
                  }}
                  className="block px-4 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 w-full rounded-md text-center cursor-pointer"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex items-center px-4 space-x-3">
                <Link href="/auth/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full rounded-md">
                  Giriş
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 w-full rounded-md text-center">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
