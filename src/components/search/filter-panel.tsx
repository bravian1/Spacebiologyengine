'use client';

import * as React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface FilterState {
  categories: string[];
  yearFrom?: number;
  yearTo?: number;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  // Available categories for filtering - using terms commonly found in NASA OSDR
  const categories = [
    'Arabidopsis', 'Mouse', 'Rat', 'Cell Culture', 'Tissue', 'RNA',
    'Microgravity', 'Radiation', 'Spaceflight', 'ISS', 'Bone', 'Muscle'
  ];

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [yearFrom, setYearFrom] = React.useState<string>('');
  const [yearTo, setYearTo] = React.useState<string>('');

  // Notify parent component when filters change
  React.useEffect(() => {
    const filters: FilterState = {
      categories: selectedCategories,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
    };
    console.log('FilterPanel: Sending filters to parent:', filters);
    onFilterChange(filters);
  }, [selectedCategories, yearFrom, yearTo]); // Removed onFilterChange from dependencies

  const handleCategoryChange = (category: string, checked: boolean) => {
    console.log('FilterPanel: Category change:', category, checked);
    setSelectedCategories(prev => {
      const newCategories = checked
        ? [...prev, category]
        : prev.filter(c => c !== category);
      console.log('FilterPanel: New selected categories:', newCategories);
      return newCategories;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setYearFrom('');
    setYearTo('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || yearFrom || yearTo;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 mr-2 text-accent" />
          <h2 className="text-lg font-headline font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {selectedCategories.length + (yearFrom || yearTo ? 1 : 0)}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['year', 'category']} className="w-full px-4">
          <AccordionItem value="year">
            <AccordionTrigger className="text-md font-semibold font-headline">Year</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="From"
                  className="w-full"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="To"
                  className="w-full"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="category">
            <AccordionTrigger className="text-md font-semibold font-headline">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
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
