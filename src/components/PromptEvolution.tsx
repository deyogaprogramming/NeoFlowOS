import React, { useState, useEffect } from 'react';
import { 
  History, 
  ChevronRight, 
  Image as ImageIcon, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Prompt, PromptEvolution } from '../types';

interface EvolutionViewProps {
  prompts: Prompt[];
}

export default function EvolutionView({ prompts }: EvolutionViewProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(prompts[0]?.id || null);
  const [evolutions, setEvolutions] = useState<PromptEvolution[]>(() => {
    const saved = localStorage.getItem('neoflow_evolutions');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEval, setNewEval] = useState({
    imageUrl: '',
    evaluation: '',
    whatWorked: '',
    whatFailed: ''
  });

  useEffect(() => {
    localStorage.setItem('neoflow_evolutions', JSON.stringify(evolutions));
  }, [evolutions]);

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
  const promptEvolutions = evolutions.filter(e => e.promptId === selectedPromptId).sort((a, b) => b.version - a.version);

  const handleAddEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromptId) return;

    const currentMaxVersion = promptEvolutions[0]?.version || 0;
    const evolution: PromptEvolution = {
      id: Math.random().toString(36).substring(7),
      promptId: selectedPromptId,
      version: currentMaxVersion + 1,
      imageUrl: newEval.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/600`, // Placeholder
      evaluation: newEval.evaluation,
      whatWorked: newEval.whatWorked,
      whatFailed: newEval.whatFailed,
      createdAt: Date.now()
    };

    setEvolutions([evolution, ...evolutions]);
    setShowAddForm(false);
    setNewEval({ imageUrl: '', evaluation: '', whatWorked: '', whatFailed: '' });
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Pertumbuhan Rekursif</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Evolusi Prompt</h1>
          <p className="mt-4 text-zinc-400 max-w-xl leading-relaxed">
            Lacak bagaimana input kreatif Anda berkembang seiring waktu. Dokumentasikan keberhasilan, pelajari dari kegagalan, dan perhalus DNA visual Anda melalui siklus iteratif.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar: Prompts */}
        <aside className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-2">Prompt Aktif</h3>
          <div className="space-y-2">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPromptId(p.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all duration-300",
                  selectedPromptId === p.id 
                    ? "bg-white text-black border-white shadow-xl shadow-white/5" 
                    : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20"
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
                  {p.preset}
                </div>
                <div className="font-bold truncate">{p.title || 'Arsitektur Tanpa Judul'}</div>
                <div className="text-[10px] mt-2 font-mono opacity-50">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main: Evolution Timeline */}
        <main className="lg:col-span-3 space-y-8">
          {selectedPrompt ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-600/10 rounded-2xl text-orange-500">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedPrompt.title}</h3>
                    <p className="text-zinc-500 text-sm">Riwayat Iterasi // v{promptEvolutions[0]?.version || 0}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-orange-500 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Hasil
                </button>
              </div>

              {showAddForm && (
                <motion.form 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddEvolution}
                  className="p-8 rounded-[3rem] bg-zinc-900 border border-orange-500/30 space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Evaluasi Keseluruhan</label>
                       <textarea 
                         required
                         value={newEval.evaluation}
                         onChange={e => setNewEval({...newEval, evaluation: e.target.value})}
                         placeholder="Bagaimana performa prompt? Cek getaran umum..."
                         className="w-full bg-zinc-800/50 rounded-2xl p-4 text-sm focus:outline-none border border-white/5"
                       />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Apa yang Berhasil?</label>
                        <input 
                          value={newEval.whatWorked}
                          onChange={e => setNewEval({...newEval, whatWorked: e.target.value})}
                          placeholder="Keberhasilan spesifik..."
                          className="w-full bg-zinc-800/50 rounded-xl px-4 py-3 text-sm focus:outline-none border border-white/5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-red-500">Apa yang Gagal?</label>
                        <input 
                          value={newEval.whatFailed}
                          onChange={e => setNewEval({...newEval, whatFailed: e.target.value})}
                          placeholder="Halusinasi atau masalah..."
                          className="w-full bg-zinc-800/50 rounded-xl px-4 py-3 text-sm focus:outline-none border border-white/5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 text-zinc-500 text-sm font-bold"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-2 bg-orange-500 text-black rounded-full text-sm font-bold"
                    >
                      Simpan Evolusi
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="space-y-12 relative">
                {promptEvolutions.length > 0 ? (
                  promptEvolutions.map((ev, idx) => (
                    <div key={ev.id} className="relative pl-12 group">
                      {/* Timeline Line */}
                      {idx !== promptEvolutions.length - 1 && (
                        <div className="absolute left-[23px] top-12 bottom-[-48px] w-px bg-zinc-800 border-l border-dashed border-zinc-700" />
                      )}
                      
                      <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-orange-500 group-hover:border-orange-500 transition-colors">
                        v{ev.version}
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                           <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all">
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Evaluasi Global</span>
                                <span className="text-[10px] font-mono text-zinc-700">{new Date(ev.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-zinc-300 leading-relaxed italic">"{ev.evaluation}"</p>
                              
                              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                   <div className="flex items-center gap-2 mb-2">
                                     <ThumbsUp className="w-3 h-3 text-emerald-500" />
                                     <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">DNA Keberhasilan</span>
                                   </div>
                                   <p className="text-xs text-zinc-400">{ev.whatWorked}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                   <div className="flex items-center gap-2 mb-2">
                                     <ThumbsDown className="w-3 h-3 text-red-500" />
                                     <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">Log Cacat</span>
                                   </div>
                                   <p className="text-xs text-zinc-400">{ev.whatFailed}</p>
                                </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="aspect-[4/5] rounded-[2rem] bg-zinc-900 overflow-hidden border border-white/5 group-hover:border-orange-500/30 transition-all shadow-2xl">
                             <img 
                               src={ev.imageUrl} 
                               alt={`Evolution v${ev.version}`} 
                               className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                             />
                           </div>
                           <div className="flex items-center justify-center gap-4 text-zinc-600">
                             <button className="hover:text-zinc-400 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                             <button className="hover:text-zinc-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center space-y-6">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-zinc-400">Penyimpangan Biologis Terdeteksi</h4>
                      <p className="text-sm text-zinc-600 max-w-xs mx-auto">Prompt ini belum berevolusi. Unggah hasil generasi AI pertama Anda untuk memulai siklus pelacakan.</p>
                    </div>
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-orange-500 transition-colors"
                    >
                      Mulai Iterasi Pertama
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-6 border border-dashed border-white/5 rounded-[3rem]">
               <ImageIcon className="w-12 h-12 text-zinc-800" />
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-500">Tidak Ada Target Ditentukan</h3>
                  <p className="text-sm text-zinc-700 max-w-xs leading-relaxed">Pilih prompt dari kolom kiri untuk melihat riwayat evolusinya atau buat cabang baru.</p>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
