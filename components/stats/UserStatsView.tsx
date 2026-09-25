import React, { useContext } from "react";
import Link from "next/link";
// Cards, tables, rate bars, avatars, and the locked-section overlay are shared with the server stats page.
import shared from "./GuildStatsView.module.css";
import styles from "./UserStatsView.module.css";
import { Crewmate } from "./MatchSummaryView";
import { IMPOSTOR_DUO_MIN_GAMES, StatsPlayer, avatarURL, defaultAvatar, percent, playerName } from "./guild-stats";
import { MAP_NAMES, RESULT_NAMES, Role } from "./match-summary";
import {
    BoardRank, DiedWith, Fate, RoleRecord, Teammate, UserMatch, UserStats, UserStatsDetails,
    matchHref, sampleDetails, userStatsHref,
} from "./user-stats";

interface Props {
    stats: UserStats;
    /** The premium page; the server is appended as ?guild= so it arrives preselected. */
    premiumHref?: string;
    /** The signed-in user's Discord ID; the page says "You" when it is theirs. */
    currentUserId?: string;
    /** Carries the page's preview=free flag along on match and player links. */
    preview?: boolean;
}

type Players = Record<string, StatsPlayer>;
type Side = "overall" | "crew" | "impostor";
const sideClass: Record<Side, string> = { overall: shared.overall, crew: shared.crew, impostor: shared.impostor };
const roleSide: Record<Role, Side> = { crewmate: "crew", impostor: "impostor" };

/** Where player and match links point. Only real content provides it: the blurred sample has no links, so
 * nothing hidden from view can be reached with the keyboard. */
const LinkContext = React.createContext<{ guildId: string; preview: boolean } | undefined>(undefined);

function plural(n: number, word: string): string { return `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`; }
function date(seconds: number): React.ReactElement {
    const d = new Date(seconds * 1000);
    return <time dateTime={d.toISOString()}>{d.toLocaleDateString("en-US", { dateStyle: "medium" })}</time>;
}

function Avatar({ players, id, size = 28 }: { players: Players; id: string; size?: number }): React.ReactElement {
    const fallback = defaultAvatar(id);
    return <img className={shared.avatar} src={avatarURL(players, id)} alt="" width={size} height={size} style={{ width: size, height: size }} loading="lazy" referrerPolicy="no-referrer"
        onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }} />;
}

/** Another player: picture and name, linking to their own page. */
function Player({ players, id }: { players: Players; id: string }): React.ReactElement {
    const links = useContext(LinkContext);
    const name = playerName(players, id);
    const label = name ? <span className={shared.name} title={`User ID ${id}`}>{name}</span> : <code className={shared.unknown} title="This player's name isn't known yet">{id}</code>;
    return <span className={shared.player}>
        <Avatar players={players} id={id} />
        {links ? <Link className={styles.link} href={userStatsHref(links.guildId, id, links.preview)}>{label}</Link> : label}
    </span>;
}

function Rate({ value, side }: { value: number; side: Side }): React.ReactElement {
    return <span className={shared.rateCell}>
        <span>{percent(value)}</span>
        <span className={shared.bar} aria-hidden="true"><span className={`${shared.barFill} ${sideClass[side]}`} style={{ width: `${Math.min(100, value)}%` }} /></span>
    </span>;
}

function Card({ title, hint, className, children }: { title: string; hint?: string; className?: string; children: React.ReactNode }): React.ReactElement {
    return <section className={`${shared.card} ${className ?? ""}`} aria-label={title}>
        <h2>{title}</h2>
        {hint && <p className={shared.cardHint}>{hint}</p>}
        {children}
    </section>;
}

function Empty({ children }: { children: React.ReactNode }): React.ReactElement {
    return <p className={shared.empty}>{children}</p>;
}

