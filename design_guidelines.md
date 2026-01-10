# Prismatic - Apple Liquid Glass Design Guidelines

## Design Philosophy
Transform the exchange into a premium Apple-like experience with the "Liquid Glass" aesthetic - translucent frosted panels, background blur with saturation, soft inner highlights, subtle borders, and layered depth. Every interaction should feel smooth and refined, never cluttered.

## Brand Identity

**Name:** Prismatic

**Visual Theme:** Greenish gradient gem/prism aesthetic
- Primary gradient: Emerald → Teal → Lime
- Subtle spectral accents for depth
- Premium, gemstone-inspired feel

## Liquid Glass Design System

### Glass Component Specifications

**Core Glass Properties:**
- Backdrop blur: `blur(18px)` with `saturate(160%)`
- Glass surface background: `rgba(255,255,255,0.10)` (tune for dark mode)
- Border: `1px solid rgba(255,255,255,0.18)`
- Inner highlight: Soft top gradient via pseudo-element
- Shadow: Subtle soft shadow, never harsh
- Border radius: Large (18-28px for cards, 12-18px for buttons)

**Glass Components to Create:**
- GlassCard (main content containers)
- GlassPill (segmented controls, filters)
- GlassModal (dialogs, confirmations)
- GlassButton (CTAs, actions)
- GlassInput (form fields)
- GlassNavbar (site navigation)

### Segmented Control Pills
Model after Apple's segmented controls:
- Glass pill container with selected item slightly brighter
- Smooth sliding indicator animation
- Use for filters: Years/Months/All, PayPal/Card/Crypto/All
- Soft press feedback on selection

## Typography

**Font Stack:** SF Pro Display / Inter (clean Apple feel)
- Headings: Tight letter spacing (-0.02em), clean hierarchy
- Body: Regular weight, comfortable line height (1.6)
- Buttons: Medium weight, slightly rounded
- Scale: 14px base, 18px body, 24-48px headings

## Layout & Spacing

**Container Structure:**
- Max width: 1280px for content
- Generous padding: 24-32px on sections
- Card spacing: 16-24px gaps in grids
- Layered depth through stacked glass panels

**Responsive Breakpoints:**
- Mobile: Single column, compact spacing
- Tablet: 2-column grids where appropriate
- Desktop: Full multi-column layouts with generous whitespace

## Background System

**Prismatic Gradient Background:**
- Slow moving gradient blobs (emerald, teal, lime)
- Noise texture overlay for depth
- Optional mouse parallax on blobs (subtle, 10-20px movement)
- Ensure text readability with contrast layers
- Background should feel alive but never distracting

## Color Strategy
Focus on:
- Glass transparency and blur effects
- Prismatic gradient (emerald → teal → lime) as accent
- White/light content on glass for legibility
- Subtle spectral highlights for premium feel
- Avoid flat colors - embrace gradients and depth

## Page Layouts

### Landing Page Hero
- Large glass header section
- Segmented control pills for time filters (Years/Months/All)
- Clear value proposition with glass card treatment
- Smooth scroll indicators
- Hero image: Abstract prismatic/crystal visualization with gradient overlay

### Live Transactions Feed
- Real-time scrolling feed in glass container
- Each transaction: Payment icon + Amount + Time + Status
- Smooth entry animations (fade + slide from bottom)
- Filter pills at top: All / PayPal / Card / Crypto
- Auto-scroll with pause on hover

### Exchange Creation Flow
- Multi-step form in clean glass panels
- Animated progress indicator (glass pill steps)
- Clear validation states with glass treatment
- Success screen with subtle confetti effect (glass particles)
- Form inputs use GlassInput component

### Admin Dashboard
- Same glass design system throughout
- Card-based layout for different admin sections
- Upload areas for icons (PayPal, card, crypto)
- Transaction management table with glass rows
- Settings panels in glass cards
- Animation intensity toggle (Low/Medium/High) with glass segmented control

## Animation Guidelines

**Premium Motion (via Framer Motion):**
- Page transitions: Fade + slight scale (0.95 → 1.0)
- Hover states: Subtle lift (2-4px) + highlight sweep
- Glass shimmer on buttons (very subtle, 1-2 second duration)
- Segmented control indicator: Smooth slide with spring physics
- List items: Stagger fade-in (50ms delays)
- Background blobs: Slow drift (20-30s loops)

**Performance Rules:**
- Use `transform` and `opacity` only
- Respect `prefers-reduced-motion`
- GPU acceleration for blur effects
- Debounce parallax calculations

## Component-Specific Guidelines

### Buttons
- Glass background with subtle hover lift
- Shimmer effect on hover (highlight sweep)
- Active state: Slight scale down (0.98)
- Rounded (12-16px radius)
- Medium weight text

### Forms
- Glass input fields with soft borders
- Focus state: Brighter border, subtle glow
- Labels above inputs, small and uppercase
- Error states: Red tint to glass
- Success states: Green tint to glass

### Navigation
- Fixed glass navbar at top
- Blur increases on scroll
- Smooth transitions between sections
- Active state indicators with glass pill

### Transaction Cards
- Glass card per transaction
- Payment method icon (left)
- Amount (large, prominent)
- Time stamp (small, muted)
- Status badge (glass pill)
- Hover: Subtle lift + highlight

## Images

**Hero Section:**
- Large abstract prismatic/crystal visualization
- Gradient overlay (emerald → teal) for text legibility
- Buttons on hero use glass background with blur (no hover changes to blur)

**Payment Icons:**
- Upload custom icons for PayPal, card types, crypto
- Display at 24-32px size in transaction feed
- White or light colored for visibility on glass

## Accessibility
- Maintain 4.5:1 contrast for text on glass
- Keyboard navigation with focus indicators
- Respect reduced-motion preferences
- ARIA labels for interactive glass elements
- Touch targets minimum 44x44px

## Key Differentiators
- **Not generic crypto exchange** - Premium Apple-like experience
- **Living background** - Animated gradients, not static
- **Real-time everything** - WebSocket-powered transaction feed
- **Admin polish** - Dashboard feels as premium as public site
- **Performance first** - Smooth 60fps animations despite glass effects