"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import DebateCard from "@/components/DebateCard";

// Filtreleme seçenekleri için arayüz
interface FilterOption {
  id: string;
  label: string;
}

// Kategori seçenekleri
const categoryOptions: FilterOption[] = [
  { id: "all", label: "Tümü" },
  { id: "technology", label: "Teknoloji" },
  { id: "politics", label: "Politika" },
  { id: "education", label: "Eğitim" },
  { id: "philosophy", label: "Felsefe" },
  { id: "social", label: "Toplum" },
  { id: "environment", label: "Çevre" },
  { id: "sports", label: "Spor" },
  { id: "health", label: "Sağlık" },
  { id: "art", label: "Sanat ve Kültür" },
];

// Sıralama seçenekleri
const sortOptions: FilterOption[] = [
  { id: "latest", label: "En Yeni" },
  { id: "popular", label: "En Popüler" },
  { id: "active", label: "En Aktif" },
  { id: "controversial", label: "En Tartışmalı" },
];

// Örnek münazara verileri
const dummyTopics = [
  { 
    id: 1, 
    title: "Yapay zeka insanlığı tehdit eder mi?", 
    description: "Yapay zekanın gelişimi ve potansiyel tehlikeleri hakkında fikirlerinizi paylaşın.", 
    participantCount: 42,
    tags: ['Teknoloji', 'Etik', 'Gelecek'],
    category: "technology",
    createdAt: "2025-06-10",
    isPopular: true
  },
  { 
    id: 2, 
    title: "Üniversite eğitimi şart mı?", 
    description: "Modern dünyada üniversite eğitiminin değeri ve alternatifleri üzerine tartışma.", 
    participantCount: 28,
    tags: ['Eğitim', 'Kariyer'],
    category: "education",
    createdAt: "2025-06-08",
    isPopular: false
  },
  { 
    id: 3, 
    title: "İklim değişikliği ile mücadelede bireysel sorumluluk", 
    description: "Küresel ısınmayı durdurmak için bireylerin yapabilecekleri neler?", 
    participantCount: 35,
    tags: ['Çevre', 'Toplum'],
    category: "environment",
    createdAt: "2025-06-12",
    isPopular: true
  },
  { 
    id: 4, 
    title: "Sosyal medya toplumu kutuplaştırıyor mu?", 
    description: "Sosyal medya platformlarının toplumsal etkileşim ve diyalog üzerindeki etkisi.", 
    participantCount: 19,
    tags: ['Medya', 'Toplum'],
    category: "social",
    createdAt: "2025-06-05",
    isPopular: false
  },
  { 
    id: 5, 
    title: "Uzay araştırmalarına ayrılan bütçe arttırılmalı mı?", 
    description: "İnsanlığın geleceği için uzay araştırmalarının önemi ve maliyeti.", 
    participantCount: 31,
    tags: ['Teknoloji', 'Bilim', 'Ekonomi'],
    category: "technology",
    createdAt: "2025-06-01",
    isPopular: true
  },
  { 
    id: 6, 
    title: "Evrensel temel gelir uygulanabilir mi?", 
    description: "Temel gelir konseptinin ekonomik ve sosyal etkileri.", 
    participantCount: 47,
    tags: ['Ekonomi', 'Toplum', 'Politika'],
    category: "politics",
    createdAt: "2025-06-11",
    isPopular: false
  },
  { 
    id: 7, 
    title: "Vegan beslenme sürdürülebilir bir seçenek mi?", 
    description: "Vegan beslenmenin sağlık, çevre ve etik açıdan değerlendirilmesi.", 
    participantCount: 22,
    tags: ['Sağlık', 'Çevre', 'Etik'],
    category: "health",
    createdAt: "2025-06-09",
    isPopular: true
  },
  { 
    id: 8, 
    title: "Sporda teknoloji kullanımı adil mi?", 
    description: "Sporda teknolojik gelişmelerin etkisi ve adalet sorunu.", 
    participantCount: 15,
    tags: ['Spor', 'Teknoloji', 'Etik'],
    category: "sports",
    createdAt: "2025-06-07",
    isPopular: false
  },
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [visibleTopics, setVisibleTopics] = useState(dummyTopics);

  // Kategori değiştiğinde filtreleme işlemi
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterTopics(categoryId, selectedSort);
  };

  // Sıralama değiştiğinde sıralama işlemi
  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    filterTopics(selectedCategory, sortId);
  };

  // Filtreleme ve sıralama işlemleri
  const filterTopics = (category: string, sort: string) => {
    let filtered = [...dummyTopics];
    
    // Kategori filtresi uygula
    if (category !== "all") {
      filtered = filtered.filter(topic => topic.category === category);
    }
    
    // Sıralama uygula
    switch (sort) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.participantCount - a.participantCount);
        break;
      case "active":
        // Burada normalde aktif tartışma sıralaması yapılır, örnek için katılımcı sayısını kullandım
        filtered.sort((a, b) => b.participantCount - a.participantCount);
        break;
      case "controversial":
        // Burada normalde tartışmalı münazara sıralaması yapılır, örnek için rastgele
        filtered.sort(() => Math.random() - 0.5);
        break;
    }
    
    setVisibleTopics(filtered);
  };

  // Sayfa animasyonları
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

  return (
    <motion.div 
      className="px-4 py-6 md:px-6 md:py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Keşfet</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          İlgi alanlarınıza göre münazaraları keşfedin ve aktif tartışmalara katılın.
        </p>
      </motion.div>
      
      <SearchBar />
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Kategoriler</h2>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <motion.button
                  key={option.id}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange(option.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Sırala</h2>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.id}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedSort === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSortChange(option.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {visibleTopics.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Sonuç bulunamadı</h3>
          <p className="text-gray-500">Seçtiğiniz kriterlere uygun münazara bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleTopics.map((topic) => (
            <DebateCard 
              key={topic.id}
              id={topic.id}
              title={topic.title}
              description={topic.description}
              participantCount={topic.participantCount}
              tags={topic.tags}
              isPopular={topic.isPopular}
            />
          ))}
        </div>
      )}
      
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
    </motion.div>
  );
}
