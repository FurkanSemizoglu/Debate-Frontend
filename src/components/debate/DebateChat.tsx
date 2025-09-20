// Münazara sohbet bileşeni
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: number;
  user: string;
  userImage: string;
  message: string;
  timestamp: string;
  isFromDebater: boolean;
  side?: "affirmative" | "negative";
}

interface DebateChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export default function DebateChat({ messages, onSendMessage }: DebateChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Yeni mesaj geldiğinde otomatik aşağı kaydırma
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Mesaj gönderme fonksiyonu
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  // Enter tuşu ile gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-3 bg-gray-100 border-b">
        <h3 className="font-semibold text-gray-800">Canlı Sohbet</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "400px" }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.isFromDebater ? 'bg-blue-50 p-2 rounded-lg' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={msg.userImage}
                alt={msg.user}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {msg.user}
                  </span>
                  {msg.isFromDebater && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      msg.side === "affirmative" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {msg.side === "affirmative" ? "Savunan" : "Karşı"}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{msg.message}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mesajınızı yazın..."
          />
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={newMessage.trim() === ""}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
