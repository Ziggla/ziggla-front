@AGENTS.md

# Ziggla Backend Plan

## Overview

Ziggla is a luxury short-stay apartment rental platform in London. The backend is split into **two independent NestJS services** sharing one PostgreSQL database.

| Service | Purpose | Port |
|---------|---------|------|
| **`ziggla-api`** | REST — auth, users, properties, bookings, payments, reviews, contact, analytics | `3001` |
| **`ziggla-chat`** | WebSocket (Socket.IO) — real-time host↔guest messaging | `3002` |

### Recommended Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (TypeScript) — both services
- **ORM**: Prisma + PostgreSQL (shared schema)
- **Auth**: JWT (access + refresh tokens) + Google OAuth2 (Passport)
- **Real-time**: Socket.IO (`ziggla-chat` only)
- **Payments**: SumUp Checkout API
- **File Storage**: Vercel Blob
- **Email**: Resend
- **Deployment**: Railway — two services, one shared Postgres instance

---

## Database Schema (PostgreSQL via Prisma)

### `users`
```
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
email                 TEXT UNIQUE NOT NULL
password_hash         TEXT                        -- null if Google-only account
first_name            TEXT NOT NULL
last_name             TEXT NOT NULL
phone                 TEXT
nationality           TEXT                        -- ISO 3166-1 alpha-2 (GB, FR, US...)
role                  ENUM('user','host','admin') DEFAULT 'user'
avatar_url            TEXT
google_id             TEXT UNIQUE                 -- null if email/password account
is_adult_confirmed    BOOLEAN DEFAULT false
language              ENUM('en','fr') DEFAULT 'en'
notif_booking_updates BOOLEAN DEFAULT true
notif_sms             BOOLEAN DEFAULT false
notif_marketing       BOOLEAN DEFAULT true
is_deleted            BOOLEAN DEFAULT false
created_at            TIMESTAMPTZ DEFAULT now()
updated_at            TIMESTAMPTZ DEFAULT now()
```

