import React from "react";
import Link from "next/link";
// Cards, avatars, badges, and the locked-section overlay are shared with the server stats page.
import shared from "./GuildStatsView.module.css";
import styles from "./MatchSummaryView.module.css";
import { StatsPlayer, avatarURL, defaultAvatar, playerName } from "./guild-stats";
import {
    COLORS, MAP_NAMES, REGION_NAMES, RESULT_NAMES, MatchEvent, MatchPlayer, MatchSummary, MatchTimeline, Role,
    clock, duration, timelineSections,
} from "./match-summary";

interface Props {
    match: MatchSummary;
    /** The premium page; the server is appended as ?guild= so it arrives preselected. */
    premiumHref?: string;
    /** The signed-in user's Discord ID; their own roster row is highlighted and badged "You". */
    currentUserId?: string;
}

type Players = Record<string, StatsPlayer>;
const roleClass: Record<Role, string> = { crewmate: shared.crew, impostor: shared.impostor };

/** The bot's own crewmate emoji in the player's color: standing, or the body left behind when they were killed or
 * voted out. A player whose color nothing reported gets a hollow outline instead. The images are small copies of
 * the bot's assets/emojis, in public/images/crewmates. */
function Crewmate({ color, dead = false, gone = false, locked = false, size = 28 }: { color?: string; dead?: boolean; gone?: boolean; locked?: boolean; size?: number }): React.ReactElement {
    const box = { width: size, height: size };
    if (!color || !COLORS.includes(color)) return <span className={styles.crewmate} style={box} title="Color not reported" aria-hidden="true"><span className={styles.noColor} /></span>;
    // Locked is always the standing sprite, blurred: a blurred body would still show its wide outline.
    if (locked) return <span className={`${styles.crewmate} ${styles.lockedSprite}`} style={box} title={`Color: ${color}`} aria-hidden="true">
        <img src={`/images/crewmates/${color}.png`} alt="" width={size} height={size} loading="lazy" />
    </span>;
    return <span className={`${styles.crewmate} ${gone ? styles.gone : ""}`} style={box} title={dead ? `${color}, dead` : color} aria-hidden="true">
        <img src={`/images/crewmates/${color}${dead ? "-dead" : ""}.png`} alt="" width={size} height={size} loading="lazy" />
    </span>;
}

function Discord({ players, id, me }: { players: Players; id: string; me: boolean }): React.ReactElement {
    const fallback = defaultAvatar(id);
    const name = playerName(players, id);
    return <span className={styles.discord}>
        <img className={shared.avatar} src={avatarURL(players, id)} alt="" width={20} height={20} loading="lazy" referrerPolicy="no-referrer"
            onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }} />
        {name ? <span className={shared.name} title={`User ID ${id}`}>{name}</span> : <code className={shared.unknown}>{id}</code>}
        {me && <span className={shared.meBadge}>You</span>}
    </span>;
}

const fateText: Record<string, string> = { death: "Killed", exile: "Voted out", disconnect: "Disconnected" };

/** How a player's match ended, from the timeline: the first death, exile, or disconnect naming them. A linked
 * player is matched by user ID, which the API only sets for roster players; anyone else by in-game name and color. */
function fates(timeline: MatchTimeline | undefined): (p: MatchPlayer) => MatchEvent | undefined {
    const byUser = new Map<string, MatchEvent>();
    const byPlayer = new Map<string, MatchEvent>();
    for (const e of timeline?.events ?? []) {
        if (!fateText[e.type]) continue;
        if (e.userId && !byUser.has(e.userId)) byUser.set(e.userId, e);
        const key = `${e.name ?? ""}\u0000${e.color ?? ""}`;
        if (e.name && !byPlayer.has(key)) byPlayer.set(key, e);
    }
    return (p) => (p.userId && byUser.get(p.userId)) || byPlayer.get(`${p.name}\u0000${p.color}`);
}

function Team({ role, rows, match, currentUserId, fate }: { role: Role; rows: MatchPlayer[]; match: MatchSummary; currentUserId?: string; fate: (p: MatchPlayer) => MatchEvent | undefined }): React.ReactElement {
    // Who died comes only from the premium timeline, so without it every player's sprite is locked.
    const locked = !match.timeline;
    const title = role === "impostor" ? "Impostors" : "Crewmates";
    const won = match.winner === role;
    return <section className={`${shared.card} ${styles.team} ${roleClass[role]}`} aria-label={title}>
        <h2><span className={`${shared.swatch} ${roleClass[role]}`} aria-hidden="true" />{title}{won && <span className={styles.winBadge}>Won</span>}</h2>
        {rows.length === 0 ? <p className={shared.empty}>No {title.toLowerCase()} recorded.</p> : <ul className={styles.roster}>
            {rows.map((p, i) => {
                const me = !!currentUserId && p.userId === currentUserId;
                const end = fate(p);
                return <li key={`${p.userId ?? p.name}:${i}`} className={me ? styles.me : undefined}>
                    <Crewmate color={p.color} dead={end?.type === "death" || end?.type === "exile"} gone={end?.type === "disconnect"} locked={locked} size={32} />
                    <span className={styles.who}>
                        <span className={styles.ingame}>{p.name || <em>Unnamed</em>}</span>
                        {p.userId ? <Discord players={match.players} id={p.userId} me={me} /> : <span className={styles.unlinked}>Not linked</span>}
                    </span>
                    {end && <span className={styles.fate}>{fateText[end.type]} <time>{clock(end.offset)}</time></span>}
                </li>;
            })}
        </ul>}
    </section>;
}

