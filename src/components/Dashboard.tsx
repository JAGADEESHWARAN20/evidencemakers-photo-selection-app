import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Film, 
  Sparkles, 
  Filter, 
  Search, 
  Plus, 
  Camera,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  CheckCheck
} from 'lucide-react';
import { WeddingEvent } from '../types';

interface DashboardProps {
  events: WeddingEvent[];
  onOpenEvent: (event: WeddingEvent) => void;
  onNavigateTab: (tab: any) => void;
  onNewEvent: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  events,
  onOpenEvent,
  onNavigateTab,
  onNewEvent
}) => {
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter((evt) => {
    const matchesFilter = filterStage === 'all' || evt.eventStage.toLowerCase().includes(filterStage.toLowerCase());
    const matchesSearch = 
      evt.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner: Minimal, occupying full width, high aesthetic density */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800/90 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
        {/* Subtle decorative glow & background wedding motif */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence Makers • Studio Production Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-zinc-100">
              Capturing Timeless Heirlooms & Cinematic Legends
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
              Real-time pipeline monitoring across pre-production, 4K shoot days, DaVinci color grading, and final luxury heirloom delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('proposals')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-zinc-950 group-hover:rotate-12 transition-transform" />
              <span>Proposal Studio</span>
            </button>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-200 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 transition-all flex items-center gap-2"
            >
              <span>Production Kanban</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Studio Real-time Metrics (Occupying full width) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Active Events</span>
            <span className="text-2xl font-bold font-serif text-amber-400 mt-1">4 Weddings</span>
            <span className="text-[11px] text-zinc-400">All crew deployed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Next Shoot</span>
            <span className="text-2xl font-bold font-serif text-white mt-1">14 Nov</span>
            <span className="text-[11px] text-amber-400">Udaipur Palace</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">In Post-Production</span>
            <span className="text-2xl font-bold font-serif text-white mt-1">2 Master Cuts</span>
            <span className="text-[11px] text-zinc-400">4K DaVinci Resolve</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Total Studio Pipeline</span>
            <span className="text-2xl font-bold font-serif text-amber-400 mt-1">₹ 17.3 L</span>
            <span className="text-[11px] text-emerald-400 font-medium">100% on schedule</span>
          </div>
        </div>
      </div>

      {/* Control & Search Bar - Clean, Minimalist, Full-Width */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search couple, city, or venue..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'pre-production', label: 'Pre-Production' },
            { id: 'culling', label: 'Culling & Raw' },
            { id: 'post-production', label: 'Post-Production' },
            { id: 'review', label: 'Client Review' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterStage(pill.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterStage === pill.id
                  ? 'bg-zinc-900 text-white dark:bg-amber-500 dark:text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 
        =============================================================================
        EVENT CARDS SECTION (EXACT USER SPECIFICATION):
        1. Date of event happened/happening
        2. Followed below by header full width
        3. Below that progress bar full width with percentage at right above progress bar
        4. Below progress bar show open button
        =============================================================================
      */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Active Wedding Productions
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {filteredEvents.length} Projects
            </span>
          </div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Full-width minimal layout
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <Film className="w-12 h-12 mx-auto text-zinc-400 mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No events found</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Try adjusting your search query or filter stage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.map((evt) => {
              return (
                <div
                  key={evt.id}
                  className="group relative overflow-hidden rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-gradient-to-b dark:from-[#11141c] dark:to-[#0d0f14] shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 p-6 sm:p-7"
                >
                  {/* Subtle ambient corner decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

                  {/* 
                    ELEMENT 1: DATE OF EVENT HAPPENED / HAPPENING 
                    Displayed prominently at the top
                  */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                          {evt.dateDisplay}
                        </span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">•</span>
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {evt.daysRemainingOrAgo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        {evt.eventStage}
                      </span>
                    </div>
                  </div>

                  {/* 
                    ELEMENT 2: HEADER FULL WIDTH
                    Header spanning full width below the date
                  */}
                  <div className="w-full pt-4 pb-4 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h3 className="w-full text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                        {evt.coupleName}
                      </h3>
                      <span className="shrink-0 text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                        {evt.totalInvestment}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{evt.venue}</span>
                        <span>• {evt.city}</span>
                      </div>
                      <span className="hidden sm:inline text-zinc-400">•</span>
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Lead: {evt.leadCrew.cinematographer}</span>
                      </div>
                    </div>
                  </div>

                  {/* 
                    ELEMENT 3: PROGRESS BAR FULL WIDTH WITH PERCENTAGE AT RIGHT ABOVE PROGRESS BAR
                    (Exact user requirement!)
                  */}
                  <div className="w-full pt-2 pb-5 space-y-2">
                    {/* Header line above progress bar: Left is milestone description, Right is the percentage */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Current Milestone:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-semibold truncate max-w-[220px] sm:max-w-md">
                          {evt.currentMilestone}
                        </span>
                      </div>
                      {/* Percentage at right above progress bar */}
                      <span className="font-bold font-mono text-sm text-amber-600 dark:text-amber-400 shrink-0">
                        {evt.progressPercent}%
                      </span>
                    </div>

                    {/* The Full Width Progress Bar */}
                    <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-200/80 dark:border-zinc-700/50 shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-sm transition-all duration-700 ease-out"
                        style={{ width: `${evt.progressPercent}%` }}
                      />
                    </div>

                    {/* Deliverables mini badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                      {evt.deliverables.map((deliv, idx) => (
                        <span 
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                            deliv.status === 'completed' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium' 
                              : deliv.status === 'in_progress' 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500'
                          }`}
                        >
                          {deliv.status === 'completed' && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                          {deliv.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 
                    ELEMENT 4: BELOW PROGRESS BAR SHOW OPEN BUTTON
                    (Exact user requirement!)
                  */}
                  <div className="w-full pt-1">
                    <button
                      onClick={() => onOpenEvent(evt)}
                      className="w-full group/btn relative flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-400 dark:hover:text-zinc-950 font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] border border-zinc-800 dark:border-zinc-700"
                    >
                      <span>Open Event Workspace</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