### `properties`
```
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
slug            TEXT UNIQUE NOT NULL        -- e.g. "luxury-properties"
name            TEXT NOT NULL               -- e.g. "The Gilded Atelier"
address         TEXT NOT NULL               -- e.g. "800 Fulham Road, London SW6 5SL"
neighborhood    TEXT                        -- e.g. "Kensington"
size_sqm        INT
type            TEXT                        -- e.g. "Studio", "1 Bedroom"
price_per_night DECIMAL(10,2) NOT NULL
check_in_time   TEXT DEFAULT '15:00'
check_out_time  TEXT DEFAULT '11:00'
deposit         TEXT                        -- e.g. "£500"
host_id         UUID NOT NULL REFERENCES users(id)
max_guests      INT DEFAULT 2
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

### `property_amenities`
```
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
label       TEXT NOT NULL               -- e.g. "King-size bed", "High-speed WiFi"
```

### `property_rules`
```
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
label       TEXT NOT NULL               -- e.g. "No smoking", "No parties"
```

### `property_images`
```
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
url         TEXT NOT NULL               -- Vercel Blob URL
alt         TEXT
sort_order  INT DEFAULT 0
is_cover    BOOLEAN DEFAULT false
```

### `bookings`
```
id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
reference           TEXT UNIQUE NOT NULL    -- e.g. "ZG-9284" (auto-generated)
property_id         UUID NOT NULL REFERENCES properties(id)
user_id             UUID NOT NULL REFERENCES users(id)
check_in            DATE NOT NULL
check_out           DATE NOT NULL
nights              INT NOT NULL
guests_count        INT NOT NULL DEFAULT 1
first_name          TEXT NOT NULL           -- snapshot from booking form
last_name           TEXT NOT NULL
email               TEXT NOT NULL
phone               TEXT
special_requests    TEXT
price_per_night     DECIMAL(10,2) NOT NULL  -- snapshot at booking time
subtotal            DECIMAL(10,2) NOT NULL  -- price_per_night * nights
cleaning_fee        DECIMAL(10,2)           -- nullable
service_fee         DECIMAL(10,2) NOT NULL  -- 12% of subtotal
concierge_fee       DECIMAL(10,2)           -- nullable
occupancy_tax       DECIMAL(10,2)           -- nullable
total               DECIMAL(10,2) NOT NULL
currency            TEXT DEFAULT 'GBP'
status              ENUM('pending','confirmed','cancelled','checked_in','completed') DEFAULT 'pending'
cancelled_at        TIMESTAMPTZ
cancellation_reason TEXT
created_at          TIMESTAMPTZ DEFAULT now()
updated_at          TIMESTAMPTZ DEFAULT now()
```

### `payments`
```
id                   UUID PRIMARY KEY DEFAULT gen_random_uuid()
booking_id           UUID UNIQUE NOT NULL REFERENCES bookings(id)
amount               DECIMAL(10,2) NOT NULL
currency             TEXT DEFAULT 'GBP'
status               ENUM('pending','completed','failed','refunded') DEFAULT 'pending'
sumup_checkout_id    TEXT
sumup_transaction_id TEXT                -- filled on webhook
sumup_raw            JSONB               -- raw SumUp event payload
created_at           TIMESTAMPTZ DEFAULT now()
updated_at           TIMESTAMPTZ DEFAULT now()
```

### `reviews`
```
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
booking_id        UUID UNIQUE NOT NULL REFERENCES bookings(id)
property_id       UUID NOT NULL REFERENCES properties(id)
user_id           UUID NOT NULL REFERENCES users(id)
text              TEXT NOT NULL
score_staff       DECIMAL(3,1)            -- nullable
score_amenities   DECIMAL(3,1)            -- nullable
score_cleanliness DECIMAL(3,1)            -- nullable
score_comfort     DECIMAL(3,1)            -- nullable
score_value       DECIMAL(3,1)            -- nullable
score_location    DECIMAL(3,1)            -- nullable
score_wifi        DECIMAL(3,1)            -- nullable
overall_score     DECIMAL(3,1)            computed average when scores provided
created_at        TIMESTAMPTZ DEFAULT now()
```

### `conversations`
```
id               UUID PRIMARY KEY DEFAULT gen_random_uuid()
booking_id       UUID REFERENCES bookings(id)  -- null for pre-booking enquiries
property_id      UUID NOT NULL REFERENCES properties(id)
host_id          UUID NOT NULL REFERENCES users(id)
guest_id         UUID NOT NULL REFERENCES users(id)
last_message     TEXT
last_message_at  TIMESTAMPTZ
unread_host      INT DEFAULT 0
unread_guest     INT DEFAULT 0
created_at       TIMESTAMPTZ DEFAULT now()
```

### `messages`
```
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE
from_user_id    UUID NOT NULL REFERENCES users(id)
text            TEXT NOT NULL
read_at         TIMESTAMPTZ             -- null = unread
created_at      TIMESTAMPTZ DEFAULT now()
```

### `contact_inquiries`
```
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
full_name  TEXT NOT NULL
email      TEXT NOT NULL
subject    TEXT
message    TEXT NOT NULL
created_at TIMESTAMPTZ DEFAULT now()
```

### `refresh_tokens`
```
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
token_hash TEXT NOT NULL
expires_at TIMESTAMPTZ NOT NULL
created_at TIMESTAMPTZ DEFAULT now()
```

---

---

# API 1 — `ziggla-api` (REST)

**Base URL**: `https://api.ziggla.co.uk/api/v1`
**Port**: `3001`

## Endpoints

### Auth — `/auth`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Register with email + password | Public |
| POST | `/auth/login` | Login → access token + refresh token | Public |
| POST | `/auth/google` | Google OAuth token exchange | Public |
| POST | `/auth/refresh` | Rotate refresh token | Refresh token |
| POST | `/auth/logout` | Revoke refresh token | Bearer |
| POST | `/auth/forgot-password` | Send password reset email | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |

### Users — `/users`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/users/me` | Get own profile | Bearer |
| PATCH | `/users/me` | Update name, phone, nationality | Bearer |
| PATCH | `/users/me/avatar` | Upload avatar → Vercel Blob | Bearer |
| PATCH | `/users/me/preferences` | Language + notification prefs | Bearer |
| DELETE | `/users/me` | Soft-delete own account | Bearer |
| GET | `/users` | List all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| PATCH | `/users/:id/role` | Change user role | Admin |

