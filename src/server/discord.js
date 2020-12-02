const express = require('express');
const { catchAsync } = require('../utils');

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:8080/api/discord/callback');

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    let response = await oauth.tokenRequest({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,

        code: code,
        scope: "identify guilds",
        grantType: "authorization_code",

        redirectUri: "http://localhost:8080/api/discord/callback",
    });
    res.redirect(`/?token=${response.access_token}`);
}));

module.exports = router;
