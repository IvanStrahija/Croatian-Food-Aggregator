# Croatian Food Aggregator

A mobile-first web application that aggregates restaurant and dish data from multiple sources (Wolt, Glovo, manual entry) in Croatia, allowing users to compare prices and write reviews.

## Features

- 📱 Mobile-first responsive design
- 🔍 Browse restaurants and dishes without account
- 💰 Compare prices across Wolt, Glovo, and manual entries
- ⭐ Write and manage dish reviews (authenticated users)
- 🗺️ Interactive map view with restaurant locations
- 🔥 Trending restaurants and dishes algorithm
- 👥 Community contributions (add restaurants not on platforms)
- 🔒 Secure authentication with NextAuth.js
- 🔌 Pluggable connector system for data ingestion

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Maps:** Leaflet + OpenStreetMap
- **Containerization:** Docker & Docker Compose

## Prerequisites

- Node.js 18+ 
- Docker & Docker Compose (for local development)
- PostgreSQL 16 (if not using Docker)

## Quick Start (Local Development)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd croatian-food-aggregator

# Copy environment variables
cp .env.example .env.local

# Edit .env.local and set NEXTAUTH_SECRET
# Generate a secret: openssl rand -base64 32
```

### 2. Start with Docker Compose

```bash
# Start PostgreSQL and the app
docker-compose up -d

# Wait for services to be healthy
docker-compose ps

# Run database migrations
docker-compose exec app npm run db:migrate

# Seed the database
docker-compose exec app npm run db:seed
```

### 3. Access the Application

- **App:** http://localhost:3000
- **Database Studio:** Run `docker-compose exec app npm run db:studio`

### 4. Test Credentials

```
Admin: admin@foodaggregator.hr / admin123
User: test@example.com / user123
```

## Alternative Setup (Without Docker)

### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql-16
sudo systemctl start postgresql

# Create database
createdb food_aggregator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

## Project Structure

```
croatian-food-aggregator/
├── prisma/                    # Database schema and migrations
├── src/
│   ├── app/                  # Next.js App Router (pages & API)
│   ├── components/           # React components
│   ├── lib/                  # Utilities (prisma, auth, cache)
│   ├── services/             # Business logic
│   ├── connectors/           # Data ingestion connectors
│   ├── types/                # TypeScript types
│   └── validators/           # Zod schemas
├── docker/                   # Docker configurations
└── tests/                    # Unit and integration tests
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed structure.

## Database Schema

The database uses PostgreSQL with Prisma ORM. Key entities:

- **User** - Authentication and user profiles
- **Restaurant** - Restaurant information and location
- **Dish** - Menu items with prices
- **DishPrice** - Price tracking across services
- **Review** - User reviews for dishes
- **RestaurantServiceLink** - Links to external services (Wolt/Glovo)
- **ViewEvent** - View tracking for trending algorithm
- **Favorite** - User favorites

See [prisma/schema.prisma](./prisma/schema.prisma) for complete schema.

## Data Connectors

### Overview

The app uses a pluggable connector system to ingest data from multiple sources:

1. **Wolt Connector** (Placeholder)
2. **Glovo Connector** (Placeholder)
3. **Manual Connector** (Fully functional)

### Important Legal Notice

⚠️ **Do NOT scrape or bypass protections on Wolt or Glovo websites.**

To use Wolt/Glovo connectors legally:

1. Contact Wolt/Glovo and request API partnership
2. Sign a data sharing agreement
3. Obtain official API credentials
4. Implement connector using official API endpoints

The placeholder implementations return empty data and serve as interfaces for future integration.

### Manual Data Import

The app is fully functional with manual data:

#### Via CSV Import

```bash
# Prepare CSV file with restaurants
# Format: name,address,city,latitude,longitude

# Import via CLI
npm run import:csv -- --file restaurants.csv --type restaurants
```

#### Via Admin UI

1. Login as admin
2. Navigate to Admin > Add Restaurant
3. Fill in restaurant details
4. Add dishes and prices manually

### Connector Configuration

Edit `.env.local`:

```bash
# Enable/disable connectors
WOLT_ENABLED=false
GLOVO_ENABLED=false

# API credentials (when obtained legally)
WOLT_API_KEY=your-key-here
WOLT_API_URL=https://api.wolt.com/v1

GLOVO_API_KEY=your-key-here
GLOVO_API_URL=https://api.glovoapp.com/v1
```

### Running Connectors

