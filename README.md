# AutoMute.us Web Application

## Getting Started

To run this application in development:

```bash
yarn install
yarn dev
```

To run this application in production:

```bash
yarn install
yarn build
yarn start <PORT> # e.g. yarn start 8080
```

## Environment Setup

To properly run this application, you need the following services and files:

- A PostgreSQL database with the schema defined in `prisma/schema.prisma` (TODO: have an `.sql` structure file here)
- A dot-env file configured in the root folder as `.env` containing the variables as outlined in `.env.sample`:

```bash
DISCORD_CLIENT_ID= # the Discord Client ID (https://discord.com/developers)
DISCORD_CLIENT_SECRET= # the Discord Client Secret (https://discord.com/developers)
DATABASE_URL= # db connection string (i.e. postgres://<user>:<password>@<host>:<port>/<db>)
NEXTAUTH_URL= # canonical URL of deploy instance (i.e. https://automute.us)
SECRET= # an encryption secret for any JSON Web Tokens (local sign-in sessions)
```

Additionally, you'll need to set up a valid callback URL in your Discord application registration (https://discord.com/developers) under "OAuth2" settings to match the pattern

```
<NEXTAUTH_URL>/api/auth/callback/discord
```

## Deployment

This application is deployed using Docker. To build and run this application:

```bash
docker build -t automuteus .
docker run --name automuteus -dp <PORT>:3000 automuteus:latest
```

You can stop and remove this application container with

```bash
docker stop automuteus
docker rm automuteus
```

**Note:** The name `automuteus` in the above commands can be substituted with any name you prefer.

## Planned Features

### General Features

- [x] **Discord sign-in**: sign in to the site with Discord OAuth2.

### Web Dashboard

The web dashboard will allow configuration and control of instances of the hosted AutoMuteUs bot.

- [ ] **Discord server invites**: invite bot with specific link to servers that the user has admin permissions on
- [ ] **Premium status checking**: check to see if a guild you're in has premium.
- [ ] **Settings management**: edit bot configuration online and have it save, per server
  - [ ] Shareable settings: add ability to publish popular bot configs and share them
- [ ] **Stats and leaderboards**: view server stats and leaderboards in a more user-friendly manner than Discord embeds.
  - [ ] Raw stats exports: export files (permissively) of game data so that people can create their own visualizations and metrics.