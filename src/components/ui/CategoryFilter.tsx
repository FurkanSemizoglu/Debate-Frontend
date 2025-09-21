// Kategori filtreleme bileşeni
"use client";

import { motion } from 'framer-motion';
import { DebateCategory } from '@/types/debate';
import { DEBATE_CATEGORIES } from '@/lib/constants';

const categories = [
  { label: 'Tümü', value: null },
  { label: DEBATE_CATEGORIES.POLITICS, value: DebateCategory.POLITICS },
  { label: DEBATE_CATEGORIES.TECHNOLOGY, value: DebateCategory.TECHNOLOGY },
  { label: DEBATE_CATEGORIES.EDUCATION, value: DebateCategory.EDUCATION },
  { label: DEBATE_CATEGORIES.SPORTS, value: DebateCategory.SPORTS },
  { label: DEBATE_CATEGORIES.PHILOSOPHY, value: DebateCategory.PHILOSOPHY },
  { label: DEBATE_CATEGORIES.SOCIETY, value: DebateCategory.SOCIETY },
  { label: DEBATE_CATEGORIES.ENVIRONMENT, value: DebateCategory.ENVIRONMENT }
];

interface CategoryFilterProps {
  selectedCategory: DebateCategory | null;
  onCategoryChange: (category: DebateCategory | null) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.label}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onCategoryChange(category.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
