// Directory: frontend/app/join/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { joinRoom } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner'; // <-- IMPORT SONNER
import { useForm, SubmitHandler } from 'react-hook-form';

// This is the Guest's entry point.
// They enter a 6-digit code to join a session.

type Inputs = {
  roomCode: string;
};

export default function JoinPage() {
  const router = useRouter();
  const { setSession, setRole } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const { roomCode } = data;

    try {
      // --- API CALL ---
      const response = await joinRoom(roomCode.toUpperCase());
      // --- END API CALL ---

      // 1. Save session data to our Zustand store
      // We get the sessionId from the backend response
      setSession(response.sessionId, roomCode.toUpperCase());
      setRole('guest');

      // 2. Show a success toast
      toast.success('Joined!', { // <-- UPDATED TOAST
        description: `Welcome to ${response.experienceTitle || 'the session'}.`,
      });

      // 3. Redirect to the studio
      router.push(`/studio/${response.sessionId}`);

    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error('Error', { // <-- UPDATED TOAST
        description: (error as Error).message || 'Could not join room.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-blue-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join a Session</CardTitle>
          <CardDescription>Enter the 6-digit room code to join.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                {...register('roomCode', {
                  required: 'Room code is required',
                  minLength: { value: 6, message: 'Code must be 6 characters' },
                  maxLength: { value: 6, message: 'Code must be 6 characters' },
                  pattern: { value: /^[a-zA-Z0-9]+$/, message: 'Invalid characters' }
                })}
                placeholder="A1B2C3"
                className="text-center text-2xl font-mono tracking-widest h-14"
                maxLength={6}
                autoCapitalize="characters"
              />
              {errors.roomCode && (
                <p className="text-red-500 text-sm px-1">{errors.roomCode.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isLoading ? (
                'Joining...'
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Join Session
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}