### Properties — `/properties`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/properties` | List active properties (filters: type, maxPrice, minRating) | Public |
| GET | `/properties/:slug` | Detail + amenities + rules + images + reviews | Public |
| GET | `/properties/:id/availability` | Booked date ranges for calendar | Public |
| POST | `/properties` | Create property | Host / Admin |
| PATCH | `/properties/:id` | Update property | Host (own) / Admin |
| DELETE | `/properties/:id` | Deactivate property | Host (own) / Admin |
| POST | `/properties/:id/images` | Upload images → Vercel Blob | Host (own) / Admin |
| DELETE | `/properties/:id/images/:imageId` | Remove image | Host (own) / Admin |
| GET | `/properties/host/mine` | List own properties | Host |

### Bookings — `/bookings`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/bookings` | Create booking + initiate SumUp checkout | Bearer |
| GET | `/bookings/me` | Guest: list own bookings | Bearer |
| GET | `/bookings/me/:id` | Guest: booking detail | Bearer |
| DELETE | `/bookings/me/:id` | Guest: cancel (>48h before check-in) | Bearer |
| GET | `/bookings/host` | Host: bookings for own properties | Host |
| PATCH | `/bookings/:id/status` | Update booking status | Host / Admin |
| GET | `/bookings` | List all bookings (filters: status, dateRange) | Admin |
| GET | `/bookings/:id` | Get booking by ID | Admin |

### Payments — `/payments`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/payments/booking/:bookingId` | Payment status for a booking | Bearer (own) / Admin |
| POST | `/payments/webhook/sumup` | SumUp webhook → confirm booking | SumUp HMAC |
| GET | `/payments` | List all payments | Admin |
| POST | `/payments/:id/refund` | Trigger SumUp refund | Admin |

### Reviews — `/reviews`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/reviews` | Submit review (completed bookings only) | Bearer |
| GET | `/reviews/property/:propertyId` | List reviews for a property | Public |
| DELETE | `/reviews/:id` | Remove a review | Admin |

### Contact — `/contact`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/contact` | Submit contact inquiry | Public |
| GET | `/contact` | List all inquiries | Admin |

### Analytics — `/analytics`
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/analytics/revenue` | Monthly revenue (last 6 months) + total | Admin |
| GET | `/analytics/bookings` | Totals by status, last 30 days | Admin |
| GET | `/analytics/users` | Active users, new signups | Admin |
| GET | `/analytics/occupancy` | Occupancy rate per property | Admin |

## Module Structure — `ziggla-api`
```
src/
  auth/         AuthModule, JwtStrategy, GoogleStrategy, RefreshStrategy
  users/        UsersModule, UsersService, UsersController
  properties/   PropertiesModule, PropertiesService, PropertiesController
  bookings/     BookingsModule, BookingsService, BookingsController
  payments/     PaymentsModule, PaymentsService, PaymentsController
  reviews/      ReviewsModule, ReviewsService, ReviewsController
  contact/      ContactModule, ContactService, ContactController
  analytics/    AnalyticsModule, AnalyticsService, AnalyticsController
  storage/      StorageService (Vercel Blob wrapper)
  mail/         MailService (Resend wrapper)
  prisma/       PrismaService (global)
  common/
    guards/     JwtAuthGuard, RolesGuard
    decorators/ @CurrentUser(), @Roles()
    pipes/      ZodValidationPipe
```

---

---

# API 2 — `ziggla-chat` (WebSocket)

**Base URL**: `https://chat.ziggla.co.uk`
**Port**: `3002`
**Protocol**: Socket.IO over WebSocket

Auth uses the **same JWT** issued by `ziggla-api`. The client sends the token on connection handshake — the server verifies it and auto-joins the user to all their conversation rooms.

## REST Endpoints (conversation bootstrap)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/conversations` | List own conversations + unread counts | Bearer |
| GET | `/conversations/:id` | Conversation detail + last 50 messages | Bearer |
| POST | `/conversations` | Start new conversation (pre-booking enquiry) | Bearer |
| PATCH | `/conversations/:id/read` | Mark all messages as read | Bearer |

