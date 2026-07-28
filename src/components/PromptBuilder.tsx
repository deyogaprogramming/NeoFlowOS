import { useState } from 'react';
import { Prompt, Idea } from '../types';
import { 
  Copy, 
  Save, 
  Sparkles, 
  Layers, 
  Camera, 
  Lightbulb, 
  Palmtree, 
  Box,
  Check,
  History,
  Fingerprint,
  ArrowUpRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PromptBuilderProps {
  onSave: (prompt: Prompt) => void;
  ideas: Idea[];
}

const PRESETS = [
  { id: 'cinematic', label: 'Cinematic', color: 'bg-orange-500' },
  { id: 'surreal', label: 'Surreal', color: 'bg-purple-500' },
  { id: 'editorial', label: 'Editorial', color: 'bg-zinc-100' },
  { id: 'dreamy', label: 'Dreamy', color: 'bg-blue-400' },
  { id: 'emotional', label: 'Emotional', color: 'bg-red-400' },
  { id: 'futuristic', label: 'Futuristic', color: 'bg-amber-400' },
];

export default function PromptBuilder({ onSave, ideas }: PromptBuilderProps) {
  const [activePreset, setActivePreset] = useState('cinematic');
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [prompt, setPrompt] = useState<Partial<Prompt>>({
    title: '',
    layers: {
      scene: '',
      subject: '',
      camera: '',
      lighting: '',
      style: ''
    }
  });

  const fullPromptText = `
Scene: ${prompt.layers?.scene || '(Not specified)'}
Subject: ${prompt.layers?.subject || '(Not specified)'}
Camera: ${prompt.layers?.camera || '(Not specified)'}
Lighting: ${prompt.layers?.lighting || '(Not specified)'}
Style: ${prompt.layers?.style || '(Not specified)'}
Preset: ${activePreset}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explainVisualLogic = async () => {
    if (!prompt.layers?.scene && !prompt.layers?.subject) {
      setError("Berikan detail adegan atau subjek sebelum meminta analisis AI.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null);
    
    try {
      const systemPrompt = `Kamu adalah seorang Visual Mentor & Director of Photography profesional.
      Bedah prompt visual berikut dan jelaskan:
      1. Komposisi & Angle: Kenapa pilihan lensa/angle ini kuat.
      2. Atmosfer & Cahaya: Kenapa skema pencahayaan ini membangun emosi tertentu.
      3. Referensi Sinematik: Sebutkan 1-2 referensi gaya sutradara atau fotografer legendaris (misal: Deakins, Wes Anderson, Fan Ho).
      
      Gunakan bahasa yang puitis namun teknis, singkat, dan inspiratif. Format dalam markdown sederhana.
      
      PROMPT DETAIL:
      ${fullPromptText}`;

      const res = await fetch('/api/prompt-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt })
      });

      if (!res.ok) throw new Error("Gagal menganalisis prompt.");
      
      const data = await res.json();
      setAnalysis(data.text || "Tidak dapat menganalisis sinyal visual.");
    } catch (err: any) {
      console.error(err);
      setError("Gangguan pada neural engine. Coba lagi nanti.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateLayer = (key: keyof Prompt['layers'], value: string) => {
    setPrompt({
      ...prompt,
      layers: {
        ...prompt.layers!,
        [key]: value
      }
    });
    setError(null);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Studio Kreatif</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Arsitek Prompt</h1>
          <p className="mt-4 text-zinc-400 leading-relaxed max-w-md">
            Struktur 5-lapis menjamin konsistensi dan kontrol maksimum untuk generasi AI. 
            Melapisi batasan-batasan ini menghasilkan hasil studio profesional.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3 text-orange-500 text-xs font-bold uppercase tracking-widest"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presets */}
        <div className="space-y-4">
          <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Palmtree className="w-3 h-3" /> Preset Gaya Inti
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePreset(p.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  activePreset === p.id 
                    ? "bg-white text-black border-white" 
                    : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Layer Inputs */}
        <div className="space-y-4 pt-4">
          <InputLayer 
             label="01. Adegan (Scene)" 
             icon={<Box className="w-4 h-4" />}
             value={prompt.layers?.scene || ''}
             onChange={(v) => updateLayer('scene', v)}
             placeholder="Lingkungan, lokasi, detail latar belakang..."
          />
          <InputLayer 
             label="02. Subjek (Subject)" 
             icon={<Sparkles className="w-4 h-4" />}
             value={prompt.layers?.subject || ''}
             onChange={(v) => updateLayer('subject', v)}
             placeholder="Karakter utama, objek, postur, aksi..."
          />
          <InputLayer 
             label="03. Kamera (Camera)" 
             icon={<Camera className="w-4 h-4" />}
             value={prompt.layers?.camera || ''}
             onChange={(v) => updateLayer('camera', v)}
             placeholder="Lensa, sudut, depth of field, format..."
          />
          <InputLayer 
             label="04. Pencahayaan (Lighting)" 
             icon={<Lightbulb className="w-4 h-4" />}
             value={prompt.layers?.lighting || ''}
             onChange={(v) => updateLayer('lighting', v)}
             placeholder="Sumber cahaya, suasana, temperatur warna..."
          />
          <InputLayer 
             label="05. Gaya (Style)" 
             icon={<Layers className="w-4 h-4" />}
             value={prompt.layers?.style || ''}
             onChange={(v) => updateLayer('style', v)}
             placeholder="Perlakuan visual akhir, grain, saturasi..."
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Preview Card */}
        <div className="sticky top-24 space-y-6">
          <div className="rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <div className={cn(
                 "w-3 h-3 rounded-full blur-[4px] animate-pulse",
                 PRESETS.find(p => p.id === activePreset)?.color
               )} />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">Hasil Generasi</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={explainVisualLogic}
                    disabled={isAnalyzing || (!prompt.layers?.scene && !prompt.layers?.subject)}
                    className="p-2 bg-zinc-900 rounded-xl hover:bg-orange-500 hover:text-black transition-all flex items-center gap-2 text-xs font-bold disabled:opacity-20"
                    title="Jelaskan Logika Visual (Mentor AI)"
                  >
                    {isAnalyzing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                    Logika
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="p-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs font-bold"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>

              <div className="space-y-6 font-mono text-sm leading-relaxed max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
                <div className="space-y-1">
                  <span className="text-orange-500/50 block font-bold uppercase text-[10px] tracking-widest">/scene_setup</span>
                  <p className="text-zinc-300 italic">{prompt.layers?.scene || 'Menunggu masukan...'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-orange-500/50 block font-bold uppercase text-[10px] tracking-widest">/subject_focus</span>
                  <p className="text-zinc-300 italic">{prompt.layers?.subject || 'Menunggu masukan...'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-orange-500/50 block font-bold uppercase text-[10px] tracking-widest">/optics_confg</span>
                  <p className="text-zinc-300 italic">{prompt.layers?.camera || 'Menunggu masukan...'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-orange-500/50 block font-bold uppercase text-[10px] tracking-widest">/lux_balance</span>
                  <p className="text-zinc-300 italic">{prompt.layers?.lighting || 'Menunggu masukan...'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-orange-500/50 block font-bold uppercase text-[10px] tracking-widest">/art_direction</span>
                  <p className="text-zinc-300 italic">{prompt.layers?.style || 'Menunggu masukan...'}</p>
                </div>
              </div>

              {/* Analysis Presentation */}
              <AnimatePresence>
                {analysis && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-zinc-950/80 border border-orange-500/20 rounded-3xl mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Wawasan Mentor Visual</span>
                        <button onClick={() => setAnalysis(null)} className="ml-auto text-[10px] text-zinc-600 hover:text-white uppercase font-bold tracking-widest">Tutup</button>
                      </div>
                      <div className="text-xs text-zinc-400 leading-relaxed font-sans prose prose-invert prose-orange max-h-[150px] overflow-y-auto pr-2 scrollbar-hide">
                         {analysis}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Dasar Rasa</div>
                   <div className="flex flex-wrap gap-2">
                     {PRESETS.map((p) => (
                       <button
                         key={p.id}
                         onClick={() => setActivePreset(p.id)}
                         className={cn(
                           "px-4 py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all",
                           activePreset === p.id 
                             ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" 
                             : "bg-zinc-900 border border-white/5 text-zinc-600 hover:text-white"
                         )}
                       >
                         {p.label}
                       </button>
                     ))}
                   </div>
                </div>
                <button 
                  onClick={() => onSave(prompt as Prompt)}
                  disabled={!prompt.layers?.scene}
                  className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-20 shadow-2xl shadow-black/50"
                >
                  <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Simpan di Brankas
                </button>
              </div>
            </div>

            {/* Matrix Decoration */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none font-mono text-[8px] leading-tight select-none">
              {Array.from({length: 40}).map((_, i) => (
                <div key={i}>01011010110010101101011011010101010101</div>
              ))}
            </div>
          </div>
          
          {/* DNA Reminder */}
          <div 
            onClick={() => {}} 
            className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-600/10 rounded-xl text-orange-500">
                 <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DNA Override</div>
                 <div className="text-xs font-bold text-zinc-300">Hukum estetika aktif</div>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-orange-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputLayer({ label, icon, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] ml-2 group-focus-within:text-orange-500 transition-colors">
        {icon}
        {label}
      </div>
      <div className="relative">
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:border-orange-500/50 focus:bg-zinc-900/50 transition-all rounded-2xl p-4 text-sm focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
