import React, { useState } from 'react';
import { CalendarEvent, WeddingEvent } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Plus, 
  Sparkles, 
  Camera, 
  Film, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';

interface EventCalendarProps {
  events: CalendarEvent[];
  weddingEvents: WeddingEvent[];
  onOpenWeddingEvent: (event: WeddingEvent) => void;
  onAddCalendarEvent: (event: CalendarEvent) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  weddingEvents,
  onOpenWeddingEvent,
  onAddCalendarEvent
}) => {
  // Calendar state focused on Nov 2026 / current month
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-14');
  const [activeView, setActiveView] = useState<'month' | 'agenda'>('month');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New event schedule form
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('2026-11-20');
  const [formType, setFormType] = useState<CalendarEvent['type']>('wedding_shoot');
  const [formVenue, setFormVenue] = useState('');
  const [formTime, setFormTime] = useState('09:00 AM - 08:00 PM');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Generate days in month
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Padding previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevM = month === 0 ? 12 : month;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({ dayNum: day, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dayNum: d, dateStr, isCurrentMonth: true });
  }

  // Padding next month
  const remainingCells = 35 - calendarDays.length > 0 ? 35 - calendarDays.length : 42 - calendarDays.length;
  for (let n = 1; n <= remainingCells; n++) {
    const nextM = month === 11 ? 1 : month + 2;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
    calendarDays.push({ dayNum: n, dateStr, isCurrentMonth: false });
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter((e) => e.date === dateStr || (e.endDate && dateStr >= e.date && dateStr <= e.endDate));
  };

  const getTypeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'wedding_shoot':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'pre_wedding':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'delivery_deadline':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'client_meeting':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    onAddCalendarEvent({
      id: `cal-${Date.now()}`,
      title: formTitle,
      date: formDate,
      type: formType,
      venue: formVenue || 'Studio Production Desk',
      time: formTime
    });

    setFormTitle('');
    setFormVenue('');
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header of Calendar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Studio Production Calendar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Schedule & Shoots
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Master shoot timeline, multi-day destination coverage, edit milestones, and review deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher: Month vs Agenda */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setActiveView('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'month'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setActiveView('agenda')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'agenda'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Agenda View
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Shoot / Date</span>
          </button>
        </div>
      </div>

      {activeView === 'month' ? (
        /* 
          FULL SPACE CALENDAR MONTH VIEW
        */
        <div className="w-full rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#10131a] shadow-lg overflow-hidden flex flex-col">
          
          {/* Calendar Toolbar */}
          <div className="flex items-center justify-between p-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0c0e14]">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                {monthNames[month]} {year}
              </h2>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium hidden sm:inline">
                • {events.length} Scheduled Events
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonthDate(new Date(2026, 10, 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Names Grid */}
          <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 text-center text-xs font-bold uppercase tracking-wider py-2.5 text-zinc-400 dark:text-zinc-500 bg-zinc-50/30 dark:bg-[#0d0f15]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Grid Cells (occupying full space) */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-zinc-200 dark:divide-zinc-800/80 bg-zinc-100 dark:bg-zinc-900/20 min-h-[550px]">
            {calendarDays.map((calDay, idx) => {
              const dayEvents = getEventsForDate(calDay.dateStr);
              const isSelected = selectedDateStr === calDay.dateStr;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(calDay.dateStr)}
                  className={`min-h-[105px] sm:min-h-[120px] p-2 sm:p-2.5 flex flex-col justify-between transition-colors cursor-pointer ${
                    calDay.isCurrentMonth
                      ? 'bg-white dark:bg-[#11141c] hover:bg-amber-500/5 dark:hover:bg-amber-500/5'
                      : 'bg-zinc-50/50 dark:bg-[#0b0d12] text-zinc-400 opacity-60'
                  } ${isSelected ? 'ring-2 ring-amber-500 inset-0 z-10' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-semibold rounded-lg w-6 h-6 flex items-center justify-center ${
                      calDay.dateStr === '2026-11-14'
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {calDay.dayNum}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>

                  {/* Event Chips inside the day cell */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded-md truncate border ${getTypeStyle(ev.type)}`}
                        title={`${ev.title} (${ev.time || ''})`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-semibold pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* 
          AGENDA LIST VIEW (Occupies full width)
        */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Upcoming Studio Engagements & Deadlines
            </h3>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Chronological Order</span>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141c] p-4 sm:p-5 shadow-sm hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold font-serif leading-none mt-0.5">
                      {ev.date.split('-')[2]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getTypeStyle(ev.type)}`}>
                        {ev.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {ev.time && (
                        <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>{ev.time}</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {ev.title}
                    </h4>
                    {ev.venue && (
                      <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{ev.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {weddingEvents.find((we) => we.coupleName === ev.coupleName) && (
                    <button
                      onClick={() => {
                        const target = weddingEvents.find((we) => we.coupleName === ev.coupleName);
                        if (target) onOpenWeddingEvent(target);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-800 text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                    >
                      Open Event
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141c] p-6 shadow-2xl text-zinc-900 dark:text-zinc-100 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-serif font-bold">Schedule Calendar Date</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Event / Shoot Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya & Vikram Royal Udaipur Shoot Day 1"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="wedding_shoot">Wedding Shoot</option>
                    <option value="pre_wedding">Pre-Wedding Shoot</option>
                    <option value="delivery_deadline">Delivery Deadline</option>
                    <option value="client_meeting">Client Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Venue / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Taj Lake Palace, Udaipur"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Timing / Call-sheet
                </label>
                <input
                  type="text"
                  placeholder="e.g., 08:00 AM - 11:30 PM"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all shadow-md shadow-amber-500/20"
                >
                  Save Schedule
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