```bash
# Sync all enabled connectors
npm run sync:connectors

# Dry run (show what would change)
npm run sync:connectors -- --dry-run
```

## Trending Algorithm

The trending algorithm calculates scores based on:

```
Score = (views * W1 + favorites * W2 + reviews * W3 + rating * W4) / daysOld
```

### Default Weights

- Views: 1.0
- Favorites: 2.0
- Reviews: 3.0
- Rating: 10.0

### Configuration

Edit weights in `.env.local`:

```bash
TRENDING_WEIGHT_VIEWS=1.0
TRENDING_WEIGHT_FAVORITES=2.0
TRENDING_WEIGHT_REVIEWS=3.0
TRENDING_WEIGHT_RATING=10.0
TRENDING_CACHE_TTL=900  # 15 minutes
```

## API Routes

### Public Endpoints

- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/[id]` - Restaurant details
- `GET /api/restaurants/trending` - Trending restaurants
- `GET /api/dishes/trending` - Trending dishes
- `GET /api/dishes/[id]` - Dish details with price comparison

### Authenticated Endpoints

- `POST /api/reviews` - Create review
- `PUT /api/reviews/[id]` - Update review
- `DELETE /api/reviews/[id]` - Delete review
- `POST /api/favorites` - Add favorite

### Admin Endpoints

- `POST /api/restaurants` - Create restaurant
- `POST /api/connectors/sync` - Trigger connector sync
- `POST /api/connectors/import` - Import CSV

## Testing

### Run Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Files

- `tests/unit/trending.test.ts` - Trending algorithm
- `tests/integration/reviews.test.ts` - Review CRUD
- `tests/integration/restaurants.test.ts` - Restaurant endpoints

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Database commands
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema without migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

## Environment Variables

See [.env.example](./.env.example) for all available variables.

### Required Variables

```bash
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_URL             # App URL
NEXTAUTH_SECRET          # JWT secret (generate with openssl rand -base64 32)
```

### Optional Variables

```bash
# Trending algorithm
TRENDING_WEIGHT_*        # Algorithm weights
TRENDING_CACHE_TTL       # Cache duration in seconds

# Rate limiting
RATE_LIMIT_REVIEW_PER_HOUR    # Reviews per hour per user
RATE_LIMIT_API_PER_MINUTE     # API calls per minute

# Connectors
WOLT_ENABLED             # Enable Wolt connector
WOLT_API_KEY            # Wolt API key
GLOVO_ENABLED           # Enable Glovo connector
GLOVO_API_KEY           # Glovo API key

# Feature flags
FEATURE_REVIEWS_ENABLED
FEATURE_MAP_ENABLED
FEATURE_FAVORITES_ENABLED
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete EC2 deployment guide.

### Quick Deployment Summary

1. Provision EC2 instance (Ubuntu 22.04 LTS)
2. Install Node.js, PostgreSQL, Nginx
3. Clone repository and install dependencies
4. Configure environment variables
5. Run database migrations
6. Build application
7. Setup systemd service
8. Configure Nginx reverse proxy
9. Setup SSL with Let's Encrypt
10. Configure backups

## Contributing

### Adding a Restaurant

1. Login as admin
2. Navigate to Admin > Add Restaurant
3. Fill in details:
   - Name, address, location coordinates
   - Add dishes with prices
   - Mark service availability (Wolt/Glovo/Manual)

### Reporting Issues

Please include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## Future Roadmap

### Performance

- [ ] Redis for distributed caching
- [ ] Database read replicas
- [ ] CDN for static assets
- [ ] ElasticSearch for advanced search

### Features

- [ ] Image upload for dishes/restaurants
- [ ] OAuth providers (Google, Facebook)
- [ ] Real-time notifications
- [ ] Mobile PWA with offline support
- [ ] Multiple language support beyond EN/HR
- [ ] Advanced filtering and search
- [ ] Restaurant owner dashboard
- [ ] Dietary preferences and filters

### DevOps

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring and alerting (Prometheus + Grafana)
- [ ] Error tracking (Sentry)
- [ ] Load testing
- [ ] Blue-green deployment

### Data

- [ ] PostGIS for advanced geospatial queries
- [ ] Background jobs for data sync (Bull/BullMQ)
- [ ] Webhook support for connectors
- [ ] Data export functionality

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@foodaggregator.hr

## Acknowledgments

- Next.js team for the excellent framework
- Anthropic Claude for assistance in development
- OpenStreetMap for map data
- Croatian food delivery community
