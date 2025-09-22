import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MünazaraApp',
  description: 'Fikirlerinizi münazara ile duyurun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body  className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="max-w-6xl mx-auto mt-6 pb-10">
                {children}
              </div>
            
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}