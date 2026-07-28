import React, { useState, useRef, useEffect } from 'react';
import { Idea, Mood, Niche, Platform } from '../types';
import { Save, X, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useFirebase } from './FirebaseProvider';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface QuickCaptureProps {
  onSave: (idea: Idea) => void;
  setActiveView: (view: any) => void;
}

const NICHES: Niche[] = ['neo-surrealisme', 'editorial', 'visual-storytelling', 'landscape-ai', 'street-tech'];
const MOODS: Mood[] = ['melancholic', 'dreamy', 'futuristic', 'poetic', 'cinematic'];
const PLATFORMS: Platform[] = ['tiktok', 'reels', 'shorts', 'instagram', 'portfolio'];

export default function QuickCapture({ onSave, setActiveView }: QuickCaptureProps) {
  const { user } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const [idea, setIdea] = useState<Partial<Idea>>({
    title: '',
    description: '',
    mood: 'cinematic',
    niche: 'visual-storytelling',
    platform: 'instagram',
    status: 'Ide'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.title || isSaving) return;

    setIsSaving(true);
    const ideaId = Math.random().toString(36).substring(7);
    const timestamp = Date.now();

    const newIdea: Idea = {
      id: ideaId,
      title: idea.title!,
      description: idea.description || '',
      mood: idea.mood as Mood,
      niche: idea.niche as Niche,
      platform: idea.platform as Platform,
      status: 'Ide',
      createdAt: timestamp
    };

    try {
      if (user) {
        const ideaPath = `users/${user.uid}/ideas/${ideaId}`;
        await setDoc(doc(db, ideaPath), {
          ...newIdea,
          userId: user.uid,
          createdAt: serverTimestamp() // In Firestore we use server timestamp for security rules
        });
      }
      
      onSave(newIdea);
      setActiveView('dashboard');
    } catch (error) {
      if (user) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/ideas/${ideaId}`);
      } else {
        console.error("Failed to save locally", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">Brainstorm Baru</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Tangkap Ide Mentah</h1>
        </div>
        <button 
          onClick={() => setActiveView('dashboard')}
          className="p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-12 bg-zinc-900/40 p-8 md:p-12 rounded-[3.5rem] border border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 ml-4">Judul (Hook)</label>
            <input 
              required
              value={idea.title}
              onChange={e => setIdea({...idea, title: e.target.value})}
              placeholder="misal, Upacara Teh Cyberpunk"
              className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-accent py-4 px-4 text-2xl font-bold transition-all outline-none placeholder:text-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 ml-4">Visi Inti (Deskripsi)</label>
            <textarea 
              value={idea.description}
              onChange={e => setIdea({...idea, description: e.target.value})}
              placeholder="Jelaskan suasana, pencahayaan, dan alur cerita..."
              rows={4}
              className="w-full bg-zinc-800/20 rounded-3xl p-6 text-lg text-zinc-300 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all border border-white/5 focus:bg-zinc-800/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CustomDropdown 
              label="Ceruk (Niche)" 
              options={NICHES} 
              selected={idea.niche} 
              onChange={val => setIdea({...idea, niche: val as Niche})} 
            />
            <CustomDropdown 
              label="Suasana (Mood)" 
              options={MOODS} 
              selected={idea.mood} 
              onChange={val => setIdea({...idea, mood: val as Mood})} 
            />
            <CustomDropdown 
              label="Platform" 
              options={PLATFORMS} 
              selected={idea.platform} 
              onChange={val => setIdea({...idea, platform: val as Platform})} 
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-white text-black font-bold py-5 rounded-full flex items-center justify-center gap-2 hover:bg-accent transition-all shadow-2xl shadow-accent/20 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? 'Menyimpan...' : 'Masukkan ke Sistem (Simpan)'}
          </button>
          <button 
            type="button"
            className="px-10 py-5 bg-zinc-900 border border-white/10 rounded-full font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-white"
          >
            <Sparkles className="w-5 h-5 text-accent" />
            Drafkan Prompt
          </button>
        </div>
      </form>
    </div>
  );
}

function CustomDropdown({ label, options, selected, onChange }: { label: string, options: string[], selected: any, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 ml-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-zinc-800/40 rounded-2xl px-5 py-4 text-sm font-bold border border-white/5 transition-all text-left group hover:border-accent/30",
          isOpen && "border-accent bg-zinc-800"
        )}
      >
        <span className="capitalize">{selected.replace('-', ' ')}</span>
        <ChevronDown className={cn("w-4 h-4 text-zinc-600 transition-transform duration-300", isOpen && "rotate-180 text-accent")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 top-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-xl"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-5 py-3 text-left text-xs uppercase tracking-widest font-bold transition-all",
                  selected === option 
                    ? "text-accent bg-accent/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {option.replace('-', ' ')}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
