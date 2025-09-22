// Hero component for main page
"use client";

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.div 
      className="relative bg-gradient-to-r from-blue-600 to-indigo-800 rounded-xl overflow-hidden shadow-2xl mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative px-8 py-16 md:py-20 md:px-16 flex flex-col items-center text-center z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Fikirlerinizi<br />
          <span className="text-yellow-300">Münazaram</span> ile Duyurun
        </h1>
        <p className="text-white text-lg md:text-xl max-w-2xl mb-8">
          Münazara platformumuzda fikirlerinizi paylaşın, başkalarının düşüncelerini keşfedin ve
          entelektüel tartışmalara katılın.
        </p>
        <motion.button
          className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full shadow-lg transform transition-transform duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hemen Başla
        </motion.button>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-300 rounded-full opacity-20"></div>
    </motion.div>
  );
}
