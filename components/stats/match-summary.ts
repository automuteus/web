import { PremiumRecord, StatsPlayer, parsePlayers } from "./guild-stats";

/** The GET /guild/match document, mirroring MatchSummary in the Go API (internal/api/match_summary.go). */
export type MatchStatus = "finished" | "inProgress" | "aborted";
export type MatchResult = "crewmateVote" | "crewmateTasks" | "crewmateDisconnect" | "impostorVote" | "impostorKill" | "impostorSabotage" | "impostorDisconnect" | "unknown";
export type Role = "crewmate" | "impostor";
export type MatchMap = "skeld" | "mira" | "polus" | "dleks" | "airship" | "fungle";
export type Region = "na" | "eu" | "as";
export type EventType = "tasks" | "discussion" | "death" | "exile" | "disconnect";

export interface MatchPlayer {
    /** Set for players linked to a Discord user. */
    userId?: string;
    /** The in-game name used in this match. */
    name: string;
    /** An in-game color key, or "" when nothing reported one (unlinked players who were never in an event). */
    color: string;
    role: Role;
    won: boolean;
}
export interface MatchEvent {
    /** Seconds since the match started. */
    offset: number;
    type: EventType;
    name?: string;
    color?: string;
    /** Only set when the player is on the roster. */
    userId?: string;
}
export interface MatchTimeline { meetings: number; deaths: number; exiles: number; disconnects: number; events: MatchEvent[] }
export interface MatchSummary {
    guildId: string;
    matchId: string;
    premium: PremiumRecord;
    status: MatchStatus;
    /** Unix seconds. */
    startTime: number;
    /** Absent while the match is in progress. */
    endTime?: number;
    /** Absent unless finished. */
    result?: MatchResult;
    /** Absent when there is no known winner. */
    winner?: Role;
    /** Each absent for older matches or when the capture never reported a lobby. */
    map?: MatchMap;
    region?: Region;
    /** Impostors first. */
    roster: MatchPlayer[];
    /** Whether the roster names every player; when false, unlinked and opted-out players are missing. */
    rosterComplete: boolean;
    /** Absent when the guild's premium is free or expired. */
    timeline?: MatchTimeline;
    players: Record<string, StatsPlayer>;
}

/** The in-game color keys, each with a standing and a dead crewmate image in public/images/crewmates. */
export const COLORS: readonly string[] = ["red", "blue", "green", "pink", "orange", "yellow", "black", "white", "purple", "brown", "cyan", "lime", "maroon", "rose", "banana", "gray", "tan", "coral"];
export const MAP_NAMES: Record<MatchMap, string> = { skeld: "The Skeld", mira: "MIRA HQ", polus: "Polus", dleks: "dlekS ehT", airship: "The Airship", fungle: "The Fungle" };
export const REGION_NAMES: Record<Region, string> = { na: "North America", eu: "Europe", as: "Asia" };
export const RESULT_NAMES: Record<MatchResult, string> = {
    crewmateVote: "Crewmates won by voting out the impostors",
    crewmateTasks: "Crewmates won by finishing their tasks",
    crewmateDisconnect: "Crewmates won when the impostors disconnected",
    impostorVote: "Impostors won by vote",
    impostorKill: "Impostors won by kills",
    impostorSabotage: "Impostors won by sabotage",
    impostorDisconnect: "Impostors won when the crewmates disconnected",
    unknown: "The game ended without reporting a result",
};

const SNOWFLAKE = /^[0-9]{17,20}$/;
const MATCH_ID = /^[1-9][0-9]{0,17}$/;
const STATUSES: readonly string[] = ["finished", "inProgress", "aborted"];
const ROLES: readonly string[] = ["crewmate", "impostor"];
const EVENT_TYPES: readonly string[] = ["tasks", "discussion", "death", "exile", "disconnect"];

class Invalid extends Error {}
function fail(what: string): never { throw new Invalid(`Invalid match summary: ${what}`); }
function record(value: unknown, what: string): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(what);
    return value as Record<string, unknown>;
}
function count(value: unknown, what: string): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(what);
    return value;
}
function text(value: unknown, what: string): string {
    if (typeof value !== "string") fail(what);
    return value;
}
function oneOf<T extends string>(value: unknown, allowed: readonly string[], what: string): T {
    if (typeof value !== "string" || !allowed.includes(value)) fail(what);
    return value as T;
}
/** A key the page knows how to show, or nothing: a map or region added to the API later is left out rather than
 * failing the whole page. */
function known<T extends string>(value: unknown, names: Record<string, string>): T | undefined {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(names, value) ? value as T : undefined;
}
function color(value: unknown): string {
    return typeof value === "string" && COLORS.includes(value) ? value : "";
}
function optionalID(value: unknown, what: string): string | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value !== "string" || !SNOWFLAKE.test(value)) fail(what);
    return value;
}

/** Validates an upstream document and rebuilds it with only the fields the page reads. Throws when the shape is
 * wrong; the proxy answers 502 in that case. Enumerations the page cannot name are dropped (map, region, colors,
 * timeline events) or shown as an unknown result, so a newer API does not break an older page. */
