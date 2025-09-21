"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createDebate } from "@/services/debate";
import { DebateCategory } from "@/types/debate";
import { validateTitle, validateTopic } from "@/lib/validation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import type { ApiErrorResponse, ValidationError } from "@/types/api";

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
  const { addToast } = useToast();
  const router = useRouter();

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Münazara Oluşturmak İçin Giriş Yapın</h1>
              <p className="text-gray-600 mb-6">
                Yeni bir münazara oluşturmak için öncelikle hesabınıza giriş yapmanız gerekiyor.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Kayıt Ol
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
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
      
      addToast("Münazara başarıyla oluşturuldu!", "success");

      router.push(`/debate/${createdDebate.data.id}`);
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      
      // Handle server validation errors (if backend sends them)
      if (apiError.response?.data?.errors) {
        const serverErrors: { [key: string]: string } = {};
        apiError.response.data.errors.forEach((err: ValidationError) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        // Use the new backend error format
        const errorMessage = apiError.response?.data?.message || "Münazara oluşturulurken bir hata oluştu";
        addToast(errorMessage, "error");
        setErrors({
          general: errorMessage
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
