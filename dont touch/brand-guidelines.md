# UI/UX & Brand Guidelines

## A. Design Philosophy

Create a premium, minimal, coherent interface that feels deliberately designed for Evidence Makers Studio — a professional wedding and heirloom photography proofing architecture.

Follow these principles:
- Clarity before decoration.
- Function before novelty.
- Consistency before isolated visual experimentation.
- Strong hierarchy before excessive emphasis.
- Useful whitespace before unnecessary containers.
- Reusable patterns before one-off styling.
- Accessible interaction before purely aesthetic effects.

The interface should feel polished and purposeful without becoming visually empty, generic, or excessively minimal.

## B. Approved Color Palette

Use these exact approved colors:

| Semantic token | Hex value | Intended use |
|---|---|---|
| Background | `#0A0A0A` | Primary page background |
| Surface | `#121212` | Cards, panels, and elevated surfaces |
| Primary text | `#FFFFFF` | Main content and prominent labels |
| Muted text | `#A1A1AA` | Secondary text and supporting information |
| Brand accent | `#D4AF37` | Primary actions, selected states, and important highlights |
| Borders | `#27272A` | Subtle dividers, outlines, and component boundaries |
| Error | `#EF4444` | Errors, destructive actions, and critical feedback |

### Strict color rules

- Do not invent new hex codes or introduce another accent color.
- Do not scatter hardcoded arbitrary color values across components.
- Centralize the approved values in the existing theme system and Tailwind `@theme` configuration (`src/index.css`).
- Use semantic color names: `background`, `surface`, `foreground`, `muted`, `primary` (brand gold), `border`, and `destructive`.
- Do not add arbitrary multi-color neon gradients, colored glows, or decorative glitter effects.
- Do not use the accent color on every element; preserve its visual significance for primary actions, selected indicators, and key status highlights.
- Maintain WCAG AA contrast (4.5:1 text, 3:1 large text) for readability across all surfaces.

## C. Typography

- **Headings & Editorial Display:** Fraunces / Playfair Display editorial serif (`font-serif` or `.font-editorial`). Used for studio branding, collection names, hero headlines, and client titles.
- **Body & Interface Text:** Sora / Inter clean geometric sans-serif (`font-sans`). Used for navigation, buttons, controls, labels, and descriptions.
- **Numeric, Metadata & Code:** Monospace font (`font-mono` / tabular-nums). Used for project IDs, event dates, photo counts, EXIF metadata, and file sizes.

Typography rules:
- Establish a clear hierarchy for page titles, section headings, body text, labels, captions, and supporting metadata.
- Use font weight deliberately (normal 400 for copy, 500 for secondary labels, 600 for buttons/headings).
- Keep line lengths and line heights readable (max 75ch for paragraphs, leading-relaxed).
- Avoid excessive uppercase text; keep uppercase reserved for short category tags or ID codes with generous tracking (`tracking-wider`).
- Prevent layout shifts on navigation tabs by keeping layout dimensions and font weight metrics stable.

## D. Spacing and Layout

Use a consistent spacing system based on a 4px base unit and an 8px preferred rhythm.

Guidelines:
- Apply consistent page gutters (`px-4 sm:px-8 lg:px-12`), container widths (`max-w-7xl`), section spacing (`space-y-8` to `space-y-10`), and component padding.
- Align content to a deliberate grid (12-column responsive layout or flex alignments).
- Outer padding of a container must always be greater than or equal to inner padding between children.
- Button padding follows the 2:1 horizontal-to-vertical ratio (e.g., `py-2.5 px-5` or `py-2 px-4`).
- Ensure layouts adapt cleanly across mobile (390px), tablet (768px), laptop (1024px), and wide desktop (1440px+) without horizontal clipping or scrollbar breakage.

## E. Borders, Radius, and Elevation

Use a restrained and consistent treatment.

- Subtle borders (`border-[#27272A]`) and clear surface separation between `#0A0A0A` (canvas) and `#121212` (surfaces).
- Radius scale:
  - `rounded-lg` (8px): small controls, popover items, input fields.
  - `rounded-xl` (12px): buttons, preview thumbnails, cards.
  - `rounded-2xl` (16px): major view containers, panels, modals.
  - `rounded-full`: status indicator dots, circular badges.
- Avoid mixing sharp corners and oversized radiuses arbitrarily.
- Shadows are reserved for floating overlays (modals, popovers, dropdowns) with `shadow-2xl`. Avoid ambient heavy drop shadows on flat cards.

## F. Components and Interaction Patterns

- **Primary Buttons:** Solid brand gold (`#D4AF37`) with black text (`#000000`), hover state `#C5A028`, active scale press feedback.
- **Secondary Buttons:** Dark elevated surface (`#181818` or `#121212`), white text, subtle border (`#27272A`), hover background `#202020`.
- **Destructive Buttons:** Subtle red background (`#EF4444/10`), red text (`#EF4444`), hover background (`#EF4444/20`).
- **Interactive Controls:** All buttons, filters, and cards must have visible focus indicators (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]`).
- **Touch Targets:** Minimum touch target size of 44 × 44px on mobile viewports for all buttons, filter tabs, and photo actions.
- **Interactive Swiping:** Full touch (`onTouchStart`, `onTouchEnd`) and pointer/mouse drag (`drag="x"`) gestures for client proofing on both mobile and desktop.

## G. Accessibility and Responsive Design

- Semantic HTML (`<main>`, `<header>`, `<nav>`, `<article>`, `<button>`).
- ARIA labels on all icon-only buttons (`aria-label`).
- Contrast verified: white `#FFFFFF` on `#0A0A0A` and `#121212` (> 15:1 ratio); muted text `#A1A1AA` on dark surfaces (> 5.5:1 ratio).
- Respect `prefers-reduced-motion` for animations and transitions.
- Zero horizontal layout scrollbars on standard viewport sizes.

## H. Definition of Good Design

Before accepting any component or screen:
1. Is the main purpose immediately clear?
2. Is the most important action visually obvious?
3. Is the hierarchy intentional?
4. Are spacing and alignment consistent?
5. Does every visible element serve a purpose?
6. Does the design match the rest of the product?
7. Is it accessible and responsive?
8. Does it feel specifically crafted for a high-end photography studio?
9. Can the implementation reuse existing components and tokens?
10. Can anything unnecessary be removed without hurting usability?
