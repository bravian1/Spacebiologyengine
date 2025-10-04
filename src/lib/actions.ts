'use server';

import { generateInsight } from '@/ai/flows/ai-powered-insights';
import { summarizeStudyMetadata } from '@/ai/flows/summarize-study-metadata';
import type { FullStudyDetails, Study, StudyFile, StudySearchResult } from '@/lib/types';

const NASA_SEARCH_API = 'https://osdr.nasa.gov/osdr/data/search';
const NASA_META_API = 'https://osdr.nasa.gov/osdr/data/osd/meta';
const NASA_FILES_API = 'https://osdr.nasa.gov/osdr/data/osd/files';

export async function askQuestion(question: string): Promise<{
  success: boolean;
  data?: { insight: string; studies: Study[] };
  error?: string;
}> {
  try {
    const insightPromise = generateInsight({ question });

    const searchParams = new URLSearchParams({
      term: question,
      type: 'cgene',
      size: '20',
    });
    
    const searchResponsePromise = fetch(`${NASA_SEARCH_API}?${searchParams.toString()}`);
    
    const [insightResult, searchResponse] = await Promise.all([insightPromise, searchResponsePromise]);

    if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.error('NASA API Error:', errorText);
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

    if (!metadataResponse.success || !filesResponse.success) {
      throw new Error('Failed to fetch study data from NASA OSDR.');
    }

    const files: StudyFile[] = filesResponse.studies?.[accession]?.study_files || [];
    
    return {
      success: true,
      data: {
        metadata: metadataResponse.study[accession],
        files,
        summary: summaryResult.summary,
      },
    };
  } catch (error) {
    console.error(`getStudyDetails action error for ${accession}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
