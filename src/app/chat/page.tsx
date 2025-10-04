'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { askQuestion, getStudyDetails as getStudyDetailsAction } from '@/lib/actions';
import type { ChatMessage, Study, FullStudyDetails } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { DataView } from '@/components/data-display/data-view';
import { ChatPanel } from '@/components/chat/chat-panel';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const initialMessages: ChatMessage[] = [
  {
    id: 'init',
    role: 'assistant',
    content: 'Welcome to AstroBioChat! How can I help you explore the NASA Open Science Data Repository today? You can ask me things like "What are the effects of spaceflight on the mouse liver?"',
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudyAccession, setSelectedStudyAccession] = useState<string | null>(null);
  const [studyDetails, setStudyDetails] = useState<FullStudyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const { toast } = useToast();

  const searchParams = useSearchParams();
  const studyIdFromQuery = searchParams.get('study');

  useEffect(() => {
    if (studyIdFromQuery) {
      getStudyDetails(studyIdFromQuery);
    }
  }, [studyIdFromQuery]);

  const handleSendMessage = async (question: string) => {
    setIsLoading(true);
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: 'user', content: question },
    ];
    setMessages(newMessages);

    try {
      const result = await askQuestion(question);
      if (result.success && result.data) {
        setMessages([
          ...newMessages,
          { id: crypto.randomUUID(), role: 'assistant', content: result.data.insight },
        ]);
        setStudies(result.data.studies);
        setSelectedStudyAccession(null);
        setStudyDetails(null);
      } else {
        throw new Error(result.error || 'Failed to get an answer.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setMessages([
        ...newMessages,
        { id: crypto.randomUUID(), role: 'assistant', content: `Sorry, I encountered an error: ${errorMessage}` },
      ]);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStudyDetails = async (accession: string) => {
    if (selectedStudyAccession === accession && studyDetails) {
      setSelectedStudyAccession(null);
      setStudyDetails(null);
      return;
    };
    setIsDetailsLoading(true);
    setSelectedStudyAccession(accession);
    setStudyDetails(null); 
    try {
      const result = await getStudyDetailsAction(accession);
      if (result.success && result.data) {
        setStudyDetails(result.data);
         // If studies array is empty, populate it with the current study
         if (studies.length === 0) {
          const minimalStudy: Study = {
            'Accession': result.data.metadata.identifier,
            'Study Title': result.data.metadata.studies[0]?.title || 'N/A',
            'Study Description': result.data.metadata.studies[0]?.description || 'N/A',
            'Last Modified': result.data.metadata.studies[0]?.publicReleaseDate || new Date().toISOString(),
          };
          setStudies([minimalStudy]);
        }
      } else {
        throw new Error(result.error || 'Failed to fetch study details.');
      }
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: "destructive",
        title: "Error Fetching Details",
        description: errorMessage,
      });
      setSelectedStudyAccession(null);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header>
        <div className="flex items-center gap-4 ml-auto">
            <Button asChild>
                <Link href="/chat">Chat</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/search">Search</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/about">About</Link>
            </Button>
             <Button asChild variant="ghost">
                <Link href="/">Home</Link>
            </Button>
        </div>
      </Header>
      <main className="flex-1 grid md:grid-cols-2 gap-6 p-4 lg:p-6 overflow-hidden">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden h-full">
          <DataView
            studies={studies}
            selectedStudyAccession={selectedStudyAccession}
            onSelectStudy={getStudyDetails}
            studyDetails={studyDetails}
            isLoading={isDetailsLoading}
          />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden h-full">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ChatPage />
    </React.Suspense>
  )
}