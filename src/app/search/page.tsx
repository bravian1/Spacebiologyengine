'use client';

import * as React from 'react';
import Link from 'next/link';
import { Telescope, FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';

import { Header, Navigation } from '@/components/layout/header';
import { SearchBar } from '@/components/search/search-bar';
import { FilterPanel } from '@/components/search/filter-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { searchStudies } from '@/lib/actions';
import type { Study } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const PAGE_SIZE = 10;

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({});
  const [results, setResults] = React.useState<Study[]>([]);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const executeSearch = React.useCallback(async (term: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await searchStudies({
        term,
        page,
        pageSize: PAGE_SIZE,
        filters,
      });

      if (response.success && response.data) {
        setResults(response.data.studies);
        setTotal(response.data.total);
      } else {
        throw new Error(response.error || 'Search failed');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);
  
  React.useEffect(() => {
    // Initial search on load
    executeSearch(searchTerm, currentPage);
  }, [currentPage, executeSearch]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    executeSearch(term, 1);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    executeSearch(searchTerm, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  const renderResults = () => {
    if (isLoading) {
      return Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>
      ));
    }

    if (results.length === 0) {
      return (
        <Card className="flex-1 overflow-hidden">
            <CardContent className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Telescope className="w-20 h-20 text-accent mb-6" strokeWidth={1} />
                <h2 className="font-headline text-2xl font-bold mb-2">Explore Studies</h2>
                <p className="text-muted-foreground max-w-md">
                    Use the search bar and filters to find studies from NASA's Open Science Data Repository.
                </p>
            </CardContent>
        </Card>
      )
    }

    return results.map(study => (
      <Card key={study.Accession} className="p-4 hover:bg-secondary/50 transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-md mt-1">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className='flex-1'>
            <p className="text-sm font-semibold text-foreground">
              {study['Study Title']}
            </p>
            <p className="text-xs text-muted-foreground font-mono mb-2">
              {study.Accession}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {study['Study Description']}
            </p>
            {study['Last Modified'] && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last Modified: {format(new Date(study['Last Modified']), 'PPP')}
                </p>
            )}
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/chat?study=${study.Accession}`}>
                <Download className="mr-2 h-4 w-4" />
                View Details
            </Link>
          </Button>
        </div>
      </Card>
    ));
  }


  return (
    <div className="flex flex-col h-screen bg-background">
      <Header>
        <Navigation />
      </Header>
      <main className="flex-1 grid md:grid-cols-[280px_1fr] gap-6 p-4 lg:p-6 overflow-hidden">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden h-full">
            <FilterPanel onFilterChange={handleFilterChange} />
        </div>
        <div className="flex flex-col gap-4 overflow-hidden h-full">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {renderResults()}
            </div>
            {total > 0 && (
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, total)}</strong> of <strong>{total.toLocaleString()}</strong> results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}