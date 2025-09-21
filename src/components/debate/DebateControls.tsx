// Münazara ses kontrol ve tartışma akışı bileşeni
"use client";

import { motion } from "framer-motion";

interface DebateControlsProps {
  isParticipant: boolean;
  canSpeak: boolean;
  isMuted: boolean;
  isRecording: boolean;
  currentSpeakerName: string;
  remainingTime: number; // Saniye cinsinden
  onToggleMute: () => void;
  onRequestToSpeak: () => void;
  onToggleRecording: () => void;
}

export default function DebateControls({
  isParticipant,
  canSpeak,
  isMuted,
  isRecording,
  currentSpeakerName,
  remainingTime,
  onToggleMute,
  onRequestToSpeak,
  onToggleRecording
}: DebateControlsProps) {
  // Kalan süreyi formatla
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Devam eden animasyon için pulse efekti
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      {/* Konuşmacı bilgisi ve süre */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
          <span className="font-medium">
            Şu an konuşuyor: <span className="font-bold text-blue-600">{currentSpeakerName}</span>
          </span>
        </div>
        
        <motion.div 
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-mono font-medium"
          variants={pulseVariants}
          animate="pulse"
        >
          {formatTime(remainingTime)}
        </motion.div>
      </div>
      
      {/* Kontrol butonları */}
      <div className="flex flex-wrap justify-center gap-3">
        {isParticipant && (
          <>
            <motion.button
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isMuted 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              onClick={onToggleMute}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!canSpeak}
            >
              {isMuted ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                  </svg>
                  <span>Sessize Alındı</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                  <span>Mikrofon Açık</span>
                </>
              )}
            </motion.button>
            
            {!canSpeak && (
              <motion.button
                className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg font-medium flex items-center gap-2"
                onClick={onRequestToSpeak}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
                </svg>
                <span>Söz İste</span>
              </motion.button>
            )}
          </>
        )}
        
        <motion.button
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={onToggleRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? (
            <>
              <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
              <span>Kaydı Durdur</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              <span>Kaydet</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Yardım</span>
        </motion.button>
      </div>
    </div>
  );
}
