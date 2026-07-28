export type Niche = 'neo-surrealisme' | 'editorial' | 'visual-storytelling' | 'landscape-ai' | 'street-tech';
export type Mood = 'melancholic' | 'dreamy' | 'futuristic' | 'poetic' | 'cinematic';
export type Platform = 'tiktok' | 'reels' | 'shorts' | 'instagram' | 'portfolio';
export type ContentStatus = 'Ide' | 'Draf Prompt' | 'Generasi' | 'Edit' | 'Tinjau' | 'Siap' | 'Terbit';

export interface Idea {
  id: string;
  title: string;
  description: string;
  mood: Mood;
  niche: Niche;
  platform: Platform;
  status: ContentStatus;
  createdAt: number;
}

export interface Prompt {
  id: string;
  ideaId?: string;
  title: string;
  layers: {
    scene: string;
    subject: string;
    camera: string;
    lighting: string;
    style: string;
  };
  preset: string;
  createdAt: number;
}

export interface Reference {
  id: string;
  title: string;
  link: string;
  tags: string[];
  category: 'account' | 'visual' | 'color' | 'mood' | 'insight';
  notes: string;
  createdAt: number;
}

export interface VisualDNA {
  styleRules: string[];
  emotionalRules: string[];
  framingRules: string[];
  colorRules: string[];
  forbiddenStyles: string[];
}

export interface PromptEvolution {
  id: string;
  promptId: string;
  version: number;
  imageUrl?: string;
  evaluation: string;
  whatWorked: string;
  whatFailed: string;
  createdAt: number;
}

export interface MoodboardAnalysis {
  id: string;
  images: string[];
  tone: string;
  rhythm: string;
  composition: string;
  emotionalDensity: string;
  styleFingerprint: string;
  visualSummary: string;
  promptDirection: string;
  createdAt: number;
}
