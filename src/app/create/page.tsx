"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createDebate } from "@/services/debate";
import { DebateCategory } from "@/types/debate";
import { validateTitle, validateTopic } from "@/lib/validation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const categoryOptions = [
  { value: DebateCategory.POLITICS, label: "Politika" },
  { value: DebateCategory.TECHNOLOGY, label: "Teknoloji" },
  { value: DebateCategory.EDUCATION, label: "Eğitim" },
  { value: DebateCategory.SPORTS, label: "Spor" },
  { value: DebateCategory.PHILOSOPHY, label: "Felsefe" },
  { value: DebateCategory.SOCIETY, label: "Toplum" },
  { value: DebateCategory.ENVIRONMENT, label: "Çevre" },
];

export default function CreateDebatePage() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<DebateCategory | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/Auth/login");
    return null;
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    const titleError = validateTitle(title);
    if (titleError) newErrors.title = titleError;
    
    const topicError = validateTopic(topic);
    if (topicError) newErrors.topic = topicError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const debateData = {
        title: title.trim(),
        topic: topic.trim(),
        ...(category && { category })
      };
      
      const createdDebate = await createDebate(debateData);
      
      // Redirect to the created debate page
      router.push(`/debate/${createdDebate.id}`);
    } catch (error: any) {
      console.error("Error creating debate:", error);
      
      // Handle server validation errors
      if (error.response?.data?.errors) {
        const serverErrors: { [key: string]: string } = {};
        error.response.data.errors.forEach((err: any) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          general: error.response?.data?.message || "Münazara oluşturulurken bir hata oluştu"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Yeni Münazara Oluştur
            </h1>
            <p className="text-gray-600">
              Tartışmak istediğiniz konuyu paylaşın ve diğer kullanıcıları dahil edin
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Münazara Başlığı *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Örn: Yapay Zeka İnsanlığın Geleceği İçin Tehdit Mi?"
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {title.length}/100 karakter
              </p>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Konu Açıklaması *
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.topic ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Münazara konusunu detaylı bir şekilde açıklayın. Hangi yönlerden tartışılması gerektiğini belirtin..."
                maxLength={500}
              />
              {errors.topic && (
                <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {topic.length}/500 karakter
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                id="category"
                value={category || ""}
                onChange={(e) => setCategory(e.target.value ? e.target.value as DebateCategory : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Kategori Seçin (İsteğe Bağlı)</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                İptal
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Münazara Oluştur"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
