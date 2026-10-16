# Project Requirements Reference

## 1. Product Purpose & Intended Users

Evidence Makers Studio is a high-resolution photography proofing and client delivery application designed for professional wedding and editorial portrait photographers and their clients.

**Target Audiences:**
- **Studio Photographers & Lab Admins:** Manage photography shoots, pair RAW digital negatives (`.CR2`, `.CR3`, `.NEF`, `.ARW`, `.DNG`) with high-resolution JPEGs, monitor client selection progress, track package limits, export selection manifests, and converse with clients about retouch requests.
- **Couples & Private Clients:** Access their protected gallery via direct tokenized link and secure PIN, browse categorized photographs, curate heirloom album selections using either an interactive Touch/Swipe Curator Deck (mobile & desktop) or responsive grid view, inspect full-resolution photos in a lightbox, and submit feedback or retouch notes.

## 2. Main Features & User Journeys

1. **Studio Workspace (Dashboard):**
   - Studio statistics: Total Projects, Awaiting Selection count, Submitted Albums, and Paired RAW Masters count.
   - Filterable projects list (by status: All, Awaiting Selection, Submitted, In Production; and real-time search by ID, client name, or event).
   - Rich project cards showing client name, event date, package tier, PIN protection status, miniature photo gallery preview strip, live selection quota progress bar, and immediate actions (RAW & JPEG manifest manager, Review Selections, Client Portal preview, and multi-channel Quick-Share popover).
   - New Project creation modal with client details, package tier selection, quota limit, and optional security PIN.

2. **RAW/JPEG Digital Negatives Asset Manager:**
   - Visual pairing status for each asset (`paired`, `jpeg_only`, `raw_only`, `duplicate`).
   - Drag-and-drop or batch upload simulator for matching RAW camera files with JPEGs based on timestamp and base filename.
   - Filtering by pairing state and category (Getting Ready, Ceremony, Portraits, Reception, Details).
   - One-click manifest export for lab post-production.

3. **Album Selection Review:**
   - Dedicated review console showing selected photos vs non-selected photos.
   - Retouch notes and comment counters per image.
   - Batch status approval (`selections_submitted` -> `album_production`).

4. **Client Proofing Portal (`?portal=<token>`):**
   - PIN Authentication Screen for secured galleries.
   - Bespoke Onboarding Sequence with atmospheric blur reveal on initial entry.
   - Flexible Viewing Modes:
     - **Swipe Curator Deck:** Interactive card deck for rapid proofing with right-swipe to select and left-swipe to pass, full mouse drag and touch gesture support, undo history stack, tactile action dock, keyboard shortcuts (`ArrowRight`, `ArrowLeft`, `Space`, `Z`), and celebratory completion state.
     - **Responsive Masonry/Grid View:** Multi-column photo layout with category filter tabs and quick-selection triggers.
   - Sticky Selection Guidance & Quota Bar: Live counter tracking chosen photos against package limits (e.g. 5 of 60 photos selected), real-time warnings if quota is exceeded or pending, direct studio chat drawer trigger, and formal selection submission.
   - Fullscreen Photo Lightbox: High-res inspection with EXIF metadata, swipe navigation between photos, picture-level retouch notes, and selection toggle.

5. **API Integration & Export Docs:**
   - In-app documentation modal for studio automation, webhook notifications, and automated RAW file retrieval.

## 3. Architecture & Tech Stack

- **Framework:** React 19 SPA running on Vite 8.
- **Styling:** Tailwind CSS v4 with `@theme` token centralization in `src/index.css`.
- **Motion & Gestures:** Framer Motion (`framer-motion` v14) & native touch events (`onTouchStart`, `onTouchEnd`) for physical drag and swipe mechanics.
- **Icons:** `lucide-react` paired with bespoke SVG icons (`src/components/icons/BespokeIcons.tsx`).
- **Data Layer:** Service architecture (`src/services/`) with in-memory and persistent LocalStorage adapters (`src/adapters/mock/`).
- **Build & Quality Commands:**
  - Build: `npm run build`
  - Lint / Typecheck: `npm run lint` (`tsc --noEmit`)
  - Dev server: `npm run dev` (runs on port 3000)

## 4. Design & Usability Standards

- Strict adherence to `brand-guidelines.md` color tokens (`#0A0A0A`, `#121212`, `#FFFFFF`, `#A1A1AA`, `#D4AF37`, `#27272A`, `#EF4444`).
- Zero-pill discipline for static metadata; clear distinction between static labels and interactive controls.
- WCAG AA contrast compliance across all text and interactive states.
- 44px minimum touch targets on mobile viewports.
- Responsive layout support from 360px up to 1920px+ with zero horizontal layout shift.
