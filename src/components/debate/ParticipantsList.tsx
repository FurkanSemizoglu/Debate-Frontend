
"use client";

import { motion } from "framer-motion";
import { DebateParticipant, ParticipantRole } from "@/services/debate";

interface ParticipantsListProps {
  participants: DebateParticipant[];
  speakerFor?: DebateParticipant;
  speakerAgainst?: DebateParticipant;
  spectators: DebateParticipant[];
  onAllowToSpeak?: (participantId: string) => void;
  isModeratorView?: boolean;
}

export default function ParticipantsList({ 
  participants = [], 
  speakerFor,
  speakerAgainst,
  spectators = [],
  onAllowToSpeak,
  isModeratorView = false
}: ParticipantsListProps) {
  const getRoleLabel = (role: ParticipantRole) => {
    switch (role) {
      case ParticipantRole.SPEAKER_FOR:
        return "Savunan";
      case ParticipantRole.SPEAKER_AGAINST:
        return "Karşı Çıkan";
      case ParticipantRole.SPECTATOR:
        return "İzleyici";
      default:
        return "Katılımcı";
    }
  };

  const getRoleColor = (role: ParticipantRole) => {
    switch (role) {
      case ParticipantRole.SPEAKER_FOR:
        return "text-green-700 bg-green-100";
      case ParticipantRole.SPEAKER_AGAINST:
        return "text-red-700 bg-red-100";
      case ParticipantRole.SPECTATOR:
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };
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
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Katılımcılar</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {participants.length} Kişi
        </span>
      </div>

      <div className="p-3 max-h-96 overflow-y-auto">
        {participants.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            Henüz kimse bu münazaraya katılmamış.
          </p>
        ) : (
          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {participant.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {participant.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {participant.user.name}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getRoleColor(participant.role)}`}>
                        {getRoleLabel(participant.role)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(participant.joinedAt).toLocaleDateString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!participant.isOnline && (
                    <span className="text-xs text-gray-400">●</span>
                  )}
                  
                  {participant.role === ParticipantRole.SPEAKER_FOR && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Savunan konuşmacı"></div>
                  )}
                  
                  {participant.role === ParticipantRole.SPEAKER_AGAINST && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" title="Karşı çıkan konuşmacı"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Summary */}
        {participants.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Toplam: {participants.length}</span>
              <div className="flex gap-2">
                <span>İzleyici: {spectators.length}</span>
                <span>Konuşmacı: {(speakerFor ? 1 : 0) + (speakerAgainst ? 1 : 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
}