function Table({ head, children }: { head: React.ReactNode; children: React.ReactNode }): React.ReactElement {
    return <div className={shared.scroll}><table className={shared.table}><thead><tr>{head}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Hero({ stats, me }: { stats: UserStats; me: boolean }): React.ReactElement {
    const { summary, userId, players } = stats;
    const name = playerName(players, userId);
    return <section className={`${shared.card} ${styles.hero}`} aria-label="Player">
        <Avatar players={players} id={userId} size={72} />
        <div className={styles.heroText}>
            <h2 className={styles.heroName}>{name ?? <code className={shared.unknown}>{userId}</code>}{me && <span className={shared.meBadge}>You</span>}</h2>
            {summary.firstGame !== undefined && summary.lastGame !== undefined
                ? <p className={styles.heroMeta}>Playing since {date(summary.firstGame)} &middot; last game {date(summary.lastGame)}</p>
                : <p className={styles.heroMeta}>No games recorded in this server.</p>}
        </div>
    </section>;
}

function RoleCard({ label, record, side }: { label: string; record: RoleRecord; side: Side }): React.ReactElement {
    return <div className={`${styles.tile} ${sideClass[side]}`}>
        <div className={styles.tileLabel}><span className={`${shared.swatch} ${sideClass[side]}`} aria-hidden="true" />{label}</div>
        <div className={styles.tileValue}>{record.games > 0 ? percent(record.winrate) : "–"}</div>
        <div className={styles.tileDetail}>{record.wins} won of {plural(record.games, "game")}</div>
    </div>;
}

/** The free summary: games, wins, and the split by role. */
function Summary({ stats }: { stats: UserStats }): React.ReactElement {
    const { summary } = stats;
    return <div className={styles.tiles}>
        <div className={`${styles.tile} ${shared.overall}`}>
            <div className={styles.tileLabel}>Games played</div>
            <div className={styles.tileValue}>{summary.games.toLocaleString("en-US")}</div>
            <div className={styles.tileDetail}>{plural(summary.wins, "win")}</div>
        </div>
        <div className={`${styles.tile} ${shared.overall}`}>
            <div className={styles.tileLabel}>Winrate</div>
            <div className={styles.tileValue}>{summary.games > 0 ? percent(summary.winrate) : "–"}</div>
            <div className={styles.tileDetail}>of every game played</div>
        </div>
        <RoleCard label="As crewmate" record={summary.crewmate} side="crew" />
        <RoleCard label="As impostor" record={summary.impostor} side="impostor" />
    </div>;
}

/** The latest results as dots, oldest on the left so the run reads toward today. An unknown result is grey. */
function Form({ matches }: { matches: UserMatch[] }): React.ReactElement {
    const ordered = [...matches].reverse();
    const known = ordered.filter((m) => m.result !== "unknown");
    const wins = known.filter((m) => m.won).length;
    return <div className={styles.form}>
        <span className={styles.formLabel}>Form</span>
        <ol className={styles.dots} aria-label={`Won ${wins} of the last ${plural(known.length, "game")} with a result`}>
            {ordered.map((m) => {
                const state = m.result === "unknown" ? styles.dotUnknown : m.won ? styles.dotWin : styles.dotLoss;
                return <li key={m.matchId} className={`${styles.dot} ${state}`} title={`Match ${m.matchId}: ${m.result === "unknown" ? "no result" : m.won ? "won" : "lost"}`} />;
            })}
        </ol>
    </div>;
}

function RecentMatches({ stats, preview }: { stats: UserStats; preview: boolean }): React.ReactElement {
    const matches = stats.recentMatches;
    return <Card title="Recent matches">
        {matches.length === 0 ? <Empty>No finished matches yet.</Empty> : <>
            <Form matches={matches} />
            <ul className={styles.matches}>
                {matches.map((m) => <li key={m.matchId}>
                    <Link className={styles.matchRow} href={matchHref(stats.guildId, m.matchId, preview)}>
                        <Crewmate color={m.color} size={30} />
                        <span className={styles.matchWho}>
                            <span className={styles.matchName}>{m.name || <em>Unnamed</em>}</span>
                            <span className={styles.matchSub}>Match {m.matchId} &middot; {m.map ? MAP_NAMES[m.map] : "Map not recorded"}</span>
                        </span>
                        <span className={`${styles.roleTag} ${sideClass[roleSide[m.role]]}`}>{m.role === "impostor" ? "Impostor" : "Crewmate"}</span>
                        <span className={`${styles.outcome} ${m.result === "unknown" ? styles.dotUnknown : m.won ? styles.dotWin : styles.dotLoss}`} title={RESULT_NAMES[m.result]}>
                            {m.result === "unknown" ? "No result" : m.won ? "Won" : "Lost"}
                        </span>
                        <span className={styles.matchDate}>{date(m.startTime)}</span>
                    </Link>
                </li>)}
            </ul>
        </>}
    </Card>;
}

function RankLine({ label, rank }: { label: string; rank?: BoardRank }): React.ReactElement {
    return <div className={styles.rankLine}>
        <dt>{label}</dt>
        <dd>{rank ? <><strong>#{rank.position}</strong> <span>of {rank.players}</span></> : <span className={styles.unranked}>Not ranked</span>}</dd>
    </div>;
}

function StreakValue({ current }: { current: number }): React.ReactElement {
    if (current === 0) return <>–</>;
    return <span className={current > 0 ? styles.streakWin : styles.streakLoss}>{current > 0 ? `${current}W` : `${-current}L`}</span>;
}

/** How often something happened to the player in a role, and whether their side won anyway. */
function FateRow({ label, fate, role }: { label: string; fate: Fate; role: string }): React.ReactElement {
    return <li className={styles.fateRow}>
        <div className={styles.fateHead}><span>{label}</span><strong>{fate.games > 0 ? percent(fate.rate) : "–"}</strong></div>
        <div className={styles.fateDetail}>{fate.times} of {plural(fate.games, `${role} game`)}{fate.times > 0 && <> &middot; their side still won {percent(fate.winrate)} of those</>}</div>
    </li>;
}

function Activity({ details }: { details: UserStatsDetails }): React.ReactElement {
    const weeks = details.activity.weeks;
    const max = Math.max(1, ...weeks);
    const total = weeks.reduce((a, b) => a + b, 0);
    return <Card title="Activity" hint={`${plural(total, "game")} in the last ${weeks.length} weeks.`}>
        <ol className={styles.activity} aria-label="Games per week, oldest first">
            {weeks.map((n, i) => {
                const ago = weeks.length - 1 - i;
                return <li key={i} title={`${plural(n, "game")} ${ago === 0 ? "in the last 7 days" : `${ago} ${ago === 1 ? "week" : "weeks"} before that`}`}>
                    <span className={styles.activityBar} style={{ height: `${n === 0 ? 0 : Math.max(6, (n / max) * 100)}%` }} />
                </li>;
            })}
        </ol>
        <div className={styles.activityAxis}><span>{weeks.length} weeks ago</span><span>This week</span></div>
    </Card>;
}

function TeammateTable({ rows, players, side }: { rows: Teammate[]; players: Players; side: Side }): React.ReactElement {
    return <Table head={<><th scope="col">Teammate</th><th scope="col" className={shared.num}>Wins</th><th scope="col" className={shared.num}>Games</th><th scope="col" className={shared.rate}>Winrate</th></>}>
        {rows.map((r) => <tr key={r.userId}>
            <th scope="row"><Player players={players} id={r.userId} /></th>
            <td className={shared.num}>{r.wins}</td><td className={shared.num}>{r.games}</td><td className={shared.rate}><Rate value={r.winrate} side={side} /></td>
        </tr>)}
    </Table>;
}

function KilledByTable({ rows, players }: { rows: DiedWith[]; players: Players }): React.ReactElement {
    return <Table head={<><th scope="col">Impostor</th><th scope="col" className={shared.num}>Deaths</th><th scope="col" className={shared.num}>Games</th><th scope="col" className={shared.rate}>Rate</th></>}>
        {rows.map((r) => <tr key={r.impostorId}>
            <th scope="row"><Player players={players} id={r.impostorId} /></th>
            <td className={shared.num}>{r.deaths}</td><td className={shared.num}>{r.games}</td><td className={shared.rate}><Rate value={r.rate} side="impostor" /></td>
        </tr>)}
    </Table>;
}

/** The premium sections. */
function Details({ details, players }: { details: UserStatsDetails; players: Players }): React.ReactElement {
    const { ranks, streaks, survival, fates, firstTarget } = details;
    const min = details.minGames;
    const needTeammate = (role: string, games: number) => <Empty>No one has been {role} with this player in {plural(games, "game")} yet.</Empty>;
    return <>
        <h2 className={shared.sectionTitle}>In depth</h2>
        <div className={styles.tiles}>
            <div className={`${styles.tile} ${shared.overall}`}>
                <div className={styles.tileLabel}>Current streak</div>
                <div className={styles.tileValue}><StreakValue current={streaks.current} /></div>
                <div className={styles.tileDetail}>best run {streaks.bestWin}W &middot; worst {streaks.bestLoss}L</div>
            </div>
            <div className={`${styles.tile} ${shared.crew}`}>
                <div className={styles.tileLabel}>Crewmate survival</div>
                <div className={styles.tileValue}>{survival.games > 0 ? percent(survival.rate) : "–"}</div>
                <div className={styles.tileDetail}>alive at the end of {survival.survived} of {plural(survival.games, "game")}</div>
            </div>
            <div className={`${styles.tile} ${shared.impostor}`}>
                <div className={styles.tileLabel}>First to die</div>
                <div className={styles.tileValue}>{firstTarget.crewmateGames > 0 ? percent(firstTarget.rate) : "–"}</div>
                <div className={styles.tileDetail}>{firstTarget.firstDeaths} of {plural(firstTarget.crewmateGames, "crewmate game")}</div>
            </div>
            <div className={`${styles.tile} ${shared.overall}`}>
                <div className={styles.tileLabel}>Server rank</div>
                <div className={styles.tileValue}>{ranks.games ? `#${ranks.games.position}` : "–"}</div>
                <div className={styles.tileDetail}>{ranks.games ? `by games, of ${ranks.games.players} players` : "no games yet"}</div>
            </div>
        </div>
        <div className={shared.grid}>
            <Card title="Server ranks" hint={`Winrate ranks count players with at least ${plural(min, "game")} in the role.`}>
                <dl className={styles.ranks}>
                    <RankLine label="Games played" rank={ranks.games} />
                    <RankLine label="Overall winrate" rank={ranks.winrate} />
                    <RankLine label="Crewmate winrate" rank={ranks.crewmateWinrate} />
                    <RankLine label="Impostor winrate" rank={ranks.impostorWinrate} />
                </dl>
            </Card>
            <Card title="How games end" hint="How often the player was killed or voted out, and how often their side won those games anyway.">
                <ul className={styles.fates}>
                    <FateRow label="Killed as crewmate" fate={fates.killedAsCrewmate} role="crewmate" />
                    <FateRow label="Voted out as crewmate" fate={fates.votedOutAsCrewmate} role="crewmate" />
                    <FateRow label="Voted out as impostor" fate={fates.votedOutAsImpostor} role="impostor" />
                </ul>
            </Card>
            <Activity details={details} />
            <Card title="Maps">
                {details.maps.length === 0 ? <Empty>No games with a recorded map yet.</Empty> : <Table head={<><th scope="col">Map</th><th scope="col" className={shared.num}>Wins</th><th scope="col" className={shared.num}>Games</th><th scope="col" className={shared.rate}>Winrate</th></>}>
                    {details.maps.map((m) => <tr key={m.map}><th scope="row">{MAP_NAMES[m.map]}</th><td className={shared.num}>{m.wins}</td><td className={shared.num}>{m.games}</td><td className={shared.rate}><Rate value={m.winrate} side="overall" /></td></tr>)}
                </Table>}
            </Card>
            <Card title="Favorite colors">
                {details.colors.length === 0 ? <Empty>No colors recorded yet.</Empty> : <ul className={styles.shares}>
                    {details.colors.map((c) => <li key={c.color}><Crewmate color={c.color} size={28} /><span className={`${styles.shareName} ${styles.colorName}`}>{c.color}</span><span className={styles.shareValue}>{percent(c.share)}</span><span className={styles.shareGames}>{plural(c.games, "game")}</span></li>)}
                </ul>}
            </Card>
            <Card title="Names used">
                {details.names.length === 0 ? <Empty>No names recorded yet.</Empty> : <ul className={styles.shares}>
                    {details.names.map((n) => <li key={n.name}><span className={styles.shareName}>{n.name || <em>Unnamed</em>}</span><span className={styles.shareValue}>{percent(n.share)}</span><span className={styles.shareGames}>{plural(n.games, "game")}</span></li>)}
                </ul>}
            </Card>
            <Card title="Most played with">
                {details.playedWith.length === 0 ? <Empty>No games with other linked players yet.</Empty> : <Table head={<><th scope="col">Player</th><th scope="col" className={shared.num}>Games</th><th scope="col" className={shared.rate}>Of their games</th></>}>
                    {details.playedWith.map((r) => <tr key={r.userId}><th scope="row"><Player players={players} id={r.userId} /></th><td className={shared.num}>{r.games}</td><td className={shared.rate}><Rate value={r.share} side="overall" /></td></tr>)}
                </Table>}
            </Card>
            <Card title="Died most often with this impostor in the game" hint="Among Us doesn't report who made a kill, so a death as a crewmate counts against every impostor in that game.">
                {details.killedBy.length === 0 ? <Empty>No impostor has shared {plural(min, "game")} with this player yet.</Empty> : <KilledByTable rows={details.killedBy} players={players} />}
            </Card>
            <Card title="Best crewmate teammates">
                {details.bestCrewmateTeammates.length === 0 ? needTeammate("a crewmate", min) : <TeammateTable rows={details.bestCrewmateTeammates} players={players} side="crew" />}
            </Card>
            <Card title="Worst crewmate teammates">
                {details.worstCrewmateTeammates.length === 0 ? needTeammate("a crewmate", min) : <TeammateTable rows={details.worstCrewmateTeammates} players={players} side="crew" />}
            </Card>
            <Card title="Best impostor teammates">
                {details.bestImpostorTeammates.length === 0 ? needTeammate("an impostor", IMPOSTOR_DUO_MIN_GAMES) : <TeammateTable rows={details.bestImpostorTeammates} players={players} side="impostor" />}
            </Card>
            <Card title="Worst impostor teammates">
                {details.worstImpostorTeammates.length === 0 ? needTeammate("an impostor", IMPOSTOR_DUO_MIN_GAMES) : <TeammateTable rows={details.worstImpostorTeammates} players={players} side="impostor" />}
            </Card>
        </div>
    </>;
}

/** The premium sections as a server without premium sees them: made-up values, blurred, under a prompt that
 * takes them to the premium page with this server preselected. */
function LockedDetails({ guildId, until, premiumHref }: { guildId: string; until: number; premiumHref: string }): React.ReactElement {
    return <div className={shared.locked}>
        <div className={shared.lockOverlay}>
            <section className={shared.lockCard} aria-label="Player details">
                <h2>Detailed player stats are a premium feature</h2>
                <p>See streaks, server ranks, survival and first-to-die rates, best and worst teammates, maps, activity, and more. Servers with AutoMuteUs Premium get every section on this page.</p>
                <Link href={{ pathname: premiumHref, query: { guild: guildId } }}>Get Premium for this server</Link>
            </section>
        </div>
        <div className={shared.lockedContent} aria-hidden="true"><Details details={sampleDetails(until)} players={{}} /></div>
    </div>;
}

/** Renders one player's stats in one server. Pure: everything shown comes from the document. */
export default function UserStatsView({ stats, premiumHref = "/premium", currentUserId, preview = false }: Props): React.ReactElement {
    const me = !!currentUserId && currentUserId === stats.userId;
    const generated = new Date(stats.generatedAt * 1000);
    const played = stats.summary.games > 0;
    return <div>
        <Hero stats={stats} me={me} />
        {!played ? <p className={shared.meta}>{me
            ? "You have no recorded games here yet. Games count once AutoMuteUs has linked you to your in-game name."
            : "This player has no recorded games here. They may not have played yet, or may not be linked to AutoMuteUs."}</p> : <>
            <Summary stats={stats} />
            <RecentMatches stats={stats} preview={preview} />
            {stats.details ? <LinkContext.Provider value={{ guildId: stats.guildId, preview }}><Details details={stats.details} players={stats.players} /></LinkContext.Provider>
                : <LockedDetails guildId={stats.guildId} until={stats.generatedAt} premiumHref={premiumHref} />}
        </>}
        <p className={shared.meta}>Updated <time dateTime={generated.toISOString()}>{generated.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>. Stats count games where the player was linked to the bot and are refreshed about once a minute.</p>
    </div>;
}
