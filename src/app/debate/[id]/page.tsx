"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DebateSpeaker from "@/components/DebateSpeaker";
import DebateControls from "@/components/DebateControls";
import DebateChat from "@/components/DebateChat";
import ParticipantsList from "@/components/ParticipantsList";
import DebateProposition from "@/components/DebateProposition";

// Örnek münazara verileri (gerçek uygulamada API'dan gelecek)
const debateData = {
  1: {
    id: 1,
    title: "Yapay zeka insanlığı tehdit eder mi?",
    description: "Yapay zekanın gelişimi ve potansiyel tehlikeleri hakkında bir münazara.",
    status: "live",
    startTime: "2025-06-13T14:30:00",
    affirmativeThesis: "Yapay zeka teknolojisinin hızlı gelişimi, insanlığı gelecekte tehdit edebilir. Kontrol edilemeyen AI sistemleri, insanlığın varlığını tehlikeye atabilecek riskleri beraberinde getirmektedir. Özellikle süper zeka kavramı ve sistemlerin kendi kendini geliştirme potansiyeli, ciddi etik ve güvenlik endişelerini gündeme getirmektedir.",
    negativeThesis: "Yapay zeka insanlığı tehdit etmez, aksine birçok alanda yaşam kalitesini artıran ve insanlara yardımcı olan bir teknolojidir. Doğru düzenlemeler ve etik çerçeveler ile geliştirilen yapay zeka sistemleri, sağlık, eğitim, ulaşım gibi alanlarda devrim yaratarak insanlığa fayda sağlayacaktır.",
    moderator: {
      id: 101,
      name: "Prof. Dr. Ahmet Yılmaz",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Moderatör"
    },
    affirmativeSpeaker: {
      id: 102,
      name: "Ayşe Kaya",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      role: "Teknoloji Etikçisi"
    },
    negativeSpeaker: {
      id: 103,
      name: "Mehmet Demir",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "AI Araştırmacısı"
    },
    participants: [
      { id: 201, name: "Elif Şahin", image: "https://randomuser.me/api/portraits/women/33.jpg", isOnline: true },
      { id: 202, name: "Can Öztürk", image: "https://randomuser.me/api/portraits/men/41.jpg", isOnline: true },
      { id: 203, name: "Zeynep Kılıç", image: "https://randomuser.me/api/portraits/women/68.jpg", isOnline: true, hasRequestedToSpeak: true },
      { id: 204, name: "Burak Yıldız", image: "https://randomuser.me/api/portraits/men/55.jpg", isOnline: false },
      { id: 205, name: "Selin Arslan", image: "https://randomuser.me/api/portraits/women/47.jpg", isOnline: true },
      { id: 206, name: "Onur Çelik", image: "https://randomuser.me/api/portraits/men/36.jpg", isOnline: true, hasRequestedToSpeak: true },
      { id: 207, name: "Deniz Aydın", image: "https://randomuser.me/api/portraits/women/22.jpg", isOnline: true },
    ],
    chatMessages: [
      { id: 1, user: "Sistem", userImage: "https://ui-avatars.com/api/?name=S&background=2563eb&color=fff", message: "Münazara başladı! Lütfen kurallara uyun ve saygılı olun.", timestamp: "14:30", isFromDebater: false },
      { id: 2, user: "Ayşe Kaya", userImage: "https://randomuser.me/api/portraits/women/65.jpg", message: "Yapay zeka teknolojilerinin kontrolsüz gelişimi, ciddi etik sorunları beraberinde getiriyor.", timestamp: "14:32", isFromDebater: true, side: "affirmative" },
      { id: 3, user: "Mehmet Demir", userImage: "https://randomuser.me/api/portraits/men/22.jpg", message: "Yapay zeka sistemleri doğru düzenlemelerle insanlığa büyük fayda sağlayabilir.", timestamp: "14:33", isFromDebater: true, side: "negative" },
      { id: 4, user: "Elif Şahin", userImage: "https://randomuser.me/api/portraits/women/33.jpg", message: "Ben de yapay zekanın iş alanlarında ciddi değişimlere yol açacağını düşünüyorum.", timestamp: "14:35", isFromDebater: false },
      { id: 5, user: "Can Öztürk", userImage: "https://randomuser.me/api/portraits/men/41.jpg", message: "Ayşe Hanım haklı, özellikle askeri alandaki AI kullanımı endişe verici olabilir.", timestamp: "14:36", isFromDebater: false },
      { id: 6, user: "Zeynep Kılıç", userImage: "https://randomuser.me/api/portraits/women/68.jpg", message: "Mehmet Bey, yapay zekanın sağlık alanındaki olumlu etkilerinden bahsedebilir misiniz?", timestamp: "14:38", isFromDebater: false },
    ],
    affirmativeVotes: 42,
    negativeVotes: 35,
  },
  2: {
    id: 2,
    title: "Üniversite eğitimi şart mı?",
    description: "Modern dünyada üniversite eğitiminin değeri ve alternatifleri üzerine tartışma.",
    status: "scheduled",
    startTime: "2025-06-14T15:00:00",
    affirmativeThesis: "Üniversite eğitimi, kişisel gelişim ve kariyer başarısı için gereklidir. Akademik bilgi, araştırma becerileri ve sosyal ağlar kazandırır.",
    negativeThesis: "Üniversite eğitimi her zaman gerekli değildir. Pratik beceriler, girişimcilik ve deneyim daha değerli olabilir.",
    moderator: {
      id: 201,
      name: "Dr. Fatma Özkan",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Eğitim Uzmanı"
    },
    affirmativeSpeaker: {
      id: 202,
      name: "Kemal Şimşek",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      role: "Akademisyen"
    },
    negativeSpeaker: {
      id: 203,
      name: "Seda Kara",
      image: "https://randomuser.me/api/portraits/women/29.jpg",
      role: "Girişimci"
    },
    participants: [
      { id: 301, name: "Ali Veli", image: "https://randomuser.me/api/portraits/men/44.jpg", isOnline: true },
      { id: 302, name: "Gül Yaprak", image: "https://randomuser.me/api/portraits/women/55.jpg", isOnline: true },
    ],
    chatMessages: [],
    affirmativeVotes: 15,
    negativeVotes: 12,
  },
  3: {
    id: 3,
    title: "Sosyal medya yasaklanmalı mı?",
    description: "Sosyal medyanın toplumsal etkileri ve düzenlenmesi hakkında tartışma.",
    status: "upcoming",
    startTime: "2025-06-15T16:00:00",
    affirmativeThesis: "Sosyal medya platformları toplumsal barışı bozuyor ve zararlı etkileri faydalarından fazla.",
    negativeThesis: "Sosyal medya ifade özgürlüğü ve iletişim için vazgeçilmez bir araçtır.",
    moderator: {
      id: 301,
      name: "Av. Murat Koç",
      image: "https://randomuser.me/api/portraits/men/66.jpg",
      role: "Hukuk Uzmanı"
    },
    affirmativeSpeaker: {
      id: 302,
      name: "Psk. Aylin Tan",
      image: "https://randomuser.me/api/portraits/women/38.jpg",
      role: "Psikolog"
    },
    negativeSpeaker: {
      id: 303,
      name: "Özgür Berk",
      image: "https://randomuser.me/api/portraits/men/25.jpg",
      role: "Dijital Medya Uzmanı"
    },
    participants: [],
    chatMessages: [],
    affirmativeVotes: 0,
    negativeVotes: 0,
  }
};

