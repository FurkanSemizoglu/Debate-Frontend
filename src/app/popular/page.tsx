"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DebateCard from "@/components/debate/DebateCard";
import { getAllDebates, transformDebateForDisplay } from "@/services/debate";
import type { DebateDisplayData } from "@/types/debate";

type TimeFilter = "day" | "week" | "month" | "year" | "all";

const trendingTopics = [
  {
    id: 1,
    title: "Teknoloji",
    description: "Yeni yapay zeka düzenlemeleri hakkında münazaralar yükselişte",
    icon: "🤖"
  },
  {
    id: 2,
    title: "Politika",
    description: "Seçim süreçleri ve demokrasi tartışmaları ilgi görüyor",
    icon: "🗳️"
  },
  {
    id: 3,
    title: "Çevre",
    description: "İklim değişikliği münazaraları bu hafta %42 arttı",
    icon: "🌍"
  }
];

export default function Popular() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [filteredDebates, setFilteredDebates] = useState<DebateDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularDebates();
  }, [timeFilter]);


      const fetchPopularDebates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllDebates({ limit: 20 });
        const transformedDebates = response.data.map(transformDebateForDisplay);
        const popularDebates = transformedDebates
          .filter(debate => debate.participantCount > 10)
          .sort((a, b) => b.participantCount - a.participantCount);
        setFilteredDebates(popularDebates);
      } catch (err) {
        console.error('Error fetching popular debates:', err);
        setError('Popüler münazaralar yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="px-4 py-6 md:px-6 md:py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Popüler Münazaralar</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          En çok ilgi gören ve aktif katılım sağlanan tartışmaları keşfedin.
        </p>
      </motion.div>
      
      {/* Trend olan kategoriler/konular */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Günün Trendleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingTopics.map((topic) => (
            <motion.div
              key={topic.id}
              className="bg-white rounded-lg shadow-md p-5 flex items-start"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="text-3xl mr-4">{topic.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                <p className="text-gray-600 text-sm">{topic.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Zaman aralığı filtreleri */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Popüler Tartışmalar</h2>
        <div className="flex space-x-2">
          {[
            { value: "day", label: "Bugün" },
            { value: "week", label: "Bu Hafta" },
            { value: "month", label: "Bu Ay" },
            { value: "year", label: "Bu Yıl" },
            { value: "all", label: "Tüm Zamanlar" }
          ].map((filter) => (
            <motion.button
              key={filter.value}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTimeFilter(filter.value as TimeFilter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Popüler münazara listesi */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-600 text-center mb-4">
            <p className="text-lg font-semibold">{error}</p>
            <p className="text-sm">Lütfen daha sonra tekrar deneyin.</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      ) : filteredDebates.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz popüler münazara yok</h3>
          <p className="text-gray-500">İlk münazarayı siz başlatın!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDebates.map((debate) => (
              <DebateCard 
                key={debate.id}
                id={debate.id}
                title={debate.title}
                description={debate.description}
                participantCount={debate.participantCount}
                tags={debate.tags}
                isPopular={true}
              />
            ))}
          </div>
          
          {/* "Daha Fazla Göster" butonu */}
          <motion.div 
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors">
              <span>Daha Fazla Göster</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </motion.div>
        </>
      )}
      
      {/* İstatistik kartları */}
      <div className="mt-16 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Münazara İstatistikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Aktif Münazara", value: "284", icon: "📊", color: "from-blue-500 to-indigo-600" },
            { title: "Kayıtlı Kullanıcı", value: "14,325", icon: "👥", color: "from-green-500 to-teal-600" },
            { title: "Aylık Yorum", value: "53,291", icon: "💬", color: "from-yellow-500 to-amber-600" },
            { title: "Aylık Görüntülenme", value: "1.2M+", icon: "👁️", color: "from-red-500 to-pink-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                <span className="text-xl text-white">{stat.icon}</span>
              </div>
              <h3 className="text-gray-600 text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
