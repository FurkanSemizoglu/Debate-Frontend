// Münazara için konuşmacı bileşeni
"use client";

import { motion } from "framer-motion";

interface SpeakerProps {
  name: string;
  image: string;
  role: string;
  isSpeaking?: boolean;
  isOnline?: boolean;
  side: "affirmative" | "negative";
  audioLevel?: number; // 0-100 arasında ses seviyesi
  isMuted?: boolean;
}

export default function DebateSpeaker({
  name,
  image,
  role,
  isSpeaking = false,
  isOnline = true,
  side,
  audioLevel = 0,
  isMuted = false
}: SpeakerProps) {
  // Taraf renklerini belirleme
  const sideColors = {
    affirmative: {
      light: "bg-blue-100",
      medium: "bg-blue-500",
      dark: "bg-blue-700",
      border: "border-blue-500",
      text: "text-blue-700",
      label: "Savunan Taraf"
    },
    negative: {
      light: "bg-red-100",
      medium: "bg-red-500",
      dark: "bg-red-700",
      border: "border-red-500",
      text: "text-red-700",
      label: "Karşı Taraf"
    }
  };

  const colors = sideColors[side];

  return (
    <motion.div
      className={`relative p-4 rounded-xl shadow-md ${colors.light} border ${colors.border} transition-all`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: isSpeaking 
          ? '0 0 0 4px rgba(59, 130, 246, 0.5), 0 4px 10px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Konuşmacı durumu (konuşuyor mu) */}
      {isSpeaking && (
        <motion.div 
          className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          Konuşuyor
        </motion.div>
      )}
      
      {/* Taraf etiketi */}
      <div className={`absolute -top-2 left-4 px-2 py-0.5 rounded-full text-xs font-medium ${colors.medium} text-white`}>
        {colors.label}
      </div>
      
      <div className="flex flex-col items-center">
        {/* Profil resmi ve durumu */}
        <div className="relative mb-3">
          <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${colors.border}`}>
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover ${isMuted ? 'grayscale opacity-70' : ''}`}
            />
          </div>
          
          {/* Online durumu */}
          <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          
          {/* Mikrofon durumu */}
          {isMuted && (
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
              </svg>
            </div>
          )}
        </div>
        
        {/* Konuşmacı bilgileri */}
        <h3 className="font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{role}</p>
        
        {/* Ses seviyesi göstergesi */}
        {!isMuted && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
            <motion.div 
              className={`h-1.5 rounded-full ${colors.medium}`} 
              initial={{ width: "0%" }}
              animate={{ width: `${audioLevel}%` }}
              transition={{ duration: 0.1 }}
            ></motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
