"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DebateCard from "@/components/DebateCard";

// Zaman aralığı filtresi için tip tanımı
type TimeFilter = "day" | "week" | "month" | "year" | "all";

// Örnek popüler münazara verileri
const popularDebates = [
  { 
    id: 1, 
    title: "Yapay zeka insanlığı tehdit eder mi?", 
    description: "Yapay zekanın gelişimi ve potansiyel tehlikeleri hakkında fikirlerinizi paylaşın.", 
    participantCount: 142,
    tags: ['Teknoloji', 'Etik', 'Gelecek'],
    isPopular: true,
    activityScore: 95, // Aktivite puanı (görüntülenme, yorum, vs)
    createdAt: "2025-06-08"
  },
  { 
    id: 5, 
    title: "Uzay araştırmalarına ayrılan bütçe arttırılmalı mı?", 
    description: "İnsanlığın geleceği için uzay araştırmalarının önemi ve maliyeti.", 
    participantCount: 131,
    tags: ['Teknoloji', 'Bilim', 'Ekonomi'],
    isPopular: true,
    activityScore: 89,
    createdAt: "2025-06-01"
  },
  { 
    id: 6, 
    title: "Evrensel temel gelir uygulanabilir mi?", 
    description: "Temel gelir konseptinin ekonomik ve sosyal etkileri.", 
    participantCount: 147,
    tags: ['Ekonomi', 'Toplum', 'Politika'],
    isPopular: true,
    activityScore: 82,
    createdAt: "2025-06-11"
  },
  { 
    id: 3, 
    title: "İklim değişikliği ile mücadelede bireysel sorumluluk", 
    description: "Küresel ısınmayı durdurmak için bireylerin yapabilecekleri neler?", 
    participantCount: 135,
    tags: ['Çevre', 'Toplum'],
    isPopular: true,
    activityScore: 78,
    createdAt: "2025-06-12"
  },
  { 
    id: 7, 
    title: "Vegan beslenme sürdürülebilir bir seçenek mi?", 
    description: "Vegan beslenmenin sağlık, çevre ve etik açıdan değerlendirilmesi.", 
    participantCount: 122,
    tags: ['Sağlık', 'Çevre', 'Etik'],
    isPopular: true,
    activityScore: 75,
    createdAt: "2025-06-09"
  },
  { 
    id: 9, 
    title: "Dijital oyunlar eğitimde kullanılmalı mı?", 
    description: "Eğitimde oyunlaştırma ve dijital oyunların potansiyel faydaları.", 
    participantCount: 98,
    tags: ['Eğitim', 'Teknoloji', 'Psikoloji'],
    isPopular: true,
    activityScore: 72,
    createdAt: "2025-06-10"
  },
  { 
    id: 10, 
    title: "Moda endüstrisi sürdürülebilir olabilir mi?", 
    description: "Hızlı moda ve sürdürülebilirlik arasındaki çatışma.", 
    participantCount: 87,
    tags: ['Çevre', 'Ekonomi', 'Toplum'],
    isPopular: true,
    activityScore: 68,
    createdAt: "2025-06-07"
  },
  { 
    id: 11, 
    title: "Sanat yapay zeka tarafından üretilebilir mi?", 
    description: "Yapay zeka ve yaratıcılık ilişkisi üzerine tartışma.", 
    participantCount: 112,
    tags: ['Sanat', 'Teknoloji', 'Felsefe'],
    isPopular: true,
    activityScore: 65,
    createdAt: "2025-06-06"
  },
];

// Günlük trendler için haber/bilgi kartları
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
  const [filteredDebates, setFilteredDebates] = useState(popularDebates);
  const [isLoading, setIsLoading] = useState(true);

  // Zaman filtresine göre popüler münazaraları filtreleme
  useEffect(() => {
    // Gerçek bir API'dan veri alınacak olsaydı burada zaman filtresine göre filtreleme yapılırdı
    // Şimdilik tüm verileri gösteriyoruz ve kısa bir yükleme animasyonu ekliyoruz
    setIsLoading(true);
    
    setTimeout(() => {
      setFilteredDebates(popularDebates);
      setIsLoading(false);
    }, 500);
  }, [timeFilter]);

  // Animasyon varyantları
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
            <button className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2">
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
