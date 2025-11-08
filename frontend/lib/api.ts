// Directory: frontend/lib/api.ts

// This file is the "messenger."
// It contains functions that talk to your teammate's backend API.
// Your UI components (like the dashboard) will call these functions.



// Get the Backend API URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

/**
 * A helper function to handle API responses.
 * @param response - The fetch response object
 * @returns The JSON data if the response is ok
 * @throws An error if the response is not ok
 */
async function handleResponse(response: Response) {
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  // If the server returns a JSON with a "message" field, use it in the error.
  throw new Error(data.message || 'API request failed');
}

/**
 * (Host) Creates a new private room.
 * Corresponds to: POST /api/room/create
 *
 * @param experienceId - The ID of the experience to launch
 * @param token - The host's authentication JWT
 * @returns The new session data (including roomCode)
 */
export async function createRoom(experienceId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/room/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Auth for the host
    },
    body: JSON.stringify({ experienceId }),
  });
  return handleResponse(response);
}

/**
 * (Guest) Joins an existing private room.
 * Corresponds to: POST /api/room/join
 *
 * @param roomCode - The 6-digit room code
 * @returns The session data (sessionId, experienceTitle, etc.)
 */
export async function joinRoom(roomCode: string) {
  const response = await fetch(`${API_BASE_URL}/room/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomCode }),
  });
  return handleResponse(response);
}

// TODO: Add other API functions as needed (e.g., login, signup)