'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FilterPanelProps {
  onFilterChange: (filters: any) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  // Placeholder categories
  const categories = [
    'Genomics', 'Proteomics', 'Metabolomics', 
    'Transcriptomics', 'Microbiology', 'Immunology'
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <SlidersHorizontal className="w-6 h-6 mr-2 text-accent" />
        <h2 className="text-lg font-headline font-semibold">Filters</h2>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['year', 'category']} className="w-full px-4">
          <AccordionItem value="year">
            <AccordionTrigger className="text-md font-semibold font-headline">Year</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="From" className="w-full" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="To" className="w-full" />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="category">
            <AccordionTrigger className="text-md font-semibold font-headline">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={category} />
                    <Label htmlFor={category} className="font-normal text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
