import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-lg text-gray-800">Münazaram</span>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">Hakkımızda</a>
            <a href="#" className="hover:text-gray-700">İletişim</a>
            <a href="#" className="hover:text-gray-700">Kullanım Şartları</a>
            <a href="#" className="hover:text-gray-700">Gizlilik Politikası</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; 2025 Münazaram. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}