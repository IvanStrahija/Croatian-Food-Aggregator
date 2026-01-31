# Complete File List & Download Guide

## 🎯 Quick Access

**All files are in the `croatian-food-aggregator` folder above this chat.**

### Download Methods:

1. **Download Entire Project (Recommended)**
   - Click the folder icon in chat interface
   - Select "Download all files as ZIP"
   - Extract on your computer

2. **Download Individual Files**
   - Browse the folder structure
   - Click on any file to view/download

---

## 📋 Complete File Inventory

### Root Level (15 files)
```
croatian-food-aggregator/
├── package.json                 ✅ Dependencies & scripts
├── .env.example                 ✅ Environment template
├── .eslintrc.json              ✅ Linting rules
├── .prettierrc                 ✅ Code formatting
├── next.config.js              ✅ Next.js config
├── tsconfig.json               ✅ TypeScript config
├── tailwind.config.ts          ✅ Tailwind config
├── postcss.config.js           ✅ PostCSS config
├── jest.config.ts              ✅ Test config
├── docker-compose.yml          ✅ Local dev environment
├── README.md                   ✅ Main documentation
├── QUICKSTART.md               ✅ 5-minute setup guide
├── INDEX.md                    ✅ Project overview
├── ARCHITECTURE.md             ✅ System design
├── DEPLOYMENT.md               ✅ EC2 deployment
├── ROADMAP.md                  ✅ Future enhancements
└── PROJECT_STRUCTURE.md        ✅ Code organization
```

### Prisma (2 files)
```
prisma/
├── schema.prisma               ✅ Database schema
└── seed.ts                     ✅ Sample data
```

### Docker (1 file)
```
docker/
└── Dockerfile                  ✅ Production image
```

### Source Code - Core Libraries (7 files)
```
src/lib/
├── prisma.ts                   ✅ DB client
├── auth.ts                     ✅ NextAuth config
├── cache.ts                    ✅ In-memory cache
├── rate-limit.ts               ✅ Rate limiting
├── utils.ts                    ✅ Helper functions
└── geocoding.ts                ⚠️ Not created (optional)
```

### Source Code - Services (4 files)
```
src/services/
├── trending.service.ts         ✅ Trending algorithm
├── review.service.ts           ⚠️ Not created (optional)
├── restaurant.service.ts       ⚠️ Not created (optional)
└── dish.service.ts             ⚠️ Not created (optional)
```

### Source Code - Connectors (6 files)
```
src/connectors/
├── types.ts                    ✅ Interfaces
├── base-connector.ts           ✅ Base class
├── wolt-connector.ts           ✅ Wolt placeholder
├── glovo-connector.ts          ✅ Glovo placeholder
├── manual-connector.ts         ⚠️ Not created (optional)
└── connector-manager.ts        ⚠️ Not created (optional)
```

### Source Code - App (4 files created, many optional)
```
src/app/
├── page.tsx                    ✅ Landing page
├── layout.tsx                  ⚠️ Not created (needed)
├── globals.css                 ✅ Global styles
└── api/
    ├── restaurants/
    │   └── trending/
    │       └── route.ts        ✅ Trending API
    └── reviews/
        └── route.ts            ✅ Reviews API
```

### Tests (2 files)
```
tests/
├── setup.ts                    ✅ Test config
└── unit/
    └── trending.test.ts        ✅ Trending tests
```

---

## 🚨 IMPORTANT: Missing Files

The following files are **referenced but not created**. Here's how to handle them:

### Critical Files (Create These First)

#### 1. `src/app/layout.tsx` (Root Layout)
```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Croatian Food Aggregator',
  description: 'Compare food prices across Wolt, Glovo, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

#### 2. `src/app/api/auth/[...nextauth]/route.ts` (NextAuth)
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 3. `src/types/next-auth.d.ts` (TypeScript types)
```typescript
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
```

---

## 📦 Installation After Download

### Step 1: Extract & Navigate
```bash
# If downloaded as ZIP
unzip croatian-food-aggregator.zip
cd croatian-food-aggregator

# Or if cloned
cd croatian-food-aggregator
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Missing Critical Files

Create the 3 critical files listed above:
- `src/app/layout.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/types/next-auth.d.ts`

