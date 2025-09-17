// Münazara katılımcı listesi bileşeni
"use client";

import { motion } from "framer-motion";

interface Participant {
  id: number;
  name: string;
  image: string;
  isOnline: boolean;
  hasRequestedToSpeak?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  onAllowToSpeak?: (participantId: number) => void;
  isModeratorView?: boolean;
}

export default function ParticipantsList({ 
  participants, 
  onAllowToSpeak,
  isModeratorView = false
}: ParticipantsListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Katılımcılar</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {participants.length} Kişi
        </span>
      </div>
      
      <motion.div 
        className="p-2 max-h-80 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {participants.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Henüz katılımcı bulunmuyor.
          </div>
        ) : (
          <ul className="space-y-2">
            {participants.map((participant) => (
              <motion.li 
                key={participant.id}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={participant.image} 
                      alt={participant.name} 
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm text-gray-800">{participant.name}</p>
                  </div>
                </div>
                
                {isModeratorView && participant.hasRequestedToSpeak && (
                  <motion.button
                    className="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium"
                    onClick={() => onAllowToSpeak && onAllowToSpeak(participant.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Konuşma izni ver"
                  >
                    İzin Ver
                  </motion.button>
                )}
                
                {participant.hasRequestedToSpeak && !isModeratorView && (
                  <div className="flex items-center text-xs text-yellow-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1 animate-pulse"></div>
                    Söz istiyor
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
