import React from "react";
import type { TFunction } from "i18next";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";
// Cards, avatars, badges, and the locked-section overlay are shared with the server stats page.
import shared from "./GuildStatsView.module.css";
import styles from "./MatchSummaryView.module.css";
import { StatsPlayer, avatarURL, defaultAvatar, playerName } from "./guild-stats";
import {
    COLORS, MAP_NAMES, MatchEvent, MatchPlayer, MatchSummary, MatchTimeline, Region, Role,
    clock, duration, timelineSections,
} from "./match-summary";
import { userStatsHref } from "./user-stats";

interface Props {
    match: MatchSummary;
    /** The premium page; the server is appended as ?guild= so it arrives preselected. */
    premiumHref?: string;
    /** The signed-in user's Discord ID; their own roster row is highlighted and badged "You". */
    currentUserId?: string;
    /** Carries the page's preview=free flag along on player links. */
    preview?: boolean;
}

type Players = Record<string, StatsPlayer>;
const roleClass: Record<Role, string> = { crewmate: shared.crew, impostor: shared.impostor };

/** The bot's own crewmate emoji in the player's color: standing, or the body left behind when they were killed or
 * voted out. A player whose color nothing reported gets a hollow outline instead. The images are small copies of
 * the bot's assets/emojis, in public/images/crewmates. */
export function Crewmate({ color, dead = false, gone = false, locked = false, size = 28 }: { color?: string; dead?: boolean; gone?: boolean; locked?: boolean; size?: number }): React.ReactElement {
    const { t } = useTranslation();
    const box = { width: size, height: size };
    if (!color || !COLORS.includes(color)) return <span className={styles.crewmate} style={box} title={t("match.crewmate.noColor")} aria-hidden="true"><span className={styles.noColor} /></span>;
    // The tooltip names the color mid-sentence, so it has its own (in English, lower case) form.
    const name = t(`match.crewmate.colorName.${color}`);
    // Locked is always the standing sprite, blurred: a blurred body would still show its wide outline.
    if (locked) return <span className={`${styles.crewmate} ${styles.lockedSprite}`} style={box} title={t("match.crewmate.color", { color: name })} aria-hidden="true">
        <img src={`/images/crewmates/${color}.png`} alt="" width={size} height={size} loading="lazy" />
    </span>;
    return <span className={`${styles.crewmate} ${gone ? styles.gone : ""}`} style={box} title={dead ? t("match.crewmate.dead", { color: name }) : name} aria-hidden="true">
        <img src={`/images/crewmates/${color}${dead ? "-dead" : ""}.png`} alt="" width={size} height={size} loading="lazy" />
    </span>;
}

/** A roster player's Discord account, linking to their player page in this server. */
function Discord({ players, id, me, href }: { players: Players; id: string; me: boolean; href: ReturnType<typeof userStatsHref> }): React.ReactElement {
    const { t } = useTranslation();
    const fallback = defaultAvatar(id);
    const name = playerName(players, id);
    return <span className={styles.discord}>
        <img className={shared.avatar} src={avatarURL(players, id)} alt="" width={20} height={20} loading="lazy" referrerPolicy="no-referrer"
            onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }} />
        <Link className={shared.nameLink} href={href}>{name ? <span className={shared.name} title={t("shared.userId", { id })}>{name}</span> : <code className={shared.unknown}>{id}</code>}</Link>
        {me && <span className={shared.meBadge}>{t("shared.you")}</span>}
    </span>;
}

/** The events that end a player's match. */
const FATES: readonly string[] = ["death", "exile", "disconnect"];

/** "Killed 4:10": how and when a player's match ended. */
function FateText({ event }: { event: MatchEvent }): React.ReactElement {
    const { t } = useTranslation();
    const key = event.type === "death" ? "match.fate.killed" : event.type === "exile" ? "match.fate.votedOut" : "match.fate.disconnected";
    return <Trans t={t} i18nKey={key} values={{ offset: clock(event.offset) }} components={{ time: <time /> }} />;
}

/** How a player's match ended, from the timeline: the first death, exile, or disconnect naming them. A linked
 * player is matched by user ID, which the API only sets for roster players; anyone else by in-game name and color. */
function fates(timeline: MatchTimeline | undefined): (p: MatchPlayer) => MatchEvent | undefined {
    const byUser = new Map<string, MatchEvent>();
    const byPlayer = new Map<string, MatchEvent>();
    for (const e of timeline?.events ?? []) {
        if (!FATES.includes(e.type)) continue;
        if (e.userId && !byUser.has(e.userId)) byUser.set(e.userId, e);
        const key = `${e.name ?? ""}\u0000${e.color ?? ""}`;
        if (e.name && !byPlayer.has(key)) byPlayer.set(key, e);
    }
    return (p) => (p.userId && byUser.get(p.userId)) || byPlayer.get(`${p.name}\u0000${p.color}`);
}

