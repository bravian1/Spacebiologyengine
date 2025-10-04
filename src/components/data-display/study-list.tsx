'use client';

import type { Study } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FileText, List } from 'lucide-react';

interface StudyListProps {
  studies: Study[];
  onSelectStudy: (accession: string) => void;
  selectedAccession: string | null;
}

export function StudyList({ studies, onSelectStudy, selectedAccession }: StudyListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
         <List className="w-6 h-6 mr-2 text-accent" />
         <h2 className="text-lg font-headline font-semibold">Relevant Studies ({studies.length})</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {studies.map((study) => (
            <button
              key={study.Accession}
              onClick={() => onSelectStudy(study.Accession)}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition-colors hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring',
                selectedAccession === study.Accession
                  ? 'bg-secondary ring-2 ring-ring'
                  : 'bg-card'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm mb-1 text-foreground">
                        {study['Study Title']} ({study.Accession})
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {study['Study Description']}
                    </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
