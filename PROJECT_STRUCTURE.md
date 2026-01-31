# Project Structure

```
croatian-food-aggregator/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Seed data for development
│   └── migrations/                # Database migrations
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── restaurants/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Restaurant detail page
│   │   │   └── page.tsx          # Restaurant list
│   │   ├── dishes/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Dish detail page
│   │   ├── map/
│   │   │   └── page.tsx          # Map view
│   │   ├── account/
│   │   │   ├── page.tsx          # User profile
│   │   │   └── reviews/
│   │   │       └── page.tsx      # User's reviews
│   │   ├── admin/
│   │   │   ├── restaurants/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Add restaurant
│   │   │   │   └── page.tsx      # Manage restaurants
│   │   │   └── import/
│   │   │       └── page.tsx      # CSV import
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts  # NextAuth handler
│   │   │   ├── restaurants/
│   │   │   │   ├── route.ts      # List/create
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts  # Get/update/delete
│   │   │   │   └── trending/
│   │   │   │       └── route.ts  # Trending restaurants
│   │   │   ├── dishes/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── trending/
│   │   │   │       └── route.ts  # Trending dishes
│   │   │   ├── reviews/
│   │   │   │   ├── route.ts      # Create review
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # Update/delete review
│   │   │   ├── connectors/
│   │   │   │   ├── sync/
│   │   │   │   │   └── route.ts  # Trigger sync
│   │   │   │   └── import/
│   │   │   │       └── route.ts  # CSV import
│   │   │   └── favorites/
│   │   │       └── route.ts
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Rating.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── restaurant/
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── RestaurantGrid.tsx
│   │   │   ├── PriceComparison.tsx
│   │   │   └── ServiceBadge.tsx
│   │   ├── dish/
│   │   │   ├── DishCard.tsx
│   │   │   ├── DishGrid.tsx
│   │   │   └── DishReviews.tsx
│   │   ├── review/
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   └── ReviewList.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   └── RestaurantMarker.tsx
│   │   └── trending/
│   │       ├── TrendingRestaurants.tsx
│   │       └── TrendingDishes.tsx
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── cache.ts              # In-memory cache
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── geocoding.ts          # Nominatim geocoding
│   │   └── utils.ts              # Helper functions
│   │
│   ├── services/                 # Business logic
│   │   ├── trending.service.ts   # Trending algorithm
│   │   ├── review.service.ts     # Review operations
│   │   ├── restaurant.service.ts # Restaurant CRUD
│   │   └── dish.service.ts       # Dish operations
│   │
│   ├── connectors/               # Data ingestion connectors
│   │   ├── types.ts              # Connector interfaces
│   │   ├── base-connector.ts     # Abstract base class
│   │   ├── wolt-connector.ts     # Wolt placeholder
│   │   ├── glovo-connector.ts    # Glovo placeholder
│   │   ├── manual-connector.ts   # Manual/CSV import
│   │   └── connector-manager.ts  # Connector orchestration
│   │
│   ├── types/                    # TypeScript types
│   │   ├── api.ts                # API types
│   │   ├── models.ts             # Domain models
│   │   └── next-auth.d.ts        # NextAuth type extensions
│   │
│   ├── validators/               # Zod schemas
│   │   ├── restaurant.schema.ts
│   │   ├── dish.schema.ts
│   │   ├── review.schema.ts
│   │   └── user.schema.ts
│   │
│   └── locales/                  # Internationalization
│       ├── en.json               # English translations
│       └── hr.json               # Croatian translations
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   └── placeholder-dish.jpg
│   └── icons/
│       └── favicon.ico
│
├── tests/                        # Test files
│   ├── unit/
│   │   ├── trending.test.ts
│   │   └── auth.test.ts
│   ├── integration/
│   │   ├── reviews.test.ts
│   │   └── restaurants.test.ts
│   └── setup.ts
│
├── scripts/                      # Utility scripts
│   ├── import-csv.ts            # CSV import CLI
│   └── sync-connectors.ts       # Run connector sync
│
├── docker/
│   ├── Dockerfile               # Production Docker image
│   └── docker-compose.yml       # Local development setup
│
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment (gitignored)
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── jest.config.js              # Jest configuration
├── README.md                   # Setup instructions
├── DEPLOYMENT.md               # EC2 deployment guide
├── ARCHITECTURE.md             # This document
└── LICENSE                     # MIT License
```

## Key Directory Explanations

### `/src/app`
Next.js 14 App Router structure. Each folder becomes a route. Route groups like `(auth)` don't affect URL structure.

### `/src/components`
Organized by feature (restaurant, dish, review) and shared UI components. Mobile-first design.

### `/src/lib`
Core utilities and configurations. Includes database client, auth setup, and caching.

### `/src/services`
Business logic layer. Services orchestrate database operations and implement complex algorithms.

### `/src/connectors`
Data ingestion layer. Pluggable connectors for Wolt, Glovo, and manual imports.

### `/prisma`
Database schema and migrations. Seed file for development data.

### `/tests`
Unit and integration tests following the Testing Library philosophy.

### `/scripts`
CLI tools for admin tasks like CSV imports and connector synchronization.

## File Naming Conventions

- **React Components:** PascalCase (e.g., `RestaurantCard.tsx`)
- **Utility Functions:** camelCase (e.g., `geocoding.ts`)
- **API Routes:** `route.ts` (Next.js convention)
- **Pages:** `page.tsx` (Next.js convention)
- **Types:** PascalCase for interfaces/types (e.g., `Restaurant`, `DishPrice`)
- **Constants:** UPPER_SNAKE_CASE when exported

## Import Aliases

```typescript
// Configured in tsconfig.json
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import type { Restaurant } from '@/types/models'
```

## Environment-Specific Files

- **`.env.local`**: Local development (gitignored)
- **`.env.production`**: Production secrets (gitignored)
- **`.env.example`**: Template with all required variables
- **`docker-compose.yml`**: Development environment setup
