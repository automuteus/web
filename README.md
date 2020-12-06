# react-web
Requires Node, npm, and optionally yarn to be installed.

Run `node server.js` to start the backend express server that performs the Discord Oauth actions and flow. This requires the env variables CLIENT_ID and CLIENT_SECRET to be provided, as corresponding to the bot used for the Oauth flow: https://discord.com/developers/applications

Once the server is running, in a separate console/process, run `yarn` (or `npm install`) to install dependencies. Once this completes, run `yarn start` or `npm run start` and navigate to `localhost:3000` in your browser.

Original Template and License ```
[GitHub](https://github.com/Nouridio/Discord-bot-website-template)
[LICENSE](https://github.com/Nouridio/Discord-bot-website-template/blob/master/LICENSE)
