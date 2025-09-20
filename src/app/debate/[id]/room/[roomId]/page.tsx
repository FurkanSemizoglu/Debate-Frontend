"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VoiceChatInterface from "@/components/debate/VoiceChatInterface";
import { 
  getIndividualDebateRoom,
  joinEnhancedDebate,
  leaveEnhancedDebate,
  joinDebateRoom,
  startDebateRoom,
  leaveDebateRoom
} from "@/services/room";
import { DebateCategory } from "@/types/debate";
import { EnhancedDebateRoomData, EnhancedUser } from "@/types/room";
import { useAuth } from "@/contexts/AuthContext";

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

export default function DebateRoom() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const debateId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const roomId = Array.isArray(params?.roomId) ? params.roomId[0] : params?.roomId;
  
  const [debateRoom, setDebateRoom] = useState<EnhancedDebateRoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'PROPOSER' | 'OPPONENT' | 'AUDIENCE'>('PROPOSER');
  const [isJoining, setIsJoining] = useState(false);
  const [currentUserParticipant, setCurrentUserParticipant] = useState<{role: string, user: EnhancedUser} | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    fetchDebateRoom();
  }, [debateId, roomId]);

  useEffect(() => {
    // User değiştiğinde tekrar kontrol et
    if (user && debateRoom) {
      checkUserParticipation();
    } else if (!user) {
      setCurrentUserParticipant(null);
    }
  }, [user, debateRoom]);

  const checkUserParticipation = () => {
    if (!user || !debateRoom || !debateRoom.participants) {
      setCurrentUserParticipant(null);
      return;
    }

    try {
      const isProposer = debateRoom.participants.proposers?.some((p: any) => p.user?.id === user.id) || false;
      const isOpponent = debateRoom.participants.opponents?.some((p: any) => p.user?.id === user.id) || false;
      const isAudience = debateRoom.participants.audience?.some((p: any) => p.user?.id === user.id) || false;
      
      if (isProposer || isOpponent || isAudience) {
        setCurrentUserParticipant({
          role: isProposer ? 'PROPOSER' : isOpponent ? 'OPPONENT' : 'AUDIENCE',
          user: {
            id: user.id,
            name: user.name,
            surname: user.surname || '',
            email: user.email
          }
        });
      } else {
        setCurrentUserParticipant(null);
      }
    } catch (error) {
      console.error("Error checking user participation:", error);
      setCurrentUserParticipant(null);
    }
  };

  const fetchDebateRoom = async () => {
    if (!roomId) {
      setError("Geçersiz oda ID'si");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const roomData = await getIndividualDebateRoom(roomId);
      console.log("Fetched room data:", roomData);
      setDebateRoom(roomData);
      
      setError(null);
    } catch (err: any) {
      console.error("Error fetching debate room:", err);
      setError(err.response?.data?.message || "Münazara odası yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinDebate = async (role: 'PROPOSER' | 'OPPONENT' | 'AUDIENCE') => {
    if (!roomId || !isAuthenticated) return;
    debugger;
    // Check if user is already a participant
    if (currentUserParticipant) {
      setError("Zaten bu odaya katıldınız. Önce odadan ayrılmanız gerekiyor.");
      return;
    }
    
    try {
      setIsJoining(true);
      setError(null); // Clear any previous errors
      
      await joinDebateRoom(roomId, role);
      
      // Refresh room data
      const updatedRoom = await getIndividualDebateRoom(roomId);
      setDebateRoom(updatedRoom);
      
      setShowJoinModal(false);
    } catch (err: any) {
      console.error("Error joining debate:", err);
      setError(err.response?.data?.message || "Münazaraya katılırken bir hata oluştu");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveDebate = async () => {
    if (!roomId) return;
    
    try {
      setError(null); // Clear any previous errors
      
      await leaveDebateRoom(roomId);
      
      // Clear current user participant immediately
      setCurrentUserParticipant(null);
      
      // Refresh room data
      const updatedRoom = await getIndividualDebateRoom(roomId);
      setDebateRoom(updatedRoom);
    } catch (err: any) {
      console.error("Error leaving debate:", err);
      setError(err.response?.data?.message || "Münazaradan ayrılırken bir hata oluştu");
    }
  };

  const handleStartDebate = async () => {
    if (!roomId || !debateRoom?.roomStatus.canStart) return;
    
    try {
      setIsStarting(true);
      
      // Başlatma API'si çağır
      await startDebateRoom(roomId);
      
      // Refresh room data
      const updatedRoom = await getIndividualDebateRoom(roomId);
      setDebateRoom(updatedRoom);
      
    } catch (err: any) {
      console.error("Error starting debate:", err);
      setError(err.response?.data?.message || "Münazara başlatılırken bir hata oluştu");
    } finally {
      setIsStarting(false);
    }
  };

  // Check if user is a participant in the room

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': 
      case 'LIVE': return 'Canlı';
      case 'WAITING': return 'Beklemede';
      case 'COMPLETED':
      case 'FINISHED': 
      case 'ENDED': return 'Tamamlandı';
      default: return status;
    }
  };

  // Helper function to get status color
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
          <Link href={`/debate/${debateId}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Oda Listesine Geri Dön
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!debateRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Münazara odası bulunamadı.</p>
          <Link href={`/debate/${debateId}`}>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Oda Listesine Geri Dön
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const debate = debateRoom.debate;
  const proposers = debateRoom.participants.proposers;
  const opponents = debateRoom.participants.opponents;
  const audience = debateRoom.participants.audience;
  const roomStatus = debateRoom.roomStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <Link href="/explore" className="text-blue-600 hover:text-blue-800">Münazaralar</Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link href={`/debate/${debateId}`} className="text-blue-600 hover:text-blue-800">
              {debate.title}
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Oda {roomId?.slice(0, 8)}</span>
          </nav>
        </div>

        {/* Room Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{debate.title}</h1>
                {debate.category && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getCategoryLabel(debate.category)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{debate.topic}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Oda ID: <strong>{roomId?.slice(0, 8)}</strong></span>
                <span className="mx-2">•</span>
                <span>{new Date(debateRoom.room.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(debateRoom.room.status)}`}>
                {getStatusLabel(debateRoom.room.status)}
              </span>
            </div>
          </div>

          {/* Participants Count */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{proposers.length} Destekleyen</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{opponents.length} Karşı Çıkan</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121m0 0A5.002 5.002 0 0112 15a5.002 5.002 0 012.804 5.121M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{audience.length} İzleyici</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 515.196-2.121m0 0A5.002 5.002 0 0112 15a5.002 5.002 0 012.804 5.121M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{debateRoom.participantCounts.total} Toplam</span>
            </div>
          </div>

          {/* Room Status */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              roomStatus.hasProposer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {roomStatus.hasProposer ? '✓' : '○'} Destekleyen
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              roomStatus.hasOpponent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {roomStatus.hasOpponent ? '✓' : '○'} Karşı Çıkan
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              roomStatus.canStart ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {roomStatus.canStart ? '✓ Başlayabilir' : '○ Başlamaya Hazır Değil'}
            </span>
          </div>
        </div>

        {/* Join/Leave Actions */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            {!currentUserParticipant ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Bu münazara odasına katılmak ister misiniz?</p>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Odaya Katıl
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">✓ Bu odaya katıldınız</span>
                  <span className="text-sm text-gray-500">
                    ({currentUserParticipant.role === 'PROPOSER' ? 'Destekleyen' : 
                      currentUserParticipant.role === 'OPPONENT' ? 'Karşı Çıkan' : 'İzleyici'})
                  </span>
                </div>
                <button
                  onClick={handleLeaveDebate}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Ayrıl
                </button>
              </div>
            )}
            
            {/* Start Debate Button for Room Creator */}
            {user && debateRoom && debateRoom.debate.createdBy.id === user.id && debateRoom.room.status === 'WAITING' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 mb-3">
                    {debateRoom.roomStatus.canStart 
                      ? "Münazara başlatılmaya hazır!" 
                      : "Münazarayı başlatmak için her iki tarafta da katılımcı olması gerekiyor."}
                  </p>
                  <button
                    onClick={handleStartDebate}
                    disabled={!debateRoom.roomStatus.canStart || isStarting}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      debateRoom.roomStatus.canStart && !isStarting
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isStarting ? 'Başlatılıyor...' : 'Münazarayı Başlat'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {debateRoom.room.status === 'ACTIVE' || debateRoom.room.status === 'LIVE' ? (
          /* Canlı Münazara Arayüzü */
          <VoiceChatInterface
            roomId={roomId as string}
            proposers={proposers}
            opponents={opponents}
            currentUser={user}
            onRoomClosed={() => {
              // Oda kapatıldığında sayfayı yenile
              fetchDebateRoom();
            }}
          />
        ) : (
          /* Normal Oda Arayüzü */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Participants */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Katılımcılar</h2>
              
              <div className="space-y-6">
                {/* Supporters */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-green-700 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Destekleyen Taraf ({proposers.length})
                    </h3>
                  </div>
                  {proposers.length > 0 ? (
                    <div className="space-y-2">
                      {proposers.map((participant: any) => (
                        <div key={participant.participantId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {participant.user.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{participant.user.name} {participant.user.surname}</p>
                              <p className="text-sm text-gray-500">Destekleyen</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Henüz destekleyen katılımcı yok.</p>
                  )}
                </div>

                {/* Opponents */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-red-700 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Karşı Çıkan Taraf ({opponents.length})
                    </h3>
                  </div>
                  {opponents.length > 0 ? (
                    <div className="space-y-2">
                      {opponents.map((participant: any) => (
                        <div key={participant.participantId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {participant.user.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{participant.user.name} {participant.user.surname}</p>
                              <p className="text-sm text-gray-500">Karşı Çıkan</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Henüz karşı çıkan katılımcı yok.</p>
                  )}
                </div>

                {/* Audience */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-blue-700 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121m0 0A5.002 5.002 0 0112 15a5.002 5.002 0 012.804 5.121M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      İzleyiciler ({audience.length})
                    </h3>
                  </div>
                  {audience.length > 0 ? (
                    <div className="space-y-2">
                      {audience.map((participant: any) => (
                        <div key={participant.participantId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {participant.user.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{participant.user.name} {participant.user.surname}</p>
                              <p className="text-sm text-gray-500">İzleyici</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Henüz izleyici yok.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Room Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Oda Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Durum</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(debateRoom.room.status)}`}>
                    {getStatusLabel(debateRoom.room.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Oluşturulma</span>
                  <span className="text-sm text-gray-800">{new Date(debateRoom.room.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Son Güncelleme</span>
                  <span className="text-sm text-gray-800">{new Date(debateRoom.room.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Toplam Katılımcı</span>
                  <span className="text-sm font-medium text-gray-800">{debateRoom.participantCounts.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Münazaraya Katıl</h3>
              <p className="text-gray-600 mb-6">Hangi tarafta yer almak istiyorsunuz?</p>
              
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="PROPOSER"
                    checked={selectedRole === 'PROPOSER'}
                    onChange={(e) => setSelectedRole(e.target.value as 'PROPOSER' | 'OPPONENT' | 'AUDIENCE')}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-600 rounded-full"></span>
                    <span className="font-medium">Destekleyen Taraf</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="OPPONENT"
                    checked={selectedRole === 'OPPONENT'}
                    onChange={(e) => setSelectedRole(e.target.value as 'PROPOSER' | 'OPPONENT' | 'AUDIENCE')}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-600 rounded-full"></span>
                    <span className="font-medium">Karşı Çıkan Taraf</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="AUDIENCE"
                    checked={selectedRole === 'AUDIENCE'}
                    onChange={(e) => setSelectedRole(e.target.value as 'PROPOSER' | 'OPPONENT' | 'AUDIENCE')}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                    <span className="font-medium">İzleyici</span>
                  </div>
                </label>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleJoinDebate(selectedRole)}
                  disabled={isJoining}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isJoining ? 'Katılınıyor...' : 'Katıl'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
