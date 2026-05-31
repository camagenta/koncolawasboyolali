# Handoff — 2026-05-31 Telegram Bot Notification System

## What Was Built

### Telegram Bot Notification (#53)
- **TelegramModule + TelegramService** — send HTML messages to Telegram Bot API via `fetch()`, zero npm dependencies
- **TelegramController** with webhook endpoint `POST /api/telegram/webhook` (public, receives bot commands)
- **Set webhook**: `GET /api/telegram/set-webhook` (admin-only, call once to register webhook)

### Notification Triggers
1. **New user login** (GoogleStrategy): When a user registers for the first time (`isNew === true`), bot notifies all recipients with name + email + timestamp
2. **Profile save** (ProfilesService): When user creates or updates their alumni profile, bot notifies all recipients with full profile data

### Skipped (development)
- `camagenta@gmail.com` excluded from both login and profile notifications to avoid spam during development

### DB-Based Recipients
- **Prisma model** `NotificationRecipient` — `chatId` (unique), `label`, `isActive`, `createdAt`
- **Auto-seed** owner (`TELEGRAM_OWNER_CHAT_ID`) as first recipient on startup if empty
- **notifyAll()** — sends to ALL active recipients in DB (no restart needed to add new ones)

### Bot Commands (via Webhook)
Anyone can send:
- `ikasmansaboy` — get their own Telegram chat ID
- `/help` — show available commands

Owner only (`TELEGRAM_OWNER_CHAT_ID`):
- `/addnotif <chatId> [label]` — add notification recipient
- `/removenotif <chatId>` — deactivate recipient
- `/listnotif` — list all recipients

### Environment Variables (backend/.env)
- `TELEGRAM_BOT_TOKEN` — from @BotFather
- `TELEGRAM_CHAT_ID` — deprecated (kept for reference), system now uses DB
- `TELEGRAM_OWNER_CHAT_ID` — Telegram user ID who can manage recipients

### Active Bot
- Bot handle: **@KoncoLawasBot**
- Token: `8832013274:AAEQxN3Elv45GDpG-QvnFOyT_EmIPwnZezg`
- Owner chat ID: `2212531` (camagenta)
- Webhook: `https://sma.kotakpasir.my.id/api/telegram/webhook`

### Landing Page Footer
- Added "Grup Facebook IKA" button linking to `https://web.facebook.com/groups/63868647864`
- Facebook icon + styled like Google login button (smaller)

## Files Changed
- `backend/src/modules/telegram/` — telegram.service.ts, telegram.module.ts, telegram.controller.ts
- `backend/src/modules/auth/strategies/google.strategy.ts` — +notifyAll on new login
- `backend/src/modules/auth/auth.module.ts` — import TelegramModule
- `backend/src/modules/alumni/profiles/profiles.service.ts` — +notifyAll on create/update
- `backend/src/modules/alumni/profiles/profiles.module.ts` — import TelegramModule
- `backend/src/app.module.ts` — register TelegramModule
- `backend/prisma/schema.prisma` — +NotificationRecipient model
- `backend/.env` — TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_OWNER_CHAT_ID
- `frontend/src/app/page.tsx` — footer Facebook group button

## Commits
- `508ed17` — feat: telegram bot notifications for new login & profile save (#53)
- `62a878d` — feat: add NotificationRecipient model + bot commands via webhook (#53)
- `818d58f` — feat: add 'ikasmansaboy' keyword to get Telegram chat ID (#53)
- `ccf013f` — feat: add Grup Facebook IKA button to landing page footer

## Uncommitted Changes (from previous sessions)
The following frontend files from sessions #46-#50 are still modified (unstaged):
- `frontend/public/alumni-berprestasi.html`
- `frontend/src/app/(app)/alumni-mengajar/page.tsx`
- `frontend/src/app/(app)/alumni/page.tsx`
- `frontend/src/app/(app)/bisnis/page.tsx`
- `frontend/src/app/(app)/page.tsx`
- `frontend/src/app/(app)/profile/page.tsx`
- `frontend/src/components/layout/app-shell.tsx`
- `frontend/src/components/layout/mobile-nav.tsx`
