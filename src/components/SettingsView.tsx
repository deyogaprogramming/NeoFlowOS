import { Settings, Shield, Sliders, Hash, Download, Trash2, Cpu, Sun, Moon, Palette, CheckCircle2, LogIn, LogOut, Cloud } from 'lucide-react';
import { cn } from '../lib/utils';
import { Theme, AccentColor } from '../App';
import { motion } from 'motion/react';
import { useFirebase } from './FirebaseProvider';
import { login, logout } from '../lib/firebase';

interface SettingsViewProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

export default function SettingsView({ theme, setTheme, accentColor, setAccentColor }: SettingsViewProps) {
  const { user } = useFirebase();
  const accentColors: { id: AccentColor; color: string }[] = [
    { id: 'orange', color: 'bg-orange-500' },
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'purple', color: 'bg-purple-500' },
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'rose', color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={cn(
            "text-[10px] uppercase tracking-[0.3em] font-bold mb-2",
            theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
          )}>Konfigurasi Inti</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Pengaturan Sistem</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <aside className="space-y-1">
          <SettingNav icon={<Sliders className="w-4 h-4" />} label="Studio Umum" active theme={theme} />
          <SettingNav icon={<Hash className="w-4 h-4" />} label="Niche & Tag" theme={theme} />
          <SettingNav icon={<Cpu className="w-4 h-4" />} label="API Mesin AI" theme={theme} />
          <SettingNav icon={<Shield className="w-4 h-4" />} label="Keamanan" theme={theme} />
          <SettingNav icon={<Download className="w-4 h-4" />} label="Manajemen Data" theme={theme} />
        </aside>

        <div className="md:col-span-2 space-y-8">
          <section className={cn(
            "p-8 rounded-[3rem] border space-y-8 transition-colors duration-500",
            theme === 'dark' ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50"
          )}>
            <h3 className={cn("text-xl font-bold tracking-tight border-b pb-4", theme === 'dark' ? "border-white/5" : "border-zinc-100")}>Sinkronisasi Cloud</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-accent/5 border border-accent/10">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Cloud className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="text-lg font-bold">{user ? 'Terhubung ke Cloud' : 'Mode Penyimpanan Lokal'}</div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {user 
                    ? `Data Anda disinkronkan ke akun ${user.email}. Anda dapat mengakses draf Anda dari perangkat mana pun.`
                    : 'Masuk dengan Google untuk mengaktifkan pencadangan otomatis dan sinkronisasi antar perangkat.'}
                </p>
              </div>
              <button 
                onClick={user ? logout : login}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                  user 
                    ? "bg-zinc-800 text-white hover:bg-zinc-700" 
                    : "bg-accent text-white hover:brightness-110"
                )}
              >
                {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {user ? 'Putuskan' : 'Hubungkan'}
              </button>
            </div>
          </section>

          <section className={cn(
            "p-8 rounded-[3rem] border space-y-8 transition-colors duration-500",
            theme === 'dark' ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50"
          )}>
            <h3 className={cn("text-xl font-bold tracking-tight border-b pb-4", theme === 'dark' ? "border-white/5" : "border-zinc-100")}>Personalisasi</h3>
            
            <div className="space-y-10">
              {/* Theme Toggle */}
              <div className="space-y-4">
                <label className={cn("text-xs font-mono uppercase tracking-widest ml-2", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>Tema Visual</label>
                <div className={cn("grid grid-cols-2 gap-4 p-1.5 rounded-[2rem]", theme === 'dark' ? "bg-zinc-800/50" : "bg-zinc-100")}>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex items-center justify-center gap-3 py-3 rounded-[1.5rem] text-sm font-bold transition-all",
                      theme === 'dark' ? "bg-zinc-700 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    <Moon className="w-4 h-4" />
                    Mode Gelap
                  </button>
                  <button 
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex items-center justify-center gap-3 py-3 rounded-[1.5rem] text-sm font-bold transition-all",
                      theme === 'light' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    <Sun className="w-4 h-4" />
                    Mode Terang
                  </button>
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-4">
                <label className={cn("text-xs font-mono uppercase tracking-widest ml-2", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>Warna Utama</label>
                <div className="flex flex-wrap gap-4">
                  {accentColors.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAccentColor(item.id)}
                      className={cn(
                        "w-12 h-12 rounded-2xl transition-all relative flex items-center justify-center",
                        item.color,
                        accentColor === item.id ? "scale-110 shadow-lg ring-4 ring-offset-2 ring-offset-current ring-current" : "opacity-60 hover:opacity-100 hover:scale-105"
                      )}
                    >
                      {accentColor === item.id && <CheckCircle2 className="w-6 h-6 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={cn("text-xs font-mono uppercase tracking-widest ml-2", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>Identitas Studio</label>
                <input 
                  type="text" 
                  defaultValue="Studio Neo-Noire" 
                  className={cn(
                    "w-full rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all border border-transparent",
                    theme === 'dark' ? "bg-zinc-800/50 text-white" : "bg-zinc-100 text-zinc-900"
                  )}
                />
              </div>

              <div className={cn(
                "flex items-center justify-between p-6 rounded-[2rem] border transition-colors",
                theme === 'dark' ? "bg-accent/10 border-accent/20" : "bg-accent/5 border-accent/10"
              )}>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-accent uppercase tracking-widest leading-none">Sinkron Otomatis</div>
                  <div className={cn("text-sm font-medium", theme === 'dark' ? "text-zinc-300" : "text-zinc-600")}>Sinkronisasi cadangan cloud setiap 5 menit.</div>
                </div>
                <div className="w-12 h-6 bg-accent rounded-full relative flex items-center px-1">
                  <div className={cn("w-4 h-4 rounded-full ml-auto", theme === 'dark' ? "bg-black" : "bg-white")} />
                </div>
              </div>
            </div>
          </section>

          <section className={cn(
            "p-8 rounded-[3rem] border space-y-8 transition-colors duration-500",
            theme === 'dark' ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50"
          )}>
             <h3 className={cn("text-xl font-bold tracking-tight border-b pb-4", theme === 'dark' ? "border-white/5" : "border-zinc-100")}>Persistensi Data</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className={cn(
                  "p-6 rounded-[2rem] border text-left transition-all space-y-2 group",
                  theme === 'dark' ? "bg-zinc-800/50 border-white/5 hover:bg-zinc-800" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                )}>
                   <Download className="w-6 h-6 text-accent" />
                   <div className="text-sm font-bold">Ekspor JSON</div>
                   <div className={cn("text-[10px] uppercase font-bold", theme === 'dark' ? "text-zinc-500" : "text-zinc-400")}>Cadangkan semua data sistem</div>
                </button>
                <button className={cn(
                  "p-6 rounded-[2rem] border text-left transition-all space-y-2 group",
                  theme === 'dark' ? "bg-red-950/20 border-red-500/10 hover:bg-red-950/40" : "bg-red-50 border-red-200 hover:bg-red-100"
                )}>
                   <Trash2 className="w-6 h-6 text-red-500" />
                   <div className="text-sm font-bold text-red-400">Hapus Data</div>
                   <div className={cn("text-[10px] uppercase font-bold", theme === 'dark' ? "text-zinc-700" : "text-zinc-400")}>Bersihkan cache penyimpanan lokal</div>
                </button>
             </div>
          </section>

          <div className="text-center">
            <p className={cn("text-[10px] font-mono uppercase tracking-[0.4em]", theme === 'dark' ? "text-zinc-700" : "text-zinc-400")}>NeoFlow OS &copy; 2026 // Production Grade Build v1.0.4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingNav({ icon, label, active, theme }: { icon: any, label: string, active?: boolean, theme: Theme }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
      active 
        ? theme === 'dark' ? "bg-white text-black" : "bg-zinc-900 text-white" 
        : theme === 'dark' ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
    )}>
      {icon}
      {label}
    </button>
  );
}
