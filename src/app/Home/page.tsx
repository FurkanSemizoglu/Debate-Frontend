
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import DebateCard from "@/components/DebateCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

// Örnek tartışma verileri
const dummyTopics = [
  { 
    id: 1, 
    title: "Yapay zeka insanlığı tehdit eder mi?", 
    description: "Yapay zekanın gelişimi ve potansiyel tehlikeleri hakkında fikirlerinizi paylaşın.", 
    participantCount: 42,
    tags: ['Teknoloji', 'Etik', 'Gelecek'],
    isPopular: true
  },
  { 
    id: 2, 
    title: "Üniversite eğitimi şart mı?", 
    description: "Modern dünyada üniversite eğitiminin değeri ve alternatifleri üzerine tartışma.", 
    participantCount: 28,
    tags: ['Eğitim', 'Kariyer'],
    isPopular: false
  },
  { 
    id: 3, 
    title: "İklim değişikliği ile mücadelede bireysel sorumluluk", 
    description: "Küresel ısınmayı durdurmak için bireylerin yapabilecekleri neler?", 
    participantCount: 35,
    tags: ['Çevre', 'Toplum'],
    isPopular: true
  },
  { 
    id: 4, 
    title: "Sosyal medya toplumu kutuplaştırıyor mu?", 
    description: "Sosyal medya platformlarının toplumsal etkileşim ve diyalog üzerindeki etkisi.", 
    participantCount: 19,
    tags: ['Medya', 'Toplum'],
    isPopular: false
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Sayfa yüklenme simülasyonu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Sayfanın içeriği için animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="px-4 py-6 md:px-6 md:py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Hero />
      
      <SearchBar />
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Münazara Konuları</h2>
          <motion.button
            className="text-blue-600 font-medium flex items-center gap-1 text-sm"
            whileHover={{ x: 3 }}
          >
            Tümünü Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </motion.button>
        </div>
        
        <CategoryFilter />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dummyTopics.map((topic) => (
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
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-xl p-6 md:p-8 shadow-inner">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kendi Münazara Konunuzu Oluşturun</h2>
          <p className="text-gray-600">Sizi ilgilendiren bir konu hakkında tartışma başlatın ve görüşlerinizi paylaşın</p>
        </div>
        
        <motion.div 
          className="flex justify-center"
          whileHover={{ scale: 1.03 }}
        >
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Yeni Münazara Başlat
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
