/** The GET /guild/stats document, mirroring GuildStats in the Go API (internal/api/guild_stats.go). */
export interface PremiumRecord { tier: number; days: number }
export interface GuildStatsSummary {
    gamesPlayed: number;
    crewmateWins: number;
    impostorWins: number;
    /** Percentages of finished games, one decimal. A game with an unknown result counts for neither side. */
    crewmateWinrate: number;
    impostorWinrate: number;
}
export interface PlayerGames { userId: string; games: number }
export interface PlayerWinrate { userId: string; wins: number; games: number; winrate: number }
/** A pair of players who shared a role, lower user ID first. */
export interface DuoWinrate { userId: string; teammateId: string; wins: number; games: number; winrate: number }
export interface FirstTarget { userId: string; firstDeaths: number; crewmateGames: number; rate: number }
export interface KilledBy { userId: string; impostorId: string; deaths: number; games: number; rate: number }
/** The premium boards, five entries each; the bot's leaderboard size setting is not used on the web. */
export interface GuildLeaderboards {
    /** The guild's leaderboard minimum: games needed before a player or crewmate duo is ranked by rate. */
    minGames: number;
    mostGames: PlayerGames[];
    winrate: PlayerWinrate[];
    crewmateWinrate: PlayerWinrate[];
    impostorWinrate: PlayerWinrate[];
    bestImpostorDuo: DuoWinrate[];
    worstImpostorDuo: DuoWinrate[];
    bestCrewmateDuo: DuoWinrate[];
    worstCrewmateDuo: DuoWinrate[];
    firstTarget: FirstTarget[];
    killedBy: KilledBy[];
}
/** How a user is shown: the API resolves these through Discord with the bot's credentials, or from the names
 * the bot cached (which carry no avatar). */
export interface StatsPlayer {
    username: string;
    /** The display name the user chose for all of Discord, if any. */
    globalName?: string;
    /** The user's name in this guild, if they set one. */
    nickname?: string;
    /** A Discord CDN image URL. Absent when only the bot's name cache knew the user. */
    avatar?: string;
}
export interface GuildStats {
    guildId: string;
    premium: PremiumRecord;
    /** Unix seconds when the API built the document; it may be served from a short cache. */
    generatedAt: number;
    summary: GuildStatsSummary;
    /** Absent when the guild's premium is free or expired. */
    leaderboards?: GuildLeaderboards;
    /** Names for the user IDs on the boards. IDs the bot never cached are absent. */
    players: Record<string, StatsPlayer>;
}

/** The impostor duo boards use this fixed floor rather than the guild's minimum, as the API documents. */
export const IMPOSTOR_DUO_MIN_GAMES = 2;

const SNOWFLAKE = /^[0-9]{17,20}$/;
/** Only Discord's own image host is ever put in an <img>. */
const AVATAR_URL = /^https:\/\/cdn\.discordapp\.com\/[A-Za-z0-9_\/.-]+\.(png|gif|webp)(\?size=\d{1,4})?$/;

class Invalid extends Error {}
function fail(what: string): never { throw new Invalid(`Invalid guild stats: ${what}`); }
function record(value: unknown, what: string): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(what);
    return value as Record<string, unknown>;
}
function count(value: unknown, what: string): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(what);
    return value;
}
function id(value: unknown, what: string): string {
    if (typeof value !== "string" || !SNOWFLAKE.test(value)) fail(what);
    return value;
}
function list<T>(value: unknown, what: string, parse: (row: Record<string, unknown>, at: string) => T): T[] {
    if (!Array.isArray(value)) fail(what);
    return value.map((row, i) => parse(record(row, `${what}[${i}]`), `${what}[${i}]`));
}
const playerGames = (r: Record<string, unknown>, at: string): PlayerGames =>
    ({ userId: id(r.userId, `${at}.userId`), games: count(r.games, `${at}.games`) });
const playerWinrate = (r: Record<string, unknown>, at: string): PlayerWinrate =>
    ({ userId: id(r.userId, `${at}.userId`), wins: count(r.wins, `${at}.wins`), games: count(r.games, `${at}.games`), winrate: count(r.winrate, `${at}.winrate`) });
const duoWinrate = (r: Record<string, unknown>, at: string): DuoWinrate =>
    ({ userId: id(r.userId, `${at}.userId`), teammateId: id(r.teammateId, `${at}.teammateId`), wins: count(r.wins, `${at}.wins`), games: count(r.games, `${at}.games`), winrate: count(r.winrate, `${at}.winrate`) });
