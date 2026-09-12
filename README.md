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

# AutoMuteUs API used for the stats on the home page (optional, defaults to the public instance)
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
go through the AutoMuteUs API once it accepts Discord user tokens; the site itself stays stateless.

- [x] **Discord sign-in**: sign in to the site with Discord OAuth2.
- [ ] **Discord server invites**: invite bot with specific link to servers that the user has admin permissions on
- [ ] **Premium status checking**: check to see if a guild you're in has premium.
- [ ] **Settings management**: edit bot configuration online and have it save, per server
  - [ ] Shareable settings: add ability to publish popular bot configs and share them
- [ ] **Stats and leaderboards**: view server stats and leaderboards in a more user-friendly manner than Discord embeds.
  - [ ] Raw stats exports: export files (permissively) of game data so that people can create their own visualizations and metrics.
