'use client';

import type { Study, FullStudyDetails } from '@/lib/types';
import { Rocket, Telescope, Files } from 'lucide-react';
import { StudyList } from './study-list';
import { StudyDetails } from './study-details';
import { Skeleton } from '../ui/skeleton';

interface DataViewProps {
  studies: Study[];
  selectedStudyAccession: string | null;
  onSelectStudy: (accession: string) => void;
  studyDetails: FullStudyDetails | null;
  isLoading: boolean;
}

export function DataView({
  studies,
  selectedStudyAccession,
  onSelectStudy,
  studyDetails,
  isLoading,
}: DataViewProps) {

  const renderContent = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    if (selectedStudyAccession && studyDetails) {
      return <StudyDetails details={studyDetails} onBack={() => onSelectStudy(selectedStudyAccession)} />;
    }
    if (studies.length > 0) {
      return (
        <StudyList
          studies={studies}
          onSelectStudy={onSelectStudy}
          selectedAccession={selectedStudyAccession}
        />
      );
    }
    return <Welcome />;
  };

  return <div className="h-full flex flex-col">{renderContent()}</div>;
}

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Telescope className="w-20 h-20 text-accent mb-6" strokeWidth={1} />
      <h2 className="font-headline text-2xl font-bold mb-2">Data Explorer</h2>
      <p className="text-muted-foreground max-w-md">
        Your window into NASA's Open Science Data Repository. Ask a question in the chat, and the relevant studies and data will appear here.
      </p>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="pt-8 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-40 w-full" />
        </div>
        <div className="pt-8 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
        </div>
    </div>
  );
}
