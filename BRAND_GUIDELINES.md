# Evidence Makers Interface Guidelines

## Brand direction

Evidence Makers should feel like a premium editorial photography studio: warm, composed, tactile, and precise. The interface supports the photographs instead of competing with them. Cream, ink, and antique gold form the core palette. Rounded corners are restrained and consistent; spacing is generous enough to keep dense project and image workflows readable.

## Typography

- **GFS Didot** is the display face for page titles, client names, section titles, and editorial moments.
- **Bodoni Moda** is the interface face for navigation, buttons, labels, filenames, metadata, forms, and body copy.
- Headings use slightly tightened tracking. Uppercase labels use wider tracking and remain short.
- Body copy should stay at 16px or larger for long reading. Small metadata may use 11–13px when contrast remains strong.
- Numeric and filename styles use Bodoni Moda with tabular numerals instead of introducing a third typeface.

## Color tokens

### Light — Editorial Ivory (default)

- Canvas: `#F8F4EC`
- Alternate canvas: `#F1EADF`
- Surface: `#FFFCF7`
- Raised surface: `#F5EEE2`
- Border: `#D8CCBA`
- Primary text: `#221E18`
- Secondary text: `#655C50`
- Antique gold: `#966D22`

### Dark — Obsidian Gallery

- Canvas: `#0E0D0B`
- Alternate canvas: `#0A0908`
- Surface: `#171511`
- Raised surface: `#211E18`
- Border: `#373126`
- Primary text: `#F7F0E5`
- Secondary text: `#BDB3A4`
- Champagne gold: `#D6B568`

Gold communicates the primary action, active state, or meaningful progress. It should not decorate every border or label.

## Layout and spacing

- Content width is capped at `80rem` with fluid horizontal padding.
- Main page padding scales from 16px on phones to 48px on wide screens.
- Use the 4px spacing base: 4, 8, 12, 16, 20, 24, 32, and 48px.
- Touch targets are at least 44px.
- Cards use 16px corners; controls use 10–12px corners; badges remain pill shaped.
- Mobile layouts collapse to a single readable flow. Horizontal carousels use snap points and never introduce vertical scrolling inside the carousel.

## Components

- Primary buttons use solid brand gold with high contrast text.
- Secondary controls use the current surface, a quiet border, and theme text.
- Active navigation uses gold text and a surface background; only one navigation item may be active.
- Project selection uses the custom accessible switcher with project ID, client name, date, keyboard navigation, and one selected state.
- Image tiles keep visual content clean. Operational actions live in the top-right popover; the filename remains below the image.
- Empty, loading, error, and success states use the same spacing and typography as the content they replace.

## Responsive behavior

- Phone: one project card per carousel view, one main content column, compact controls, and navigation in the drawer.
- Tablet: two-column image or metric layouts where content remains legible.
- Desktop: full navigation, two project cards per carousel view, and multi-column image layouts.
- Avoid duplicate controls across desktop and mobile at the same breakpoint.

## Mock and production boundary

Views consume the service interfaces in `src/services`. Mock adapters implement those interfaces today. Production APIs should replace adapters through the service registry without changing UI components. Selection, project switching, JPEG/RAW download, upload staging, sharing, search, and filters must remain adapter-driven.

## Approval and test phase

This UI phase is reviewed visually first. After design approval, add feature test cases for every user flow and adapter contract, then run the complete production build verification.
