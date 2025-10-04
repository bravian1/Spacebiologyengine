'use client';

import type { FullStudyDetails } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FilePieChart, Users, Quote, UserRound } from 'lucide-react';
import { FileCategoryChart } from './file-category-chart';
import { PersonnelChart } from './personnel-chart';

interface StudyDetailsProps {
  details: FullStudyDetails;
  onBack: () => void;
}

export function StudyDetails({ details, onBack }: StudyDetailsProps) {
  const { metadata, files, summary } = details;
  const studyInfo = metadata.studies?.[0];
  const personnel = studyInfo?.people || [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className='truncate'>
            <h2 className="text-lg font-headline font-semibold truncate" title={studyInfo?.title}>
              {studyInfo?.title || 'Study Details'}
            </h2>
            <p className="text-sm text-muted-foreground">{metadata.identifier}</p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div>
            <h3 className="flex items-center text-md font-semibold mb-3 font-headline">
                <Quote className="w-5 h-5 mr-2 text-accent"/>
                AI Summary
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-secondary/30 p-4 rounded-lg border">
                <p>{summary}</p>
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-md font-semibold mb-3 font-headline">
                <FilePieChart className="w-5 h-5 mr-2 text-accent"/>
                Data Files Overview
            </h3>
            {files.length > 0 ? (
                <div className='h-64'>
                    <FileCategoryChart files={files} />
                </div>
            ) : (
                <p className='text-sm text-muted-foreground'>No file data available for this study.</p>
            )}
          </div>

          {personnel.length > 0 && (
            <div>
              <h3 className="flex items-center text-md font-semibold mb-3 font-headline">
                  <UserRound className="w-5 h-5 mr-2 text-accent"/>
                  Personnel Roles
              </h3>
              <div className='h-72'>
                  <PersonnelChart personnel={personnel} />
              </div>
            </div>
          )}
          
          {studyInfo?.publications?.length > 0 && (
            <div>
              <h3 className="flex items-center text-md font-semibold mb-3 font-headline">
                <BookOpen className="w-5 h-5 mr-2 text-accent"/>
                Publications
              </h3>
              <div className="space-y-4">
                {studyInfo.publications.map((pub: any, index: number) => (
                  <div key={index} className="p-3 bg-secondary/30 rounded-md border">
                    <p className="font-semibold text-sm">{pub.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pub.authorList}</p>
                    {pub.doi && <Badge variant="outline" className="mt-2 text-xs">DOI: {pub.doi}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {studyInfo?.people?.length > 0 && (
            <div>
                <h3 className="flex items-center text-md font-semibold mb-3 font-headline">
                    <Users className="w-5 h-5 mr-2 text-accent"/>
                    Personnel
                </h3>
                <div className="flex flex-wrap gap-2">
                    {studyInfo.people.map((person: any, index: number) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                            {person.firstName} {person.lastName} ({person.roles.join(', ')})
                        </Badge>
                    ))}
                </div>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
}
