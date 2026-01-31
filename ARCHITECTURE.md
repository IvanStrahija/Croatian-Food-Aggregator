# Croatian Food Aggregator - Architecture Overview

## System Overview

A mobile-first web application that aggregates restaurant and dish data from multiple sources (Wolt, Glovo, manual entry) in Croatia. Built with Next.js 14 (App Router), TypeScript, PostgreSQL, and Prisma ORM.

### Core Capabilities
- Browse restaurants and dishes without authentication
- Compare prices across Wolt, Glovo, and manual entries
- Write reviews (authenticated users only)
- Interactive map view with restaurant locations
- Trending restaurants and dishes based on weighted algorithm
- Community contributions (add restaurants/dishes not on platforms)
- Admin moderation for community-added content

## Architecture Decisions

### Frontend: Next.js 14 (App Router) + TypeScript
**Rationale:**
- Server-side rendering for SEO and initial load performance
- App Router provides modern patterns (server/client components)
- Built-in API routes eliminate need for separate backend
- Mobile-first responsive design with PWA capabilities
- Zero-config TypeScript support

### Database: PostgreSQL + Prisma ORM
**Rationale:**
- PostgreSQL: Robust, open-source, excellent geospatial support (PostGIS optional)
- Self-hosted on EC2 (cost-effective, full control)
- Prisma: Type-safe ORM, excellent migrations, developer experience
- Supports complex queries for trending algorithm and price comparisons

### Authentication: NextAuth.js
**Rationale:**
- Industry-standard solution for Next.js
- Supports credentials (email/password) out of the box
- Easy OAuth integration for future (Google, Facebook)
- Session management with JWT
- Anonymous browsing enabled by default

### Maps: Leaflet + OpenStreetMap
**Rationale:**
- No API keys or paid services required
- Lightweight, mobile-friendly
- OpenStreetMap provides Croatia coverage
- Nominatim for geocoding (rate-limited, suitable for manual entry)

### State Management: React Context + Server Components
**Rationale:**
- Server components reduce client-side JS bundle
- React Context for global state (auth, theme)
- No need for Redux/Zustand in MVP (can add later)

## Data Ingestion Architecture

### Connector Pattern
Pluggable architecture with three connector types:

1. **Wolt Connector** (Placeholder)
   - Interface: `IDataConnector`
   - Implementation: Placeholder that returns empty arrays
   - Configuration: Environment variables
   - Legal note: Requires official API partnership or data feed agreement
   
2. **Glovo Connector** (Placeholder)
   - Same interface as Wolt
   - Configuration: Environment variables
   - Legal note: Requires official API partnership

3. **Manual Connector** (Fully Implemented)
   - CSV import functionality
   - Admin UI for adding restaurants/dishes
   - Direct database writes via Prisma

### Data Flow
```
External Sources → Connectors → Data Normalization → Database → API Routes → UI
```

All connectors must:
- Return standardized data format
- Include metadata (source, timestamp)
- Handle errors gracefully
- Support incremental updates

## Database Schema (Simplified)

```
User → Reviews (1:N)
Restaurant → Dishes (1:N)
Restaurant → RestaurantServiceLinks (1:N)
Dish → DishPrices (1:N)
Dish → Reviews (1:N)
User → Favorites (1:N)
Restaurant → ViewEvents (1:N)
```

## Trending Algorithm

**Formula:**
```
TrendingScore = (
  viewsLast7Days * 1.0 +
  favoritesLast7Days * 2.0 +
  reviewsLast7Days * 3.0 +
  avgRating * 10.0
) / daysOld
```

**Configurable weights:**
- Views: 1.0 (base engagement)
- Favorites: 2.0 (stronger intent)
- Reviews: 3.0 (highest effort)
- Rating: 10.0 (quality multiplier)
- Recency bias: divide by days since creation (newer = higher)

**Implementation:**
- Computed in database query (efficient)
- Cached in-memory for 15 minutes
- Configurable via environment variables

## Security Considerations

1. **Authentication:**
   - Bcrypt password hashing (10 rounds)
   - JWT tokens with httpOnly cookies
   - CSRF protection via NextAuth

2. **Rate Limiting:**
   - Review creation: 5 per hour per user
   - API endpoints: in-memory store (upgrade to Redis later)

3. **Input Validation:**
   - Zod schemas for all user inputs
   - SQL injection prevented by Prisma parameterization
   - XSS prevention via React's default escaping

