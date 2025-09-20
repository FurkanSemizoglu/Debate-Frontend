// src/types/debate.ts

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

export interface DebatesResponse {
  data: Debate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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