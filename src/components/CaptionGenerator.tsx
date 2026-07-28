import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'reels', label: 'Instagram Reels' },
  { id: 'shorts', label: 'YouTube Shorts' }
];

const MOODS = [
  { id: 'poetic', label: 'Poetic' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'mysterious', label: 'Mysterious' },
  { id: 'technical', label: 'Technical' }
];

export default function CaptionGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [mood, setMood] = useState('poetic');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCaption = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = `Buatlah caption singkat dan menarik untuk ${platform} dengan mood ${mood}.
      Topik konten: ${topic}.
      Sertakan 3-5 hashtag yang relevan.
      Gunakan gaya bahasa kreator konten visual yang premium dan minimalis.
      Berikan 3 variasi caption.`;

      const res = await fetch('/api/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error("Sinyal AI terganggu.");
      
      const data = await res.json();
      setResult(data.text || "Gagal mendapatkan respon.");
    } catch (err: any) {
      console.error(err);
      setError("Maaf, terjadi kesalahan saat menyusun narasi. Sinyal AI terganggu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Strategi Sosial</h2>
        <h1 className="text-4xl font-display font-bold tracking-tight">Sintesis Caption</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-zinc-900/40 p-8 rounded-[3rem] border border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-2">Tentang apa rekaman ini?</label>
            <textarea 
              value={topic}
              onChange={e => {
                setTopic(e.target.value);
                setError(null);
              }}
              placeholder="misal: Malam hujan di Tokyo, fokus pada pantulan neon di genangan air..."
              rows={4}
              className="w-full bg-zinc-800/30 border border-white/5 rounded-[2rem] p-6 text-sm focus:outline-none focus:border-orange-500 transition-all h-40 resize-none"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3 text-orange-500 text-xs font-bold uppercase tracking-widest"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
             <AnimatedDropdown 
               label="Saluran" 
               options={PLATFORMS} 
               selected={platform} 
               onSelect={setPlatform} 
             />
             <AnimatedDropdown 
               label="Suasana (Vibe)" 
               options={MOODS} 
               selected={mood} 
               onSelect={setMood} 
             />
          </div>

          <button 
            onClick={generateCaption}
            disabled={loading || !topic}
            className="w-full h-16 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 hover:bg-orange-500 transition-all disabled:opacity-20 active:scale-95 shadow-2xl shadow-orange-950/20"
          >
            {loading ? (
              <RotateCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {loading ? 'Menyintesis...' : 'Buat Narasi'}
          </button>
        </div>

        <div className={cn(
          "p-8 rounded-[3rem] border transition-all duration-500 relative group overflow-hidden",
          result ? "bg-zinc-950 border-orange-500/30" : "bg-transparent border-dashed border-white/5"
        )}>
           {!result ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-700">
               <Sparkles className="w-12 h-12" />
               <p className="text-xs uppercase tracking-widest font-bold">Menunggu sinyal masukan...</p>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Hasil Draf</span>
                  <button onClick={handleCopy} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
                  {result}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function AnimatedDropdown({ label, options, selected, onSelect }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find((opt: any) => opt.id === selected)?.label || selected;

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 ml-2">{label}</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-zinc-800/30 border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-left hover:border-white/10 transition-all",
          isOpen && "border-orange-500/50 bg-zinc-800"
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-600 transition-transform", isOpen && "rotate-180 text-orange-500")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 left-0 right-0 top-full bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
          >
            {options.map((opt: any) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelect(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all",
                  selected === opt.id ? "bg-orange-500 text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