function Team({ role, rows, match, currentUserId, preview, fate }: { role: Role; rows: MatchPlayer[]; match: MatchSummary; currentUserId?: string; preview: boolean; fate: (p: MatchPlayer) => MatchEvent | undefined }): React.ReactElement {
    // Who died comes only from the premium timeline, so without it every player's sprite is locked.
    const { t } = useTranslation();
    const locked = !match.timeline;
    const title = role === "impostor" ? t("match.team.impostors") : t("match.team.crewmates");
    const won = match.winner === role;
    return <section className={`${shared.card} ${styles.team} ${roleClass[role]}`} aria-label={title}>
        <h2><span className={`${shared.swatch} ${roleClass[role]}`} aria-hidden="true" />{title}{won && <span className={styles.winBadge}>{t("shared.outcome.won")}</span>}</h2>
        {rows.length === 0 ? <p className={shared.empty}>{role === "impostor" ? t("match.team.noImpostors") : t("match.team.noCrewmates")}</p> : <ul className={styles.roster}>
            {rows.map((p, i) => {
                const me = !!currentUserId && p.userId === currentUserId;
                const end = fate(p);
                return <li key={`${p.userId ?? p.name}:${i}`} className={me ? styles.me : undefined}>
                    <Crewmate color={p.color} dead={end?.type === "death" || end?.type === "exile"} gone={end?.type === "disconnect"} locked={locked} size={32} />
                    <span className={styles.who}>
                        <span className={styles.ingame}>{p.name || <em>{t("shared.unnamed")}</em>}</span>
                        {p.userId ? <Discord players={match.players} id={p.userId} me={me} href={userStatsHref(match.guildId, p.userId, preview)} /> : <span className={styles.unlinked}>{t("match.team.notLinked")}</span>}
                    </span>
                    {end && <span className={styles.fate}><FateText event={end} /></span>}
                </li>;
            })}
        </ul>}
    </section>;
}

function EventRow({ event, players }: { event: MatchEvent; players: Players }): React.ReactElement {
    const { t } = useTranslation();
    const key = event.type === "death" ? "match.event.killed" : event.type === "exile" ? "match.event.votedOut" : "match.event.disconnected";
    const aka = event.userId && playerName(players, event.userId);
    return <li className={`${styles.event} ${styles[event.type]}`}>
        <time className={styles.offset}>{clock(event.offset)}</time>
        <Crewmate color={event.color} dead={event.type === "death"} gone={event.type === "disconnect"} size={24} />
        <span><Trans t={t} i18nKey={key} values={{ name: event.name || t("match.event.someone") }} components={{ strong: <strong /> }} />{aka ? <span className={styles.aka}>{t("match.event.aka", { name: aka })}</span> : null}</span>
    </li>;
}

function Timeline({ timeline, players }: { timeline: MatchTimeline; players: Players }): React.ReactElement {
    const { t } = useTranslation();
    const sections = timelineSections(timeline.events);
    const strong = { strong: <strong /> };
    return <section className={`${shared.card} ${styles.timeline}`} aria-label={t("match.timeline.title")}>
        <h2>{t("match.timeline.title")}</h2>
        <ul className={styles.counts}>
            <li><Trans t={t} i18nKey="match.timeline.meetings" count={timeline.meetings} components={strong} /></li>
            <li><Trans t={t} i18nKey="match.timeline.kills" count={timeline.deaths} components={strong} /></li>
            <li><Trans t={t} i18nKey="match.timeline.votedOut" count={timeline.exiles} components={strong} /></li>
            {timeline.disconnects > 0 && <li><Trans t={t} i18nKey="match.timeline.disconnected" count={timeline.disconnects} components={strong} /></li>}
        </ul>
        {sections.length === 0 ? <p className={shared.empty}>{t("match.timeline.empty")}</p> : <ol className={styles.sections}>
            {sections.map((s) => <li key={`${s.kind}${s.number}`} className={`${styles.section} ${s.kind === "meeting" ? styles.meeting : styles.round}`}>
                <div className={styles.sectionHead}><span>{s.kind === "meeting" ? t("match.timeline.meeting", { number: s.number }) : t("match.timeline.round", { number: s.number })}</span><time>{clock(s.offset)}</time></div>
                {s.events.length === 0 ? <p className={styles.quiet}>{s.kind === "meeting" ? t("match.timeline.noExile") : t("match.timeline.noDeath")}</p>
                    : <ul className={styles.events}>{s.events.map((e, i) => <EventRow key={i} event={e} players={players} />)}</ul>}
            </li>)}
        </ol>}
    </section>;
}