export function parseMatchSummary(body: unknown): MatchSummary {
    const doc = record(body, "document");
    const premium = record(doc.premium, "premium");
    if (typeof premium.tier !== "number" || typeof premium.days !== "number") fail("premium");
    if (typeof doc.guildId !== "string" || !SNOWFLAKE.test(doc.guildId)) fail("guildId");
    if (typeof doc.matchId !== "string" || !MATCH_ID.test(doc.matchId)) fail("matchId");
    if (typeof doc.rosterComplete !== "boolean") fail("rosterComplete");
    if (!Array.isArray(doc.roster)) fail("roster");
    const summary: MatchSummary = {
        guildId: doc.guildId,
        matchId: doc.matchId,
        premium: { tier: premium.tier, days: premium.days },
        status: oneOf<MatchStatus>(doc.status, STATUSES, "status"),
        startTime: count(doc.startTime, "startTime"),
        roster: doc.roster.map((row, i): MatchPlayer => {
            const r = record(row, `roster[${i}]`);
            if (typeof r.won !== "boolean") fail(`roster[${i}].won`);
            const player: MatchPlayer = { name: text(r.name, `roster[${i}].name`), color: color(r.color), role: oneOf<Role>(r.role, ROLES, `roster[${i}].role`), won: r.won };
            const userId = optionalID(r.userId, `roster[${i}].userId`);
            return userId ? { userId, ...player } : player;
        }),
        rosterComplete: doc.rosterComplete,
        players: parsePlayers(doc.players === undefined || doc.players === null ? {} : record(doc.players, "players")),
    };
    if (doc.endTime !== undefined && doc.endTime !== null) summary.endTime = count(doc.endTime, "endTime");
    if (doc.result !== undefined && doc.result !== null) summary.result = known<MatchResult>(doc.result, RESULT_NAMES) ?? "unknown";
    if (doc.winner !== undefined && doc.winner !== null) summary.winner = oneOf<Role>(doc.winner, ROLES, "winner");
    const map = known<MatchMap>(doc.map, MAP_NAMES);
    if (map) summary.map = map;
    const region = known<Region>(doc.region, REGION_NAMES);
    if (region) summary.region = region;
    if (doc.timeline !== undefined && doc.timeline !== null) {
        const t = record(doc.timeline, "timeline");
        if (!Array.isArray(t.events)) fail("timeline.events");
        const events: MatchEvent[] = [];
        t.events.forEach((row, i) => {
            const e = record(row, `timeline.events[${i}]`);
            const offset = count(e.offset, `timeline.events[${i}].offset`);
            if (typeof e.type !== "string" || !EVENT_TYPES.includes(e.type)) return;
            const event: MatchEvent = { offset, type: e.type as EventType };
            if (typeof e.name === "string" && e.name !== "") event.name = e.name;
            const c = color(e.color);
            if (c) event.color = c;
            const userId = optionalID(e.userId, `timeline.events[${i}].userId`);
            if (userId) event.userId = userId;
            events.push(event);
        });
        summary.timeline = {
            meetings: count(t.meetings, "timeline.meetings"),
            deaths: count(t.deaths, "timeline.deaths"),
            exiles: count(t.exiles, "timeline.exiles"),
            disconnects: count(t.disconnects, "timeline.disconnects"),
            events,
        };
    }
    return summary;
}

/** The document as a server without premium would receive it: no timeline, and a free premium record. Used by the
 * page's `preview=free` query flag, as on the stats page; it only hides data. */
export function previewFree(match: MatchSummary): MatchSummary {
    const { timeline, ...rest } = match;
    return { ...rest, premium: { tier: 0, days: -9999 } };
}

/** The match number from what a user pastes: the bare number, or the "CODE:42" form the bot posts at game over.
 * Returns "" for anything else. */
export function matchNumber(input: string): string {
    const m = /^\s*(?:[A-Za-z0-9]{8}\s*:\s*)?0*([1-9][0-9]{0,17})\s*$/.exec(input);
    return m ? m[1] : "";
}

/** "12:05" for a timeline offset, or "1:02:03" past an hour. */
export function clock(seconds: number): string {
    const s = Math.floor(seconds);
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, rest = String(s % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${rest}` : `${m}:${rest}`;
}

/** "14 min 5 s", "45 s", or "1 h 2 min" for how long a match ran. */
export function duration(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    if (s < 60) return `${s} s`;
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
    return h ? `${h} h ${m} min` : `${m} min${s % 60 ? ` ${s % 60} s` : ""}`;
}

/** A timeline split where the game's own screens split it: each tasks phase is a round, each discussion a
 * meeting. Player events stay under the phase they happened in. The capture may report an exile just after the
 * phase has flipped back to tasks, so an exile that opens a round is kept with the meeting before it. Events
 * before the first phase change get a round of their own. */
export interface TimelineSection { kind: "round" | "meeting"; number: number; offset: number; events: MatchEvent[] }
export function timelineSections(events: MatchEvent[]): TimelineSection[] {
    const sections: TimelineSection[] = [];
    let rounds = 0, meetings = 0;
    for (const e of events) {
        if (e.type === "tasks") { sections.push({ kind: "round", number: ++rounds, offset: e.offset, events: [] }); continue; }
        if (e.type === "discussion") { sections.push({ kind: "meeting", number: ++meetings, offset: e.offset, events: [] }); continue; }
        if (sections.length === 0) sections.push({ kind: "round", number: ++rounds, offset: 0, events: [] });
        const last = sections[sections.length - 1], before = sections[sections.length - 2];
        if (e.type === "exile" && last.kind === "round" && last.events.length === 0 && before?.kind === "meeting") before.events.push(e);
        else last.events.push(e);
    }
    return sections;
}