function EventRow({ event, players }: { event: MatchEvent; players: Players }): React.ReactElement {
    const verb = event.type === "death" ? "was killed" : event.type === "exile" ? "was voted out" : "disconnected";
    return <li className={`${styles.event} ${styles[event.type]}`}>
        <time className={styles.offset}>{clock(event.offset)}</time>
        <Crewmate color={event.color} dead={event.type === "death"} gone={event.type === "disconnect"} size={24} />
        <span><strong>{event.name || "A player"}</strong> {verb}{event.userId && playerName(players, event.userId) ? <span className={styles.aka}> ({playerName(players, event.userId)})</span> : null}</span>
    </li>;
}

function Timeline({ timeline, players }: { timeline: MatchTimeline; players: Players }): React.ReactElement {
    const sections = timelineSections(timeline.events);
    return <section className={`${shared.card} ${styles.timeline}`} aria-label="Timeline">
        <h2>Timeline</h2>
        <ul className={styles.counts}>
            <li><strong>{timeline.meetings}</strong> {timeline.meetings === 1 ? "meeting" : "meetings"}</li>
            <li><strong>{timeline.deaths}</strong> {timeline.deaths === 1 ? "kill" : "kills"}</li>
            <li><strong>{timeline.exiles}</strong> voted out</li>
            {timeline.disconnects > 0 && <li><strong>{timeline.disconnects}</strong> disconnected</li>}
        </ul>
        {sections.length === 0 ? <p className={shared.empty}>The capture didn&apos;t report anything for this match.</p> : <ol className={styles.sections}>
            {sections.map((s) => <li key={`${s.kind}${s.number}`} className={`${styles.section} ${s.kind === "meeting" ? styles.meeting : styles.round}`}>
                <div className={styles.sectionHead}><span>{s.kind === "meeting" ? `Meeting ${s.number}` : `Round ${s.number}`}</span><time>{clock(s.offset)}</time></div>
                {s.events.length === 0 ? <p className={styles.quiet}>{s.kind === "meeting" ? "No one was voted out." : "No one died."}</p>
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
    return <div className={shared.locked}>
        <div className={shared.lockOverlay}>
            <section className={shared.lockCard} aria-label="Timeline">
                <h2>The match timeline is a premium feature</h2>
                <p>See how the match played out: every round and meeting, who was killed and when, and who was voted out. Servers with AutoMuteUs Premium get the timeline for every match.</p>
                <Link href={{ pathname: premiumHref, query: { guild: guildId } }}>Get Premium for this server</Link>
            </section>
        </div>
        <div className={shared.lockedContent} aria-hidden="true"><Timeline timeline={sampleTimeline()} players={{}} /></div>
    </div>;
}

function headline(match: MatchSummary): string {
    if (match.status === "inProgress") return "Match in progress";
    if (match.status === "aborted") return "Match ended early";
    if (match.winner === "crewmate") return "Crewmates win";
    if (match.winner === "impostor") return "Impostors win";
    return "No winner recorded";
}

function Header({ match }: { match: MatchSummary }): React.ReactElement {
    const started = new Date(match.startTime * 1000);
    const facts: Array<[string, React.ReactNode]> = [];
    if (match.map) facts.push(["Map", MAP_NAMES[match.map]]);
    if (match.region) facts.push(["Region", REGION_NAMES[match.region]]);
    facts.push(["Started", <time key="t" dateTime={started.toISOString()}>{started.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>]);
    if (match.endTime !== undefined && match.endTime >= match.startTime) facts.push(["Length", duration(match.endTime - match.startTime)]);
    const side = match.winner ? roleClass[match.winner] : shared.none;
    return <section className={`${shared.card} ${styles.hero} ${side}`} aria-label="Match">
        <div className={styles.matchId}>Match {match.matchId}</div>
        <h2 className={styles.headline}>{headline(match)}</h2>
        {match.status === "finished" && match.result && <p className={styles.result}>{RESULT_NAMES[match.result]}</p>}
        {match.status === "aborted" && <p className={styles.result}>The match was ended before the game reported a result, so it doesn&apos;t count toward stats.</p>}
        <dl className={styles.facts}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>;
}

/** Renders one match. Pure: everything shown comes from the document. */
export default function MatchSummaryView({ match, premiumHref = "/premium", currentUserId }: Props): React.ReactElement {
    const impostors = match.roster.filter((p) => p.role === "impostor");
    const crewmates = match.roster.filter((p) => p.role === "crewmate");
    const fate = fates(match.timeline);
    return <div>
        <Header match={match} />
        {match.roster.length === 0 ? <p className={shared.meta}>{match.status === "inProgress"
            ? "The roster appears when the match ends."
            : "No players were recorded for this match."}</p> : <>
            <div className={styles.teams}>
                <Team role="impostor" rows={impostors} match={match} currentUserId={currentUserId} fate={fate} />
                <Team role="crewmate" rows={crewmates} match={match} currentUserId={currentUserId} fate={fate} />
            </div>
            {!match.timeline && <p className={`${shared.meta} ${styles.premiumNote}`}><Link href={{ pathname: premiumHref, query: { guild: match.guildId } }}>Premium</Link> shows who was killed or voted out, and when.</p>}
            {!match.rosterComplete && <p className={shared.meta}>Only players linked to AutoMuteUs are listed. This match was recorded before the bot kept the full lobby, so anyone unlinked or opted out is missing.</p>}
        </>}
        {match.timeline ? <Timeline timeline={match.timeline} players={match.players} />
            : match.status !== "aborted" && <LockedTimeline guildId={match.guildId} premiumHref={premiumHref} />}
    </div>;
}
