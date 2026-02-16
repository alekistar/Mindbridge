export type ContentType = 'youtube' | 'article' | 'guide';

export interface GuideStep {
  title: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: ContentType;
  heroImage?: string;
  tags: string[];
  publishedAt: string;
  
  // Content specific fields
  youtubeId?: string; // For video
  channelName?: string; // New field
  sourceUrl?: string; // For article/video
  author?: string; // For article
  steps?: string[]; // For guide
  estimatedTime?: number; // Minutes
  references?: string[];
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  topicIds: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string; 
  moodTags: string[];
  createdAt: number;
  isLocked: boolean; // UI flag for visual locking (distinct from encryption)
  isEncrypted?: boolean; // New flag for technical encryption status
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  reducedMotion: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isCrisis?: boolean;
}

// --- Auth Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// --- Quiz Types ---
export interface QuizOption {
  text: string;
  value: number; // Score value
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizResult {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  recommendedTopicIds: string[];
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  summary: string;
  questions: QuizQuestion[];
  results: QuizResult[];
  estimatedTime: number; // minutes
}