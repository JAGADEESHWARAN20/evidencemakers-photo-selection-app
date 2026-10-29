import { WeddingEvent, KanbanTask, CalendarEvent, ProposalPackage, ProposalAddon } from '../types';

export const INITIAL_EVENTS: WeddingEvent[] = [
  {
    id: 'evt-101',
    coupleName: 'Ananya & Vikramaditya',
    tagline: 'Royal Heritage Destination Wedding',
    venue: 'Taj Lake Palace, Lake Pichola',
    city: 'Udaipur, Rajasthan',
    eventDate: '2026-11-14',
    dateDisplay: '14 Nov 2026',
    daysRemainingOrAgo: '16 Days Ahead',
    eventStage: 'Post-Production',
    currentMilestone: '4K Cinematic Teaser Cut & Sound Design',
    progressPercent: 78,
    coverImage: '/assets/Evidence Makers at a Golden Wedding.png',
    totalInvestment: '₹ 4,80,000',
    leadCrew: {
      cinematographer: 'Jagadeesh (Director of Photography)',
      photographer: 'Aarav Sharma',
      editor: 'Kavita Menon'
    },
    functions: ['Welcome Sundowner', 'Sangeet & Cocktail', 'Haldi Ceremony', 'Grand Vows & Pheras', 'Royal Reception'],
    deliverables: [
      { name: '4K Cinematic 4-Min Teaser', status: 'completed' },
      { name: 'Full 35-Min Feature Film', status: 'in_progress' },
      { name: 'Same Day 60s Reel', status: 'completed' },
      { name: 'Handcrafted Italian Photo Book', status: 'in_progress' },
      { name: 'Master Archival SSD Drive', status: 'pending' }
    ]
  },
  {
    id: 'evt-102',
    coupleName: 'Meera & Siddharth',
    tagline: 'Sun-drenched Coastal Celebration',
    venue: 'Alila Diwa & Betalbatim Beachfront',
    city: 'South Goa',
    eventDate: '2026-10-24',
    dateDisplay: '24 Oct 2026',
    daysRemainingOrAgo: '5 Days Ago',
    eventStage: 'Culling & Raw',
    currentMilestone: 'Dual-Backup Verification & Color Grading First Pass',
    progressPercent: 42,
    coverImage: '/assets/Cinematic Wedding Videographer at Golden Hour.png',
    totalInvestment: '₹ 3,40,000',
    leadCrew: {
      cinematographer: 'Jagadeesh',
      photographer: 'Rohan Verma',
      editor: 'Suresh Kumar'
    },
    functions: ['Sunset Beach Party', 'Traditional Mehendi', 'Beach Vows', 'White Sand Gala'],
    deliverables: [
      { name: '60s Teaser Reel', status: 'completed' },
      { name: 'Extended 20-Min Film', status: 'in_progress' },
      { name: '300 Curated Color-Graded Stills', status: 'in_progress' },
      { name: 'Raw ProRes 422 Archive', status: 'pending' }
    ]
  },
  {
    id: 'evt-103',
    coupleName: 'Radhika & Devansh',
    tagline: 'Palatial Grandeur & Traditional Muhurtham',
    venue: 'The Leela Palace, Diplomatic Enclave',
    city: 'New Delhi',
    eventDate: '2026-12-05',
    dateDisplay: '05 Dec 2026',
    daysRemainingOrAgo: '37 Days Ahead',
    eventStage: 'Pre-Production',
    currentMilestone: 'Moodboard Finalization & Multi-Cam Drone Permit',
    progressPercent: 25,
    coverImage: '/assets/Golden Garden Wedding Reception.png',
    totalInvestment: '₹ 5,20,000',
    leadCrew: {
      cinematographer: 'Jagadeesh',
      photographer: 'Simran Khurana',
      editor: 'Team EM'
    },
    functions: ['Ring Ceremony', 'Mehendi & Sufi Night', 'Vedic Muhurtham', 'Black-Tie Reception'],
    deliverables: [
      { name: 'Pre-Wedding Vignette Film', status: 'completed' },
      { name: 'Full Wedding Cinema Doc', status: 'pending' },
      { name: 'Dual Heirloom Albums', status: 'pending' },
      { name: 'Live Multi-Cam Stream', status: 'pending' }
    ]
  },
  {
    id: 'evt-104',
    coupleName: 'Dr. Tanvi & Dr. Neil',
    tagline: 'Modern Contemporary Garden Wedding',
    venue: 'JW Marriott Golfshire Resort',
    city: 'Bengaluru, Karnataka',
    eventDate: '2026-10-12',
    dateDisplay: '12 Oct 2026',
    daysRemainingOrAgo: '17 Days Ago',
    eventStage: 'Client Review',
    currentMilestone: 'Final Cut Version 2 Review with Bride & Groom',
    progressPercent: 92,
    coverImage: '/assets/Golden Hour Indian Wedding Portrait.png',
    totalInvestment: '₹ 3,90,000',
    leadCrew: {
      cinematographer: 'Jagadeesh',
      photographer: 'Pooja Hegde',
      editor: 'Kavita Menon'
    },
    functions: ['Haldi Brunch', 'Musical Sangeet', 'Sunset Lawn Vows'],
    deliverables: [
      { name: '4K Teaser Film', status: 'completed' },
      { name: 'Feature Film Cut v2', status: 'in_progress' },
      { name: 'Custom Leather Box Album', status: 'completed' },
      { name: 'Private 4K Web Portal', status: 'completed' }
    ]
  }
];

