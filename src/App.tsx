import React, { useState, useEffect } from 'react';
import { 
  NavTab, 
  ThemeMode, 
  WeddingEvent, 
  KanbanTask, 
  KanbanColumnId, 
  CalendarEvent 
} from './types';
import { 
  INITIAL_EVENTS, 
  INITIAL_KANBAN_TASKS, 
  CALENDAR_EVENTS 
} from './data/mockData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { EventCalendar } from './components/EventCalendar';
import { ProposalStudio } from './components/ProposalStudio';
import { SettingsView } from './components/SettingsView';
import { EventDetailModal } from './components/EventDetailModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  
  // Theme management: persisted in localStorage (supports both em_theme_mode and em_studio_theme_v1)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('em_theme_mode') || localStorage.getItem('em_studio_theme_v1');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeMode;
    }
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const [events, setEvents] = useState<WeddingEvent[]>(INITIAL_EVENTS);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_KANBAN_TASKS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS);

  // Modal state
  const [selectedEventModal, setSelectedEventModal] = useState<WeddingEvent | null>(null);

  // Sync theme to document element and keep both keys updated
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('em_theme_mode', themeMode);
    localStorage.setItem('em_studio_theme_v1', themeMode);

    if (themeMode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Kanban operations
  const handleUpdateTaskColumn = (taskId: string, targetColumn: KanbanColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: targetColumn } : t))
    );
  };

  const handleAddNewTask = (newTask: Omit<KanbanTask, 'id'>) => {
    const created: KanbanTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks((prev) => [created, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Calendar operations
  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0b0d11] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-500">
      
      {/* 
        HEADER: 
        - Theme toggle removed from plain header, kept cleanly inside profile dropdown
        - Updated navigation with Events Dashboard, Event Calendar, Progress Tracker, Proposal Studio, Settings
      */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        themeMode={themeMode}
        onSetThemeMode={setThemeMode}
      />

      {/* Main Full-Space Workspace View */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto">
        {currentTab === 'dashboard' && (
          <Dashboard
            events={events}
            onOpenEvent={(evt) => setSelectedEventModal(evt)}
            onNavigateTab={setCurrentTab}
            onNewEvent={() => setCurrentTab('proposals')}
          />
        )}

        {currentTab === 'calendar' && (
          <EventCalendar
            events={calendarEvents}
            weddingEvents={events}
            onOpenWeddingEvent={(evt) => setSelectedEventModal(evt)}
            onAddCalendarEvent={handleAddCalendarEvent}
          />
        )}

        {currentTab === 'tracker' && (
          <KanbanBoard
            tasks={tasks}
            events={events}
            onUpdateTaskColumn={handleUpdateTaskColumn}
            onAddNewTask={handleAddNewTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'proposals' && (
          <ProposalStudio />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            themeMode={themeMode}
            onSetThemeMode={setThemeMode}
          />
        )}
      </main>

      {/* Event Details Workspace Modal */}
      <EventDetailModal
        event={selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        onGoToTracker={(eventId) => {
          setSelectedEventModal(null);
          setCurrentTab('tracker');
        }}
      />

      {/* Minimal Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-[#0b0d11]/50 py-4 px-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1700px] mx-auto">
          <span>© {new Date().getFullYear()} Evidence Makers Cinema Studio. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Udaipur • Bangalore • Goa • Delhi</span>
            <span>•</span>
            <span className="text-amber-500 font-medium">Bespoke Wedding Heritage</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
