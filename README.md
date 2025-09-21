# Debate App 🎙️

Modern, real-time debate platform built with Next.js that enables users to create, participate in, and watch live debates across various topics.

## ✨ Features

- **🔥 Real-time Debates**: Live debate rooms with real-time chat and voice communication
- **🎯 Multiple Categories**: Politics, Technology, Education, Sports, Philosophy, Society, Environment
- **👥 Role-based Participation**: Spectators, Speakers (For/Against positions)
- **🔍 Debate Discovery**: Explore and search debates by category and popularity
- **🎨 Modern UI**: Beautiful, responsive design with Framer Motion animations
- **🔐 Authentication**: Secure user registration and login system
- **📱 Mobile Friendly**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Linting**: ESLint

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (login, register)
│   ├── create/            # Create debate page
│   ├── debate/            # Debate detail and room pages
│   ├── explore/           # Debate exploration page
│   ├── home/              # Home page
│   └── popular/           # Popular debates page
├── components/            # Reusable UI components
│   ├── debate/           # Debate-specific components
│   ├── layout/           # Layout components (Navbar, Footer, etc.)
│   └── ui/               # General UI components
├── contexts/             # React contexts (AuthContext)
├── lib/                  # Utility functions and constants
├── services/             # API service functions
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FurkanSemizoglu/Debate-Frontend.git
   cd debate-app-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Components

### Debate Components
- **DebateCard**: Display debate information in card format
- **DebateChat**: Real-time chat interface for debates
- **DebateControls**: Control panel for debate participants
- **VoiceChatInterface**: Voice communication interface
- **ParticipantsList**: Display and manage debate participants

### UI Components
- **CategoryFilter**: Filter debates by category
- **SearchBar**: Search debates by title or topic
- **LoadingSpinner**: Loading state indicator
- **Toast**: Notification system

## 🔧 Configuration

The project uses modern configuration files:
- `eslint.config.mjs` - ESLint configuration
- `tailwindcss.config.js` - Tailwind CSS configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## 🌐 API Integration

The app includes service layers for:
- **Authentication**: User login/register/logout
- **Debates**: Create, fetch, and manage debates
- **Rooms**: Real-time debate room management
- **API Client**: Centralized HTTP client configuration

## 🎨 Design System

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: Following web accessibility standards
- **Modern UI**: Clean, contemporary interface design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/FurkanSemizoglu/Debate-Frontend)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

---

Built with ❤️ using Next.js and TypeScript
