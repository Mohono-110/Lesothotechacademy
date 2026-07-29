# Lesotho Tech Academy — Official Website

A modern, responsive multi-page website for **Lesotho Tech Academy**, a premier IT training institution based in Leribe 300 District, Lesotho.

Built with Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui.

## 🚀 Live Features

- **Multi-page architecture** — Home, About Us, Courses, News Feed, Contact, Admissions, Student Dashboard
- **4 Professional Courses** with comprehensive content:
  | Course | Duration | Fee |
  |---|---|---|
  | Web Development Programming | 3 Months | M2,600 |
  | Computer Networks | 6 Months | M3,500 |
  | CMS Development & Customization | 6 Months | M4,000 |
  | Business Development Systems | 3 Months | M2,000 |
  | **Registration Fee** | *All Courses* | **M300** |
- **Student registration & login** system with bcrypt password hashing
- **Enrollment/application form** with payment proof upload (M-Pesa / EcoCash / Bank Transfer)
- **Mobile-responsive design** optimized for all screen sizes
- **SEO optimized** with OpenGraph, Twitter Cards, and geo metadata for Lesotho

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | Full-stack React framework (App Router) |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Component library |
| [Prisma ORM](https://www.prisma.io/) | Database management |
| [PostgreSQL](https://www.postgresql.org/) | Production database |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icon library |

## 📦 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohono-110/Lesothotechacademy.git
cd Lesothotechacademy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL (see below)

# Set up the database
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (with pooler for Vercel) |
| `DIRECT_DATABASE_URL` | Direct PostgreSQL connection (for Prisma migrations) |

## 🌐 Deploying to Vercel (Step-by-Step)

### Step 1: Create a Free PostgreSQL Database (Neon)

1. Go to [neon.tech](https://neon.tech) → Sign up (free)
2. Click **Create Project**
3. Name it: `lesotho-tech-academy`
4. Choose a region closest to Lesotho (e.g., **AWS eu-west-1** or **af-south-1**)
5. Click **Create Project**
6. On the dashboard, copy your connection strings — you'll need **two**:
   - **Pooled connection** → This is your `DATABASE_URL`
   - **Direct connection** → This is your `DIRECT_DATABASE_URL`

### Step 2: Push Your Database Schema

In your terminal (not Vercel), run:
```bash
# Set your environment variables temporarily
export DATABASE_URL="your_direct_connection_string_here"
export DIRECT_DATABASE_URL="your_direct_connection_string_here"

# Push the schema to create tables
npx prisma db push
```

### Step 3: Seed the Database (Add Courses)

After pushing the schema, seed the courses:
```bash
# Start the dev server
npm run dev

# In another terminal, run:
curl http://localhost:3000/api/seed
```

You should see a success message with 4 courses created.

### Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New → Project"**
3. Find and import **`Lesothotechacademy`** from your GitHub repos
4. **Configure Framework:** Vercel will auto-detect **Next.js** — leave as-is
5. **Build Command:** `npx prisma generate && next build`
6. **Install Command:** `npm install`
7. **Environment Variables** — Add these:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your **pooled** connection string from Neon |
   | `DIRECT_DATABASE_URL` | Your **direct** connection string from Neon |
8. Click **Deploy**

Your site will be live at `lesothotechacademy.vercel.app`! 🎉

### Step 5: Seed Courses on Vercel

After deployment, visit:
```
https://lesothotechacademy.vercel.app/api/seed
```
This will create the 4 courses in your production database.

### Custom Domain (Optional)

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g., `lesothotechacademy.com`)
3. Update DNS records at your domain registrar as instructed by Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── about/page.tsx        # About Us page
│   ├── courses/
│   │   ├── page.tsx          # Courses listing page
│   │   └── [slug]/page.tsx   # Individual course detail page
│   ├── news/page.tsx         # News Feed page
│   ├── contact/page.tsx      # Contact Us page
│   ├── admissions/page.tsx   # Admissions & Enrollment page
│   ├── login/page.tsx        # Student Login page
│   ├── register/page.tsx     # Student Registration page
│   ├── dashboard/page.tsx    # Student Dashboard
│   └── api/                  # API routes
│       ├── auth/             # Registration & Login
│       ├── courses/          # Course data
│       ├── applications/     # Enrollment applications
│       ├── payments/         # Payment proof upload
│       ├── contact/          # Contact form
│       ├── seed/             # Database seeder
│       └── admin/            # Admin management
├── components/
│   ├── shared/               # Navbar, Footer
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
└── lib/                      # Utilities, DB client, store
prisma/
└── schema.prisma             # Database schema (PostgreSQL)
public/
├── logo.png                  # Academy logo
└── robots.txt                # SEO robots
```

## 🎨 Branding

| Element | Color | Hex |
|---|---|---|
| Primary Green | LTA Green | `#4CAF50` |
| Primary Blue | LTA Blue | `#006CB7` |
| Dark Green | LTA Green Dark | `#388E3C` |
| Dark Blue | LTA Blue Dark | `#004A80` |

## 📄 License

© 2025 Lesotho Tech Academy. All rights reserved.

Founded by **Relebohile Joseph Mohono** — Leribe, Lesotho.
