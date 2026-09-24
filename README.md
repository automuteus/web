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
- [x] **Discord server invites**: invite bot with specific link to servers that the user has admin permissions on
- [ ] **Premium status checking**: check to see if a guild you're in has premium.
- [x] **Settings management**: edit bot configuration online and have it save, per server 
  - [ ] Shareable settings: add ability to publish popular bot configs and share them
- [ ] **Stats and leaderboards**: view server stats and leaderboards in a more user-friendly manner than Discord embeds.
  - [ ] Raw stats exports: export files (permissively) of game data so that people can create their own visualizations and metrics.

## Authenticated API reads

The browser calls these same-origin GET routes using its NextAuth session cookie:

| Web route | Go API route | Required query parameters |
| --- | --- | --- |
| `/api/guild/settings` (GET, PATCH) | `/guild/settings` | `guildID` |
| `/api/guild/premium` | `/guild/premium` | `guildID` |
| `/api/guild/bot` | `/guild/bot` | `guildID` |
| `/api/guild/channel` | `/guild/channel` | `guildID`, `channelID` |
| `/api/guild/channels` | `/guild/channels` | `guildID` |
| `/api/guild/roles` | `/guild/roles` | `guildID` |
| `/api/guild/stats` | `/guild/stats` | `guildID` |
| `/api/settings/defaults` | `/bot/settings/defaults` | none; no sign-in needed |
| `/api/game/state` | `/game/state` | `guildID`, `connectCode` |
| `/api/game/roomcode` | `/game/roomcode` | `guildID`, `connectCode` |

Example: `fetch("/api/guild/settings?guildID=123456789012345678")`.
The `/settings` page uses the settings, premium, and bot routes. The bot route
adds an `invite` URL when the bot is absent, built from `DISCORD_CLIENT_ID` and
preselecting that server. `PATCH /api/guild/settings` forwards a JSON object of
changed fields with the caller's session and the `If-Match` tag from the GET;
the site only accepts the fields it can edit, applies the API's range checks
first, and relays the API's `fields` list on 400 and 403 so the page can point
at the offending control. Game discovery is not yet implemented. The game endpoints still require a known
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

## Server settings page

Open `/settings` or use Settings in the navigation. Sign in, select a Discord
server, and view its voice rules, transition delays, display preferences, and
match summary options. Leaderboard settings are not shown, since stats are
moving to this UI, and the legacy bot admin user ID list is not shown because
the bot no longer uses it. Only servers the user owns or holds the Administrator
or Manage Server permission in are listed, matching the Go API's rule for who
may change settings. A selection is shareable as `/settings?guild=<guild ID>`;
each visitor still needs to own or manage it.

Values that differ from the bot's defaults carry a **Custom** badge whose
tooltip shows the default, and unsaved edits get an amber highlight on the row
or cell; each card header counts both ("3 custom · 1 unsaved"). Defaults
come from the Go API's public `/bot/settings/defaults` route, so the two never
drift; if that request fails the page just shows no markers. Settings the bot
applies only on premium servers carry a gold **Premium** badge. That list is
kept in the view, mirroring the Go settings package's premium snapshot.

If the bot is not in the selected server, the page offers an invite link that
preselects that server instead of showing settings. Membership comes from the
guild join and leave events the bot has processed, so it may lag briefly after
an invite or a removal; use the refresh button after inviting.

Owners, administrators, and members with Manage Server can change most
settings here: bot language, voice rules, delays, map style, room code
visibility, auto refresh, spectator muting, dead-player unmuting, summary
retention, the summary channel, and the operator role IDs. Operator roles gate
who may start, pause, end, link, and unlink games (everyone, when the list is
empty); the guild owner and members with Administrator or Manage Server always
may, and they alone can change settings, whether here or with `/settings`. The
page loads the guild's roles through `/api/guild/roles` (the
bot's view, in Discord order, without @everyone) and shows operator roles by
name with their colour, with a picker to add more; if that request fails it
falls back to raw IDs typed by hand. The API refuses a changed list that names a
role the guild does not have, when it has bot credentials; without them IDs are
accepted as typed. Bot admin user IDs and leaderboard options remain hidden. The language list, with names and
flags, lives in `components/settings/settings-edit.ts` and mirrors the locale
files embedded in the Go repo; the API validates the code on save, so a stale
entry is rejected rather than stored. Edits are held locally until **Save changes**
sends one PATCH with only the changed fields and the loaded version tag; a
concurrent change elsewhere is reported and the page offers a reload. Premium
gated settings are locked in the UI when the server has no premium, and the API
refuses them regardless. The summary channel is picked from the server's text
and announcement channels, loaded through `/api/guild/channels` (the bot's
view, in Discord's order and grouped by category); channels the bot cannot post
in are greyed out with the reason, and the Go API requires the settings
permission for that list because channel names can be private. **Enter an ID**
switches to a typed channel ID, for a thread or when the list is unavailable
(the page explains how to copy one from Discord). Once a well-formed ID is
typed the page asks `/api/guild/channel` whether the bot can post there; the
row shows the resolved channel name, or the problem, and Save waits for a good
answer. The Go API repeats the same check when the setting is saved: the channel must
exist and be visible to the bot, belong to the guild, be a text or announcement
channel or a thread in one, and grant the bot View Channel, Embed Links, and
Send Messages (Send Messages in Threads instead, for a thread). Missing response fields
are shown as unavailable rather than silently substituted with defaults. Servers
with no stored settings receive the API's defaults. Language codes and configured
Discord user/role/channel IDs are shown as stored; Discord name lookup is future
work. Server changes abort the previous request and hide its data immediately.
No background polling is used.

## Server stats page

Open `/stats` or use Stats in the navigation. Sign in, select a Discord server
you belong to, and the page shows what `/stats guild` reports in Discord: games
played, crewmate and impostor wins, and, on servers with premium, the
leaderboards (most games, winrates overall and by role, best and worst duos,
first to die, killed by). Any member may view a server's stats, the same as the
slash command, so the picker lists every server the user is in rather than
only those they manage. A selection is shareable as `/stats?guild=<guild ID>`.

The page loads `/api/guild/bot` first and offers an invite when the bot is
absent, then `/api/guild/stats`. The Go API builds the document at most once a
minute per server, so **Reload stats** within that window returns the same
figures. The proxy validates the upstream document against the shape in
`components/stats/guild-stats.ts` and drops anything else; a document that
does not fit is a 502. The free tier receives no `leaderboards` key; the page
then shows the same hall of fame and boards filled with made-up, blurred
entries, under a prompt linking to `/premium?guild=<guild ID>` so the server
arrives preselected. The blurred section is hidden from assistive technology. A self-hosted API always reports
premium, so `/stats?guild=<guild ID>&preview=free` shows the free layout for
that server instead; it only hides the boards on the client. Players are shown
with the name and avatar the Go API resolved through Discord with the bot's
token (nickname, else display name, else username), or with the name the bot
cached for that server; IDs nothing knows are shown as-is. Avatars are only
ever loaded from Discord's CDN, and a player without one gets the default
Discord would show them.
