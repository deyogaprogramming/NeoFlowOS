import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  Sparkles, 
  Layers, 
  Zap, 
  Maximize, 
  Palette, 
  Trash2,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MoodboardAnalysis } from '../types';

export default function MoodboardIntelligence() {
  const [images, setImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MoodboardAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    setError(null);
    if (files.length + images.length > 5) {
      setError("Maksimal 5 gambar untuk analisis moodboard.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const analyzeMoodboard = async () => {
    if (images.length < 1) return;

    setAnalyzing(true);
    setError(null);
    try {
      const prompt = `Analyze these ${images.length} images as a cohesive moodboard. 
      Identify the following visual and emotional characteristics:
      1. Tone: The overall mood and atmosphere.
      2. Rhythm: The visual tempo, repetition, or flow.
      3. Composition: Common structural patterns, use of space, and lens language.
      4. Emotional Density: How "heavy" or light the emotional impact is.
      5. Style Fingerprint: A unique identifier or short phrase describing this specific aesthetic blend.
      6. Visual Summary: A concise paragraph summarizing what makes these images work together.
      7. Prompt Direction: A high-level text instruction (prompt fragment) that would help an AI generate something in this exact style.

      Return the analysis in a STRICT JSON format with these exact keys: 
      "tone", "rhythm", "composition", "emotionalDensity", "styleFingerprint", "visualSummary", "promptDirection"
      Do not include any markdown formatting like \`\`\`json. Just the raw JSON.`;

      const res = await fetch('/api/moodboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, images })
      });

      if (!res.ok) throw new Error("Gagal mendapatkan respons AI.");
      
      const responseData = await res.json();
      const text = responseData.text || "{}";
      const cleanedText = text.replace(/```json|```/g, '').trim();
      let analysisData;
      try {
        analysisData = JSON.parse(cleanedText);
      } catch (e) {
        throw new Error("Gagal memproses format data dari AI. Silakan coba lagi.");
      }

      const finalResult: MoodboardAnalysis = {
        id: Math.random().toString(36).substring(7),
        images: [...images],
        ...analysisData,
        createdAt: Date.now()
      };

      setResult(finalResult);

      // Save to backend
      try {
        const res = await fetch('/api/moodboard-analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalResult),
        });
        if (!res.ok) throw new Error("Gagal menyimpan ke server");
      } catch (saveError) {
        console.warn("Analysis cached locally but failed to sync with cloud.");
      }
    } catch (err: any) {
      console.error("Moodboard Analysis Error:", err);
      setError(err.message || "Terjadi kesalahan saat menganalisis gambar. Pastikan koneksi stabil.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-2">Ekstraksi Visual</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Moodboard Intelligence</h1>
          <p className="mt-4 text-zinc-400 max-w-xl leading-relaxed">
            Unggah referensi visual untuk mengekstrak jiwa estetikanya. Mesin neural kami memecahkan pola tersembunyi dalam warna, ritme, dan emosi untuk membangun sidik jari gaya Anda.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
           <Scan className="w-5 h-5 text-orange-500" />
           <div className="text-xs font-bold uppercase tracking-widest text-zinc-300">Pemindaian Cerdas Aktif</div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {!result ? (
        <div className="space-y-8">
           <div className="p-12 rounded-[3.5rem] bg-zinc-900/30 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6 group hover:border-orange-500/30 transition-all">
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500">
                 <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Mulai Unggahan Benih</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">Unggah 1-5 gambar referensi. AI melakukan pemindaian mendalam untuk ekstraksi DNA estetika.</p>
              </div>
              <label className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-orange-500 transition-all cursor-pointer shadow-xl shadow-white/5 active:scale-95">
                 Pilih Referensi
                 <input 
                   type="file" 
                   multiple 
                   accept="image/*" 
                   onChange={handleImageUpload} 
                   className="hidden" 
                 />
              </label>
           </div>

           {images.length > 0 && (
             <div className="space-y-8">
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 <AnimatePresence>
                   {images.map((img, idx) => (
                     <motion.div 
                       key={idx}
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="aspect-[4/5] rounded-3xl overflow-hidden relative border border-white/10 group shadow-2xl"
                     >
                       <img src={img} alt="Seed" className="w-full h-full object-cover" />
                       <button 
                         onClick={() => removeImage(idx)}
                         className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>

               <div className="flex justify-center">
                 <button 
                   onClick={analyzeMoodboard}
                   disabled={analyzing}
                   className="px-12 py-5 bg-orange-600 text-white rounded-full font-bold flex items-center gap-3 hover:bg-orange-500 transition-all shadow-2xl shadow-orange-950/20 active:scale-95 disabled:opacity-50"
                 >
                   {analyzing ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <Sparkles className="w-5 h-5" />
                   )}
                   {analyzing ? "Mendekode DNA Visual..." : "Luncurkan Pemindaian Cerdas"}
                 </button>
               </div>
             </div>
           )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
             <div className="p-10 rounded-[3.5rem] bg-[#0a0a0a] border border-orange-500/30 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Layers className="w-32 h-32 text-orange-500" />
                </div>
                                <div className="space-y-6 relative">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Ringkasan Dekode</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold leading-tight">{result.styleFingerprint}</h3>
                  <p className="text-lg text-zinc-400 italic font-mono leading-relaxed">"{result.visualSummary}"</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 pt-10 border-t border-white/5 relative">
                  <AnalysisItem 
                    icon={<Zap className="w-4 h-4 text-orange-400" />} 
                    label="Suasana & Nada" 
                    value={result.tone} 
                  />
                  <AnalysisItem 
                    icon={<Maximize className="w-4 h-4 text-blue-400" />} 
                    label="Hukum Komposisi" 
                    value={result.composition} 
                  />
                  <AnalysisItem 
                    icon={<Palette className="w-4 h-4 text-emerald-400" />} 
                    label="Ritme Visual" 
                    value={result.rhythm} 
                  />
                  <AnalysisItem 
                    icon={<Loader2 className="w-4 h-4 text-red-500" />} 
                    label="Kepadatan Emosional" 
                    value={result.emotionalDensity} 
                  />
                </div>
             </div>

             <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-orange-500/20 transition-all">
                <div className="space-y-2">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Ekstraksi Prompt</div>
                   <div className="text-zinc-300 font-mono text-sm">"{result.promptDirection}"</div>
                </div>
                <button className="p-4 bg-orange-600 rounded-2xl text-black hover:bg-orange-500 transition-colors shadow-lg">
                   <ArrowRight className="w-6 h-6" />
                </button>
             </div>
          </div>

          {/* Seed References */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Metadata Benih</h4>
              <button 
                onClick={() => setResult(null)}
                className="text-xs font-bold uppercase text-orange-500 hover:text-orange-400"
              >
                Atur Ulang Pemindaian
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {result.images.map((img, idx) => (
                 <div key={idx} className="aspect-square rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 brightness-50 hover:brightness-100">
                    <img src={img} alt="Seed" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AnalysisItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
         <div className="p-1.5 bg-zinc-900 rounded-lg">
           {icon}
         </div>
         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <p className="text-sm font-medium text-zinc-300 pl-8">{value}</p>
    </div>
  );
}
