// Tartışma kartları için bir bileşen
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

// DebateCard propu için tip tanımı
interface DebateCardProps {
  id: number;
  title: string;
  description: string;
  participantCount?: number;
  tags?: string[];
  isPopular?: boolean;
}

export default function DebateCard({ 
  id, 
  title, 
  description, 
  participantCount = 0, 
  tags = [], 
  isPopular = false 
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
      {isPopular && (
        <div className="flex items-center mb-3">
          <span className="bg-yellow-400 text-xs font-semibold px-2.5 py-0.5 rounded-full text-yellow-900">
            Popüler Tartışma
          </span>
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{participantCount}</span> katılımcı
        </div>
        
        <Link href={`/debate/${id}`}>
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors"
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
