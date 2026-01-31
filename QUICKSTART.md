# 🚀 Quick Start Guide

Get the Croatian Food Aggregator running in 5 minutes!

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (if running without Docker)
- 8GB RAM minimum
- 10GB free disk space

## Option 1: Docker (Recommended)

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Generate a secure secret
openssl rand -base64 32

# Edit .env.local and add the secret to NEXTAUTH_SECRET
```

### 2. Start Services

```bash
# Start PostgreSQL and the app
docker-compose up -d

# Check status (wait until healthy)
docker-compose ps
```

### 3. Initialize Database

```bash
# Run migrations
docker-compose exec app npm run db:migrate

# Seed with sample data
docker-compose exec app npm run db:seed
```

### 4. Access Application

- **App:** http://localhost:3000
- **Test Login:** test@example.com / user123
- **Admin Login:** admin@foodaggregator.hr / admin123

### 5. Development

```bash
# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Restart after code changes
docker-compose restart app
```

## Option 2: Local Development (No Docker)

### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16
createdb food_aggregator

# Ubuntu
sudo apt install postgresql-16
sudo systemctl start postgresql
sudo -u postgres createdb food_aggregator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env.local

# Edit .env.local:
# - Set DATABASE_URL to your PostgreSQL
# - Generate NEXTAUTH_SECRET: openssl rand -base64 32
```

### 4. Initialize Database

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Common Tasks

### Run Tests

```bash
npm test
```

### Open Database Studio

```bash
npm run db:studio
```

### Add New Restaurant (CSV Import)

```bash
npm run import:csv -- --file restaurants.csv --type restaurants
```

### Sync Connectors (when configured)

```bash
npm run sync:connectors
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure Overview

```
croatian-food-aggregator/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── lib/              # Core utilities
│   ├── services/         # Business logic
│   └── connectors/       # Data ingestion
├── prisma/
│   └── schema.prisma     # Database schema
├── docker-compose.yml    # Local development
└── README.md            # Full documentation
```

## Key Features

✅ Browse restaurants and dishes (no login required)  
✅ Compare prices across Wolt, Glovo, and manual entries  
✅ Write reviews (requires login)  
✅ Interactive map view  
✅ Trending restaurants and dishes  
✅ Mobile-first responsive design  
✅ Admin panel for data management  

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_URL` - App URL (http://localhost:3000)
- `NEXTAUTH_SECRET` - JWT secret (generate with openssl)

Optional (see .env.example for full list):
- Trending algorithm weights
- Rate limiting settings
- Connector API keys (Wolt/Glovo)

## Troubleshooting

### Port 3000 already in use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env.local
PORT=3001
```

### Database connection failed

```bash
# Check PostgreSQL is running
# Docker:
docker-compose ps

# Local:
pg_isready

# Test connection
psql -h localhost -U postgres -d food_aggregator
```

### Docker services won't start

```bash
# Remove old containers
docker-compose down -v

# Rebuild
docker-compose up --build
```

### Migration failed

```bash
# Reset database (WARNING: deletes all data)
docker-compose exec app npm run db:push -- --force-reset

# Or manually
psql -h localhost -U postgres -c "DROP DATABASE food_aggregator;"
psql -h localhost -U postgres -c "CREATE DATABASE food_aggregator;"
docker-compose exec app npm run db:migrate
```

## Next Steps

1. ✅ Get it running locally
2. 📖 Read [README.md](./README.md) for full features
3. 🏗️ Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
4. 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
5. 🗺️ Check [ROADMAP.md](./ROADMAP.md) for future features

## Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for codebase layout

## Production Deployment

For deploying to AWS EC2, see the comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide which covers:

- EC2 instance setup
- PostgreSQL configuration
- Nginx reverse proxy
- SSL certificates with Let's Encrypt
- Automated backups
- Monitoring and logging

## License

MIT License - see LICENSE file

---

**Happy coding! 🎉**

For questions or issues, please refer to the detailed documentation in README.md
