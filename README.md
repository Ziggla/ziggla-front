# Ziggla — Frontend

Luxury short-stay apartment rental platform. Two curated properties in Putney, London.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (en / fr) |
| Auth | Custom context + localStorage (JWT-ready) |
| State | React Context |
| Storage | Vercel Blob |
| Animations | Framer Motion |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Create `.env.local` at the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

If `NEXT_PUBLIC_API_URL` is not set or the API is unreachable, the app falls back to local mock data automatically — no backend required to run the frontend.

---

## Demo Accounts

The app ships with three built-in test accounts that work without a backend.

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Guest | `user@ziggla.com` | `ziggla123` | `/dashboard/user` |
| Host | `host@ziggla.com` | `ziggla123` | `/dashboard/host` |
| Admin | `admin@ziggla.com` | `ziggla123` | `/dashboard/admin` |

- **Guest / Host** → `/auth/login` (role toggle at top of form)
- **Admin** → `/auth/admin` (separate portal)

---

## Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── (public)/               # Public-facing pages
│       │   ├── page.tsx            # Home
│       │   ├── properties/         # Listing + detail
│       │   ├── host/[id]/          # Public host profile
│       │   ├── contact/
│       │   ├── privacy/
│       │   └── terms/
│       ├── auth/
│       │   ├── login/              # Guest + host login (role toggle)
│       │   ├── admin/              # Admin portal
│       │   ├── register/
│       │   ├── forgot-password/
│       │   └── reset-password/
│       ├── booking/
│       │   ├── [slug]/             # Booking form (receives total from property page)
│       │   └── confirmation/
│       ├── search/
│       └── dashboard/
│           ├── user/               # Guest dashboard + bookings + profile
│           ├── host/               # Host dashboard + properties + messages + payouts
│           └── admin/              # Admin dashboard + users + analytics + payments
│
├── components/
│   ├── layout/
│   │   ├── DashboardShell.tsx      # Sidebar + main area wrapper
│   │   ├── DashboardSidebar.tsx    # Per-role nav, real user info, logout
│   │   └── Navbar.tsx
│   ├── properties/
│   │   ├── BookingForm.tsx         # Date picker, price calc, CTA → booking page
│   │   ├── PropertyGallery.tsx
│   │   ├── AmenitiesList.tsx
│   │   └── HouseRules.tsx
│   ├── dashboard/
│   │   ├── PropertyCard.tsx
│   │   └── StayCard.tsx
│   └── AuthProvider.tsx            # Client wrapper for locale server layout
│
├── lib/
│   ├── auth/
│   │   ├── types.ts                # AuthUser type
│   │   ├── mockUsers.ts            # Demo credentials + mockLogin()
│   │   └── AuthContext.tsx         # Context, useAuth(), login(), logout()
│   └── api/
│       ├── client.ts               # apiFetch (with Bearer token) + mockFetch
│       ├── auth.ts
│       ├── users.ts
│       ├── properties.ts
│       ├── bookings.ts
│       ├── analytics.ts
│       └── messages.ts
│
└── data/
    └── mock/
        ├── users.json
        ├── properties.json
        ├── bookings.json
        └── analytics.json
```

---

## Auth Flow

```
/auth/login         →  role toggle (Guest / Host)
                        pre-fills demo credentials
                        calls POST /auth/login on API
                        falls back to mock if API unavailable
                        redirects to /dashboard/{role}

/auth/admin         →  admin-only portal
                        rejects non-admin logins
                        redirects to /dashboard/admin
```

Session is stored in `localStorage` as `ziggla_auth` (JSON: `AuthUser`).
`apiFetch` reads the token automatically and sends `Authorization: Bearer {token}` on every request.

---

## Booking Flow

```
/properties/[slug]          BookingForm computes:
                              nights = checkOut - checkIn
                              total  = nights × pricePerNight

  → click "Confirm Booking"

/booking/[slug]?checkIn=...&checkOut=...&guests=...&nights=...&total=...
                            reads params via useSearchParams()
                            displays real total in summary panel
```

---

## i18n

Supported locales: `en`, `fr`.
All copy lives in `src/messages/{en,fr}.json`.
URLs are prefixed: `/en/...`, `/fr/...`.
Default locale is `en` (no redirect).

---

## Backend (not included)

The frontend is designed to connect to two NestJS services defined in `CLAUDE.md`:

| Service | Port | Purpose |
|---|---|---|
| `ziggla-api` | `3001` | REST — auth, users, properties, bookings, payments |
| `ziggla-chat` | `3002` | WebSocket (Socket.IO) — real-time messaging |

Both services share one PostgreSQL database via Prisma.
Until the backend is running, every API call falls back silently to the local mock data.

---

## Scripts

```bash
npm run dev      # development server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```
