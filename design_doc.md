# Design Document: Magnesium – Kinetic Industrial Aesthetic

## 1. Design Philosophy

**"Kinetic Industrialism"**
The design language reflects the raw, physical nature of bouldering combined with the precision of modern training. It is sharp, dynamic, and unapologetically technical. It avoids soft curves and organic shapes in favor of angles, grids, and high-contrast structures.

## 2. Core Visual Pillars

### The Shard (Geometry)

- **Concept:** Elements represent climbing holds or architectural shards.
- **Implementation:** Frequent use of `skew-x` transforms (typically -6deg or -12deg).
- **Usage:** Badges, buttons, active states in navigation, and decorative underlays.
- **Rule:** Interactive elements lean forward (skew) to suggest momentum.

### The Monolith (Content)

- **Concept:** Content blocks are solid, heavy, and grounded.
- **Implementation:** Thick borders (often 2px or 4px), heavy shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]`), and high contrast backgrounds.
- **Usage:** Cards, hero sections, modal windows.

### The Grid (Environment)

- **Concept:** The gym is a controlled, measured environment.
- **Implementation:** Background patterns using linear gradients to create graph paper or technical grids.
- **Usage:** Page backgrounds, section dividers, overlays.

## 3. Typography System

### Primary Headings (The Shout)

- **Font:** Sans-serif (Inter/System).
- **Weight:** Black / ExtraBold (`font-black`).
- **Tracking:** Tighter (`tracking-tighter`).
- **Case:** Often Uppercase for impact.
- **Usage:** Page titles, Route grades.

### Technical Labels (The Whisper)

- **Font:** Monospace (`font-mono`).
- **Weight:** Regular.
- **Tracking:** Widest (`tracking-widest`).
- **Case:** Uppercase.
- **Usage:** Metadata (Dates, Setters, IDs), Navigation labels, Subheaders.

## 4. Color Palette

### Foundation

- **Void Black:** `#000000` - Text, Borders, Primary Backgrounds.
- **Paper White:** `#FFFFFF` - Cards, Text on Black.
- **Concrete Slate:** `Slate-50` to `Slate-900` - Backgrounds, Secondary Text, Subtle Borders.

### Accents

- **Hazard Yellow:** `Yellow-400` - Primary Action, Active State, Highlights.
- **Signal Red/Green:** Functional colors for status (Flash/Fail), kept pure and bright.

## 5. Component Guidelines

### Navigation

- **Style:** Floating, detached from screen edges.
- **Interaction:** Skewed active states.
- **Material:** Glassmorphism (`backdrop-blur`) combined with solid black structural elements.

### Cards (Route/Gym)

- **Shape:** Rectangular with optional skewed accents.
- **Border:** Thin, crisp borders (`border-slate-200`) or heavy black borders for emphasis.
- **Hover:** "Lift" effects or "Shift" effects (translating X/Y) rather than soft glows.

### Buttons & Actions

- **Style:** Solid blocks or outlined shards.
- **Text:** Always uppercase, tracking-widest.
- **Iconography:** Small, precise icons (Lucide) paired with text.

## 6. Layout Patterns

- **Overlapping:** Elements frequently overlap (e.g., badges hanging off cards).
- **Asymmetry:** Layouts should feel balanced but not perfectly symmetrical, mimicking a climbing wall.
- **Whitespace:** Generous padding to let the heavy typography breathe.

## 7. Implementation Notes (Tailwind)

- Use `transform -skew-x-12` for standard shard effects.
- Use `tracking-widest uppercase font-mono text-xs` for all metadata.
- Use `border-b-2` or `border-l-4` for structural definition.
- Background utility: `bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]`