export const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: 'task-1',
    eventId: 'evt-103',
    eventTitle: 'Radhika & Devansh',
    title: 'Recce & Lighting Layout at The Leela',
    description: 'Walkthrough with ballroom event manager for heavy crane and high-aperture lens positioning.',
    columnId: 'pre_production',
    priority: 'high',
    dueDate: '08 Nov 2026',
    assignee: {
      name: 'Jagadeesh',
      role: 'Lead Cinematographer',
      avatar: 'JD'
    },
    tags: ['Recce', 'Logistics'],
    subtasksCompleted: 3,
    subtasksTotal: 4
  },
  {
    id: 'task-2',
    eventId: 'evt-103',
    eventTitle: 'Radhika & Devansh',
    title: 'Drone Clearance & Audio Wireplan',
    description: 'Secure DGCA aerial photography permits for Lutyens Delhi perimeter and test wireless transmitter frequencies.',
    columnId: 'pre_production',
    priority: 'urgent',
    dueDate: '10 Nov 2026',
    assignee: {
      name: 'Aarav',
      role: 'Drone Specialist',
      avatar: 'AS'
    },
    tags: ['Permits', 'Drone'],
    subtasksCompleted: 1,
    subtasksTotal: 2
  },
  {
    id: 'task-3',
    eventId: 'evt-101',
    eventTitle: 'Ananya & Vikramaditya',
    title: 'Shoot Prep: FX3 & Venice 2 Sensor Cleans',
    description: 'Assemble 4-camera cinema package with anamorphic primes and calibrate Ronin 4D gimbal.',
    columnId: 'production',
    priority: 'high',
    dueDate: '13 Nov 2026',
    assignee: {
      name: 'Jagadeesh',
      role: 'Lead Cinematographer',
      avatar: 'JD'
    },
    tags: ['Cameras', 'Rigging'],
    subtasksCompleted: 4,
    subtasksTotal: 4
  },
  {
    id: 'task-4',
    eventId: 'evt-102',
    eventTitle: 'Meera & Siddharth',
    title: 'Dual NAS Cloud Ingestion & SHA-256 Checksum',
    description: 'Offload 1.8 TB of RED & Sony RAW footage, verify checksum integrity, and create Apple ProRes proxies.',
    columnId: 'culling',
    priority: 'urgent',
    dueDate: '26 Oct 2026',
    assignee: {
      name: 'Suresh',
      role: 'DIT Specialist',
      avatar: 'SK'
    },
    tags: ['Backup', 'Proxies'],
    subtasksCompleted: 2,
    subtasksTotal: 2
  },
  {
    id: 'task-5',
    eventId: 'evt-101',
    eventTitle: 'Ananya & Vikramaditya',
    title: 'Color Grading on DaVinci Resolve (Arri LUT pass)',
    description: 'Apply custom Kodak 2383 film stock emulation tailored for golden hour sunset vows and palace lanterns.',
    columnId: 'post_production',
    priority: 'high',
    dueDate: '04 Nov 2026',
    assignee: {
      name: 'Kavita',
      role: 'Senior Colorist',
      avatar: 'KM'
    },
    tags: ['DaVinci', 'Grading'],
    subtasksCompleted: 5,
    subtasksTotal: 6
  },
  {
    id: 'task-6',
    eventId: 'evt-104',
    eventTitle: 'Dr. Tanvi & Neil',
    title: 'Client Review Meeting (Frame.io Feedback)',
    description: 'Incorporate bride notes regarding ceremony speech balance and maternal blessing angle.',
    columnId: 'review',
    priority: 'medium',
    dueDate: '31 Oct 2026',
    assignee: {
      name: 'Jagadeesh',
      role: 'Creative Director',
      avatar: 'JD'
    },
    tags: ['Client Approval', 'Audio'],
    subtasksCompleted: 4,
    subtasksTotal: 4
  },
  {
    id: 'task-7',
    eventId: 'evt-104',
    eventTitle: 'Dr. Tanvi & Neil',
    title: 'Luxury Engraved Walnut Box & 4K USB Dispatch',
    description: 'Inspect print fidelity of 40-page linen album, flash custom 128GB crystal flash drive, and courier via BlueDart.',
    columnId: 'delivery',
    priority: 'normal',
    dueDate: '05 Nov 2026',
    assignee: {
      name: 'Simran',
      role: 'Client Concierge',
      avatar: 'SK'
    },
    tags: ['Album', 'Courier'],
    subtasksCompleted: 1,
    subtasksTotal: 3
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Ananya & Vikramaditya • Royal Udaipur Shoot',
    date: '2026-11-14',
    endDate: '2026-11-16',
    type: 'wedding_shoot',
    venue: 'Taj Lake Palace, Udaipur',
    coupleName: 'Ananya & Vikramaditya',
    time: '08:00 AM - 11:30 PM'
  },
  {
    id: 'cal-2',
    title: 'Meera & Siddharth • Beachfront Vows Day 1',
    date: '2026-10-24',
    endDate: '2026-10-25',
    type: 'wedding_shoot',
    venue: 'Alila Diwa, Goa',
    coupleName: 'Meera & Siddharth',
    time: '04:00 PM'
  },
  {
    id: 'cal-3',
    title: 'Teaser Delivery Deadline • Ananya & Vikram',
    date: '2026-11-20',
    type: 'delivery_deadline',
    venue: 'Studio Production',
    coupleName: 'Ananya & Vikramaditya',
    time: '06:00 PM'
  },
  {
    id: 'cal-4',
    title: 'Pre-Wedding Film Shoot • Radhika & Devansh',
    date: '2026-11-06',
    type: 'pre_wedding',
    venue: 'Neemrana Fort Palace',
    coupleName: 'Radhika & Devansh',
    time: '05:30 AM (Sunrise)'
  },
  {
    id: 'cal-5',
    title: 'Dr. Tanvi & Neil • Master Cut Delivery',
    date: '2026-11-02',
    type: 'delivery_deadline',
    venue: 'Bangalore Studio & Cloud',
    coupleName: 'Dr. Tanvi & Neil',
    time: '04:00 PM'
  },
  {
    id: 'cal-6',
    title: 'Virtual Review Call • Sangeet Draft Approval',
    date: '2026-11-01',
    type: 'client_meeting',
    venue: 'Google Meet Studio Room',
    coupleName: 'Dr. Tanvi & Neil',
    time: '07:30 PM'
  }
];

