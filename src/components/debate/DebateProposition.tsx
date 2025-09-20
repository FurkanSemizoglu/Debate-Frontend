// Münazara tez/özet ve oylamaya bileşeni
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DebatePropositionProps {
  title: string;
  description: string;
  affirmativeThesis: string;
  negativeThesis: string;
  canVote: boolean;
  affirmativeVotes: number;
  negativeVotes: number;
  totalVotes: number;
  onVote: (side: "affirmative" | "negative") => void;
}

export default function DebateProposition({
  title,
  description,
  affirmativeThesis,
  negativeThesis,
  canVote,
  affirmativeVotes,
  negativeVotes,
  totalVotes,
  onVote
}: DebatePropositionProps) {
  const [selectedSide, setSelectedSide] = useState<"affirmative" | "negative" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Oy yüzdelerini hesapla
  const affirmativePercentage = totalVotes > 0 ? Math.round((affirmativeVotes / totalVotes) * 100) : 0;
  const negativePercentage = totalVotes > 0 ? Math.round((negativeVotes / totalVotes) * 100) : 0;
  
  // Oy verme fonksiyonu
  const handleVote = () => {
    if (selectedSide && canVote) {
      onVote(selectedSide);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Münazara Tezleri</h3>
          <button 
            className="text-blue-600 text-sm flex items-center gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Gizle" : "Detayları Göster"}
            <svg 
              className={`w-4 h-4 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded-lg ${selectedSide === "affirmative" ? 'bg-blue-100 border-2 border-blue-500' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-blue-800">Savunan Taraf</h4>
              {canVote && (
                <motion.div 
                  className={`w-5 h-5 rounded-full border ${
                    selectedSide === "affirmative" 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-400'
                  } flex items-center justify-center cursor-pointer`}
                  onClick={() => setSelectedSide("affirmative")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedSide === "affirmative" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </motion.div>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {showDetails ? affirmativeThesis : `${affirmativeThesis.substring(0, 100)}...`}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${selectedSide === "negative" ? 'bg-red-100 border-2 border-red-500' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-red-800">Karşı Taraf</h4>
              {canVote && (
                <motion.div 
                  className={`w-5 h-5 rounded-full border ${
                    selectedSide === "negative" 
                      ? 'bg-red-500 border-red-500' 
                      : 'border-gray-400'
                  } flex items-center justify-center cursor-pointer`}
                  onClick={() => setSelectedSide("negative")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedSide === "negative" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </motion.div>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {showDetails ? negativeThesis : `${negativeThesis.substring(0, 100)}...`}
            </p>
          </div>
        </div>
        
        {/* Oylama sonuçları */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Anlık Oylama Sonuçları</h3>
          <div className="h-7 bg-gray-200 rounded-full overflow-hidden">
            <div className="flex h-full">
              <motion.div 
                className="bg-blue-500 h-full flex items-center justify-center text-xs text-white font-bold"
                initial={{ width: "0%" }}
                animate={{ width: `${affirmativePercentage}%` }}
                transition={{ duration: 0.5 }}
              >
                {affirmativePercentage > 10 && `${affirmativePercentage}%`}
              </motion.div>
              <motion.div 
                className="bg-red-500 h-full flex items-center justify-center text-xs text-white font-bold"
                initial={{ width: "0%" }}
                animate={{ width: `${negativePercentage}%` }}
                transition={{ duration: 0.5 }}
              >
                {negativePercentage > 10 && `${negativePercentage}%`}
              </motion.div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <div>Savunan: {affirmativeVotes} oy</div>
            <div>Toplam: {totalVotes} oy</div>
            <div>Karşı: {negativeVotes} oy</div>
          </div>
        </div>
        
        {/* Oy verme butonu */}
        {canVote && (
          <motion.button
            className={`w-full py-2 rounded-lg font-medium ${
              selectedSide 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleVote}
            whileHover={selectedSide ? { scale: 1.02 } : {}}
            whileTap={selectedSide ? { scale: 0.98 } : {}}
            disabled={!selectedSide}
          >
            Oyunu Kullan
          </motion.button>
        )}
      </div>
    </div>
  );
}
