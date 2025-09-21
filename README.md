# Debate App 🎙️

Modern debate platform built with Next.js where users can create, explore, and participate in debates across various topics.

> **⚠️ Project Status**: This project is currently under development. Some features are still being implemented.

## ✨ Features

### ✅ Implemented
- **🎯 Multiple Categories**: Politics, Technology, Education, Sports, Philosophy, Society, Environment
- **🔍 Debate Discovery**: Explore and browse debates by category
- **🎨 Modern UI**: Clean, responsive design with Framer Motion animations
- **� Mobile Friendly**: Optimized for all device sizes
- **🏗️ Component Architecture**: Well-structured React components

### 🚧 In Development
- **�🔐 Authentication**: User registration and login system
- **� Role-based Participation**: Spectators, Speakers (For/Against positions)
- **💬 Real-time Chat**: Live chat functionality for debates
- **🎙️ Voice Communication**: Voice chat interface
- **🔥 Live Debate Rooms**: Real-time debate sessions

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

### Layout Components
- **Navbar**: Navigation bar with menu items
- **Footer**: Site footer information
- **Hero**: Landing page hero section

### Debate Components (In Development)
- **DebateCard**: Display debate information in card format
- **DebateProposition**: Show debate topic and proposition
- **ParticipantsList**: Display debate participants
- **DebateControls**: Control panel for debate management

### UI Components
- **CategoryFilter**: Filter debates by category
- **SearchBar**: Search debates functionality
- **LoadingSpinner**: Loading state indicator
- **Toast**: Notification system

## 🔧 Current Development Focus

The project is actively being developed with focus on:

1. **Authentication System**: Implementing user registration and login
2. **Debate Management**: Creating and managing debate sessions
3. **Real-time Features**: Adding live chat and voice communication
4. **User Interface**: Enhancing UI/UX across all pages
5. **API Integration**: Connecting frontend with backend services

## 🔧 Configuration

The project uses modern configuration files:
- `eslint.config.mjs` - ESLint configuration
- `tailwindcss.config.js` - Tailwind CSS configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## 🌐 API Integration

The app includes service layer structure for:
- **Authentication**: User login/register functionality (in development)
- **Debates**: Create, fetch, and manage debates (in development)
- **Rooms**: Debate room management (planned)
- **API Client**: Centralized HTTP client configuration

## 🛣️ Roadmap

### Phase 1 (Current)
- [ ] Complete authentication system
- [ ] Debate creation and management
- [ ] Basic user interface improvements

### Phase 2 (Next)
- [ ] Real-time chat implementation
- [ ] Voice communication features
- [ ] Advanced debate controls

### Phase 3 (Future)
- [ ] Mobile app development
- [ ] Advanced moderation tools
- [ ] Analytics and reporting

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

This project is currently in development and private.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/FurkanSemizoglu/Debate-Frontend)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

---

🚧 **Development in Progress** - Built with ❤️ using Next.js and TypeScript
