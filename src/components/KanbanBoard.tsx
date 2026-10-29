import React, { useState } from 'react';
import { 
  KanbanColumnId, 
  KanbanTask, 
  WeddingEvent 
} from '../types';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronLeft, 
  MoveRight, 
  Filter, 
  Calendar, 
  User, 
  X, 
  Layers,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  events: WeddingEvent[];
  onUpdateTaskColumn: (taskId: string, targetColumn: KanbanColumnId) => void;
  onAddNewTask: (task: Omit<KanbanTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMNS: { id: KanbanColumnId; title: string; subtitle: string; color: string }[] = [
  { id: 'pre_production', title: 'Pre-Production', subtitle: 'Recce & Moodboards', color: 'from-blue-500/20 to-blue-600/5' },
  { id: 'production', title: 'Shoot & Production', subtitle: 'Live Coverage & Drone', color: 'from-amber-500/20 to-amber-600/5' },
  { id: 'culling', title: 'Culling & Raw NAS', subtitle: 'Dual Backup & Selects', color: 'from-purple-500/20 to-purple-600/5' },
  { id: 'post_production', title: 'Post-Production', subtitle: '4K Cut & Color LUTs', color: 'from-emerald-500/20 to-emerald-600/5' },
  { id: 'review', title: 'Client Review', subtitle: 'Frame.io & Approvals', color: 'from-rose-500/20 to-rose-600/5' },
  { id: 'delivery', title: 'Final Delivery', subtitle: 'USB Vault & Albums', color: 'from-teal-500/20 to-teal-600/5' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  events,
  onUpdateTaskColumn,
  onAddNewTask,
  onDeleteTask
}) => {
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskEventId, setNewTaskEventId] = useState(events[0]?.id || '');
  const [newTaskColumn, setNewTaskColumn] = useState<KanbanColumnId>('pre_production');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'normal'>('high');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Jagadeesh');
  const [newTaskDueDate, setNewTaskDueDate] = useState('15 Nov 2026');

  const filteredTasks = tasks.filter((t) => {
    const matchesEvent = selectedEventFilter === 'all' || t.eventId === selectedEventFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || t.priority === selectedPriorityFilter;
    return matchesEvent && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const matchedEvent = events.find((e) => e.id === newTaskEventId);

    onAddNewTask({
      eventId: newTaskEventId,
      eventTitle: matchedEvent ? matchedEvent.coupleName : 'General Production',
      title: newTaskTitle,
      description: newTaskDesc || 'Production milestone',
      columnId: newTaskColumn,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      assignee: {
        name: newTaskAssignee,
        role: newTaskAssignee === 'Jagadeesh' ? 'Lead Cinematographer' : 'Editor',
        avatar: newTaskAssignee.slice(0, 2).toUpperCase()
      },
      tags: ['Production', 'Sprint'],
      subtasksCompleted: 0,
      subtasksTotal: 3
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsModalOpen(false);
  };

  const getPriorityBadge = (priority: KanbanTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">Normal</span>;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Header bar of Progress Tracker: Occupies full space, minimal & premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Production Progress Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Kanban Ops
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            End-to-end milestone workflow from equipment preparation to final heirloom delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by wedding event */}
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">All Weddings ({events.length})</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.coupleName}</option>
            ))}
          </select>

          {/* Filter by priority */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* 
        KANBAN BOARD: FULL SPACE OCCUPYING LAYOUT
        Horizontal scrolling with 6 full-height columns
      */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="flex gap-4 sm:gap-5 min-w-[1400px]">
          {COLUMNS.map((col, colIdx) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === col.id);
            return (
              <div
                key={col.id}
                className="flex-1 min-w-[280px] max-w-[340px] flex flex-col rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-[#0f1218] p-3 sm:p-4 backdrop-blur-md"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        {col.title}
                      </span>
                      <span className="w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {colTasks.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {col.subtitle}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setNewTaskColumn(col.id);
                      setIsModalOpen(true);
                    }}
                    className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    title="Add task to this stage"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Task Cards */}
                <div className="flex-1 space-y-3 min-h-[450px]">
                  {colTasks.length === 0 ? (
                    <div className="h-44 border-2 border-dashed border-zinc-200 dark:border-zinc-800/70 rounded-2xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 p-4 text-center">
                      <Layers className="w-6 h-6 mb-2 stroke-[1.5]" />
                      <span className="text-xs font-medium">Stage Idle</span>
                      <span className="text-[11px] mt-0.5">No active tasks in this phase</span>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#141822] p-4 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-200 space-y-2.5"
                      >
                        {/* Event tag & priority */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 truncate max-w-[160px]">
                            {task.eventTitle}
                          </span>
                          {getPriorityBadge(task.priority)}
                        </div>

                        {/* Title & description */}
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors line-clamp-2">
                            {task.title}
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Progress of subtasks */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                            <span>Checklist items</span>
                            <span className="font-mono">{task.subtasksCompleted}/{task.subtasksTotal}</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${(task.subtasksCompleted / task.subtasksTotal) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Assignee & Due Date */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center">
                              {task.assignee.avatar}
                            </div>
                            <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{task.assignee.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                        {/* Stage Transition Quick Actions */}
                        <div className="pt-2 flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          {colIdx > 0 && (
                            <button
                              onClick={() => onUpdateTaskColumn(task.id, COLUMNS[colIdx - 1].id)}
                              className="p-1 rounded-md text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-0.5"
                              title={`Move to ${COLUMNS[colIdx - 1].title}`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Back</span>
                            </button>
                          )}
                          <div className="flex-1" />
                          {colIdx < COLUMNS.length - 1 && (
                            <button
                              onClick={() => onUpdateTaskColumn(task.id, COLUMNS[colIdx + 1].id)}
                              className="px-2 py-1 rounded-md text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-1"
                              title={`Advance to ${COLUMNS[colIdx + 1].title}`}
                            >
                              <span>Next Stage</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Production Milestone */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141c] p-6 shadow-2xl text-zinc-900 dark:text-zinc-100 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-serif font-bold">New Production Milestone</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Target Wedding Production
                </label>
                <select
                  value={newTaskEventId}
                  onChange={(e) => setNewTaskEventId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.coupleName} ({e.venue})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Milestone Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Drone FPV flight path rehearsal at Lake Pichola"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Execution Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details, gear requirements, lens focal lengths, or client directives..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Initial Stage
                  </label>
                  <select
                    value={newTaskColumn}
                    onChange={(e) => setNewTaskColumn(e.target.value as KanbanColumnId)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Priority Level
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Assignee
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Jagadeesh">Jagadeesh (Director)</option>
                    <option value="Aarav">Aarav (Photographer)</option>
                    <option value="Kavita">Kavita (Colorist)</option>
                    <option value="Suresh">Suresh (DIT Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    placeholder="e.g., 20 Nov 2026"
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all shadow-md shadow-amber-500/20"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