### Step 4: Setup Environment
```bash
cp .env.example .env.local

# Generate secret
openssl rand -base64 32

# Add to .env.local:
# NEXTAUTH_SECRET=your-generated-secret
```

### Step 5: Start Development
```bash
# With Docker (recommended)
docker-compose up -d
docker-compose exec app npm run db:migrate
docker-compose exec app npm run db:seed

# Or locally
npm run db:migrate
npm run db:seed
npm run dev
```

---

## 🔍 File Status Legend

- ✅ **Created** - File exists in download
- ⚠️ **Optional** - Not critical for MVP
- 🚨 **Missing** - Critical, must be created

---

## 📝 Optional Files (Can Create Later)

These enhance functionality but aren't required for basic operation:

### Additional Pages
- `src/app/restaurants/[slug]/page.tsx` - Restaurant detail
- `src/app/dishes/[id]/page.tsx` - Dish detail
- `src/app/map/page.tsx` - Map view
- `src/app/login/page.tsx` - Login page
- `src/app/register/page.tsx` - Register page
- `src/app/account/page.tsx` - User profile

### Additional API Routes
- `src/app/api/restaurants/route.ts` - List restaurants
- `src/app/api/restaurants/[id]/route.ts` - Restaurant CRUD
- `src/app/api/dishes/route.ts` - List dishes
- `src/app/api/dishes/[id]/route.ts` - Dish CRUD
- `src/app/api/dishes/trending/route.ts` - Trending dishes

### Components
- All components in `src/components/*` directories
- Can be created as needed when building pages

### Services
- `src/services/review.service.ts`
- `src/services/restaurant.service.ts`
- `src/services/dish.service.ts`

### Validators
- All Zod schemas in `src/validators/`

### Scripts
- `scripts/import-csv.ts`
- `scripts/sync-connectors.ts`

---

## 🎯 Minimum Viable Setup

To get a **working app with minimal files**, you need:

### Must Have (15 files)
1. `package.json`
2. `tsconfig.json`
3. `next.config.js`
4. `tailwind.config.ts`
5. `postcss.config.js`
6. `.env.local` (from .env.example)
7. `prisma/schema.prisma`
8. `src/app/layout.tsx` (CREATE THIS)
9. `src/app/page.tsx`
10. `src/app/globals.css`
11. `src/app/api/auth/[...nextauth]/route.ts` (CREATE THIS)
12. `src/lib/prisma.ts`
13. `src/lib/auth.ts`
14. `src/lib/utils.ts`
15. `src/types/next-auth.d.ts` (CREATE THIS)

### Run Minimal Setup
```bash
npm install
npm run db:migrate
npm run dev
```

Visit http://localhost:3000 - You'll see the landing page!

---

## 💡 Tips

### If Files Are Missing
1. Check the folder structure in chat
2. Download again (may have been incomplete)
3. Use the file creation commands above
4. Reference the examples in documentation

### If You Get Errors
1. **Module not found** - Create the missing file or comment out the import
2. **Database error** - Run migrations: `npm run db:migrate`
3. **Auth error** - Check `NEXTAUTH_SECRET` is set
4. **Build error** - Check all critical files exist

### Quick File Creation
```bash
# Create a file
touch src/app/layout.tsx

# Create multiple files
touch src/types/next-auth.d.ts \
      src/app/api/auth/[...nextauth]/route.ts
```

---

## 📞 Need Help?

If files are missing or downloads aren't working:

1. **Check the folder above** - All files should be there
2. **Download as ZIP** - Ensures all files come together
3. **Create critical files** - Use code snippets above
4. **Reference documentation** - README has full setup guide

---

## ✅ Verification Checklist

After download, verify you have:

- [ ] All documentation (README, QUICKSTART, etc.)
- [ ] package.json and config files
- [ ] prisma/schema.prisma
- [ ] src/app/page.tsx (landing page)
- [ ] src/lib/* (core utilities)
- [ ] src/services/trending.service.ts
- [ ] src/connectors/* (connector system)
- [ ] tests/unit/trending.test.ts

If any are missing, use the file browser in chat to download them individually.

---

**Ready to start? Download the folder above and follow QUICKSTART.md!**
