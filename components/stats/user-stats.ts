import { PremiumRecord, StatsPlayer, parsePlayers } from "./guild-stats";
import { COLORS, MAP_NAMES, MatchMap, MatchResult, RESULT_NAMES, Role } from "./match-summary";

/** The GET /guild/user document, mirroring UserStats in the Go API (internal/api/user_stats.go). */
export interface RoleRecord { games: number; wins: number; winrate: number }
export interface UserStatsSummary {
    games: number;
    wins: number;
    winrate: number;
    crewmate: RoleRecord;
    impostor: RoleRecord;
    /** Unix seconds of the player's first and latest games; absent with no games. */
    firstGame?: number;
    lastGame?: number;
}
export interface UserMatch {
    matchId: string;
    startTime: number;
    endTime: number;
    result: MatchResult;
    /** Absent for matches recorded before maps were stored. */
    map?: MatchMap;
    name: string;
    /** An in-game color key, or "" when the page has no sprite for it. */
    color: string;
    role: Role;
    won: boolean;
}
/** A place on a guild board, 1 being first, out of the players the board ranks. */
export interface BoardRank { position: number; players: number }
export interface UserRanks { games?: BoardRank; winrate?: BoardRank; crewmateWinrate?: BoardRank; impostorWinrate?: BoardRank }
/** Consecutive games with a known winner. Current is positive for wins, negative for losses. */
export interface Streaks { current: number; bestWin: number; bestLoss: number }
export interface Survival { games: number; survived: number; rate: number }
/** Times of the player's games in a role something happened, and how many of those their side still won. */
export interface Fate { times: number; games: number; rate: number; wins: number; winrate: number }
export interface UserFates { killedAsCrewmate: Fate; votedOutAsCrewmate: Fate; votedOutAsImpostor: Fate }
export interface UserFirstTarget { firstDeaths: number; crewmateGames: number; rate: number }
export interface ColorShare { color: string; games: number; share: number }
export interface NameShare { name: string; games: number; share: number }
export interface PlayedWith { userId: string; games: number; share: number }
export interface Teammate { userId: string; wins: number; games: number; winrate: number }
export interface DiedWith { impostorId: string; deaths: number; games: number; rate: number }
/** Games per week, oldest first, the last week ending at `until`. */
export interface Activity { until: number; weeks: number[] }
export interface MapRecord { map: MatchMap; games: number; wins: number; winrate: number }
export interface UserStatsDetails {
    /** The guild's leaderboard minimum, for the rate ranks, crewmate teammates, and killed-by list. */
    minGames: number;
    ranks: UserRanks;
    streaks: Streaks;
    survival: Survival;
    fates: UserFates;
    firstTarget: UserFirstTarget;
    colors: ColorShare[];
    names: NameShare[];
    playedWith: PlayedWith[];
    bestCrewmateTeammates: Teammate[];
    worstCrewmateTeammates: Teammate[];
    bestImpostorTeammates: Teammate[];
    worstImpostorTeammates: Teammate[];
    killedBy: DiedWith[];
    activity: Activity;
    maps: MapRecord[];
}
export interface UserStats {
    guildId: string;
    userId: string;
    premium: PremiumRecord;
    generatedAt: number;
    summary: UserStatsSummary;
    /** Newest first, at most ten. */
    recentMatches: UserMatch[];
    /** Absent when the guild's premium is free or expired. */
    details?: UserStatsDetails;
    players: Record<string, StatsPlayer>;
}

const SNOWFLAKE = /^[0-9]{17,20}$/;
const MATCH_ID = /^[1-9][0-9]{0,17}$/;
const ROLES: readonly string[] = ["crewmate", "impostor"];

