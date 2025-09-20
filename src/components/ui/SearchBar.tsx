// Arama bileşeni
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="relative w-full max-w-lg mx-auto mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <motion.input
        type="text"
        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
        placeholder="Bir münazara konusu ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        whileFocus={{ boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
      />
      <motion.button
        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white font-medium rounded-full text-sm cursor-pointer transition-colors hover:bg-blue-700"
        whileHover={{ backgroundColor: '#2563eb' }}
        whileTap={{ scale: 0.95 }}
      >
        Ara
      </motion.button>
    </div>
  );
}
