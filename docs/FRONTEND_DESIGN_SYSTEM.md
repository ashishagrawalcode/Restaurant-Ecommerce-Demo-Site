# The Saffron Plate - Frontend Design System & Visual Style Guide

This comprehensive design system and visual style guide documents the aesthetic principles, color tokens, typography hierarchy, layout grid specifications, component library, and motion design guidelines for **The Saffron Plate** luxury dining web application.

---

## 1. Aesthetic Philosophy & Brand Identity

**The Saffron Plate** design language blends centuries-old royal Indian culinary heritage with contemporary haute-gastronomy digital aesthetics (inspired by world-class fine-dining publications and Michelin-starred culinary portfolios).

### Key Design Pillars
1. **Understated Royal Opulence**: Avoid loud or gaudy decorations; celebrate richness through deep obsidian canvas surfaces (`#171717`), warm card undertones (`#211E1B`), and luminous imperial gold accents (`#C9A227`).
2. **Editorial Typography**: Pair classical Roman inscriptional serifs (**Cinzel**) with romantic Renaissance display italics (**Cormorant Garamond**) and clean modern geometric sans-serifs (**Jost**) for effortless readability.
3. **Atmospheric Glassmorphism**: Utilize translucent surface fills with CSS `backdrop-filter: blur(12px)` and subtle gold-tinted borders (`#4A4038`) to create visual depth and physical layering.
4. **Zero-JavaScript Visual Stability**: Achieve all transitions, hover states, navigation overlays, and responsive transformations using hardware-accelerated CSS3 properties with zero layout shift (CLS: 0.0).

---

## 2. Color Palette & Design Tokens

### 2.1 Primary Brand Tokens

| Token Name | CSS Custom Property | HEX Value | RGB Equivalent | HSL Equivalent | Role & Context |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Canvas Background** | `--canvas-bg` | `#171717` | `rgb(23, 23, 23)` | `hsl(0, 0%, 9%)` | Global page backdrop canvas |
| **Card Surface** | `--card-surface` | `#211E1B` | `rgb(33, 30, 27)` | `hsl(30, 10%, 12%)` | Card containers, modal sheets, nav drawer |
| **Primary Heading** | `--text-heading` | `#F5EFE6` | `rgb(245, 239, 230)`| `hsl(36, 44%, 93%)` | Royal dish titles, section headings, quotes |
| **Body Paragraph** | `--text-body` | `#D8D0C4` | `rgb(216, 208, 196)`| `hsl(36, 20%, 81%)` | Description copy, ingredient lists, metadata |
| **Imperial Gold** | `--gold-accent` | `#C9A227` | `rgb(201, 162, 39)` | `hsl(46, 67%, 47%)` | Primary CTAs, price tags, star ratings, borders |
| **Gold Hover Glow** | `--gold-hover` | `#E0B93D` | `rgb(224, 185, 61)` | `hsl(46, 73%, 56%)` | Hover states, active tabs, focus outlines |
| **Subtle Divider** | `--border-subtle` | `#4A4038` | `rgb(74, 64, 56)` | `hsl(27, 14%, 25%)` | Card borders, table dividers, footer lines |
| **Dark Overlay** | `--overlay-dark` | `rgba(15,13,11,0.85)` | `rgba(15, 13, 11, 0.85)` | - | Modal backgrounds, image vignettes |

### 2.2 Semantic Status Colors

| Token Name | HEX Value | Usage Context |
| :--- | :---: | :--- |
| **Success Emerald** | `#2ECC71` | Order confirmed, review submitted successfully |
| **Warning Amber** | `#F39C12` | Inquiry pending status, seat availability low |
| **Error Crimson** | `#E74C3C` | Form validation failure, network disconnect |
| **Info Sapphire** | `#3498DB` | Dietary badges, patron notification highlights |

---

## 3. Typography Hierarchy & Font Scaling

The typography system relies on three complementary Google Fonts loaded asynchronously with `font-display: swap`:

### 3.1 Font Family Stacks
- **Brand & Headings**: `'Cinzel', Georgia, 'Times New Roman', serif;`
- **Quotes & Accents**: `'Cormorant Garamond', 'Garamond', Georgia, serif;`
- **Interface & Body**: `'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`

### 3.2 Type Scale Hierarchy

| Element / Class | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Hero Title (`h1`)** | Cinzel | `3.75rem` (60px) | `2.25rem` (36px) | 700 | `1.15` | `0.08em` |
| **Section Title (`h2`)**| Cinzel | `2.5rem` (40px) | `1.75rem` (28px) | 600 | `1.25` | `0.05em` |
| **Card Title (`h3`)** | Cinzel | `1.35rem` (22px) | `1.15rem` (18px) | 600 | `1.3` | `0.03em` |
| **Subtitle / Motto** | Cormorant | `1.5rem` (24px) | `1.25rem` (20px) | 400 Italic | `1.4` | `0.02em` |
| **Body Copy (`p`)** | Jost | `1.05rem` (16.8px) | `0.95rem` (15.2px)| 400 | `1.7` | `0.01em` |
| **Button Label** | Jost | `0.85rem` (13.6px) | `0.85rem` (13.6px)| 600 | `1.0` | `0.12em` (Uppercase) |
| **Metadata & Badges** | Jost | `0.75rem` (12px) | `0.75rem` (12px) | 500 | `1.2` | `0.06em` |