class Invalid extends Error {}
function fail(what: string): never { throw new Invalid(`Invalid player stats: ${what}`); }
function record(value: unknown, what: string): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(what);
    return value as Record<string, unknown>;
}
function count(value: unknown, what: string): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(what);
    return value;
}
function integer(value: unknown, what: string): number {
    if (typeof value !== "number" || !Number.isInteger(value)) fail(what);
    return value;
}
function id(value: unknown, what: string): string {
    if (typeof value !== "string" || !SNOWFLAKE.test(value)) fail(what);
    return value;
}
function list<T>(value: unknown, what: string, parse: (row: Record<string, unknown>, at: string) => T | undefined): T[] {
    if (!Array.isArray(value)) fail(what);
    const rows: T[] = [];
    value.forEach((row, i) => { const parsed = parse(record(row, `${what}[${i}]`), `${what}[${i}]`); if (parsed !== undefined) rows.push(parsed); });
    return rows;
}
function roleRecord(value: unknown, what: string): RoleRecord {
    const r = record(value, what);
    return { games: count(r.games, `${what}.games`), wins: count(r.wins, `${what}.wins`), winrate: count(r.winrate, `${what}.winrate`) };
}
function rank(value: unknown, what: string): BoardRank | undefined {
    if (value === undefined || value === null) return undefined;
    const r = record(value, what);
    return { position: count(r.position, `${what}.position`), players: count(r.players, `${what}.players`) };
}
function fate(value: unknown, what: string): Fate {
    const r = record(value, what);
    return { times: count(r.times, `${what}.times`), games: count(r.games, `${what}.games`), rate: count(r.rate, `${what}.rate`), wins: count(r.wins, `${what}.wins`), winrate: count(r.winrate, `${what}.winrate`) };
}
const teammate = (r: Record<string, unknown>, at: string): Teammate =>
    ({ userId: id(r.userId, `${at}.userId`), wins: count(r.wins, `${at}.wins`), games: count(r.games, `${at}.games`), winrate: count(r.winrate, `${at}.winrate`) });

function match(r: Record<string, unknown>, at: string): UserMatch {
    if (typeof r.matchId !== "string" || !MATCH_ID.test(r.matchId)) fail(`${at}.matchId`);
    if (typeof r.name !== "string") fail(`${at}.name`);
    if (typeof r.role !== "string" || !ROLES.includes(r.role)) fail(`${at}.role`);
    if (typeof r.won !== "boolean") fail(`${at}.won`);
    const m: UserMatch = {
        matchId: r.matchId,
        startTime: count(r.startTime, `${at}.startTime`),
        endTime: count(r.endTime, `${at}.endTime`),
        // A result, map, or color added to the API later is shown as unknown rather than failing the page.
        result: typeof r.result === "string" && Object.prototype.hasOwnProperty.call(RESULT_NAMES, r.result) ? r.result as MatchResult : "unknown",
        name: r.name,
        color: typeof r.color === "string" && COLORS.includes(r.color) ? r.color : "",
        role: r.role as Role,
        won: r.won,
    };
    if (typeof r.map === "string" && Object.prototype.hasOwnProperty.call(MAP_NAMES, r.map)) m.map = r.map as MatchMap;
    return m;
}

