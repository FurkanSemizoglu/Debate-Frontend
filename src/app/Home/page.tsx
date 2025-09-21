
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "@/components/layout/Hero";
import DebateCard from "@/components/debate/DebateCard";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilter from "@/components/ui/CategoryFilter";
import { getAllDebates, transformDebateForDisplay, DebateCategory } from "@/services/debate";
import type {  DebateDisplayData } from "@/types/debate";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [debates, setDebates] = useState<DebateDisplayData[]>([]);
/*   const [filteredDebates, setFilteredDebates] = useState<DebateDisplayData[]>([]); */
  const [selectedCategory, setSelectedCategory] = useState<DebateCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchDebates();
  }, []);

/*   useEffect(() => {
    if (selectedCategory === null) {
      setFilteredDebates(debates);
    } else {
      const filtered = debates.filter(debate => debate.category === selectedCategory);
      setFilteredDebates(filtered);
    }
  }, [debates, selectedCategory]); */

    const filteredDebates = useMemo(() => {
    let filtered = debates;
    
    // Arama filtresi
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(debate => 
        debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Kategori filtresi
    if (selectedCategory) {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }
    
    return filtered;
  }, [debates, selectedCategory, searchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const fetchDebates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllDebates({ limit: 20 }); 
      const transformedDebates = response.data?.map(transformDebateForDisplay) ?? [];
      setDebates(transformedDebates);
    } catch (err) {
      console.error('Error fetching debates:', err);
      setError('Münazaralar yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: DebateCategory | null) => {
    setSelectedCategory(category);
  };

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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="text-red-600 text-center mb-4">
          <p className="text-lg font-semibold">{error}</p>
          <p className="text-sm">Lütfen daha sonra tekrar deneyin.</p>
        </div>
        <button 
          onClick={() => fetchDebates()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
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
      <SearchBar onSearch={handleSearch} />     

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Münazara Konuları</h2>
          <motion.button
            className="text-blue-600 font-medium flex items-center gap-1 text-sm cursor-pointer hover:text-blue-700 transition-colors"
            whileHover={{ x: 3 }}
          >
            Tümünü Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </motion.button>
        </div>
        
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDebates.length > 0 ? (
            filteredDebates.map((debate) => (
              <DebateCard 
                key={debate.id}
                id={debate.id}
                title={debate.title}
                description={debate.description}
                participantCount={debate.participantCount}
                tags={debate.tags}
                isPopular={debate.isPopular}
                category={debate.category}
                createdAt={debate.createdAt}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-600 text-lg">
                {selectedCategory ? 'Bu kategoride münazara bulunmuyor.' : 'Henüz münazara bulunmuyor.'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {selectedCategory ? 'Başka bir kategori deneyin!' : 'İlk münazarayı siz başlatın!'}
              </p>
            </div>
          )}
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
          <Link href="/create" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 cursor-pointer transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Yeni Münazara Başlat
     
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
