'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { SearchBar } from '@/components/search/search-bar';
import { FilterPanel } from '@/components/search/filter-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Telescope } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({});
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // In a real implementation, you would trigger a search here
    console.log('Searching for:', term);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real implementation, you would trigger a search/filter here
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header>
        <div className="flex items-center gap-4 ml-auto">
            <Button asChild variant="ghost">
                <Link href="/">Chat</Link>
            </Button>
            <Button asChild>
                <Link href="/search">Search</Link>
            </Button>
        </div>
      </Header>
      <main className="flex-1 grid md:grid-cols-[280px_1fr] gap-6 p-4 lg:p-6 overflow-hidden">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden h-full">
            <FilterPanel onFilterChange={handleFilterChange} />
        </div>
        <div className="flex flex-col gap-6 overflow-hidden h-full">
            <SearchBar onSearch={handleSearch} />
            <Card className="flex-1 overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-8">
                     <Telescope className="w-20 h-20 text-accent mb-6" strokeWidth={1} />
                    <h2 className="font-headline text-2xl font-bold mb-2">Explore Studies</h2>
                    <p className="text-muted-foreground max-w-md">
                        Use the search bar and filters to find studies from NASA's Open Science Data Repository.
                    </p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
