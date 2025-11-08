// Directory: frontend/app/(creator)/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { createRoom } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Plus } from 'lucide-react';
import { toast } from 'sonner'; // <-- IMPORT SONNER

// This is the Host's main dashboard.
// From here, they can start a new session.

export default function CreatorDashboard() {
  const router = useRouter();
  const { setSession, setRole } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);

  // This function simulates creating a room
  const handleCreateRoom = async () => {
    setIsLoading(true);

    try {
      // --- API CALL ---
      // TODO: Get a real experienceId and token
      const mockExperienceId = '60d5f1b2f96e4b3c6c9a8b12';
      const mockToken = 'YOUR_MOCK_JWT_TOKEN'; // TODO: Replace with real auth

      const data = await createRoom(mockExperienceId, mockToken);
      // --- END API CALL ---

      // 1. Save session data to our Zustand store
      setSession(data.sessionId, data.roomCode);
      setRole('host');

      // 2. Show a success toast
      toast.success('Room Created!', { // <-- UPDATED TOAST
        description: `Your new room code is: ${data.roomCode}`,
      });

      // 3. Redirect to the studio
      router.push(`/studio/${data.sessionId}`);

    } catch (error) {
      console.error('Failed to create room:', error);
      toast.error('Error', { // <-- UPDATED TOAST
        description: (error as Error).message || 'Could not create room.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Rocket className="mx-auto h-12 w-12 text-blue-500" />
          <CardTitle className="text-2xl font-bold mt-4">Welcome, Host!</CardTitle>
          <CardDescription>Ready to start a new experience?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Click the button below to generate a new private room. You can share the
            room code with your guests to let them join.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="w-full text-lg py-6"
            size="lg"
          >
            {isLoading ? (
              'Creating room...'
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" /> Create New Session
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}