const firstTarget = (r: Record<string, unknown>, at: string): FirstTarget =>
    ({ userId: id(r.userId, `${at}.userId`), firstDeaths: count(r.firstDeaths, `${at}.firstDeaths`), crewmateGames: count(r.crewmateGames, `${at}.crewmateGames`), rate: count(r.rate, `${at}.rate`) });
const killedBy = (r: Record<string, unknown>, at: string): KilledBy =>
    ({ userId: id(r.userId, `${at}.userId`), impostorId: id(r.impostorId, `${at}.impostorId`), deaths: count(r.deaths, `${at}.deaths`), games: count(r.games, `${at}.games`), rate: count(r.rate, `${at}.rate`) });

/** Validates an upstream document and rebuilds it with only the fields the page reads, so nothing unexpected
 * reaches the browser and every number the page divides or sorts by is known to be a finite, non-negative
 * number. Throws when the shape is wrong; the proxy answers 502 in that case. */
export function parseGuildStats(body: unknown): GuildStats {
    const doc = record(body, "document");
    const premium = record(doc.premium, "premium");
    if (typeof premium.tier !== "number" || typeof premium.days !== "number") fail("premium");
    const s = record(doc.summary, "summary");
    const stats: GuildStats = {
        guildId: id(doc.guildId, "guildId"),
        premium: { tier: premium.tier, days: premium.days },
        generatedAt: count(doc.generatedAt, "generatedAt"),
        summary: {
            gamesPlayed: count(s.gamesPlayed, "summary.gamesPlayed"),
            crewmateWins: count(s.crewmateWins, "summary.crewmateWins"),
            impostorWins: count(s.impostorWins, "summary.impostorWins"),
            crewmateWinrate: count(s.crewmateWinrate, "summary.crewmateWinrate"),
            impostorWinrate: count(s.impostorWinrate, "summary.impostorWinrate"),
        },
        players: {},
    };
    if (doc.leaderboards !== undefined && doc.leaderboards !== null) {
        const b = record(doc.leaderboards, "leaderboards");
        stats.leaderboards = {
            minGames: count(b.minGames, "leaderboards.minGames"),
            mostGames: list(b.mostGames, "leaderboards.mostGames", playerGames),
            winrate: list(b.winrate, "leaderboards.winrate", playerWinrate),
            crewmateWinrate: list(b.crewmateWinrate, "leaderboards.crewmateWinrate", playerWinrate),
            impostorWinrate: list(b.impostorWinrate, "leaderboards.impostorWinrate", playerWinrate),
            bestImpostorDuo: list(b.bestImpostorDuo, "leaderboards.bestImpostorDuo", duoWinrate),
            worstImpostorDuo: list(b.worstImpostorDuo, "leaderboards.worstImpostorDuo", duoWinrate),
            bestCrewmateDuo: list(b.bestCrewmateDuo, "leaderboards.bestCrewmateDuo", duoWinrate),
            worstCrewmateDuo: list(b.worstCrewmateDuo, "leaderboards.worstCrewmateDuo", duoWinrate),
            firstTarget: list(b.firstTarget, "leaderboards.firstTarget", firstTarget),
            killedBy: list(b.killedBy, "leaderboards.killedBy", killedBy),
        };
    }
    // Names are a convenience, so a malformed entry is dropped rather than failing the whole document. Only
    // snowflake keys are kept, which also keeps prototype names out of the map.
    const players = doc.players === undefined || doc.players === null ? {} : record(doc.players, "players");
    for (const key of Object.keys(players)) {
        const p = players[key];
        if (!SNOWFLAKE.test(key) || !p || typeof p !== "object" || Array.isArray(p)) continue;
        const { username, nickname, globalName, avatar } = p as Record<string, unknown>;
        if (typeof username !== "string" || username === "") continue;
        const player: StatsPlayer = { username };
        if (typeof nickname === "string" && nickname !== "") player.nickname = nickname;
        if (typeof globalName === "string" && globalName !== "") player.globalName = globalName;
        if (typeof avatar === "string" && AVATAR_URL.test(avatar)) player.avatar = avatar;
        stats.players[key] = player;
    }
    return stats;
}

/** The document as a server without premium would receive it: the summary only, and a free premium record.
 * Used by the page's `preview=free` query flag so the free layout can be checked on a self-hosted stack, where
 * the API always reports premium. It only hides data; nothing is fetched differently. */
export function previewFree(stats: GuildStats): GuildStats {
    const { leaderboards, ...rest } = stats;
    return { ...rest, premium: { tier: 0, days: -9999 }, players: {} };
}