4. **Data Privacy:**
   - User emails not exposed in API responses
   - Review ownership verified server-side
   - Admin actions require role check

## Performance Strategy

### Current (MVP):
- In-memory caching (trending data, restaurant lists)
- Database indexes on foreign keys and search fields
- Prisma query optimization (select only needed fields)
- Image optimization via Next.js Image component

### Future Optimizations:
- Redis for distributed caching
- CDN for static assets
- Database read replicas
- ElasticSearch for advanced search
- Background jobs for trending calculation (Bull/BullMQ)

## Deployment Architecture (EC2)

```
Internet → CloudFlare/Route53 (DNS)
         → Nginx (reverse proxy, SSL termination)
         → Next.js (Node.js process on port 3000)
         → PostgreSQL (localhost:5432)
```

**Components:**
- **Nginx:** Reverse proxy, SSL (Let's Encrypt), static file serving
- **Systemd:** Process management for Next.js
- **PostgreSQL:** Local installation with regular backups
- **Let's Encrypt:** Free SSL certificates via certbot

**Scaling Path:**
1. Vertical scaling (larger EC2 instance)
2. Separate database to RDS or separate EC2
3. Load balancer + multiple app servers
4. Redis for session storage and caching

## Localization Strategy

**Current:**
- Dual language support: English (default) + Croatian
- Translation files: `locales/en.json`, `locales/hr.json`
- Simple t() function for client components
- Server components use dictionary approach

**Future:**
- next-intl or react-i18next for full i18n
- URL-based locale routing (/en/, /hr/)
- Browser language detection

## Mobile-First Design

### Breakpoints:
- Mobile: < 768px (default design)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Navigation:
- Mobile: Bottom navigation bar (Home, Search, Map, Account)
- Desktop: Top navigation bar
- Sticky positioning for easy access

### Touch Interactions:
- Minimum 44px touch targets
- Swipe gestures for image galleries
- Pull-to-refresh on lists (future)

## Testing Strategy

### Unit Tests (Jest):
- Authentication logic
- Trending algorithm calculation
- Data normalization functions

### Integration Tests (Playwright or Cypress):
- User registration/login flow
- Review creation and editing
- Price comparison display
- Map functionality

### Current Coverage:
- Review authorization
- Trending endpoint
- Price comparison retrieval

## Monitoring & Observability (Future)

**Recommended Stack:**
- **Logging:** Winston or Pino (structured logging)
- **Metrics:** Prometheus + Grafana
- **Errors:** Sentry
- **Uptime:** UptimeRobot or Pingdom
- **Database:** pg_stat_statements for query analysis

## Compliance & Legal

### Terms of Service:
- Clear attribution of data sources (Wolt/Glovo when used)
- User-generated content moderation policy
- Privacy policy for user data

### Data Sources:
- **Wolt/Glovo:** No scraping implemented. Placeholder connectors only.
- **Manual Data:** Community contributions with moderation
- **Future:** Partner API integrations with proper agreements

### GDPR Considerations:
- User data export capability (future)
- Right to deletion (cascade deletes in schema)
- Consent for data collection (future)

## Development Workflow

1. **Local Development:**
   - Docker Compose for consistent environment
   - Hot reload for rapid iteration
   - Seeded database for testing

2. **Code Quality:**
   - ESLint + Prettier for formatting
   - TypeScript strict mode
   - Pre-commit hooks (future: Husky)

3. **Version Control:**
   - Git with feature branches
   - Conventional commits (future)
   - PR reviews before merge (team setting)

## Project Constraints & Trade-offs

### Chosen Constraints:
- **Single EC2 instance:** Simpler deployment, lower cost, suitable for MVP
- **No external APIs initially:** Fully functional with manual data
- **In-memory caching:** Avoids Redis dependency for MVP
- **NextAuth credentials:** Quick setup, OAuth can be added later

### Trade-offs:
- **No real-time updates:** Acceptable for restaurant data (not time-critical)
- **Basic search:** Text-based initially, upgrade to ElasticSearch when needed
- **Single region:** Croatia-focused, simpler geospatial queries
- **No CDN yet:** Next.js Image optimization sufficient for MVP

## Success Metrics (Future)

- Daily active users (DAU)
- Reviews per restaurant
- Price comparison views
- Restaurant discovery via trending
- Community contributions rate
- Mobile vs desktop usage ratio

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Author:** System Architecture Team
