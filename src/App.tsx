/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Terminal, 
  Database, 
  Trello, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  User,
  Hash,
  Fingerprint,
  History,
  Scan,
  LogOut,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Idea, Prompt, Reference } from './types';
import { INITIAL_IDEAS, INITIAL_PROMPTS, INITIAL_REFERENCES } from './constants';
import { FirebaseProvider, useFirebase } from './components/FirebaseProvider';
import { login, logout } from './lib/firebase';

// Pages
import Dashboard from './components/Dashboard';
import QuickCapture from './components/QuickCapture';
import PromptBuilder from './components/PromptBuilder';
import ReferenceVault from './components/ReferenceVault';
import ContentPipeline from './components/ContentPipeline';
import Analytics from './components/Analytics';
import SettingsView from './components/SettingsView';
import CaptionGenerator from './components/CaptionGenerator';
import VisualDNA from './components/VisualDNA';
import PromptEvolution from './components/PromptEvolution';
import MoodboardIntelligence from './components/MoodboardIntelligence';

type View = 'dashboard' | 'capture' | 'prompt-builder' | 'vault' | 'pipeline' | 'analytics' | 'settings' | 'captions' | 'visual-dna' | 'evolution' | 'moodboard';

export type Theme = 'dark' | 'light';
export type AccentColor = 'orange' | 'blue' | 'purple' | 'emerald' | 'rose';

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useFirebase();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('neoflow_theme') as Theme) || 'dark';
  });
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('neoflow_accent') as AccentColor) || 'orange';
  });
  
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('neoflow_ideas');
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });
  const [prompts, setPrompts] = useState<Prompt[]>(() => {
    const saved = localStorage.getItem('neoflow_prompts');
    return saved ? JSON.parse(saved) : INITIAL_PROMPTS;
  });
  const [references, setReferences] = useState<Reference[]>(() => {
    const saved = localStorage.getItem('neoflow_references');
    return saved ? JSON.parse(saved) : INITIAL_REFERENCES;
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem('neoflow_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('neoflow_prompts', JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem('neoflow_references', JSON.stringify(references));
  }, [references]);

  useEffect(() => {
    localStorage.setItem('neoflow_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('neoflow_accent', accentColor);
    document.documentElement.dataset.accent = accentColor;
  }, [accentColor]);

  const navItems = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'visual-dna', label: 'Mesin DNA', icon: Fingerprint },
    { id: 'moodboard', label: 'Moodboard', icon: Scan },
    { id: 'capture', label: 'Tangkapan', icon: PlusCircle },
    { id: 'prompt-builder', label: 'Studio', icon: Terminal },
    { id: 'evolution', label: 'Evolusi', icon: History },
    { id: 'pipeline', label: 'Alur Kerja', icon: Trello },
    { id: 'vault', label: 'Brankas', icon: Database },
    { id: 'analytics', label: 'Wawasan', icon: BarChart3 },
    { id: 'captions', label: 'Keterangan', icon: Hash },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-accent/30 transition-colors duration-500",
      theme === 'dark' ? "bg-[#050505] text-white" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Sidebar for Desktop */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-20 lg:w-64 border-r hidden md:flex flex-col z-50 transition-colors duration-500",
        theme === 'dark' ? "bg-[#0a0a0a] border-white/5" : "bg-white border-zinc-200"
      )}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-accent to-accent-light rounded-lg shadow-lg shadow-accent/20 flex items-center justify-center font-bold text-white text-sm">
            NF
          </div>
          <span className={cn(
            "hidden lg:block font-display font-bold tracking-tighter text-xl",
            theme === 'dark' ? "text-white" : "text-black"
          )}>NeoFlow OS</span>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? theme === 'dark' 
                      ? "bg-white/10 text-accent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                      : "bg-zinc-100 text-accent"
                    : theme === 'dark'
                      ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-accent rounded-r-full" />}
              </button>
            );
          })}
        </nav>

        <div className={cn("p-6 border-t font-display", theme === 'dark' ? "border-white/5" : "border-zinc-200")}>
          <div className="flex items-center gap-3 px-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center overflow-hidden", theme === 'dark' ? "bg-zinc-800" : "bg-zinc-200")}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <User className={cn("w-4 h-4", theme === 'dark' ? "text-zinc-400" : "text-zinc-600")} />
              )}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{user?.displayName || 'Direktur Kreatif'}</div>
              <div className={cn("text-[10px] uppercase tracking-widest font-mono", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>
                {user ? 'Cloud Sync Aktif' : 'Mode Lokal'}
              </div>
            </div>
            {user && (
              <button 
                onClick={logout}
                className="hidden lg:block p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          {!user && (
            <button 
              onClick={login}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-accent text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all hidden lg:flex"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login Cloud
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-20 lg:ml-64 min-h-screen pb-24 md:pb-0">
        {/* Top Header */}
        <header className={cn(
          "sticky top-0 z-40 backdrop-blur-xl border-b px-6 md:px-12 py-4 flex items-center justify-between gap-4 transition-colors duration-500",
          theme === 'dark' ? "bg-[#050505]/80 border-white/5" : "bg-white/80 border-zinc-200"
        )}>
          <div className="flex-1 md:max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-accent" />
              <input 
                type="text" 
                placeholder="Cari ide, prompt, atau aset..." 
                className={cn(
                  "w-full border rounded-full pl-10 pr-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20",
                  theme === 'dark' 
                    ? "bg-zinc-900/50 border-white/5 text-zinc-300 focus:bg-zinc-900" 
                    : "bg-zinc-100 border-zinc-200 text-zinc-900 focus:bg-white"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className={cn("p-2 transition-colors relative", theme === 'dark' ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-900")}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-current shadow-lg"></span>
            </button>
            <div className={cn("h-4 w-px hidden sm:block", theme === 'dark' ? "bg-white/10" : "bg-zinc-200")}></div>
            <div className="text-right hidden sm:block">
              <div className={cn("text-[10px] uppercase tracking-tighter font-bold", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>Ruang Kerja</div>
              <div className="text-xs font-semibold">Studio Neo-Noire</div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {activeView === 'dashboard' && (
                <Dashboard 
                  ideas={ideas} 
                  prompts={prompts} 
                  setActiveView={setActiveView} 
                />
              )}
              {activeView === 'capture' && (
                <QuickCapture 
                  onSave={(idea) => setIdeas([idea, ...ideas])}
                  setActiveView={setActiveView}
                />
              )}
              {activeView === 'prompt-builder' && (
                <PromptBuilder 
                  onSave={(prompt) => setPrompts([prompt, ...prompts])}
                  ideas={ideas}
                />
              )}
              {activeView === 'pipeline' && (
                <ContentPipeline 
                  ideas={ideas}
                  setIdeas={setIdeas}
                />
              )}
              {activeView === 'vault' && (
                <ReferenceVault 
                  references={references}
                  setReferences={setReferences}
                />
              )}
              {activeView === 'analytics' && (
                <Analytics 
                  ideas={ideas}
                  prompts={prompts}
                />
              )}
              {activeView === 'captions' && (
                <CaptionGenerator />
              )}
              {activeView === 'visual-dna' && (
                <VisualDNA />
              )}
              {activeView === 'evolution' && (
                <PromptEvolution prompts={prompts} />
              )}
              {activeView === 'moodboard' && (
                <MoodboardIntelligence />
              )}
              {activeView === 'settings' && (
                <SettingsView 
                  theme={theme} 
                  setTheme={setTheme} 
                  accentColor={accentColor} 
                  setAccentColor={setAccentColor} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 h-16 backdrop-blur-2xl border-t md:hidden z-50 flex items-center justify-around px-2 transition-colors duration-500",
        theme === 'dark' ? "bg-[#0a0a0a]/90 border-white/5" : "bg-white/90 border-zinc-200"
      )}>
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive ? "text-accent" : "text-zinc-500"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-tighter font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