/** Made-up boards shown blurred, in the premium layout, to a server without premium, so the page looks the same
 * and the locked section is a preview rather than a gap. The IDs are not real users; they draw Discord's default
 * avatars. Nothing here is ever readable, so the values only need to look plausible. */
export function sampleLeaderboards(): GuildLeaderboards {
    const p = ["900000000000000001", "900000000000000002", "900000000000000003", "900000000000000004", "900000000000000005"];
    return {
        minGames: 3,
        mostGames: [{ userId: p[0], games: 142 }, { userId: p[1], games: 118 }, { userId: p[2], games: 97 }],
        winrate: [{ userId: p[1], wins: 81, games: 118, winrate: 68.6 }, { userId: p[0], wins: 90, games: 142, winrate: 63.4 }, { userId: p[3], wins: 40, games: 71, winrate: 56.3 }],
        crewmateWinrate: [{ userId: p[1], wins: 70, games: 96, winrate: 72.9 }, { userId: p[3], wins: 38, games: 58, winrate: 65.5 }, { userId: p[0], wins: 74, games: 115, winrate: 64.3 }],
        impostorWinrate: [{ userId: p[2], wins: 14, games: 21, winrate: 66.7 }, { userId: p[0], wins: 16, games: 27, winrate: 59.3 }, { userId: p[4], wins: 9, games: 17, winrate: 52.9 }],
        bestImpostorDuo: [{ userId: p[0], teammateId: p[2], wins: 6, games: 8, winrate: 75 }, { userId: p[1], teammateId: p[4], wins: 4, games: 7, winrate: 57.1 }],
        worstImpostorDuo: [{ userId: p[3], teammateId: p[4], wins: 1, games: 6, winrate: 16.7 }, { userId: p[1], teammateId: p[3], wins: 2, games: 5, winrate: 40 }],
        bestCrewmateDuo: [{ userId: p[1], teammateId: p[3], wins: 41, games: 52, winrate: 78.8 }, { userId: p[0], teammateId: p[1], wins: 61, games: 84, winrate: 72.6 }, { userId: p[2], teammateId: p[3], wins: 30, games: 45, winrate: 66.7 }],
        worstCrewmateDuo: [{ userId: p[2], teammateId: p[4], wins: 12, games: 33, winrate: 36.4 }, { userId: p[0], teammateId: p[4], wins: 20, games: 46, winrate: 43.5 }],
        firstTarget: [{ userId: p[4], firstDeaths: 19, crewmateGames: 61, rate: 31.1 }, { userId: p[2], firstDeaths: 17, crewmateGames: 76, rate: 22.4 }, { userId: p[3], firstDeaths: 11, crewmateGames: 58, rate: 19 }],
        killedBy: [{ userId: p[4], impostorId: p[0], deaths: 15, games: 22, rate: 68.2 }, { userId: p[3], impostorId: p[2], deaths: 11, games: 18, rate: 61.1 }, { userId: p[1], impostorId: p[0], deaths: 13, games: 24, rate: 54.2 }],
    };
}

/** Mirrors premium.IsExpired in Go: the free tier, or a day count that ran out (-9999 means no expiry). */
export function premiumActive(record: PremiumRecord): boolean {
    return !(record.tier === 0 || (record.days !== -9999 && record.days < 1));
}

function player(players: Record<string, StatsPlayer>, userId: string): StatsPlayer | undefined {
    return Object.prototype.hasOwnProperty.call(players, userId) ? players[userId] : undefined;
}

/** What to call a user on the boards: their nickname in this guild, else their Discord display name, else
 * their username, else nothing, in which case the page shows the ID itself. */
export function playerName(players: Record<string, StatsPlayer>, userId: string): string | undefined {
    const p = player(players, userId);
    return p?.nickname || p?.globalName || p?.username || undefined;
}

/** The avatar Discord assigns a user who never set one, by ID. Snowflakes exceed 53 bits, so BigInt. */
export function defaultAvatar(userId: string): string {
    const index = SNOWFLAKE.test(userId) ? Number((BigInt(userId) >> BigInt(22)) % BigInt(6)) : 0;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

/** The picture to show for a user: their resolved avatar, else the default Discord would show. */
export function avatarURL(players: Record<string, StatsPlayer>, userId: string): string {
    return player(players, userId)?.avatar || defaultAvatar(userId);
}

/** "62.5%" or "25%": the API already rounds to one decimal, so a whole number shows without ".0". */
export function percent(value: number): string {
    return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}
