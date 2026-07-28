import React, { useState } from 'react';
import { Idea, ContentStatus } from '../types';
import { STATUS_LIST } from '../constants';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ContentPipelineProps {
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
}

export default function ContentPipeline({ ideas, setIdeas }: ContentPipelineProps) {
  const getIdeasByStatus = (status: ContentStatus) => ideas.filter(i => i.status === status);

  const updateStatus = (id: string, newStatus: ContentStatus) => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Lini Produksi</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Alur Konten</h1>
        </div>
        <div className="flex bg-zinc-900/50 p-1 rounded-full border border-white/5">
          <button className="px-6 py-2 rounded-full bg-white text-black text-xs font-bold transition-all">Tampilan Kanban</button>
          <button className="px-6 py-2 rounded-full text-zinc-500 text-xs font-bold hover:text-white transition-all">Tampilan Timeline</button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        {STATUS_LIST.map((status) => (
          <div key={status} className="w-80 shrink-0 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <h3 className="text-sm font-bold tracking-tight uppercase text-zinc-300">{status}</h3>
                <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                  {getIdeasByStatus(status).length}
                </span>
              </div>
              <button className="p-1 text-zinc-600 hover:text-zinc-400">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 min-h-[500px]">
              {getIdeasByStatus(status).map((idea) => (
                <KanbanCard 
                   key={idea.id} 
                   idea={idea} 
                   onStatusChange={(s) => updateStatus(idea.id, s)}
                />
              ))}
              {getIdeasByStatus(status).length === 0 && (
                <div className="h-24 border border-dashed border-white/5 rounded-3xl flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-700 font-bold">
                  Slot Kosong
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  idea: Idea;
  onStatusChange: (status: ContentStatus) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ idea, onStatusChange }) => {
  const [showMove, setShowMove] = useState(false);

  return (
    <motion.div 
      layout
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 25px rgba(249, 115, 22, 0.08)",
        borderColor: "rgba(249, 115, 22, 0.4)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 transition-colors cursor-default group relative"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
              {idea.niche}
            </span>
          </div>
          <button 
            onClick={() => setShowMove(!showMove)}
            className="p-1 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-600 hover:text-orange-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {showMove && (
          <div className="absolute top-12 right-6 z-20 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 w-40">
            {STATUS_LIST.filter(s => s !== idea.status).map(s => (
              <button 
                key={s} 
                onClick={() => { onStatusChange(s); setShowMove(false); }}
                className="w-full text-left p-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-white hover:text-black transition-all"
              >
                Pindahkan ke {s}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-1">
          <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{idea.title}</h4>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{idea.description}</p>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-600">
            <div className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">2</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">2d</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full bg-orange-600 border border-black" />
            <div className="w-5 h-5 rounded-full bg-zinc-800 border border-black flex items-center justify-center">
               <span className="text-[8px] font-bold">+</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
