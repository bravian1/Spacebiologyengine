'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
}

type FormValues = {
  searchTerm: string;
};

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { searchTerm: '' }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSearch(data.searchTerm.trim());
  };
  
  const searchInput = watch('searchTerm');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        {...register('searchTerm')}
        placeholder="Filter by keyword, organism, or mission name..."
        className="w-full pl-10 pr-24"
        disabled={isLoading}
      />
      <Button type="submit" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 px-4" disabled={isLoading || !searchInput.trim()}>
        Search
      </Button>
    </form>
  );
}
