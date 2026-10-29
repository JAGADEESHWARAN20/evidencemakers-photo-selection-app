import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  KanbanSquare, 
  Sliders, 
  FileSpreadsheet, 
  LayoutDashboard, 
  Sun, 
  Moon, 
  Laptop, 
  ChevronDown, 
  Menu, 
  X, 
  Bell, 
  Sparkles, 
  Check, 
  User, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { NavTab, ThemeMode } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
  unreadNotifications?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  themeMode,
  onSetThemeMode,
  unreadNotifications = 3
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Events Dashboard',
      shortLabel: 'Events',
      icon: LayoutDashboard,
      badge: '4 Active'
    },
    {
      id: 'calendar' as NavTab,
      label: 'Event Calendar',
      shortLabel: 'Calendar',
      icon: Calendar,
      badge: 'Upcoming'
    },
    {
      id: 'tracker' as NavTab,
      label: 'Progress Tracker',
      shortLabel: 'Tracker',
      icon: KanbanSquare,
      badge: 'Kanban'
    },
    {
      id: 'proposals' as NavTab,
      label: 'Proposal Studio',
      shortLabel: 'Proposals',
      icon: FileSpreadsheet,
      badge: 'Architect'
    },
    {
      id: 'settings' as NavTab,
      label: 'Studio Settings',
      shortLabel: 'Settings',
      icon: Sliders
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0b0d11]/85 backdrop-blur-xl transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Identity / Monogram */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onSelectTab('dashboard')}
              className="group flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-[1.5px] shadow-sm shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950 text-amber-300 font-serif font-bold text-base tracking-wider">
                  EM
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                    EVIDENCE MAKERS
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Cinema Studio
                  </span>
                </div>
                <span className="hidden sm:block text-[11px] text-zinc-600 dark:text-zinc-400 font-medium tracking-wide">
                  Cinematic Wedding & Milestone Suite
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800/90 dark:text-amber-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                      isActive 
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' 
                        : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications Button */}
            <button 
              onClick={() => onSelectTab('calendar')}
              title="Notifications" 
              className="relative p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>

            {/* Profile / Studio Menu Dropdown (THEME MODE IS KEPT INSIDE HERE!) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 transition-all focus:outline-none"
                aria-expanded={profileDropdownOpen}
              >
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-bold text-xs shadow-sm">
                  JD
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                    Jagadeesh
                  </span>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Creative Director
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* The Dropdown Menu containing Theme Toggle & Options */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#12151c] shadow-2xl p-2.5 z-50 text-zinc-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* Studio User Header */}
                  <div className="px-3 py-2.5 mb-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Evidence Makers Studio</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Ops
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">ops@evidencemakers.com</p>
                  </div>

                  {/* THEME TOGGLE INSIDE DROPDOWN (Requirement: remove from header, keep inside dropdown) */}
                  <div className="p-2 mb-2 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Interface Theme</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-500">
                        {themeMode}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
                      <button
                        onClick={() => onSetThemeMode('light')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                          themeMode === 'light'
                            ? 'bg-amber-500 text-white shadow-sm font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => onSetThemeMode('dark')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                          themeMode === 'dark'
                            ? 'bg-amber-500 text-zinc-950 shadow-sm font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </button>
                      <button
                        onClick={() => onSetThemeMode('system')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                          themeMode === 'system'
                            ? 'bg-amber-500 text-zinc-950 shadow-sm font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Auto</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Links inside Dropdown */}
                  <div className="space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        onSelectTab('proposals');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Proposal Studio Architect</span>
                      </div>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Quotes</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectTab('tracker');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <KanbanSquare className="w-4 h-4 text-amber-500" />
                        <span>Production Kanban Board</span>
                      </div>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Stages</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        <span>Studio Settings & Config</span>
                      </div>
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between px-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <span>Evidence Makers v2.6 Pro</span>
                    <span className="text-emerald-500 font-medium">Sync Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0b0d11]/95 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          
          {/* Navigation Links for Mobile */}
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Theme Toggle Section - Inside Dropdown/Drawer, NOT cluttering top header */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Display Theme
              </span>
              <span className="text-xs text-amber-500 font-medium capitalize">
                {themeMode} Mode
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => onSetThemeMode('light')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                  themeMode === 'light'
                    ? 'bg-white text-zinc-900 shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => onSetThemeMode('dark')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                  themeMode === 'dark'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => onSetThemeMode('system')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                  themeMode === 'system'
                    ? 'bg-zinc-800 text-white shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Laptop className="w-4 h-4 text-zinc-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Quick Studio Info */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">Jagadeesh (Director)</p>
              <p className="text-[11px]">Bangalore & Udaipur Hub</p>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
              PRO OPS
            </span>
          </div>

        </div>
      )}
    </header>
  );
};
