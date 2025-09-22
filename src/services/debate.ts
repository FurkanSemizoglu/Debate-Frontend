import apiClient from "./apiClient";
import { 
  CreateDebateData, 
  Debate, 
  DebatesResponse,
  DebatesApiResponse,
  GetDebatesParams,
  CreateDebateResponse
} from "@/types/debate";
import { EnhancedDebateRoomData } from "@/types/room";



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
    
    const response = await apiClient.get<DebatesApiResponse>(`/debates/getAllDebates?${queryParams.toString()}`);
    
    return {
      data: response.data.data.data || [],
      meta: response.data.data.meta || { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
  } catch (error) {
    console.error('Error fetching debates:', error);
    throw error;
  }
}

export async function getDebateById(id: string): Promise<Debate> {
  try {
    const response = await apiClient.get(`debates/getDebate/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching debate:', error);
    throw error;
  }
}

export async function createDebate(debateData: CreateDebateData): Promise<CreateDebateResponse> {
  try {
    const response = await apiClient.post('/debates/createDebate', debateData);
    return {
      success: response.data.success || true,
      data: response.data.data || response.data,
      message: response.data.message || 'Debate created successfully'
    };
  } catch (error) {
    console.error('Error creating debate:', error);
    throw error;
  }
}

export async function getDebateRoom(id: string): Promise<EnhancedDebateRoomData> {
  try {
    const response = await apiClient.get(`/debates/room/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching debate room:', error);
    throw error;
  }
}

export function transformDebateForDisplay(debate: Debate) {
  return {
    id: debate.id, 
    title: debate.title,
    description: debate.topic,
    participantCount: debate._count.users,
    tags: [], 
    isPopular: debate._count.users > 20, 
    status: debate.status,
    createdAt: debate.createdAt,
    createdBy: debate.createdBy,
    users: debate.users,
    category: debate.category,
  };
}
export type { 
  Debate, 
  CreateDebateData, 
  DebatesResponse, 
  GetDebatesParams,
  DebateParticipant
} from "@/types/debate";

export { DebateCategory, ParticipantRole } from "@/types/debate";