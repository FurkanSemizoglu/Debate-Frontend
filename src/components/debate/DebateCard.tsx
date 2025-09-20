// Tartışma kartları için bir bileşen
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { DebateCategory } from '@/types/debate';
import { DEBATE_CATEGORIES } from '@/lib/constants';

// DebateCard propu için tip tanımı
interface DebateCardProps {
  id: string; // Changed to string to support UUID
  title: string;
  description: string;
  participantCount?: number;
  tags?: string[];
  isPopular?: boolean;
  category?: DebateCategory;
  createdAt?: string;
}

const getCategoryLabel = (category?: DebateCategory): string => {
  const categoryLabels: Record<DebateCategory, string> = {
    [DebateCategory.POLITICS]: DEBATE_CATEGORIES.POLITICS,
    [DebateCategory.TECHNOLOGY]: DEBATE_CATEGORIES.TECHNOLOGY,
    [DebateCategory.EDUCATION]: DEBATE_CATEGORIES.EDUCATION,
    [DebateCategory.SPORTS]: DEBATE_CATEGORIES.SPORTS,
    [DebateCategory.PHILOSOPHY]: DEBATE_CATEGORIES.PHILOSOPHY,
    [DebateCategory.SOCIETY]: DEBATE_CATEGORIES.SOCIETY,
    [DebateCategory.ENVIRONMENT]: DEBATE_CATEGORIES.ENVIRONMENT
  };
  return category ? categoryLabels[category] : "Genel";
};

export default function DebateCard({ 
  id, 
  title, 
  description, 
  participantCount = 0, 
  tags = [], 
  isPopular = false,
  category,
  createdAt
}: DebateCardProps) {
  return (
    <motion.div
      className={`p-6 rounded-xl shadow-lg transition-all ${
        isPopular ? 'bg-gradient-to-r from-amber-50 to-yellow-100 border-l-4 border-yellow-400' : 'bg-white hover:bg-gray-50'
      }`}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        {isPopular && (
          <span className="bg-yellow-400 text-xs font-semibold px-2.5 py-0.5 rounded-full text-yellow-900">
            Popüler Tartışma
          </span>
        )}
        {category && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {getCategoryLabel(category)}
          </span>
        )}
      </div>
      
      <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0M21 8.5c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5S6.515 4 12 4s9 2.015 9 4.5z" />
            </svg>
            <span className="font-medium">{participantCount}</span> katılımcı
          </span>
          {createdAt && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(createdAt).toLocaleDateString('tr-TR')}
            </span>
          )}
        </div>
        
        <Link href={`/debate/${id}`}>
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 cursor-pointer"
            whileHover={{ backgroundColor: '#2563eb' }}
            whileTap={{ scale: 0.95 }}
          >
            Katıl
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
