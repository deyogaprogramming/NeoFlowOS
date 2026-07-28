import { Reference } from '../types';
import { 
  Plus, 
  ExternalLink, 
  Tag, 
  Search, 
  Filter,
  Image,
  Palette,
  Link2,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface ReferenceVaultProps {
  references: Reference[];
  setReferences: (refs: Reference[]) => void;
}

export default function ReferenceVault({ references, setReferences }: ReferenceVaultProps) {
  const [filter, setFilter] = useState<string>('all');
  
  const filtered = filter === 'all' 
    ? references 
    : references.filter(r => r.category === filter);

  const categories = [
    { id: 'all', label: 'Semua Aset', icon: Search },
    { id: 'visual', label: 'Ref Visual', icon: Image },
    { id: 'color', label: 'Spek Warna', icon: Palette },
    { id: 'account', label: 'Akun', icon: ExternalLink },
    { id: 'mood', label: 'Suasana (Mood)', icon: Filter },
    { id: 'insight', label: 'Wawasan', icon: FileText },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Bank Memori</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Brankas Referensi</h1>
        </div>
        <button className="px-8 py-3 bg-zinc-900 border border-white/10 text-white font-bold rounded-full hover:bg-zinc-800 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5 text-orange-500" />
          Setor Aset
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border bg-zinc-900",
              filter === cat.id 
                ? "border-orange-500 text-orange-400 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
                : "border-white/5 text-zinc-500 hover:border-white/20"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ref) => (
          <motion.div
            key={ref.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-zinc-900 rounded-2xl group-hover:bg-orange-600/10 group-hover:text-orange-500 transition-all">
                  <CategoryIcon category={ref.category} />
                </div>
                <a 
                  href={ref.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 text-zinc-700 hover:text-white transition-colors"
                >
                  <Link2 className="w-5 h-5" />
                </a>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">{ref.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 italic">"{ref.notes}"</p>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-white/5 flex flex-wrap gap-2">
              {ref.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1 group-hover:border-zinc-700 transition-all">
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: Reference['category'] }) {
  switch (category) {
    case 'visual': return <Image className="w-6 h-6" />;
    case 'color': return <Palette className="w-6 h-6" />;
    case 'account': return <ExternalLink className="w-6 h-6" />;
    case 'mood': return <Filter className="w-6 h-6" />;
    case 'insight': return <FileText className="w-6 h-6" />;
    default: return <Link2 className="w-6 h-6" />;
  }
}