export const PROPOSAL_PACKAGES: ProposalPackage[] = [
  {
    id: 'pkg-royal',
    name: 'The Royal Heirloom Signature',
    tagline: 'Ultra-luxury multi-day coverage with cinematic anamorphic lenses & bespoke storyboarding',
    price: 475000,
    featured: true,
    coverageDays: 3,
    crewSize: '8 Cinema Specialists (4 Cinematographers, 2 Candid Photographers, 1 Drone Pilot, 1 DIT)',
    deliverables: [
      'Feature-Length 4K Cinema Film (35-45 minutes)',
      'High-Impact 4K Teaser Reel (3-4 minutes) within 10 days',
      'Same-Day 60-Second Vertical Reel for Socials',
      'Full Multi-Cam Speech & Vows Uncut Video',
      'Licensed Drone Cinematography with 4K HDR master',
      'Two 40-Spread Italian Handcrafted Leather Albums (12x18)',
      'Curated 700+ Master Color-Graded Stills Gallery',
      '1TB Custom Engraved Wooden / Crystal SSD Box with Raw & 4K Files'
    ]
  },
  {
    id: 'pkg-cinematic',
    name: 'The Cinematic Grandeur',
    tagline: 'High-end cinema coverage capturing heartfelt emotions, grandeur, and authentic moments',
    price: 310000,
    coverageDays: 2,
    crewSize: '5 Specialists (2 Cinematographers, 2 Photographers, 1 Drone Pilot)',
    deliverables: [
      'Cinematic Highlight Film (20-25 minutes)',
      '4K Cinematic Teaser Film (2-3 minutes)',
      'Licensed Aerial Drone Perspectives',
      'One Luxury Linen Hardcover Album (30 spreads)',
      'Curated 450+ Color-Graded High-Resolution Stills',
      'Private Password-Protected Online Viewing Portal',
      'Curated USB Master Vault'
    ]
  },
  {
    id: 'pkg-editorial',
    name: 'The Editorial Intimate',
    tagline: 'Focused, sophisticated wedding and reception coverage with documentary precision',
    price: 185000,
    coverageDays: 1,
    crewSize: '3 Specialists (1 Lead Cinematographer, 1 Candid Photographer, 1 Traditional Camera)',
    deliverables: [
      'Documentary Highlight Film (12-15 minutes)',
      'Social Cinema Reel (60-90 seconds)',
      '300+ Edited Stills with Signature Tone',
      'High-Speed Cloud Delivery for 1 Year'
    ]
  }
];

