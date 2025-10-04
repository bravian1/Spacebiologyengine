'use client';

import * as React from 'react';
import { Paperclip, SendHorizonal, Bot } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageBubble } from './chat-message';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

type FormValues = {
  message: string;
};

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.message.trim()) {
      onSendMessage(data.message.trim());
      reset();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
         <Bot className="w-6 h-6 mr-2 text-accent" />
         <h2 className="text-lg font-headline font-semibold">Knowledge Engine</h2>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{
                  opacity: { duration: 0.2 },
                  layout: {
                    type: 'spring',
                    bounce: 0.4,
                    duration: 0.5,
                  },
                }}
              >
                <ChatMessageBubble message={message} />
              </motion.div>
            ))}
            {isLoading && messages[messages.length-1]?.role === 'user' && (
                <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
              >
                <ChatMessageBubble message={{id: 'thinking', role: 'assistant', content: 'Thinking...', isLoading: true}} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <Textarea
            {...register('message')}
            placeholder="Ask about NASA's open science data..."
            className="w-full resize-none pr-20"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            disabled={isLoading}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
            <Button type="submit" size="icon" disabled={isLoading}>
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
