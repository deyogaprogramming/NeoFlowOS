import { Idea, Prompt, Reference, ContentStatus } from './types';

export const INITIAL_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'Arsitek yang Terabaikan',
    description: 'Studi tentang struktur brutalist yang perlahan-lahan direbut kembali oleh tanaman merambat neon dalam suasana hujan.',
    mood: 'futuristic',
    niche: 'neo-surrealisme',
    platform: 'instagram',
    status: 'Ide',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '2',
    title: 'Pagi di Glimmer-City',
    description: 'Fotografi low-light yang puitis tentang seseorang yang tidur sementara hologram melayang di atas mereka.',
    mood: 'dreamy',
    niche: 'visual-storytelling',
    platform: 'tiktok',
    status: 'Draf Prompt',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    title: 'Editorial Abadi',
    description: 'Pemotretan fesyen kontras tinggi di gudang terbengkalai dengan gaun abad ke-18 yang anakronistik.',
    mood: 'cinematic',
    niche: 'editorial',
    platform: 'portfolio',
    status: 'Terbit',
    createdAt: Date.now() - 86400000 * 10,
  }
];

export const INITIAL_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    ideaId: '2',
    title: 'Dreamy Glimmer Morning',
    layers: {
      scene: 'Cozy modern bedroom with floor-to-ceiling windows showing a blurred futuristic skyline',
      subject: 'A young artist sleeping peacefully',
      camera: '35mm anamorphic lens, shallow depth of field, f/1.4',
      lighting: 'Golden hour sunlight filtering through blue neon city lights, high contrast',
      style: 'Cinematic, dreamy haze, subtle grain, neo-noire palette'
    },
    preset: 'dreamy',
    createdAt: Date.now() - 86400000 * 4,
  }
];

export const INITIAL_REFERENCES: Reference[] = [
  {
    id: 'r1',
    title: 'Blade Runner 2049 Color Palette',
    link: 'https://example.com/palette',
    tags: ['color', 'futuristic'],
    category: 'color',
    notes: 'Focus on the amber and teal balance.',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'r2',
    title: 'Gregory Crewdson Lighting Study',
    link: 'https://example.com/crewdson',
    tags: ['lighting', 'cinematic'],
    category: 'visual',
    notes: 'Artificial twilight, staged reality.',
    createdAt: Date.now() - 86400000 * 15,
  }
];

export const STATUS_LIST: ContentStatus[] = [
  'Ide', 'Draf Prompt', 'Generasi', 'Edit', 'Tinjau', 'Siap', 'Terbit'
];
