import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Eye, 
  Palette, 
  Maximize, 
  Heart, 
  Ban, 
  Plus, 
  Trash2, 
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { VisualDNA as VisualDNAType } from '../types';

const INITIAL_DNA: VisualDNAType = {
  styleRules: ['Cinematic Neo-Noir', 'Hyper-real texture'],
  emotionalRules: ['Melancholic longing', 'Subtle futuristic anxiety'],
  framingRules: ['Heavy negative space', 'Rule of thirds with offset subject'],
  colorRules: ['Desaturated blues', 'High-contrast amber accents', 'Deep blacks'],
  forbiddenStyles: ['Oversaturated cyberpunk', 'Glossy AI skin', 'Chaotic compositions']
};

export default function VisualDNA() {
  const [dna, setDna] = useState<VisualDNAType>(() => {
    const saved = localStorage.getItem('neoflow_visual_dna');
    return saved ? JSON.parse(saved) : INITIAL_DNA;
  });

  useEffect(() => {
    localStorage.setItem('neoflow_visual_dna', JSON.stringify(dna));
  }, [dna]);

  const addRule = (category: keyof VisualDNAType) => {
    const categoryName = category === 'styleRules' ? 'Gaya' : 
                         category === 'emotionalRules' ? 'Emosional' : 
                         category === 'framingRules' ? 'Pembingkaian' : 
                         category === 'colorRules' ? 'Warna' : 'Terlarang';
    const newRule = window.prompt(`Tambah aturan ${categoryName} baru:`);
    if (newRule) {
      setDna({
        ...dna,
        [category]: [...dna[category], newRule]
      });
    }
  };

  const removeRule = (category: keyof VisualDNAType, index: number) => {
    const updated = [...dna[category]];
    updated.splice(index, 1);
    setDna({
      ...dna,
      [category]: updated
    });
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">Inti Utama</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Mesin DNA Visual</h1>
          <p className="mt-4 text-zinc-400 max-w-xl leading-relaxed">
            DNA Visual mendefinisikan hukum estetika yang tidak dapat diubah dari studio Anda. Hasil AI dan suntingan manusia harus selaras dengan parameter ini untuk menjaga kohesi merek.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
           <Zap className="w-5 h-5 text-accent animate-pulse" />
           <div className="text-xs font-bold uppercase tracking-widest text-zinc-300">Diterapkan Sistem</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <DNACard 
          title="Aturan Gaya" 
          icon={<Eye className="w-5 h-5" />}
          rules={dna.styleRules}
          onAdd={() => addRule('styleRules')}
          onRemove={(idx) => removeRule('styleRules', idx)}
          color="border-blue-500/30"
          accent="bg-blue-500"
        />
        <DNACard 
          title="Aturan Emosional" 
          icon={<Heart className="w-5 h-5" />}
          rules={dna.emotionalRules}
          onAdd={() => addRule('emotionalRules')}
          onRemove={(idx) => removeRule('emotionalRules', idx)}
          color="border-red-500/30"
          accent="bg-red-500"
        />
        <DNACard 
          title="Aturan Pembingkaian" 
          icon={<Maximize className="w-5 h-5" />}
          rules={dna.framingRules}
          onAdd={() => addRule('framingRules')}
          onRemove={(idx) => removeRule('framingRules', idx)}
          color="border-emerald-500/30"
          accent="bg-emerald-500"
        />
        <DNACard 
          title="Aturan Warna" 
          icon={<Palette className="w-5 h-5" />}
          rules={dna.colorRules}
          onAdd={() => addRule('colorRules')}
          onRemove={(idx) => removeRule('colorRules', idx)}
          color="border-accent/30"
          accent="bg-accent"
        />
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-500" />
            Gaya Terlarang (Daftar Hitam)
          </h3>
          <button 
            onClick={() => addRule('forbiddenStyles')}
            className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors"
          >
            Tambah Batasan
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <AnimatePresence>
            {dna.forbiddenStyles.map((rule, idx) => (
              <motion.div 
                key={rule}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group p-4 bg-red-950/10 border border-red-900/20 rounded-2xl flex items-center justify-between hover:bg-red-950/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-red-200/70">{rule}</span>
                </div>
                <button 
                  onClick={() => removeRule('forbiddenStyles', idx)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <div className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 flex items-start gap-6">
        <div className="p-4 bg-zinc-800 rounded-2xl text-accent">
           <Info className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-bold">Pengaruh DNA pada Arsitek Prompt</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Setiap aturan yang ditambahkan di sini secara otomatis disuntikkan ke dalam logika latar belakang Arsitek Prompt. Ini memastikan bahwa meskipun Anda tidak menyebutkannya secara eksplisit, AI tetap menghormati batasan "DNA Visual" Anda.
          </p>
        </div>
      </div>
    </div>
  );
}

function DNACard({ title, icon, rules, onAdd, onRemove, color, accent }: any) {
  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] bg-[#0a0a0a] border group transition-all duration-500",
      color || "border-white/5"
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl transition-colors", accent ? `${accent}/10 ${accent.replace('bg-', 'text-')}` : "bg-white/5 text-zinc-500")}>
            {icon}
          </div>
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        </div>
        <button 
          onClick={onAdd}
          className="p-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <ul className="space-y-3">
        <AnimatePresence>
          {rules.map((rule: string, idx: number) => (
            <motion.li 
              key={rule}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-white/5 group/item hover:border-white/10 transition-all font-mono"
            >
              <span className="text-xs text-zinc-300 italic">"{rule}"</span>
              <button 
                onClick={() => onRemove(idx)}
                className="opacity-0 group-item-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