function details(value: unknown): UserStatsDetails {
    const d = record(value, "details");
    const ranks = record(d.ranks, "details.ranks");
    const streaks = record(d.streaks, "details.streaks");
    const survival = record(d.survival, "details.survival");
    const fates = record(d.fates, "details.fates");
    const first = record(d.firstTarget, "details.firstTarget");
    const activity = record(d.activity, "details.activity");
    if (!Array.isArray(activity.weeks)) fail("details.activity.weeks");
    const parsed: UserStatsDetails = {
        minGames: count(d.minGames, "details.minGames"),
        ranks: {},
        streaks: { current: integer(streaks.current, "details.streaks.current"), bestWin: count(streaks.bestWin, "details.streaks.bestWin"), bestLoss: count(streaks.bestLoss, "details.streaks.bestLoss") },
        survival: { games: count(survival.games, "details.survival.games"), survived: count(survival.survived, "details.survival.survived"), rate: count(survival.rate, "details.survival.rate") },
        fates: {
            killedAsCrewmate: fate(fates.killedAsCrewmate, "details.fates.killedAsCrewmate"),
            votedOutAsCrewmate: fate(fates.votedOutAsCrewmate, "details.fates.votedOutAsCrewmate"),
            votedOutAsImpostor: fate(fates.votedOutAsImpostor, "details.fates.votedOutAsImpostor"),
        },
        firstTarget: { firstDeaths: count(first.firstDeaths, "details.firstTarget.firstDeaths"), crewmateGames: count(first.crewmateGames, "details.firstTarget.crewmateGames"), rate: count(first.rate, "details.firstTarget.rate") },
        // Colors the page has no sprite for, and maps it cannot name, are left out.
        colors: list(d.colors, "details.colors", (r, at) => {
            const games = count(r.games, `${at}.games`), share = count(r.share, `${at}.share`);
            return typeof r.color === "string" && COLORS.includes(r.color) ? { color: r.color, games, share } : undefined;
        }),
        names: list(d.names, "details.names", (r, at) => {
            if (typeof r.name !== "string") fail(`${at}.name`);
            return { name: r.name, games: count(r.games, `${at}.games`), share: count(r.share, `${at}.share`) };
        }),
        playedWith: list(d.playedWith, "details.playedWith", (r, at) => ({ userId: id(r.userId, `${at}.userId`), games: count(r.games, `${at}.games`), share: count(r.share, `${at}.share`) })),
        bestCrewmateTeammates: list(d.bestCrewmateTeammates, "details.bestCrewmateTeammates", teammate),
        worstCrewmateTeammates: list(d.worstCrewmateTeammates, "details.worstCrewmateTeammates", teammate),
        bestImpostorTeammates: list(d.bestImpostorTeammates, "details.bestImpostorTeammates", teammate),
        worstImpostorTeammates: list(d.worstImpostorTeammates, "details.worstImpostorTeammates", teammate),
        killedBy: list(d.killedBy, "details.killedBy", (r, at) =>
            ({ impostorId: id(r.impostorId, `${at}.impostorId`), deaths: count(r.deaths, `${at}.deaths`), games: count(r.games, `${at}.games`), rate: count(r.rate, `${at}.rate`) })),
        activity: { until: count(activity.until, "details.activity.until"), weeks: activity.weeks.map((w, i) => count(w, `details.activity.weeks[${i}]`)) },
        maps: list(d.maps, "details.maps", (r, at) => {
            const row = { games: count(r.games, `${at}.games`), wins: count(r.wins, `${at}.wins`), winrate: count(r.winrate, `${at}.winrate`) };
            return typeof r.map === "string" && Object.prototype.hasOwnProperty.call(MAP_NAMES, r.map) ? { map: r.map as MatchMap, ...row } : undefined;
        }),
    };
    for (const key of ["games", "winrate", "crewmateWinrate", "impostorWinrate"] as const) {
        const r = rank(ranks[key], `details.ranks.${key}`);
        if (r) parsed.ranks[key] = r;
    }
    return parsed;
}

/** Validates an upstream document and rebuilds it with only the fields the page reads. Throws when the shape is
 * wrong; the proxy answers 502 in that case. */
export function parseUserStats(body: unknown): UserStats {
    const doc = record(body, "document");
    const premium = record(doc.premium, "premium");
    if (typeof premium.tier !== "number" || typeof premium.days !== "number") fail("premium");
    const s = record(doc.summary, "summary");
    const stats: UserStats = {
        guildId: id(doc.guildId, "guildId"),
        userId: id(doc.userId, "userId"),
        premium: { tier: premium.tier, days: premium.days },
        generatedAt: count(doc.generatedAt, "generatedAt"),
        summary: {
            games: count(s.games, "summary.games"),
            wins: count(s.wins, "summary.wins"),
            winrate: count(s.winrate, "summary.winrate"),
            crewmate: roleRecord(s.crewmate, "summary.crewmate"),
            impostor: roleRecord(s.impostor, "summary.impostor"),
        },
        recentMatches: list(doc.recentMatches, "recentMatches", match),
        players: parsePlayers(doc.players === undefined || doc.players === null ? {} : record(doc.players, "players")),
    };
    if (s.firstGame !== undefined && s.firstGame !== null) stats.summary.firstGame = count(s.firstGame, "summary.firstGame");
    if (s.lastGame !== undefined && s.lastGame !== null) stats.summary.lastGame = count(s.lastGame, "summary.lastGame");
    if (doc.details !== undefined && doc.details !== null) stats.details = details(doc.details);
    return stats;
}

