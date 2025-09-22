import { DebateCategory } from "./debate";

export enum RoomStatusEnum {
  WAITING = 'WAITING',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED'
}

export interface DebateRoom {
  id: string;
  status: "WAITING" | "ACTIVE" | "LIVE" | "ENDED" | "FINISHED";
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
}

export interface EnhancedUser {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface EnhancedDebate {
  id: string;
  title: string;
  topic: string;
  category: DebateCategory;
  status: "PENDING" | "ACTIVE" | "ENDED";
  createdAt: string;
  createdBy: EnhancedUser;
}

export interface DebateParticipants {
  proposers: RoomParticipant[];
  opponents: RoomParticipant[];
  audience: RoomParticipant[];
}

export interface ParticipantCounts {
  proposers: number;
  opponents: number;
  audience: number;
  total: number;
}

export interface RoomStatus {
  hasProposer: boolean;
  hasOpponent: boolean;
  canStart: boolean;
  isReady: boolean;
}

export interface EnhancedDebateRoomData {
  room: DebateRoom;
  debate: EnhancedDebate;
  participants: DebateParticipants;
  participantCounts: ParticipantCounts;
  roomStatus: RoomStatus;
}

export interface RoomParticipant {
  id: string;
  userId: string;
  roomId: string;
  role: "PROPOSER" | "OPPONENT" | "AUDIENCE";
  joinedAt: string;
  leftAt: string | null;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

export interface DebateRoomSummary {
  id: string;
  debateId: string;
  status: "WAITING" | "ACTIVE" | "COMPLETED" | "FINISHED" | "ENDED";
  createdAt: string;
  updatedAt: string;
  participants: RoomParticipant[];
  debate: {
    id: string;
    title: string;
    topic: string;
    category: DebateCategory;
  };
  participantCount?: number;
  hasProposer?: boolean;
  hasOpponent?: boolean;
  canStart?: boolean;
  isReady?: boolean;
}

export interface DebateRoomsApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  data: DebateRoomSummary[];
  message: string;
}

export interface DebateRoomsResponse {
  success: boolean;
  data: DebateRoomSummary[];
}