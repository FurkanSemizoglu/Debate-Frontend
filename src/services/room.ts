// src/services/room.ts
import apiClient from "./apiClient";
import { 
  DebateRoom,
  EnhancedUser,
  EnhancedDebate,
  DebateParticipants,
  ParticipantCounts,
  RoomStatus,
  RoomStatusEnum,
  EnhancedDebateRoomData,
  RoomParticipant,
  DebateRoomSummary,
  DebateRoomsResponse
} from "@/types/room";

// Re-export the enum for convenience
export { RoomStatusEnum } from "@/types/room";

// Helper function to compute room properties from participants
export function computeRoomProperties(room: DebateRoomSummary): DebateRoomSummary {
  const supporterCount = room.participants.filter(p => p.role === "SUPPORTER" && !p.leftAt).length;
  const opponentCount = room.participants.filter(p => p.role === "OPPONENT" && !p.leftAt).length;
  
  return {
    ...room,
    participantCount: room.participants.filter(p => !p.leftAt).length,
    hasProposer: supporterCount > 0,
    hasOpponent: opponentCount > 0,
    canStart: supporterCount > 0 && opponentCount > 0,
    isReady: supporterCount > 0 && opponentCount > 0
  };
}

// Room API functions
export async function getDebateRoom(id: string): Promise<any> {
  try {
    const response = await apiClient.get(`/debates/room/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching debate room:', error);
    throw error;
  }
}

export async function getEnhancedDebateRoom(id: string): Promise<EnhancedDebateRoomData> {
  try {
    const response = await apiClient.get(`/debates/room/${id}/enhanced`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching enhanced debate room:', error);
    throw error;
  }
}

export async function joinEnhancedDebate(debateId: string, role: 'PROPOSER' | 'OPPONENT' | 'AUDIENCE'): Promise<any> {
  try {
    const response = await apiClient.post(`/debates/room/${debateId}/join`, { role });
    return response.data;
  } catch (error) {
    console.error('Error joining enhanced debate:', error);
    throw error;
  }
}

export async function leaveEnhancedDebate(debateId: string): Promise<void> {
  try {
    await apiClient.post(`/debates/room/${debateId}/leave`);
  } catch (error) {
    console.error('Error leaving enhanced debate:', error);
    throw error;
  }
}

export async function getDebateRooms(debateId: string): Promise<DebateRoomsResponse> {
  try {
    const response = await apiClient.get(`/debateRooms/debate/${debateId}`);
    
    // Transform the response to add computed properties
    const transformedData = {
      ...response.data,
      data: response.data.data.map((room: DebateRoomSummary) => computeRoomProperties(room))
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching debate rooms:', error);
    throw error;
  }
}

export async function createDebateRoom(debateId: string): Promise<DebateRoomSummary> {
  try {
    const response = await apiClient.post(`/debateRooms/create`, { debateId });
    return response.data;
  } catch (error) {
    console.error('Error creating debate room:', error);
    throw error;
  }
}

export async function getIndividualDebateRoom(roomId: string): Promise<EnhancedDebateRoomData> {
  try {
    const response = await apiClient.get(`/debateRooms/${roomId}`);
    
    // Return the enhanced room data directly - no transformation needed
    return response.data.data;
  } catch (error) {
    console.error('Error fetching individual debate room:', error);
    throw error;
  }
}

export async function joinDebateRoom(roomId: string, role: 'PROPOSER' | 'OPPONENT' | 'AUDIENCE'): Promise<RoomParticipant> {
  try {
    debugger;
    const response = await apiClient.post(`/debateRooms/join`, { roomId, role });
    return response.data.data;
  } catch (error) {
    console.error('Error joining debate room:', error);
    throw error;
  }
}

export async function leaveDebateRoom(roomId: string): Promise<void> {
  try {
    await apiClient.post(`/debateRooms/${roomId}/leave`);
  } catch (error) {
    console.error('Error leaving debate room:', error);
    throw error;
  }
}

export async function updateRoomStatus(roomId: string, status: RoomStatusEnum): Promise<void> {
  try {
    await apiClient.patch(`/debateRooms/${roomId}/status`, { status });
  } catch (error) {
    console.error('Error updating room status:', error);
    throw error;
  }
}

// Convenience function to start a debate room
export async function startDebateRoom(roomId: string): Promise<void> {
  return updateRoomStatus(roomId, RoomStatusEnum.LIVE);
}

// Convenience function to finish a debate room
export async function finishDebateRoom(roomId: string): Promise<void> {
  return updateRoomStatus(roomId, RoomStatusEnum.FINISHED);
}