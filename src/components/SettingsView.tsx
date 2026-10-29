import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { 
  Sliders, 
  Sun, 
  Moon, 
  Laptop, 
  ShieldCheck, 
  Camera, 
  HardDrive, 
  FileText, 
  Check, 
  Sparkles, 
  Save, 
  Users, 
  BellRing
} from 'lucide-react';

interface SettingsViewProps {
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  themeMode,
  onSetThemeMode
}) => {
  const [studioName, setStudioName] = useState('Evidence Makers');
  const [leadName, setLeadName] = useState('Jagadeesh');
  const [leadRole, setLeadRole] = useState('Founder & Lead Cinematographer');
  const [primaryHub, setPrimaryHub] = useState('Bangalore & Udaipur, India');
  const [defaultCurrency, setDefaultCurrency] = useState('INR (₹)');
  const [defaultGSTRate, setDefaultGSTRate] = useState(18);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Settings Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Studio Configuration & Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Ops Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Global studio preferences, visual appearance, cinema camera inventory, and quotation financial formulas.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Studio Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Main Settings Full Space Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: General Profile & Theme (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Theme & Display Mode Card */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                  Visual Appearance & Theme
                </h3>
              </div>
              <span className="text-xs text-amber-500 font-semibold uppercase">{themeMode} Mode</span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Toggle between high-contrast dark cinema mode or daylight mode. Theme is also accessible inside the header profile dropdown.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onSetThemeMode('light')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  themeMode === 'light'
                    ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Light Mode</span>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Clean Editorial</span>
              </button>

              <button
                type="button"
                onClick={() => onSetThemeMode('dark')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  themeMode === 'dark'
                    ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="p-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-700 shadow-sm">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Dark Cinema</span>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Low-Glare Suite</span>
              </button>

              <button
                type="button"
                onClick={() => onSetThemeMode('system')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  themeMode === 'system'
                    ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">System Auto</span>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Device Match</span>
              </button>
            </div>
          </div>

          {/* Studio Profile Card */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Studio Brand Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Studio Name
                </label>
                <input
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Primary Production Hubs
                </label>
                <input
                  type="text"
                  value={primaryHub}
                  onChange={(e) => setPrimaryHub(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Creative Director & Lead
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Official Designation
                </label>
                <input
                  type="text"
                  value={leadRole}
                  onChange={(e) => setLeadRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Commercial & Storage Rules (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Commercial & Quotation Formula defaults */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <FileText className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Commercial Defaults
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Primary Currency Symbol
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                  <option value="USD ($)">USD ($ - US Dollar)</option>
                  <option value="EUR (€)">EUR (€ - Euro)</option>
                  <option value="AED (د.إ)">AED (د.إ - UAE Dirham)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Default GST / Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={defaultGSTRate}
                  onChange={(e) => setDefaultGSTRate(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Default Payment Milestones:</span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">40% Retainer • 40% On Shoot • 20% On Final Delivery</p>
              </div>
            </div>
          </div>

          {/* Backup & Redundancy Security */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <HardDrive className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Storage & Redundancy
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Dual NAS Sync</span>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Automatic offload to onsite Synology RAID 10</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  CONNECTED
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Frame.io Client Portal</span>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Draft v1 & v2 review link generation</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  AUTHENTICATED
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Studio Preferences</span>
              </button>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
};
