# Task: Lesotho Tech Academy - News, Contact, Admissions Pages

## Files Created

### 1. `/api/contact/route.ts` — Contact Form API
- POST endpoint that saves contact messages to the ContactMessage model via Prisma
- Validates required fields (name, email, subject, message)
- Returns success/error JSON responses

### 2. `src/app/news/page.tsx` — News Feed Page
- Page header with "News & Events" title, breadcrumb navigation
- Featured article card with gold styling about LSMTA Science Fair 2026 winners
  - Full article text about 3 students from Millicent Academy winning 1st & 2nd Prize
  - External link to millicentacademy.co.ls (target="_blank")
- 6 news cards in responsive grid (1/2/3 columns):
  - Online Classes Now in Progress
  - New Course: Business Development Systems
  - M-Pesa & EcoCash Payment Now Available
  - Registration Open for 2026 Intake
  - Founder Relebohile Mohono Featured in Tech
  - Lesotho Tech Academy Partners with Local Schools
- Newsletter signup with email input and subscribe button (visual only, no API)
- Uses framer-motion stagger animations, glass-card, gradient-text CSS classes

### 3. `src/app/contact/page.tsx` — Contact Us Page
- Page header with "Contact Us" title, breadcrumb
- Two-column layout (stacked on mobile):
  - Left: Contact form with react-hook-form style manual validation
    - Full Name (required), Email (required), Phone, Subject (required), Message (required)
    - POST to /api/contact, success toast via sonner
    - Loading state with spinner
  - Right: Contact information cards (MapPin, Phone, Mail, Globe, Clock icons)
    - Location, Phone, Email, Website, Office Hours
  - Map placeholder (gray box with MapPin icon)
- Uses framer-motion animations, glass-card styling

### 4. `src/app/admissions/page.tsx` — Admissions / Enrollment Page
- Page header with "Admissions" title, breadcrumb, subtitle
- 3-step "How to Apply" process (Register → Apply → Pay)
  - Step 1 links to /register
- Multi-section enrollment form:
  - Section 1: Personal Information (First/Last Name, Email, Phone, DOB, Gender)
  - Section 2: Course Selection (dropdown with 4 courses, prices shown)
  - Section 3: Additional Information (Education level, Prior experience, Motivation)
  - Section 4: Payment Information (Radio card payment methods, Transaction ref, Screenshot upload with preview, Amount M300 disabled)
- Submit to /api/applications (JSON) + /api/payments (FormData for screenshot)
- Fee information sidebar (sticky, registration fee M300, accepted methods, course fees reference)
- Full validation, loading states, toast notifications

## Design Patterns
- Colors: lta-green (#4CAF50), lta-blue (#006CB7) via Tailwind custom colors
- CSS classes: gradient-text, glass-card, section-pattern, btn-glow-green, animate-fade-in-up
- Responsive: mobile-first with sm/md/lg breakpoints
- All pages use 'use client' for framer-motion
- No Navbar/Footer in pages (handled by root layout.tsx)
- shadcn/ui components: Card, Button, Input, Textarea, Label, Select, RadioGroup, Badge, Breadcrumb, Separator
