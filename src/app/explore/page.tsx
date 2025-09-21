"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";
import DebateCard from "@/components/debate/DebateCard";
import { getAllDebates, transformDebateForDisplay, DebateCategory } from "@/services/debate";
import type {  DebateDisplayData } from "@/types/debate";

// Filtreleme seçenekleri için arayüz
interface FilterOption {
  id: string;
  label: string;
  value?: DebateCategory | null;
}

// Kategori seçenekleri
const categoryOptions: FilterOption[] = [
  { id: "all", label: "Tümü", value: null },
  { id: "technology", label: "Teknoloji", value: DebateCategory.TECHNOLOGY },
  { id: "politics", label: "Politika", value: DebateCategory.POLITICS },
  { id: "education", label: "Eğitim", value: DebateCategory.EDUCATION },
  { id: "philosophy", label: "Felsefe", value: DebateCategory.PHILOSOPHY },
  { id: "society", label: "Toplum", value: DebateCategory.SOCIETY },
  { id: "environment", label: "Çevre", value: DebateCategory.ENVIRONMENT },
  { id: "sports", label: "Spor", value: DebateCategory.SPORTS },
];

// Sıralama seçenekleri
const sortOptions: FilterOption[] = [
  { id: "latest", label: "En Yeni" },
  { id: "popular", label: "En Popüler" },
  { id: "active", label: "En Aktif" },
  { id: "controversial", label: "En Tartışmalı" },
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [debates, setDebates] = useState<DebateDisplayData[]>([]);
  const [visibleTopics, setVisibleTopics] = useState<DebateDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDebates();
  }, []);

      const fetchDebates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllDebates({ limit: 20 }); // Get more debates for explore page
        const transformedDebates = response.data.map(transformDebateForDisplay);
        setDebates(transformedDebates);
        setVisibleTopics(transformedDebates);
        setHasMore(response.meta.totalPages > 1);
      } catch (err) {
        console.error('Error fetching debates:', err);
        setError('Münazaralar yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterTopics(categoryId, selectedSort, searchTerm);
  };

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    filterTopics(selectedCategory, sortId, searchTerm);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    filterTopics(selectedCategory, selectedSort, query);
  };

  const filterTopics = (category: string, sort: string, search: string = "") => {
    let filtered = [...debates];
    
    // Arama filtresi (isme göre)
    if (search.trim() !== "") {
      filtered = filtered.filter(debate => 
        debate.title.toLowerCase().includes(search.toLowerCase()) ||
        debate.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Kategori filtresi
    if (category !== "all") {
      const selectedCategoryOption = categoryOptions.find(opt => opt.id === category);
      if (selectedCategoryOption && selectedCategoryOption.value) {
        filtered = filtered.filter(debate => debate.category === selectedCategoryOption.value);
      }
    }
    
    // Sıralama
    switch (sort) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.participantCount - a.participantCount);
        break;
      case "active":
        filtered.sort((a, b) => b.participantCount - a.participantCount);
        break;
      case "controversial":
        filtered.sort(() => Math.random() - 0.5);
        break;
    }
    
    setVisibleTopics(filtered);
  };

  useEffect(() => {
    if (debates.length > 0) {
      filterTopics(selectedCategory, selectedSort, searchTerm);
    }
  }, [debates, selectedCategory, selectedSort, searchTerm]);

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
      
      <SearchBar onSearch={handleSearch} />

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="text-red-600 text-center mb-4">
            <p className="text-lg font-semibold">{error}</p>
            <p className="text-sm">Lütfen daha sonra tekrar deneyin.</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Tekrar Dene
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Kategoriler</h2>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
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
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz münazara yok</h3>
              <p className="text-gray-500">İlk münazarayı siz başlatın!</p>
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
                  category={topic.category}
                  createdAt={topic.createdAt}
                />
              ))}
            </div>
          )}
          
          {hasMore && (
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
          )}
        </>
      )}
    </motion.div>
  );
}
