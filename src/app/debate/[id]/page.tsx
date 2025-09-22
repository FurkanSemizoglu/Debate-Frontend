"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { 
  getDebateRooms,
  createDebateRoom
} from "@/services/room";
import { 
  DebateCategory,
  Debate
} from "@/types/debate";
import { 
  getDebateById 
} from "@/services/debate";
import { 
  DebateRoomsResponse,
  DebateRoomSummary
} from "@/types/room";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiErrorResponse } from "@/types/api";

const getCategoryLabel = (category?: DebateCategory): string => {
  const categoryLabels = {
    [DebateCategory.POLITICS]: "Politika",
    [DebateCategory.TECHNOLOGY]: "Teknoloji", 
    [DebateCategory.EDUCATION]: "Eğitim",
    [DebateCategory.SPORTS]: "Spor",
    [DebateCategory.PHILOSOPHY]: "Felsefe",
    [DebateCategory.SOCIETY]: "Toplum",
    [DebateCategory.ENVIRONMENT]: "Çevre"
  };
  return category ? categoryLabels[category] : "Genel";
};

export default function DebatePage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const debateId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  const [debateData, setDebateData] = useState<DebateRoomsResponse | null>(null);
  const [debate, setDebate] = useState<Debate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const mainDebate = debate;

  useEffect(() => {
    fetchDebateData();
  }, [debateId]);

  const fetchDebateData = async () => {
    if (!debateId) {
      setError("Geçersiz münazara ID'si");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const [debateResponse, roomsResponse] = await Promise.all([
        getDebateById(debateId),
        getDebateRooms(debateId)
      ]);
      
      setDebate(debateResponse);
      setDebateData(roomsResponse);
      setError(null);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      console.error("Error fetching debate data:", err);
      setError(apiError.response?.data?.message || "Münazara bilgileri yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDebateRooms = async () => {
    if (!debateId) {
      setError("Geçersiz münazara ID'si");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const roomsData = await getDebateRooms(debateId);
      
      setDebateData(roomsData);
      setError(null);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      console.error("Error fetching debate rooms:", err);
      setError(apiError.response?.data?.message || "Münazara odaları yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!debateId || !isAuthenticated) return;
    
    try {
      setIsCreatingRoom(true);
      await createDebateRoom(debateId);
      await fetchDebateRooms(); // Sadece room bilgilerini yenile
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      console.error("Error creating room:", err);
      setError(apiError.response?.data?.message || "Oda oluşturulurken bir hata oluştu");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': 
      case 'LIVE': return 'Canlı';
      case 'WAITING': return 'Beklemede';
      case 'COMPLETED':
      case 'FINISHED': 
      case 'ENDED': return 'Münazara Bitti';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'LIVE': return 'bg-red-100 text-red-800';
      case 'WAITING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
      case 'FINISHED':
      case 'ENDED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <Link href="/explore">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Münazaralara Geri Dön
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!debate && !debateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Münazara bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <Link href="/explore" className="text-blue-600 hover:text-blue-800">Münazaralar</Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">{mainDebate?.title || 'Münazara'}</span>
          </nav>
        </div>

        {/* Debate Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl font-bold text-gray-800">{mainDebate?.title || 'Münazara Başlığı'}</h1>
                {mainDebate?.category && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {getCategoryLabel(mainDebate.category)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{mainDebate?.topic || 'Münazara konusu yükleniyor...'}</p>
              
              {/* Debate Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Münazara ID</p>
                    <p className="font-semibold text-gray-800">
                      {mainDebate?.id.slice(0, 8) || 'Yükleniyor...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kategori</p>
                    <p className="font-semibold text-gray-800">
                      {mainDebate?.category ? getCategoryLabel(mainDebate.category) : 'Genel'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Toplam Oda</p>
                    <p className="font-semibold text-gray-800">
                      {debateData?.data.length || 0} oda
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Aktif Münazara
              </span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{debateData?.data?.length || 0}</p>
                  <p className="text-sm text-gray-600">Toplam Oda</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {debateData?.data?.filter((room: DebateRoomSummary) => room.status === 'ACTIVE').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Aktif Oda</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {debateData?.data?.reduce((total: number, room: DebateRoomSummary) => total + (room.participantCount || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Toplam Katılımcı</p>
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-500">
                  Münazaraya katılmak için bir odaya girin veya yeni bir oda oluşturun
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Münazara Odaları</h2>
              <p className="text-gray-600">
                {debateData?.data?.length ? 
                  `Bu münazara için ${debateData.data.length} oda bulundu` :
                  "Bu münazara için henüz oda oluşturulmamış"
                }
              </p>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={handleCreateRoom}
                disabled={isCreatingRoom}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-3 text-sm font-medium"
              >
                {isCreatingRoom ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Oda Oluştur
                  </>
                )}
              </button>
            )}
          </div>

          {/* Rooms Grid */}
          {debateData?.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {debateData.data.map((room: DebateRoomSummary) => (
                <motion.div
                  key={room.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {['FINISHED', 'ENDED', 'COMPLETED'].includes(room.status) ? (
                    <div className="block">
                      <div className="space-y-4">
                        {/* Room Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 transition-colors">
                                  Münazara Odası #{room.id.slice(0, 8)}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {new Date(room.createdAt).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                            {getStatusLabel(room.status)}
                          </span>
                        </div>

                        {/* Room Stats */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121m0 0A5.002 5.002 0 0112 15a5.002 5.002 0 012.804 5.121M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">{room.participantCount || 0} Katılımcı</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500">Maksimum: 20</span>
                            </div>
                          </div>
                        </div>

                        {/* Room Status Indicators */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-600">Roller:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              room.hasProposer 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-gray-50 text-gray-500 border border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                {room.hasProposer ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                  </svg>
                                )}
                                <span>Destekleyen</span>
                              </div>
                            </div>
                            <div className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              room.hasOpponent 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-gray-50 text-gray-500 border border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                {room.hasOpponent ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                  </svg>
                                )}
                                <span>Karşı Çıkan</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Status */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Münazara Tamamlandı</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Bu münazara sona ermiştir. Sonuçları görüntüleyebilirsiniz.</p>
                        </div>

                        {/* Disabled Button */}
                        <div className="pt-2">
                          <div className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                            Münazara Bitti
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link href={`/debate/${debateId}/room/${room.id}`} className="block">
                      <div className="space-y-4">
                      {/* Room Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Münazara Odası #{room.id.slice(0, 8)}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {new Date(room.createdAt).toLocaleDateString('tr-TR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {getStatusLabel(room.status)}
                        </span>
                      </div>

                      {/* Room Stats */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121m0 0A5.002 5.002 0 0112 15a5.002 5.002 0 012.804 5.121M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{room.participantCount || 0} Katılımcı</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">Maksimum: 20</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Status Indicators */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-600">Roller:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            room.hasProposer 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              {room.hasProposer ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                </svg>
                              )}
                              <span>Destekleyen</span>
                            </div>
                          </div>
                          <div className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            room.hasOpponent 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              {room.hasOpponent ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                </svg>
                              )}
                              <span>Karşı Çıkan</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Status */}
                      {['FINISHED', 'ENDED', 'COMPLETED'].includes(room.status) ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Münazara Tamamlandı</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Bu münazara sona ermiştir. Sonuçları görüntüleyebilirsiniz.</p>
                        </div>
                      ) : room.canStart ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-blue-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Münazara Başlamaya Hazır!</span>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">Odaya girip münazarayı başlatabilirsiniz</p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-amber-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm font-medium">Katılımcı Bekleniyor</span>
                          </div>
                          <p className="text-xs text-amber-600 mt-1">
                            {!room.hasProposer && !room.hasOpponent 
                              ? "Destekleyen ve karşı çıkan katılımcılar bekleniyor"
                              : !room.hasProposer 
                              ? "Destekleyen katılımcı bekleniyor"
                              : "Karşı çıkan katılımcı bekleniyor"}
                          </p>
                        </div>
                      )}

                      {/* Enter Room Button */}
                      <div className="pt-2">
                        <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium group-hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Odaya Gir
                        </div>
                      </div>
                    </div>
                  </Link>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Henüz Münazara Odası Yok</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Bu münazara için henüz hiç oda oluşturulmamış. Münazaraya katılmak için bir oda oluşturun ve diğer katılımcıların gelmesini bekleyin.
              </p>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <button
                    onClick={handleCreateRoom}
                    disabled={isCreatingRoom}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-3 mx-auto text-lg font-medium"
                  >
                    {isCreatingRoom ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Oda Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        İlk Münazara Odasını Oluştur
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-400">
                    Oda oluşturduktan sonra, münazaraya katılmak isteyen diğer kullanıcılar odanıza katılabilir.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center gap-3 text-yellow-800 mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-medium">Giriş Yapmanız Gerekiyor</span>
                  </div>
                  <p className="text-yellow-700 text-sm mb-4">
                    Münazara odası oluşturmak için önce hesabınıza giriş yapmalısınız.
                  </p>
                  <Link href="/auth/login">
                    <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer">
                      Giriş Yap
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
