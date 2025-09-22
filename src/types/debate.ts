
export interface User {
  id: string;
  name: string;
  email: string;
  surname?: string;
}

export enum DebateCategory {
  POLITICS = "POLITICS",
  TECHNOLOGY = "TECHNOLOGY",
  EDUCATION = "EDUCATION",
  SPORTS = "SPORTS",
  PHILOSOPHY = "PHILOSOPHY",
  SOCIETY = "SOCIETY",
  ENVIRONMENT = "ENVIRONMENT"
}

export enum ParticipantRole {
  SPECTATOR = "SPECTATOR",
  SPEAKER_FOR = "SPEAKER_FOR", 
  SPEAKER_AGAINST = "SPEAKER_AGAINST"
}

export interface CreateDebateData {
  title: string;
  topic: string;
  category?: DebateCategory;
}

export interface Debate {
  id: string;
  title: string;
  description: string;
  topic: string;
  category?: DebateCategory;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  users: User[];
  _count: {
    users: number;
  };
}

export interface DebatesApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  data: {
    data: Debate[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface DebatesResponse {
  data: Debate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateDebateResponse {
  data: Debate;
  message: string;
  success: boolean;
}

export interface GetDebatesParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface DebateParticipant {
  id: string;
  user: User;
  role: ParticipantRole;
  joinedAt: string;
  isOnline: boolean;
}

export interface JoinDebateData {
  debateId: string;
  role: ParticipantRole;
}

export interface DebateRoomData {
  debate: Debate;
  participants: DebateParticipant[];
  speakerFor?: DebateParticipant;
  speakerAgainst?: DebateParticipant;
  spectators: DebateParticipant[];
  canJoinAsSpeaker: {
    canJoinFor: boolean;
    canJoinAgainst: boolean;
  };
}

// Interface for transformed debate display data
export interface DebateDisplayData {
  id: string;
  title: string;
  description: string;
  participantCount: number;
  tags: never[];
  isPopular: boolean;
  status: string;
  createdAt: string;
  createdBy: User;
  users: User[];
  category?: DebateCategory;
}

// Interface for voice chat participants
export interface VoiceChatParticipant {
  id: string;
  user: User;
  role: ParticipantRole;
  isOnline: boolean;
  isSpeaking?: boolean;
  joinedAt: string;
}

// Interface for voice chat props
export interface VoiceChatProps {
  proposers: VoiceChatParticipant[];
  opponents: VoiceChatParticipant[];
  currentUser: User;
}