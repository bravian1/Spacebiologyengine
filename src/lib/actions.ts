'use server';

import { generateInsight } from '@/ai/flows/ai-powered-insights';
import { summarizeStudyMetadata } from '@/ai/flows/summarize-study-metadata';
import type { FullStudyDetails, Study, StudyFile, StudySearchResult } from '@/lib/types';
import type { FilterState } from '@/components/search/filter-panel';

const NASA_SEARCH_API = 'https://osdr.nasa.gov/osdr/data/search';
const NASA_META_API = 'https://osdr.nasa.gov/osdr/data/osd/meta';
const NASA_FILES_API = 'https://osdr.nasa.gov/osdr/data/osd/files';
const NASA_BASE_URL = 'https://osdr.nasa.gov';

export async function askQuestion(question: string): Promise<{
  success: boolean;
  data?: { insight: string; studies: Study[] };
  error?: string;
}> {
  try {
    const insightPromise = generateInsight({ question });

    const searchQuery = {
      size: 20,
      query: {
        bool: {
          must: {
            query_string: {
              query: question,
              default_field: "All_Text_Fields"
            },
          },
        },
      },
      sort: [
          { "Last Modified": { order: "desc" } }
      ]
    };
    
    const searchUrl = `${NASA_SEARCH_API}?source_content_type=application/json&source=${encodeURIComponent(JSON.stringify(searchQuery))}`;
    
    const searchResponsePromise = fetch(searchUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    const [insightResult, searchResponse] = await Promise.all([insightPromise, searchResponsePromise]);

    if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.error('NASA API Error:', errorText, searchResponse.status);
        throw new Error(`Failed to search studies. Status: ${searchResponse.status}`);
    }

    const searchResultData: StudySearchResult = await searchResponse.json();
    const studies = searchResultData.hits.hits.map((hit: any) => hit._source);

    return {
      success: true,
      data: {
        insight: insightResult.insight,
        studies: studies,
      },
    };
  } catch (error) {
    console.error('askQuestion action error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function getStudyDetails(accession: string): Promise<{
  success: boolean;
  data?: FullStudyDetails;
  error?: string;
}> {
  try {
    const studyId = accession.replace('OSD-', '');

    const metadataPromise = fetch(`${NASA_META_API}/${studyId}`).then(res => res.json());
    const filesPromise = fetch(`${NASA_FILES_API}/${studyId}`).then(res => res.json());
    const summaryPromise = summarizeStudyMetadata({ studyId: accession });

    const [metadataResponse, filesResponse, summaryResult] = await Promise.all([
      metadataPromise,
      filesPromise,
      summaryPromise,
    ]);

    if (metadataResponse?.study?.[accession] && filesResponse?.studies?.[accession]) {
        const files: StudyFile[] = (filesResponse.studies[accession].study_files || []).map((file: any) => ({
            ...file,
            remote_url: `${NASA_BASE_URL}${file.remote_url}`
        }));
    
        return {
          success: true,
          data: {
            metadata: metadataResponse.study[accession],
            files,
            summary: summaryResult.summary,
          },
        };
    } else {
         throw new Error('Failed to fetch study data from NASA OSDR. Invalid data structure.');
    }

  } catch (error) {
    console.error(`getStudyDetails action error for ${accession}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function searchStudies(params: {
    term: string;
    page: number;
    pageSize: number;
    filters: FilterState;
}): Promise<{
    success: boolean,
    data?: { studies: Study[], total: number },
    error?: string
}> {
    const { term, page, pageSize, filters } = params;
    const from = (page - 1) * pageSize;

    console.log('Search filters received:', JSON.stringify(filters, null, 2));
    console.log('Search term:', term);

    // Build filter array based on provided filters
    const filterArray: any[] = [];

    // Category filters - search in study description and title for category keywords
    if (filters.categories && filters.categories.length > 0) {
        const categoryQuery = filters.categories.map(category =>
            `("${category}" OR "${category.toLowerCase()}")`
        ).join(' OR ');

        filterArray.push({
            query_string: {
                query: categoryQuery,
                fields: ["Study Title", "Study Description", "All_Text_Fields"]
            }
        });
    }

    // Year filters - filter by Last Modified date
    if (filters.yearFrom || filters.yearTo) {
        const rangeFilter: any = {
            range: {
                "Last Modified": {}
            }
        };

        if (filters.yearFrom) {
            rangeFilter.range["Last Modified"].gte = `${filters.yearFrom}-01-01`;
        }
        if (filters.yearTo) {
            rangeFilter.range["Last Modified"].lte = `${filters.yearTo}-12-31`;
        }

        filterArray.push(rangeFilter);
    }

    const query = {
        from: from,
        size: pageSize,
        query: {
            bool: {
                must: {
                    query_string: {
                        query: term || '*',
                    },
                },
                ...(filterArray.length > 0 && { filter: filterArray }),
            },
        },
        sort: [
            { "Last Modified": { order: "desc" } }
        ]
    };

    console.log('Final search query:', JSON.stringify(query, null, 2));

    try {
        const searchUrl = `${NASA_SEARCH_API}?source_content_type=application/json&source=${encodeURIComponent(JSON.stringify(query))}`;

        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('NASA API Error:', errorText, response.status, response.statusText);
            throw new Error(`Failed to search studies. Status: ${response.status}`);
        }

        const result: StudySearchResult = await response.json();
        const studies = result.hits.hits.map(hit => hit._source);
        const total = result.hits.total.value;

        console.log('API Response - Total hits:', total);
        console.log('API Response - Returned results:', studies.length);
        if (filters.categories.length > 0) {
            console.log('Filter applied - Categories:', filters.categories);
            console.log('Sample result titles:', studies.slice(0, 3).map(s => s['Study Title']));
        }

        return { success: true, data: { studies, total } };

    } catch (error) {
        console.error('searchStudies action error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
