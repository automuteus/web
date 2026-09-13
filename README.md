# AutoMute.us Web Application

The public website for AutoMuteUs: landing page, command reference, and premium sign-up. It has no database of its own;
signing in with Discord gives it a token it uses to list your servers, and everything else comes from the
[AutoMuteUs API](https://github.com/automuteus/automuteus).

## Getting Started

Requires Node 20 or newer (`.nvmrc` pins 24) and Yarn 1.

```bash
yarn install
yarn dev
```

To run a production build:

```bash
yarn build
yarn start -p <PORT> # e.g. yarn start -p 8080
```

## Environment Setup

Create a `.env` file in the root folder:

```bash
# NextAuth: the public URL of this site and a random secret (e.g. `openssl rand -base64 32`)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Discord OAuth application (https://discord.com/developers)
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Server-side AutoMuteUs API base URL for public stats and authenticated reads
# Use a trusted HTTPS endpoint in production; local HTTP is supported for development.
AUTOMUTEUS_API_URL=https://api.automute.us
```

In your Discord application, add a redirect under "OAuth2" matching

```
<NEXTAUTH_URL>/api/auth/callback/discord
```

## Deployment

This application is deployed using Docker:

```bash
docker build -t automuteus-web .
docker run --name automuteus-web --env-file .env -dp <PORT>:3000 automuteus-web:latest
```

Stop and remove it with

```bash
docker stop automuteus-web
docker rm automuteus-web
```

## Planned Features

The web dashboard will allow configuration and control of instances of the hosted AutoMuteUs bot. All of it is meant to
go through the AutoMuteUs API using Discord user tokens; the site itself stays stateless.

- [x] **Discord sign-in**: sign in to the site with Discord OAuth2.
- [ ] **Discord server invites**: invite bot with specific link to servers that the user has admin permissions on
- [ ] **Premium status checking**: check to see if a guild you're in has premium.
- [ ] **Settings management**: edit bot configuration online and have it save, per server
  - [ ] Shareable settings: add ability to publish popular bot configs and share them
- [ ] **Stats and leaderboards**: view server stats and leaderboards in a more user-friendly manner than Discord embeds.
  - [ ] Raw stats exports: export files (permissively) of game data so that people can create their own visualizations and metrics.

## Authenticated API reads

The browser calls these same-origin GET routes using its NextAuth session cookie:

| Web route | Go API route | Required query parameters |
| --- | --- | --- |
| `/api/guild/settings` | `/guild/settings` | `guildID` |
| `/api/guild/premium` | `/guild/premium` | `guildID` |
| `/api/game/state` | `/game/state` | `guildID`, `connectCode` |
| `/api/game/roomcode` | `/game/roomcode` | `guildID`, `connectCode` |

Example: `fetch("/api/guild/settings?guildID=123456789012345678")`.
These routes are ready for dashboard callers; this change does not add dashboard
screens, writes, or game discovery. The game endpoints still require a known
capture connect code. Go returns a filtered member game view and verifies that
room-code reads belong to the authorized guild.

`getServerSession` runs the existing JWT refresh callback and persists the updated
encrypted cookie, including rotated refresh tokens. A request-local callback
captures the access token for the outgoing `Authorization: Bearer ...` header;
the public `/api/auth/session` response never includes either Discord token.
Browser Authorization headers and extra query parameters are not forwarded.

Go independently enforces membership on each read. No platform admin credential
is used, and the existing `identify guilds` OAuth scopes suffice. Configure
`AUTOMUTEUS_API_URL` to a trusted API running bearer authentication; tokens are
sent only to that configured base URL, with redirects rejected. An unset URL
uses `https://api.automute.us`, matching the existing public stats default.

All authenticated responses use `Cache-Control: no-store`; writes are rejected
with 405. Upstream 400/401/403/404/429/503 statuses are preserved with safe messages;
other upstream failures, redirects, malformed JSON, and timeouts become 502.
A 401 means the UI should ask the user to sign in again; a 403 means insufficient
access. Do not retry 429/503 aggressively: the Go API currently checks Discord on
every read. API calls time out after 12 seconds; OAuth refresh after 8 seconds.

`/api/guilds` continues to call Discord because Go has no guild-list endpoint. It
now uses the same refresh-aware session helper and handles pagination. It keeps
all of the user's guilds, including non-admin guilds and guilds without the bot,
so the premium picker remains usable. Premium purchases and subscription
ownership remain separate from guild-read authorization.

Refresh tokens remain in encrypted cookies. Simultaneous refreshes across requests
or replicas are not coordinated; refresh failures require signing in again. A
shared refresh coordinator can be added if production traffic warrants it.

Validation: `yarn test` exercises the routes with real encrypted NextAuth cookies
and mocked upstream HTTP, including token rotation and cookie persistence.
`yarn typecheck` checks TypeScript; `yarn build` checks the production build.
