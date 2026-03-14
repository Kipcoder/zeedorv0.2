'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MessagesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch all messages where user is sender or receiver
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'messages'),
      where('senderId', 'in', [user.uid, 'placeholder']), // Using 'in' to handle multiple participants
    );
  }, [firestore, user]);

  // For this prototype, we'll fetch all and filter client-side to simplify security rules
  const allMessagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'messages'));
  }, [firestore, user]);

  const { data: messages, isLoading } = useCollection(allMessagesQuery);

  const myMessages = (messages || []).filter(m => m.senderId === user?.uid || m.receiverId === user?.uid);
  
  // Group messages into conversations
  const conversationsMap = new Map();
  myMessages.forEach(m => {
    const otherId = m.senderId === user?.uid ? m.receiverId : m.senderId;
    if (!conversationsMap.has(otherId)) conversationsMap.set(otherId, []);
    conversationsMap.get(otherId).push(m);
  });

  const sortedConversations = Array.from(conversationsMap.entries()).sort((a, b) => {
    const latestA = Math.max(...a[1].map((m: any) => m.sentAt?.seconds || 0));
    const latestB = Math.max(...b[1].map((m: any) => m.sentAt?.seconds || 0));
    return latestB - latestA;
  });

  const handleSendReply = () => {
    if (!user || !firestore || !selectedConversation || !replyText.trim()) return;

    const newMessage = {
      senderId: user.uid,
      receiverId: selectedConversation,
      content: replyText,
      sentAt: serverTimestamp(),
      isRead: false,
    };

    addDocumentNonBlocking(collection(firestore, 'messages'), newMessage)
      .then(() => {
        setReplyText('');
        toast({ title: "Message sent" });
      });
  };

  if (isUserLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-10">
      <Navbar />
      <div className="container px-4 mx-auto max-w-6xl h-[calc(100vh-140px)]">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden h-full flex">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-headline font-bold">Messages</h2>
            </div>
            <ScrollArea className="flex-1">
              {sortedConversations.length > 0 ? (
                sortedConversations.map(([otherId, msgs]: [string, any]) => (
                  <button
                    key={otherId}
                    onClick={() => setSelectedConversation(otherId)}
                    className={`w-full p-6 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 flex items-center gap-4 ${selectedConversation === otherId ? 'bg-blue-50/50 border-l-4 border-l-primary' : ''}`}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">{otherId.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-gray-900">User {otherId.slice(0, 5)}</p>
                      <p className="text-sm text-muted-foreground truncate">{msgs[msgs.length - 1].content}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-10 text-center">
                  <MessageSquare className="mx-auto text-gray-300 mb-4" size={40} />
                  <p className="text-gray-500 font-medium">No messages yet</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col bg-white">
            {selectedConversation ? (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold">Conversation with User {selectedConversation.slice(0, 5)}</h3>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {conversationsMap.get(selectedConversation)?.sort((a:any, b:any) => (a.sentAt?.seconds || 0) - (b.sentAt?.seconds || 0)).map((m: any) => (
                      <div key={m.id} className={`flex ${m.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl ${m.senderId === user?.uid ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                          <p className="text-sm">{m.content}</p>
                          <p className={`text-[10px] mt-1 opacity-60 ${m.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
                            {m.sentAt ? new Date(m.sentAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-6 border-t border-gray-100 flex gap-4">
                  <Input 
                    placeholder="Type a message..." 
                    className="rounded-xl h-12"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <Button onClick={handleSendReply} className="rounded-xl h-12 px-6"><Send size={18} /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div className="bg-gray-50 p-10 rounded-full mb-6 text-gray-300"><MessageSquare size={80} /></div>
                <h3 className="text-2xl font-headline font-bold mb-2">Your Conversations</h3>
                <p className="text-muted-foreground max-w-xs">Select a conversation from the list to view messages and respond.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
