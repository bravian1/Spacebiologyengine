export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
};

// Based on search result
export interface Study {
  Accession: string;
  'Study Title': string;
  'Study Description': string;
  'Last Modified': string;
  [key: string]: any;
}

export interface StudySearchResult {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: {
      _source: Study;
    }[];
  };
}

// Based on files API
export interface StudyFile {
  category: string;
  file_name: string;
  file_size: number;
  remote_url: string;
}

// Based on metadata API
export interface StudyMetadata {
  studies: {
    description: string;
    title: string;
    publications: {
      title: string;
      authorList: string;
      doi: string;
    }[];
    people: {
      firstName: string;
      lastName: string;
      roles: string[];
    }[];
    [key: string]: any;
  }[];
  [key: string]: any;
}

export interface FullStudyDetails {
  metadata: any;
  files: StudyFile[];
  summary: string;
}