export default function Debate() {
  const params = useParams();
  const id = params?.id;
  const debateId = Array.isArray(id) ? parseInt(id[0]) : (id ? parseInt(id) : 1);
  const rawDebate = debateData[debateId as keyof typeof debateData];
  
  // If debate not found, show error
  if (!rawDebate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Münazara Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız münazara mevcut değil.</p>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // Provide default values for missing properties
  const defaultSpeaker = { id: 0, name: 'Bilinmeyen', image: '/placeholder.jpg', role: 'Konuşmacı' };
  const debate = {
    ...rawDebate,
    affirmativeSpeaker: (rawDebate as any).affirmativeSpeaker || defaultSpeaker,
    negativeSpeaker: (rawDebate as any).negativeSpeaker || defaultSpeaker,
    moderator: (rawDebate as any).moderator || defaultSpeaker,
    chatMessages: (rawDebate as any).chatMessages || [],
    participants: (rawDebate as any).participants || [],
    affirmativeVotes: (rawDebate as any).affirmativeVotes || 0,
    negativeVotes: (rawDebate as any).negativeVotes || 0,
    affirmativeThesis: (rawDebate as any).affirmativeThesis || '',
    negativeThesis: (rawDebate as any).negativeThesis || '',
  };

  const [currentSpeaker, setCurrentSpeaker] = useState('moderator');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 dakika saniye cinsinden
  const [votes, setVotes] = useState({
    affirmative: debate.affirmativeVotes,
    negative: debate.negativeVotes
  });
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (debate.status === 'live') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            // Konuşmacı değiştir
            if (currentSpeaker === 'moderator') {
              setCurrentSpeaker('affirmative');
              return 8 * 60; // 8 dakika
            } else if (currentSpeaker === 'affirmative') {
              setCurrentSpeaker('negative');
              return 8 * 60; // 8 dakika
            } else if (currentSpeaker === 'negative') {
              setCurrentSpeaker('affirmative');
              return 5 * 60; // 5 dakika (cevap)
            } else {
              setCurrentSpeaker('moderator');
              return 3 * 60; // 3 dakika (özet)
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSpeaker, debate.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVote = (side: 'affirmative' | 'negative') => {
    if (!hasVoted) {
      setVotes(prev => ({
        ...prev,
        [side]: prev[side] + 1
      }));
      setHasVoted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{debate.title}</h1>
              <p className="text-gray-600">{debate.description}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                debate.status === 'live' ? 'bg-red-100 text-red-800' :
                debate.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {debate.status === 'live' ? 'Canlı' :
                 debate.status === 'scheduled' ? 'Planlanmış' :
                 'Yaklaşan'}
              </span>
            </div>
          </div>
          
          {debate.status === 'live' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-800 font-medium">Canlı Yayın</span>
                </div>
                <div className="text-red-800 font-mono text-lg">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Panel - Katılımcılar */}
          <div className="lg:col-span-1">
            <ParticipantsList participants={debate.participants} />
          </div>

          {/* Orta Panel - Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Münazara Tezleri */}
            <DebateProposition 
              title={debate.title}
              description={debate.description}
              affirmativeThesis={debate.affirmativeThesis}
              negativeThesis={debate.negativeThesis}
              canVote={debate.status === 'live'}
              affirmativeVotes={votes.affirmative}
              negativeVotes={votes.negative}
              totalVotes={votes.affirmative + votes.negative}
              onVote={handleVote}
            />

            {/* Konuşmacılar */}
            <div className="space-y-4">
              <DebateSpeaker
                name={debate.moderator.name}
                image={debate.moderator.image}
                role={debate.moderator.role}
                isSpeaking={currentSpeaker === 'moderator'}
                isOnline={true}
                side="affirmative"
                audioLevel={currentSpeaker === 'moderator' ? 75 : 0}
                isMuted={false}
              />
              <DebateSpeaker
                name={debate.affirmativeSpeaker.name}
                image={debate.affirmativeSpeaker.image}
                role={debate.affirmativeSpeaker.role}
                isSpeaking={currentSpeaker === 'affirmative'}
                isOnline={true}
                side="affirmative"
                audioLevel={currentSpeaker === 'affirmative' ? 75 : 0}
                isMuted={false}
              />
              <DebateSpeaker
                name={debate.negativeSpeaker.name}
                image={debate.negativeSpeaker.image}
                role={debate.negativeSpeaker.role}
                isSpeaking={currentSpeaker === 'negative'}
                isOnline={true}
                side="negative"
                audioLevel={currentSpeaker === 'negative' ? 75 : 0}
                isMuted={false}
              />
            </div>

            {/* Kontroller */}
            <DebateControls
              isParticipant={true}
              canSpeak={false}
              isMuted={false}
              isRecording={false}
              currentSpeakerName={
                currentSpeaker === 'moderator' ? debate.moderator.name :
                currentSpeaker === 'affirmative' ? debate.affirmativeSpeaker.name :
                debate.negativeSpeaker.name
              }
              remainingTime={timeLeft}
              onToggleMute={() => {}}
              onRequestToSpeak={() => {}}
              onToggleRecording={() => {}}
            />
          </div>

          {/* Sağ Panel - Chat */}
          <div className="lg:col-span-1">
            <DebateChat
              messages={debate.chatMessages}
              onSendMessage={(message: string) => {
                // Handle new message logic here
                console.log('New message:', message);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
