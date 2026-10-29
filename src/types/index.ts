export type NavTab = 'dashboard' | 'calendar' | 'tracker' | 'proposals' | 'settings';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface WeddingEvent {
  id: string;
  coupleName: string;
  tagline: string;
  venue: string;
  city: string;
  eventDate: string; // e.g. "2026-11-14"
  dateDisplay: string; // e.g. "14 Nov 2026"
  daysRemainingOrAgo: string; // e.g. "3 Days Left" or "Happened 4 days ago"
  eventStage: 'Pre-Production' | 'Shoot Day' | 'Culling & Raw' | 'Post-Production' | 'Client Review' | 'Final Delivery' | 'Completed';
  currentMilestone: string; // e.g. "Color Grading & Cinematic Master Cut"
  progressPercent: number; // 0 to 100
  coverImage: string;
  totalInvestment: string;
  leadCrew: {
    cinematographer: string;
    photographer: string;
    editor: string;
  };
  functions: string[];
  deliverables: {
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
}

export type KanbanColumnId = 'pre_production' | 'production' | 'culling' | 'post_production' | 'review' | 'delivery';

export interface KanbanTask {
  id: string;
  eventId: string;
  eventTitle: string;
  title: string;
  description: string;
  columnId: KanbanColumnId;
  priority: 'urgent' | 'high' | 'medium' | 'normal';
  dueDate: string;
  assignee: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  subtasksCompleted: number;
  subtasksTotal: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  type: 'wedding_shoot' | 'pre_wedding' | 'edit_milestone' | 'client_meeting' | 'delivery_deadline';
  venue?: string;
  coupleName?: string;
  time?: string;
}

export interface ProposalPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  featured?: boolean;
  coverageDays: number;
  crewSize: string;
  deliverables: string[];
}

export interface ProposalAddon {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  selected: boolean;
}

export interface ProposalState {
  clientName: string;
  partnerName: string;
  clientEmail: string;
  clientPhone: string;
  weddingLocation: string;
  weddingDate: string;
  guestCount: number;
  selectedPackageId: string;
  customPackagePrice: number;
  selectedAddonIds: string[];
  discountPercent: number;
  includeTax: boolean; // 18% GST
  currency: 'INR' | 'USD' | 'EUR';
  notes: string;
}
