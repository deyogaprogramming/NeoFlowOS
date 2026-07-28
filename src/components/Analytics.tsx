import { Idea, Prompt } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Activity, 
  Target, 
  Zap, 
  Trophy 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AnalyticsProps {
  ideas: Idea[];
  prompts: Prompt[];
}

export default function Analytics({ ideas, prompts }: AnalyticsProps) {
  const data = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 12 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 6 },
  ];

  const nicheData = [
    { name: 'Neo-Surreal', value: 40, color: '#f97316' },
    { name: 'Editorial', value: 30, color: '#fbbf24' },
    { name: 'Storytelling', value: 20, color: '#6366f1' },
    { name: 'Street', value: 10, color: '#a855f7' },
  ];

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Lapisan Metrik</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Vibe Intelligence</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <MetricSmall title="Tingkat Engage" value="84%" change="+4.2%" />
        <MetricSmall title="ROI Prompt" value="12.4" change="+0.8" />
        <MetricSmall title="Kecepatan Sinkron" value="2.1h" change="-12%" />
        <MetricSmall title="Kesehatan Aset" value="100%" change="0%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Creation Velocity */}
        <section className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Kecepatan Kreasi
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Bergulir 7h</span>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#525252', fontSize: 10, fontWeight: 'bold' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', color: '#f97316', fontWeight: 'bold', textTransform: 'uppercase' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]} 
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#f97316' : '#262626'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Niche Dominance */}
        <section className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-8">
           <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Dominasi Niche
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Pangsa Pasar</span>
          </div>

          <div className="flex items-center justify-center h-[250px]">
             <div className="w-full h-full flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nicheData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        {nicheData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4 px-4">
                 {nicheData.map((n) => (
                   <div key={n.name} className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: n.color }} />
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{n.name}</span>
                     <span className="text-xs font-mono font-bold ml-auto">{n.value}%</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[3rem] bg-orange-600 text-black flex items-center justify-between group overflow-hidden relative">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
               <Trophy className="w-5 h-5 fill-black" />
               <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-70">Pencapaian Mingguan</span>
            </div>
            <h3 className="text-3xl font-display font-bold leading-tight">Master Pencahayaan Neo-Noire.</h3>
            <p className="text-sm font-medium opacity-80 max-w-sm">
              12 prompt terakhir Anda secara konsisten mencapai mood target dengan presisi 94%. Pertahankan alur ini untuk membuka Tier-2.
            </p>
          </div>
          <Zap className="w-48 h-48 absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 transition-transform" />
        </div>

        <div className="p-8 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6">
           <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Pemisahan Platform</h3>
           <div className="space-y-6">
              {[
                { name: 'Instagram', value: 75, icon: 'IN' },
                { name: 'TikTok', value: 42, icon: 'TT' },
                { name: 'Portfolio', value: 18, icon: 'PF' },
              ].map(p => (
                <div key={p.name} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-zinc-300">{p.name}</span>
                    <span className="text-orange-500 font-mono">{p.value} Item</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, p.value * 1.2)}%` }}
                      className="h-full bg-orange-500/40"
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricSmall({ title, value, change }: { title: string, value: string, change: string }) {
  const isUp = change.includes('+');
  return (
    <div className="p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 space-y-1 group hover:border-white/10 transition-all">
      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest line-clamp-1">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className={cn(
          "text-[10px] font-mono font-bold",
          isUp ? "text-emerald-500" : "text-zinc-500"
        )}>
          {change}
        </div>
      </div>
    </div>
  );
}
