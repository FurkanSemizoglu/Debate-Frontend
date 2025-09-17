// Kategori filtreleme bileşeni
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  'Tümü',
  'Politika',
  'Teknoloji',
  'Eğitim',
  'Spor',
  'Felsefe',
  'Toplum',
  'Çevre'
];

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
