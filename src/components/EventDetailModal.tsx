import React from 'react';
import { WeddingEvent } from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Film, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink,
  KanbanSquare,
  ChevronRight
} from 'lucide-react';

interface EventDetailModalProps {
  event: WeddingEvent | null;
  onClose: () => void;
  onGoToTracker: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onGoToTracker
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] shadow-2xl text-zinc-900 dark:text-zinc-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Photo Header */}
        <div className="relative h-56 sm:h-64 w-full bg-zinc-900 overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.coupleName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] via-[#10131a]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on cover */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                {event.eventStage}
              </span>
              <span className="text-xs text-zinc-300 font-medium">
                {event.dateDisplay} • {event.daysRemainingOrAgo}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-sm">
              {event.coupleName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Progress bar and milestone */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Current Milestone:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{event.currentMilestone}</span>
              </div>
              <span className="font-bold font-mono text-amber-500">{event.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${event.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Functions itinerary */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Celebration Functions Schedule:
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.functions.map((fn, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
                >
                  {fn}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Contracted Deliverables Status:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {event.deliverables.map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80"
                >
                  <span className="text-zinc-800 dark:text-zinc-200">{d.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    d.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : d.status === 'in_progress'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    {d.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Crew */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Assigned Cinema Crew & Directorship:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Cinematographer</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{event.leadCrew.cinematographer}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Lead Photographer</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{event.leadCrew.photographer}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Post Lead & Editor</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{event.leadCrew.editor}</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Total Contract: <span className="font-mono font-bold text-zinc-900 dark:text-amber-400">{event.totalInvestment}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onGoToTracker(event.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                <span>View in Progress Tracker</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
