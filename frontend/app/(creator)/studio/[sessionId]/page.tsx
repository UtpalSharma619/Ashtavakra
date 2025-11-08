// Directory: frontend/app/(creator)/studio/[sessionId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import {
  Copy,
  LogOut,
  Users,
  Send,
  User,
  Crown,
  Settings,
  Sun,
  Moon,
  WholeWord,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner'; // <-- IMPORT SONNER

// This is the MAIN file: The Live Session Studio
// It handles:
// 1. Socket connection
// 2. Simple chat
// 3. Conditional UI for HOST vs. GUEST
// 4. Accessibility toggles

interface ChatMessage {
  id: string;
  sender: string; // 'Host', 'Guest', or 'System'
  text: string;
}

export default function StudioPage() {
  const router = useRouter();
  const params = useParams();

  // Get state from Zustand
  const {
    sessionId,
    roomCode,
    role,
    socket,
    isConnected,
    connectSocket,
    clearSession,
  } = useSessionStore();

  // Local component state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // --- Accessibility State ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16); // 16px default

  // On page load, check for session and connect socket
  useEffect(() => {
    const currentSessionId = params.sessionId as string;

    // If state is missing (e.g., page refresh), redirect
    if (!role || !currentSessionId) {
      toast.error('Session Expired', { // <-- UPDATED TOAST
        description: 'Please create or join a new session.',
      });
      router.push(role === 'host' ? '/dashboard' : '/join');
      return;
    }

    // Connect to socket
    if (!socket && currentSessionId) {
      connectSocket(currentSessionId);
    }

    // Socket event listeners
    if (socket) {
      // Listen for incoming messages
      socket.on('chat:receive', (message: ChatMessage) => {
        setChatMessages((prev) => [...prev, message]);
      });

      // Listen for system notifications
      socket.on('system:notification', (message: { text: string }) => {
        setChatMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), sender: 'System', text: message.text },
        ]);
        toast.info(message.text); // <-- Show system messages as a toast too
      });
    }

    // Cleanup on unmount
    return () => {
      socket?.off('chat:receive');
      socket?.off('system:notification');
    };
  }, [socket, role, params, router, connectSocket, clearSession, isConnected]);


  // --- CHAT ---
  const handleSendChat = () => {
    if (chatInput.trim() && socket) {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        sender: role === 'host' ? 'Host' : 'Guest',
        text: chatInput.trim(),
      };
      
      // Send message to server
      socket.emit('chat:send', message);
      
      // Add to local chat
      setChatMessages((prev) => [...prev, message]);
      setChatInput('');
    }
  };

  // --- OTHER ACTIONS ---
  const handleCopyRoomCode = () => {
    if (roomCode) {
      // Use this method for broadest compatibility
      const el = document.createElement('textarea');
      el.value = roomCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      
      toast.success('Copied!', { description: 'Room code copied to clipboard.' }); // <-- UPDATED TOAST
    }
  };

  const handleLeaveSession = () => {
    clearSession(); // This disconnects socket and clears state
    router.push(role === 'host' ? '/dashboard' : '/');
  };

  // --- ACCESSIBILITY ---
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const increaseFontSize = () => setFontSize((s) => Math.min(s + 2, 24));
  const decreaseFontSize = () => setFontSize((s) => Math.max(s - 2, 12));

  // --- RENDER ---
  const isHost = role === 'host';

  // Fallback for page refresh before state is ready
  if (!role) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div 
      className={`flex h-screen w-full ${isDarkMode ? 'dark' : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
        
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-xl font-bold">Ashtavakra Session</h1>
          <div className="flex items-center gap-2">
            {isHost && roomCode && (
              <Button onClick={handleCopyRoomCode} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" /> Room Code: {roomCode}
              </Button>
            )}
            <Badge variant={isConnected ? 'default' : 'destructive'} className={isConnected ? 'bg-green-600' : ''}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Button onClick={handleLeaveSession} variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Leave
            </Button>
          </div>
        </header>

        {/* Core Layout (Video + Chat) */}
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
          
          {/* Main Experience Area (Video/Presentation) */}
          <div className="flex-1 flex flex-col gap-4">
            <Card className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              <CardContent className="p-6">
                <p className="text-2xl text-gray-500">Video Stream Area</p>
                {/* Your video component (e.g., Daily.co) would go here */}
              </CardContent>
            </Card>
            
            {/* Host Controls */}
            {isHost && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Host Controls</h3>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="outline">Mute All</Button>
                  <Button variant="secondary">Start Poll</Button>
                  <Button variant="destructive">End Session for All</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar (Participants + Chat) */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
            
            {/* Participants */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" /> Participants (2)
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar-host.png" />
                      <AvatarFallback>H</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Host</span>
                  </div>
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar-guest.png" />
                      <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Guest</span>
                  </div>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <h3 className="font-semibold">Live Chat</h3>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 p-4 space-y-3 overflow-y-auto">
                {/* Messages */}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'Host' ? 'items-start' : msg.sender === 'Guest' ? 'items-end' : 'items-center'}`}>
                    {msg.sender === 'System' ? (
                      <Badge variant="secondary" className="text-xs">{msg.text}</Badge>
                    ) : (
                      <div className={`p-3 rounded-lg max-w-[80%] ${
                        msg.sender === role ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <span className="font-bold text-sm block">{msg.sender}</span>
                        <p>{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-4 border-t dark:border-gray-700">
                <form
                  // --- FIX 1: Added type for 'e' ---
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSendChat(); }}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button type="submit" size="icon" disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Accessibility Sidebar */}
      <aside className="p-4 bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 flex flex-col gap-4">
        <h3 className="font-bold text-center flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Tools
        </h3>
        <Separator />
        <Button onClick={toggleDarkMode} variant="outline" size="sm">
          {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {isDarkMode ? 'Light' : 'Dark'} Mode
        </Button>
        <div className="space-y-2">
          <p className="text-sm font-medium text-center">Font Size</p>
          <div className="flex gap-2">
            <Button onClick={decreaseFontSize} variant="outline" size="icon" className="h-8 w-8">
              <WholeWord className="h-4 w-4" />-
            </Button> 
            {/* --- FIX 2: Corrected </Vbutton> to </Button> --- */}
            <Button onClick={increaseFontSize} variant="outline" size="icon" className="h-8 w-8">
              <WholeWord className="h-4 w-4" />+
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}