---

## 4. Layout Grid Architecture & Spacing Scale

### 4.1 Spacing Scale (8-Point Modular Grid)
All padding, margin, and gap values adhere strictly to multiples of 8px (with 4px half-steps for micro-spacing):

```css
--space-1:  4px;    /* Micro-adjustments and icon gaps */
--space-2:  8px;    /* Tight component padding */
--space-3: 12px;    /* Card inner spacing */
--space-4: 16px;    /* Standard element gap */
--space-6: 24px;    /* Medium container padding */
--space-8: 32px;    /* Section inner spacing */
--space-12: 48px;   /* Section column gaps */
--space-16: 64px;   /* Section vertical margins */
--space-24: 96px;   /* Major section dividers */
```

### 4.2 Responsive Viewport Breakpoints
- **Mobile Phones**: `max-width: 480px` (Single-column layout, full-bleed images, fixed mobile drawer).
- **Tablets & Small Screens**: `max-width: 768px` (Two-column grids, collapsed navigation header).
- **Laptops & Desktops**: `min-width: 1024px` (Three-column highlights grid, expanded navigation overlay).
- **Ultra-Wide Displays**: `min-width: 1440px` (Max container width clamped to `1280px` centered).

---

## 5. UI Component Catalog

### 5.1 Overlay Navigation Header
- **Positioning**: `position: sticky; top: 0; z-index: 1000;`
- **Surface**: `background: rgba(23, 23, 23, 0.88); backdrop-filter: blur(12px);`
- **Border**: `border-bottom: 1px solid var(--border-subtle);`
- **Layout**: Space-between flex container aligning brand logo on left, centered navigation links, and gold action CTA button on right.

### 5.2 Split-Gradient Hero Banner
- **Backdrop**: High-resolution dish photography flanked by radial and linear dark vignettes:
  ```css
  background: linear-gradient(to right, rgba(23, 23, 23, 0.92) 0%, rgba(23, 23, 23, 0.4) 60%, rgba(23, 23, 23, 0.95) 100%),
              url('../images/hero-banner.jpg') center/cover no-repeat;
  ```
- **Text Alignment**: Left-aligned with subtle gold kicker badge, majestic Cinzel heading, and twin CTA buttons ("Explore Signature Menu", "Reserve a Table").

### 5.3 Quick Reservation Bar
- **Position**: Floated beneath hero section with negative margin overlap.
- **Surface**: `background: var(--card-surface); border: 1px solid var(--border-subtle); border-radius: 8px;`
- **Grid Layout**: 4-column responsive grid on desktop (`Date`, `Time`, `Guests`, `Find Table CTA`), collapsing into single column on mobile.

### 5.4 Culinary Delicacy Cards
- **Container**: `background: var(--card-surface); border: 1px solid var(--border-subtle); border-radius: 6px; overflow: hidden;`
- **Image Header**: Aspect ratio `16:10` with subtle zoom hover effect (`transform: scale(1.04); transition: transform 0.4s ease;`).
- **Content Block**: Title in Cinzel, gold price highlight in Jost, ingredient excerpt, and "Add to Order" action button.

### 5.5 Customer Testimonial Cards (`.accolade-card`)
- **Container**: `border: 1px solid var(--border-subtle); padding: 28px; background: rgba(33, 30, 27, 0.6); backdrop-filter: blur(8px);`
- **Star Rating**: Gold unicode star rendering (`★★★★★`).
- **Quotation**: Cormorant Garamond display italic text with opening quotation mark styling.
- **Author Attribution**: Small uppercase sans-serif with subtle dish indicator badge.

---

## 6. Motion Design & Transition Curves

All transitions must feel luxurious, weighted, and natural. Jerky or ultra-fast animations are avoided:

```css
/* Standard luxury transition curves */
--ease-luxury: cubic-bezier(0.25, 1, 0.5, 1);
--transition-fast: 0.2s var(--ease-luxury);
--transition-normal: 0.35s var(--ease-luxury);
--transition-slow: 0.6s var(--ease-luxury);

/* Button hover elevation */
.btn-gold {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}
.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(201, 162, 39, 0.35);
}
```

---

## 7. Accessibility & Inclusivity Guidelines (WCAG 2.1 AA)

1. **Color Contrast Ratios**:
   - Heading text (`#F5EFE6`) on canvas (`#171717`): **14.8:1** (Exceeds WCAG AAA requirement of 7:1).
   - Body copy (`#D8D0C4`) on card surface (`#211E1B`): **9.2:1** (Exceeds WCAG AAA).
   - Gold accent (`#C9A227`) on dark canvas: **5.8:1** (Exceeds WCAG AA requirement of 4.5:1).
2. **Keyboard Navigation**:
   - All interactive controls (buttons, links, inputs, selects) include prominent focus rings:
     `outline: 2px solid var(--gold-hover); outline-offset: 3px;`
3. **Screen Readers & ARIA Roles**:
   - Dynamic modals feature `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` attributes.
   - Accolade star elements include `aria-label="Rated 5 out of 5 stars"`.
   - Form status banners use `role="status"` and `aria-live="polite"`.
