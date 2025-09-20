// Canlı münazara için sesli sohbet arayüzü
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finishDebateRoom, RoomStatusEnum } from '@/services/room';

interface VoiceChatInterfaceProps {
  roomId: string;
  proposers: any[];
  opponents: any[];
  currentUser: any;
  onRoomClosed: () => void;
}

interface Speaker {
  id: string;
  name: string;
  surname: string;
  role: 'PROPOSER' | 'OPPONENT';
  isCurrentSpeaker: boolean;
  isMuted: boolean;
}

export default function VoiceChatInterface({
  roomId,
  proposers,
  opponents,
  currentUser,
  onRoomClosed
}: VoiceChatInterfaceProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Timer için effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Konuşmacıları hazırla
  useEffect(() => {
    const allSpeakers: Speaker[] = [
      ...proposers.map(p => ({
        id: p.user.id,
        name: p.user.name,
        surname: p.user.surname,
        role: 'PROPOSER' as const,
        isCurrentSpeaker: false,
        isMuted: false
      })),
      ...opponents.map(o => ({
        id: o.user.id,
        name: o.user.name,
        surname: o.user.surname,
        role: 'OPPONENT' as const,
        isCurrentSpeaker: false,
        isMuted: false
      }))
    ];
    setSpeakers(allSpeakers);
  }, [proposers, opponents]);

  // Zaman formatlama
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Konuşmacı değiştirme
  const handleSpeakerToggle = (speakerId: string) => {
    setSpeakers(prev => prev.map(speaker => ({
      ...speaker,
      isCurrentSpeaker: speaker.id === speakerId ? !speaker.isCurrentSpeaker : false
    })));
    
    const speaker = speakers.find(s => s.id === speakerId);
    setCurrentSpeaker(speaker || null);
  };

  // Mikrofon kapatma/açma
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Kayıt başlatma/durdurma
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  // Odayı kapatma
  const handleCloseRoom = async () => {
    try {
      setIsClosing(true);
      await finishDebateRoom(roomId);
      onRoomClosed();
    } catch (error) {
      console.error('Error closing room:', error);
    } finally {
      setIsClosing(false);
    }
  };

  const isCurrentUserSpeaker = speakers.some(s => 
    s.id === currentUser?.id && (s.role === 'PROPOSER' || s.role === 'OPPONENT')
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 space-y-6">
      {/* Header - Canlı Münazara */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-red-500 text-white rounded-full mb-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-white rounded-full"
          />
          <span className="font-semibold">CANLI YAYIN</span>
        </motion.div>
        
        <div className="text-3xl font-bold text-gray-800 mb-1">
          {formatTime(timeElapsed)}
        </div>
        <p className="text-gray-600">Münazara süresi</p>
      </div>

      {/* Konuşmacı Paneli */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destekleyenler */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Destekleyenler
          </h3>
          <div className="space-y-2">
            {proposers.map((proposer: any) => {
              const speaker = speakers.find(s => s.id === proposer.user.id);
              const isCurrentlySpeaking = speaker?.isCurrentSpeaker;
              
              return (
                <div
                  key={proposer.user.id}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    isCurrentlySpeaking 
                      ? 'border-green-400 bg-green-50 shadow-lg transform scale-105' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        isCurrentlySpeaking ? 'bg-green-500' : 'bg-green-600'
                      }`}>
                        {proposer.user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {proposer.user.name} {proposer.user.surname}
                        </p>
                        {isCurrentlySpeaking && (
                          <motion.p
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-sm text-green-600 font-medium"
                          >
                            🎤 Konuşuyor...
                          </motion.p>
                        )}
                      </div>
                    </div>
                    
                    {isCurrentUserSpeaker && proposer.user.id === currentUser?.id && (
                      <button
                        onClick={() => handleSpeakerToggle(proposer.user.id)}
                        className={`p-2 rounded-full transition-colors ${
                          isCurrentlySpeaking 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                        title={isCurrentlySpeaking ? "Konuşmayı bitir" : "Konuşmaya başla"}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Karşı Çıkanlar */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13l3 3 7-7" />
            </svg>
            Karşı Çıkanlar
          </h3>
          <div className="space-y-2">
            {opponents.map((opponent: any) => {
              const speaker = speakers.find(s => s.id === opponent.user.id);
              const isCurrentlySpeaking = speaker?.isCurrentSpeaker;
              
              return (
                <div
                  key={opponent.user.id}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    isCurrentlySpeaking 
                      ? 'border-red-400 bg-red-50 shadow-lg transform scale-105' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        isCurrentlySpeaking ? 'bg-red-500' : 'bg-red-600'
                      }`}>
                        {opponent.user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {opponent.user.name} {opponent.user.surname}
                        </p>
                        {isCurrentlySpeaking && (
                          <motion.p
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-sm text-red-600 font-medium"
                          >
                            🎤 Konuşuyor...
                          </motion.p>
                        )}
                      </div>
                    </div>
                    
                    {isCurrentUserSpeaker && opponent.user.id === currentUser?.id && (
                      <button
                        onClick={() => handleSpeakerToggle(opponent.user.id)}
                        className={`p-2 rounded-full transition-colors ${
                          isCurrentlySpeaking 
                            ? 'bg-gray-500 text-white hover:bg-gray-600' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        title={isCurrentlySpeaking ? "Konuşmayı bitir" : "Konuşmaya başla"}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kontrol Paneli */}
      {isCurrentUserSpeaker && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Ses Kontrolleri</h3>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleMuteToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isMuted 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMuted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                )}
              </svg>
              {isMuted ? 'Mikrofonu Aç' : 'Mikrofonu Kapat'}
            </button>
          </div>
        </div>
      )}

      {/* Admin Kontrolleri */}
      {currentUser && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Münazara Yönetimi</h3>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Münazarayı sonlandırmak için butona tıklayın
            </div>
            <button
              onClick={handleCloseRoom}
              disabled={isClosing}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isClosing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Kapatılıyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Münazarayı Bitir
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Durum Bilgisi */}
      <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-3">
        <p>
          <strong>Aktif Konuşmacı:</strong> {
            currentSpeaker 
              ? `${currentSpeaker.name} ${currentSpeaker.surname} (${currentSpeaker.role === 'PROPOSER' ? 'Destekleyen' : 'Karşı Çıkan'})` 
              : 'Henüz kimse konuşmuyor'
          }
        </p>
      </div>
    </div>
  );
}