export const PROPOSAL_ADDONS: ProposalAddon[] = [
  {
    id: 'add-drone',
    name: 'Dedicated Aerial Drone Master (FPV + Cinema)',
    category: 'Cinematography',
    description: 'Licensed pilot with DJI Inspire 3 / Mavic 3 Cine for dynamic high-speed sweeping shots and overhead wedding mandap vistas.',
    price: 45000,
    selected: false
  },
  {
    id: 'add-sameday',
    name: 'Same-Day Edit (SDE) Reception Premiere',
    category: 'Post-Production',
    description: 'Dedicated onsite editor creating a thrilling emotional 3-minute film shown on LED walls during your reception.',
    price: 55000,
    selected: false
  },
  {
    id: 'add-prewedding',
    name: 'Pre-Wedding Destination Cinema Vignette (2 Days)',
    category: 'Production',
    description: 'Intimate editorial destination shoot at sunrise and twilight with wardrobe styling assistance and director storytelling.',
    price: 85000,
    selected: false
  },
  {
    id: 'add-album-extra',
    name: 'Parent Duplicate Heirloom Albums (Set of 2)',
    category: 'Print & Keepsake',
    description: 'Matching handcrafted linen hardbound keepsake books designed especially for parents and close family.',
    price: 38000,
    selected: false
  },
  {
    id: 'add-stream',
    name: 'Live 1080p Multi-Cam Broadcast & Private Link',
    category: 'Technology',
    description: '4-camera broadcast with dedicated wireless bonded cellular encoder for family members watching worldwide.',
    price: 40000,
    selected: false
  },
  {
    id: 'add-rawdrive',
    name: 'Archival 2TB Rugged SSD with All RAW Footage',
    category: 'Archives',
    description: 'Every single take, b-roll, high-bitrate audio, and uncompressed ProRes 422 files preserved permanently.',
    price: 25000,
    selected: false
  }
];
