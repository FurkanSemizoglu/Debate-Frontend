# Enhanced Debate Room Features

## What's Been Implemented

### 1. Enhanced Data Structure Support
- Added new TypeScript interfaces for the enhanced debate room endpoint response
- Support for the new participant categorization (proposers, opponents, audience)
- Enhanced user information with name/surname fields
- Room status tracking with start/end times

### 2. New API Functions
- `getEnhancedDebateRoom(id: string)` - Fetches enhanced debate room data
- `joinEnhancedDebate(debateId: string, role: 'PROPOSER' | 'OPPONENT' | 'AUDIENCE')` - Join with enhanced roles
- `leaveEnhancedDebate(debateId: string)` - Leave enhanced debate room

### 3. Enhanced UI Features
- **Improved Header**: Shows both debate status and room status
- **Detailed Participant Counts**: Separate counts for proposers, opponents, audience, and total
- **Room Status Indicators**: Visual indicators for room readiness (has proposer, has opponent, can start)
- **Enhanced Participant Lists**: Organized by role with color-coded sections
- **Better User Display**: Shows full names (name + surname) from the enhanced user data

### 4. Fallback Support
- Automatically tries enhanced endpoint first
- Falls back to regular endpoint if enhanced is not available
- Seamless user experience regardless of backend version

### 5. Role Management
- Support for new role types: PROPOSER, OPPONENT, AUDIENCE
- Backward compatibility with existing SPEAKER_FOR, SPEAKER_AGAINST, SPECTATOR roles
- Smart role mapping between old and new systems

## API Endpoint Expected

The component expects a `GET /debates/room/{id}/enhanced` endpoint that returns:

```json
{
  "success": true,
  "data": {
    "room": {
      "id": "string",
      "status": "WAITING" | "ACTIVE" | "ENDED",
      "startedAt": "string | null",
      "endedAt": "string | null", 
      "createdAt": "string"
    },
    "debate": {
      "id": "string",
      "title": "string",
      "topic": "string",
      "category": "TECHNOLOGY" | "POLITICS" | "etc",
      "status": "PENDING" | "ACTIVE" | "ENDED",
      "createdAt": "string",
      "createdBy": {
        "id": "string",
        "name": "string", 
        "surname": "string",
        "email": "string"
      }
    },
    "participants": {
      "proposers": [/* User objects */],
      "opponents": [/* User objects */], 
      "audience": [/* User objects */]
    },
    "participantCounts": {
      "proposers": 0,
      "opponents": 0,
      "audience": 0,
      "total": 0
    },
    "roomStatus": {
      "hasProposer": false,
      "hasOpponent": false, 
      "canStart": false,
      "isReady": false
    }
  }
}
```

## Join/Leave Endpoints Expected

- `POST /debates/room/{id}/join` with body `{ role: "PROPOSER" | "OPPONENT" | "AUDIENCE" }`
- `POST /debates/room/{id}/leave`

## Usage

The debate page will automatically detect and use the enhanced features if the endpoint is available. No changes needed to existing functionality - it maintains full backward compatibility.
