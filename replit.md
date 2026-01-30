# ZengoSwap - Premium Crypto Exchange Platform

## Overview

ZengoSwap is a premium cryptocurrency exchange platform featuring an Apple-inspired "Liquid Glass" design aesthetic. The application provides a real-time transaction feed, multi-step exchange flow, and an admin dashboard for managing transactions, cryptocurrencies, and platform settings. The visual theme emphasizes translucent frosted panels, gradient backgrounds, and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side router)
- **State Management:** TanStack React Query for server state
- **Styling:** TailwindCSS with custom CSS variables for theming
- **Animations:** Framer Motion for smooth UI transitions
- **Component Library:** Radix UI primitives with shadcn/ui styling

**Design System:** Custom "Liquid Glass" components located in `client/src/components/glass/`:
- GlassCard, GlassButton, GlassInput, GlassPill, GlassModal, GlassNavbar
- PrismaticBackground for animated gradient backgrounds
- Implements backdrop blur, soft borders, and glow effects

**Page Structure:**
- Home (`/`) - Landing page with transaction feed and stats
- Exchange (`/exchange`) - Multi-step fiat-to-crypto exchange wizard
- Swap (`/swap`) - Crypto-to-crypto swap with 0.2% fee
- Verify (`/verify`) - Transaction verification page
- Admin (`/admin`) - Dashboard for managing platform content
- 404 - Not found fallback

### Backend Architecture

**Runtime:** Node.js with Express
- **Build Tool:** tsx for TypeScript execution in development
- **Production Build:** esbuild for server bundling, Vite for client
- **WebSocket:** Native `ws` library for real-time transaction updates

**API Design:** RESTful endpoints under `/api/` prefix
- Transactions CRUD (`/api/transactions`)
- Cryptocurrencies management (`/api/cryptos`)
- Currencies management (`/api/currencies`)
- Settings key-value store (`/api/settings`)
- Swap wallets CRUD (`/api/swap-wallets`) - Manage crypto addresses for swaps
- Live crypto prices (`/api/prices`) - Fetches BTC, ETH, SOL, USDT, LTC, XRP, BNB, BCH, USDC, TRX prices from CoinGecko with 5-minute caching

**Real-time Updates:** WebSocket server at `/ws` path broadcasts new transactions to connected clients

### Data Storage

**Database:** PostgreSQL with Drizzle ORM
- Schema defined in `shared/schema.ts`
- Migrations managed via `drizzle-kit push`
- Connection via `pg` Pool using `DATABASE_URL` environment variable

**Schema Tables:**
- `users` - Admin authentication
- `transactions` - Exchange transaction records
- `cryptos` - Supported cryptocurrencies with wallet addresses
- `currencies` - Fiat currencies
- `settings` - Key-value configuration store
- `swapWallets` - Crypto addresses and QR codes for crypto-to-crypto swaps

### Build System

**Development:** Vite dev server with HMR proxied through Express
**Production:** 
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist/index.cjs`
- Selective dependency bundling for faster cold starts

## External Dependencies

### Database
- **PostgreSQL** - Primary data store (requires `DATABASE_URL` environment variable)
- **Drizzle ORM** - Type-safe database queries and schema management

### Frontend Libraries
- **@tanstack/react-query** - Server state management and caching
- **framer-motion** - Animation library for React
- **react-icons** - Payment method icons (PayPal, Bitcoin, Ethereum)
- **lucide-react** - General icon library
- **date-fns** - Date formatting utilities

### UI Components
- **Radix UI** - Accessible primitive components (dialog, dropdown, tabs, etc.)
- **shadcn/ui** - Pre-styled component variants
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Tailwind class conflict resolution

### Real-time Communication
- **ws** - WebSocket server for live transaction broadcasting

### Validation
- **zod** - Runtime schema validation
- **drizzle-zod** - Generate Zod schemas from Drizzle tables
- **@hookform/resolvers** - Form validation integration