/** The document as a server without premium would receive it: no details, a free premium record, and only the
 * player's own name. Used by the page's `preview=free` query flag; it only hides data. */
export function previewFree(stats: UserStats): UserStats {
    const { details, ...rest } = stats;
    const players = Object.prototype.hasOwnProperty.call(stats.players, stats.userId) ? { [stats.userId]: stats.players[stats.userId] } : {};
    return { ...rest, premium: { tier: 0, days: -9999 }, players };
}

/** Made-up details shown blurred, in the premium layout, to a server without premium. The IDs are not real users;
 * nothing here is ever readable, so the values only need to look plausible. */
export function sampleDetails(until: number): UserStatsDetails {
    const p = ["900000000000000001", "900000000000000002", "900000000000000003", "900000000000000004", "900000000000000005"];
    return {
        minGames: 3,
        ranks: { games: { position: 4, players: 31 }, winrate: { position: 7, players: 22 }, crewmateWinrate: { position: 5, players: 22 }, impostorWinrate: { position: 11, players: 18 } },
        streaks: { current: 3, bestWin: 7, bestLoss: 4 },
        survival: { games: 96, survived: 41, rate: 42.7 },
        fates: {
            killedAsCrewmate: { times: 44, games: 96, rate: 45.8, wins: 25, winrate: 56.8 },
            votedOutAsCrewmate: { times: 11, games: 96, rate: 11.5, wins: 4, winrate: 36.4 },
            votedOutAsImpostor: { times: 9, games: 22, rate: 40.9, wins: 3, winrate: 33.3 },
        },
        firstTarget: { firstDeaths: 17, crewmateGames: 96, rate: 17.7 },
        colors: [{ color: "lime", games: 61, share: 51.7 }, { color: "cyan", games: 30, share: 25.4 }, { color: "pink", games: 12, share: 10.2 }],
        names: [{ name: "Sora", games: 90, share: 76.3 }, { name: "sora2", games: 18, share: 15.3 }],
        playedWith: [{ userId: p[0], games: 88, share: 74.6 }, { userId: p[1], games: 71, share: 60.2 }, { userId: p[2], games: 52, share: 44.1 }],
        bestCrewmateTeammates: [{ userId: p[1], wins: 41, games: 55, winrate: 74.5 }, { userId: p[3], wins: 20, games: 29, winrate: 69 }],
        worstCrewmateTeammates: [{ userId: p[4], wins: 9, games: 24, winrate: 37.5 }, { userId: p[2], wins: 19, games: 40, winrate: 47.5 }],
        bestImpostorTeammates: [{ userId: p[0], wins: 4, games: 5, winrate: 80 }],
        worstImpostorTeammates: [{ userId: p[2], wins: 1, games: 4, winrate: 25 }],
        killedBy: [{ impostorId: p[0], deaths: 12, games: 17, rate: 70.6 }, { impostorId: p[2], deaths: 7, games: 13, rate: 53.8 }],
        activity: { until, weeks: [3, 5, 0, 8, 12, 6, 9, 4, 11, 14, 7, 10] },
        maps: [{ map: "skeld", games: 64, wins: 37, winrate: 57.8 }, { map: "polus", games: 30, wins: 15, winrate: 50 }, { map: "airship", games: 24, wins: 11, winrate: 45.8 }],
    };
}

/** The player stats page for a user in a guild. `preview` carries the page's free-layout flag along. */
export function userStatsHref(guildId: string, userId: string, preview = false) {
    return { pathname: "/stats/user", query: { guild: guildId, user: userId, ...(preview ? { preview: "free" } : {}) } };
}

/** The match page for one of the guild's matches. */
export function matchHref(guildId: string, matchId: string, preview = false) {
    return { pathname: "/stats/match", query: { guild: guildId, match: matchId, ...(preview ? { preview: "free" } : {}) } };
}
