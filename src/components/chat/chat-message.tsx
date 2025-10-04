'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoIcon } from '../icons/logo-icon';

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-4', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-accent/50">
          <AvatarFallback className="bg-accent/20">
            <LogoIcon className="h-5 w-5 text-accent" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3 text-sm shadow-md',
          isUser
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none bg-secondary text-secondary-foreground'
        )}
      >
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.4s]" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
