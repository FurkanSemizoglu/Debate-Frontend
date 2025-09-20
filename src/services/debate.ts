// src/services/debate.ts
import apiClient from "./apiClient";
import { 
  User, 
  DebateCategory, 
  CreateDebateData, 
  Debate, 
  DebatesResponse, 
  GetDebatesParams,
  ParticipantRole,
  DebateParticipant,
  JoinDebateData,
  DebateRoomData
} from "@/types/debate";

// API functions
export async function getAllDebates(params: GetDebatesParams = {}): Promise<DebatesResponse> {
  try {
    const { page = 1, limit = 10, status } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      queryParams.append('status', status);
    }
    
    const response = await apiClient.get(`/debates/getAllDebates?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching debates:', error);
    throw error;
  }
}

export async function getDebateById(id: string): Promise<Debate> {
  try {
    const response = await apiClient.get(`debates/getDebate/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching debate:', error);
    throw error;
  }
}

export async function createDebate(debateData: CreateDebateData): Promise<Debate> {
  try {
    const response = await apiClient.post('/debates/createDebate', debateData);
    return response.data;
  } catch (error) {
    console.error('Error creating debate:', error);
    throw error;
  }
}

// API functions for debate room
export async function getDebateRoom(id: string): Promise<any> {
  try {
    const response = await apiClient.get(`/debates/room/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching debate room:', error);
    throw error;
  }
}

export async function joinDebate(joinData: JoinDebateData): Promise<DebateParticipant> {
  try {
    const response = await apiClient.post('/debates/join', joinData);
    return response.data;
  } catch (error) {
    console.error('Error joining debate:', error);
    throw error;
  }
}

export async function leaveDebate(debateId: string): Promise<void> {
  try {
    await apiClient.post(`/debates/leave/${debateId}`);
  } catch (error) {
    console.error('Error leaving debate:', error);
    throw error;
  }
}







// Transform backend debate data to match frontend expectations
export function transformDebateForDisplay(debate: Debate) {
  return {
    id: debate.id, // Keep UUID as string for proper backend communication
    title: debate.title,
    description: debate.topic,
    participantCount: debate._count.users,
    tags: [], // Backend doesn't return tags yet, can be added later
    isPopular: debate._count.users > 20, // Simple popularity logic
    status: debate.status,
    createdAt: debate.createdAt,
    createdBy: debate.createdBy,
    users: debate.users,
    category: debate.category,
  };
}

// Export types for external use
export type { 
  Debate, 
  CreateDebateData, 
  DebatesResponse, 
  GetDebatesParams,
  ParticipantRole,
  DebateParticipant,
  JoinDebateData,
  DebateRoomData,
  User
} from "@/types/debate";

// Export enum as value (not type)
export { DebateCategory } from "@/types/debate";