## Socket.IO Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `message:send` | `{ conversationId, text }` | Send a message |
| `message:read` | `{ conversationId }` | Mark messages as read |
| `typing:start` | `{ conversationId }` | Broadcast typing indicator |
| `typing:stop` | `{ conversationId }` | Stop typing indicator |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | `{ id, conversationId, fromUserId, text, createdAt }` | New message |
| `message:read_ack` | `{ conversationId, readAt }` | Read confirmation |
| `conversation:updated` | `{ id, lastMessage, lastMessageAt, unreadHost, unreadGuest }` | Refresh conversation list |
| `typing:indicator` | `{ conversationId, userId, isTyping }` | Other party typing |
| `error` | `{ code, message }` | Auth failure, not a participant, etc. |

## Room Strategy

Each conversation maps to a Socket.IO room `conv:<conversationId>`.
On connect → server auto-joins user to all their rooms.
On `message:send` → save to DB → emit `message:new` to room → update `last_message` + `unread_*`.

## Module Structure — `ziggla-chat`
```
src/
  auth/          JwtWsGuard (validates token from socket handshake)
  conversations/ ConversationsModule, ConversationsService, ConversationsController
  messages/      MessagesModule, MessagesService
  chat/          ChatGateway (@WebSocketGateway — all Socket.IO handlers)
  prisma/        PrismaService (shared DB)
  common/
    guards/      JwtWsGuard
    decorators/  @WsCurrentUser()
```

---

---

## Shared: Auth & Authorization

### JWT
- **Access token**: 15 min — validated by both `ziggla-api` and `ziggla-chat`
- **Refresh token**: 30 days, stored hashed in `refresh_tokens` — only managed by `ziggla-api`

### Roles
```typescript
@Roles('admin')
@Roles('host', 'admin')
@UseGuards(JwtAuthGuard, RolesGuard)
```

### Google OAuth
1. Frontend → `GET /auth/google/redirect`
2. Passport fetches Google profile
3. Upsert user by `google_id` or `email` → role defaults to `user`
4. Returns same JWT pair as email login

---

## Payment Flow (SumUp)

1. `POST /bookings` — creates booking `status: pending`, then:
   ```
   POST https://api.sumup.com/v0.1/checkouts
   { amount, currency: "GBP", checkout_reference: booking.reference,
     description: "Ziggla — {propertyName}" }
   ```
2. Returns `{ sumup_checkout_id, checkout_url }` → frontend redirects to SumUp page
3. SumUp calls `POST /payments/webhook/sumup` on success
4. Webhook verifies HMAC → `payments.status = completed`, `bookings.status = confirmed`
5. Resend sends confirmation email to guest

---

## Key Business Rules

- **Cancellation**: free >48h before check-in; forfeit cleaning fee <48h; forfeit full amount <24h
- **Reviews**: only guests with `status: completed` bookings can submit
- **Host isolation**: hosts read/update only their own properties and bookings
- **Soft delete**: `is_deleted: true` — history preserved, login blocked
- **Availability conflict**: check `check_in / check_out` overlap before creating booking
- **Reference**: `ZG-` + 4 random uppercase alphanumeric (e.g. `ZG-9284`)
- **Price snapshot**: `price_per_night` copied to booking row at creation time
- **Chat access**: only the host and guest of a booking (or admin) can join a conversation room

---

## Environment Variables

### `ziggla-api`
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://ziggla.co.uk

DATABASE_URL=postgresql://user:password@host:5432/ziggla

JWT_SECRET=...
JWT_REFRESH_SECRET=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://api.ziggla.co.uk/api/v1/auth/google/callback

SUMUP_API_KEY=...
SUMUP_MERCHANT_CODE=...
SUMUP_WEBHOOK_SECRET=...

BLOB_READ_WRITE_TOKEN=...

RESEND_API_KEY=...
RESEND_FROM=noreply@ziggla.co.uk
```

### `ziggla-chat`
```env
NODE_ENV=production
PORT=3002
FRONTEND_URL=https://ziggla.co.uk

DATABASE_URL=postgresql://user:password@host:5432/ziggla

JWT_SECRET=...
```