/** Made-up events shown blurred, in the premium layout, to a server without premium. Never readable. */
function sampleTimeline(): MatchTimeline {
    return { meetings: 2, deaths: 3, exiles: 1, disconnects: 0, events: [
        { offset: 5, type: "tasks" }, { offset: 71, type: "death", name: "Sora", color: "lime" }, { offset: 88, type: "discussion" },
        { offset: 190, type: "exile", name: "Kiwi", color: "cyan" }, { offset: 196, type: "tasks" },
        { offset: 254, type: "death", name: "Taro", color: "yellow" }, { offset: 301, type: "death", name: "Mochi", color: "pink" }, { offset: 306, type: "discussion" },
    ] };
}

function LockedTimeline({ guildId, premiumHref }: { guildId: string; premiumHref: string }): React.ReactElement {
    const { t } = useTranslation();
    return <div className={shared.locked}>
        <div className={shared.lockOverlay}>
            <section className={shared.lockCard} aria-label={t("match.timeline.title")}>
                <h2>{t("match.locked.title")}</h2>
                <p>{t("match.locked.body")}</p>
                <Link href={{ pathname: premiumHref, query: { guild: guildId } }}>{t("shared.getPremium")}</Link>
            </section>
        </div>
        <div className={shared.lockedContent} aria-hidden="true"><Timeline timeline={sampleTimeline()} players={{}} /></div>
    </div>;
}

function headline(match: MatchSummary, t: TFunction): string {
    if (match.status === "inProgress") return t("match.headline.inProgress");
    if (match.status === "aborted") return t("match.headline.aborted");
    if (match.winner === "crewmate") return t("match.headline.crewmatesWin");
    if (match.winner === "impostor") return t("match.headline.impostorsWin");
    return t("match.headline.noWinner");
}

function regionName(region: Region, t: TFunction): string {
    if (region === "na") return t("match.region.na");
    if (region === "eu") return t("match.region.eu");
    return t("match.region.as");
}

function Header({ match }: { match: MatchSummary }): React.ReactElement {
    const { t, i18n } = useTranslation();
    const started = new Date(match.startTime * 1000);
    const facts: Array<[string, React.ReactNode]> = [];
    if (match.map) facts.push([t("shared.column.map"), MAP_NAMES[match.map]]);
    if (match.region) facts.push([t("match.facts.region"), regionName(match.region, t)]);
    facts.push([t("match.facts.started"), <time key="t" dateTime={started.toISOString()}>{started.toLocaleString(i18n.language, { dateStyle: "medium", timeStyle: "short" })}</time>]);
    if (match.endTime !== undefined && match.endTime >= match.startTime) facts.push([t("match.facts.length"), duration(match.endTime - match.startTime, t)]);
    const side = match.winner ? roleClass[match.winner] : shared.none;
    return <section className={`${shared.card} ${styles.hero} ${side}`} aria-label={t("match.label")}>
        <div className={styles.matchId}>{t("match.id", { id: match.matchId })}</div>
        <h2 className={styles.headline}>{headline(match, t)}</h2>
        {match.status === "finished" && match.result && <p className={styles.result}>{t(`shared.result.${match.result}`)}</p>}
        {match.status === "aborted" && <p className={styles.result}>{t("match.abortedNote")}</p>}
        <dl className={styles.facts}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>;
}

/** Renders one match. Pure: everything shown comes from the document. */
export default function MatchSummaryView({ match, premiumHref = "/premium", currentUserId, preview = false }: Props): React.ReactElement {
    const { t } = useTranslation();
    const impostors = match.roster.filter((p) => p.role === "impostor");
    const crewmates = match.roster.filter((p) => p.role === "crewmate");
    const fate = fates(match.timeline);
    return <div>
        <Header match={match} />
        {match.roster.length === 0 ? <p className={shared.meta}>{match.status === "inProgress"
            ? t("match.roster.later")
            : t("match.roster.none")}</p> : <>
            <div className={styles.teams}>
                <Team role="impostor" rows={impostors} match={match} currentUserId={currentUserId} preview={preview} fate={fate} />
                <Team role="crewmate" rows={crewmates} match={match} currentUserId={currentUserId} preview={preview} fate={fate} />
            </div>
            {!match.timeline && <p className={`${shared.meta} ${styles.premiumNote}`}><Trans t={t} i18nKey="match.premiumNote" components={{ premium: <Link href={{ pathname: premiumHref, query: { guild: match.guildId } }} /> }} /></p>}
            {!match.rosterComplete && <p className={shared.meta}>{t("match.roster.incomplete")}</p>}
        </>}
        {match.timeline ? <Timeline timeline={match.timeline} players={match.players} />
            : match.status !== "aborted" && <LockedTimeline guildId={match.guildId} premiumHref={premiumHref} />}
    </div>;
}
