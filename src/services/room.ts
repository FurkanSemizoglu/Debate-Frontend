// src/services/room.ts
import apiClient from "./apiClient";
import { 

  RoomStatusEnum,
  EnhancedDebateRoomData,
  RoomParticipant,
  DebateRoomSummary,
  DebateRoomsResponse,
  DebateRoomsApiResponse
} from "@/types/room";

// Re-export the enum for convenience
export { RoomStatusEnum } from "@/types/room";


export function computeRoomProperties(room: DebateRoomSummary): DebateRoomSummary {
  const proposerCount = room.participants.filter(p => p.role === "PROPOSER" && !p.leftAt).length;
  const opponentCount = room.participants.filter(p => p.role === "OPPONENT" && !p.leftAt).length;
  
  return {
    ...room,
    participantCount: room.participants.filter(p => !p.leftAt).length,
    hasProposer: proposerCount > 0,
    hasOpponent: opponentCount > 0,
    canStart: proposerCount > 0 && opponentCount > 0,
    isReady: proposerCount > 0 && opponentCount > 0
  };
}

  
export async function getDebateRooms(debateId: string): Promise<DebateRoomsResponse> {
  try {
    const response = await apiClient.get<DebateRoomsApiResponse>(`/debateRooms/debate/${debateId}`);
    
    const rooms = response.data.data || [];
    const transformedRooms = rooms.map((room: DebateRoomSummary) => computeRoomProperties(room));

    return {
      success: response.data.success || true,
      data: transformedRooms
    };
  } catch (error) {
    console.error('Error fetching debate rooms:', error);
    throw error;
  }
}

export async function createDebateRoom(debateId: string): Promise<DebateRoomSummary> {
  try {
    const response = await apiClient.post(`/debateRooms/create`, { debateId });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating debate room:', error);
    throw error;
  }
}

export async function getIndividualDebateRoom(roomId: string): Promise<EnhancedDebateRoomData> {
  try {
    const response = await apiClient.get(`/debateRooms/${roomId}`);
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching individual debate room:', error);
    throw error;
  }
}

export async function joinDebateRoom(roomId: string, role: 'PROPOSER' | 'OPPONENT' | 'AUDIENCE'): Promise<RoomParticipant> {
  try {
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

export async function startDebateRoom(roomId: string): Promise<void> {
  return updateRoomStatus(roomId, RoomStatusEnum.LIVE);
}

export async function finishDebateRoom(roomId: string): Promise<void> {
  return updateRoomStatus(roomId, RoomStatusEnum.FINISHED);
}