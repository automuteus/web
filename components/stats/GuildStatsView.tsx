import React, { useContext } from "react";
import Link from "next/link";
import styles from "./GuildStatsView.module.css";
import {
    GuildStats, GuildLeaderboards, GuildStatsSummary, StatsPlayer, DuoWinrate, PlayerWinrate, IMPOSTOR_DUO_MIN_GAMES,
    avatarURL, defaultAvatar, percent, playerName, sampleLeaderboards,
} from "./guild-stats";
import { userStatsHref } from "./user-stats";

interface Props {
    stats: GuildStats;
    /** The premium page; the server is appended as ?guild= so it arrives preselected. */
    premiumHref?: string;
    /** The signed-in user's Discord ID; their own entries are highlighted and badged "You". */
    currentUserId?: string;
    /** Carries the page's preview=free flag along on player links. */
    preview?: boolean;
}

/** The signed-in user's ID, so any row or card naming them can say so without every component being told. */
const MeContext = React.createContext<string | undefined>(undefined);
function useMe(...ids: string[]): boolean {
    const me = useContext(MeContext);
    return !!me && ids.includes(me);
}
function MeBadge(): React.ReactElement {
    return <span className={styles.meBadge}>You</span>;
}

/** Where player names link. Only the real boards provide it: the blurred sample has no links, so nothing hidden
 * from view can be reached with the keyboard. */
const LinkContext = React.createContext<{ guildId: string; preview: boolean } | undefined>(undefined);

/** A known player's name, linking to their player page when the boards are real. */
function NameText({ id, name }: { id: string; name: string }): React.ReactElement {
    const links = useContext(LinkContext);
    const text = <span className={styles.name} title={`User ID ${id}`}>{name}</span>;
    return links ? <Link className={styles.nameLink} href={userStatsHref(links.guildId, id, links.preview)}>{text}</Link> : text;
}

type Players = Record<string, StatsPlayer>;
/** Which side a board is about, for the colour of its rate bars. */
type Side = "overall" | "crew" | "impostor";
const sideClass: Record<Side, string> = { overall: styles.overall, crew: styles.crew, impostor: styles.impostor };

function Avatar({ players, id, size = 28 }: { players: Players; id: string; size?: number }): React.ReactElement {
    const fallback = defaultAvatar(id);
    return <img className={styles.avatar} src={avatarURL(players, id)} alt="" width={size} height={size} loading="lazy" referrerPolicy="no-referrer"
        onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }} />;
}

/** A user on a board: picture plus their name, or the ID itself when nothing knows a name for them. */
function Player({ players, id }: { players: Players; id: string }): React.ReactElement {
    const name = playerName(players, id);
    const me = useMe(id);
    return <span className={styles.player}>
        <Avatar players={players} id={id} />
        {name ? <NameText id={id} name={name} /> : <code className={styles.unknown} title="This player's name isn't known yet">{id}</code>}
        {me && <MeBadge />}
    </span>;
}

function Pair({ players, a, b }: { players: Players; a: string; b: string }): React.ReactElement {
    return <span className={styles.pair}>
        <span className={styles.pairAvatars}><Avatar players={players} id={a} /><Avatar players={players} id={b} /></span>
        <span className={styles.pairNames}><Name players={players} id={a} /><Name players={players} id={b} /></span>
    </span>;
}

function Name({ players, id }: { players: Players; id: string }): React.ReactElement {
    const name = playerName(players, id);
    const me = useMe(id);
    return <>{name ? <NameText id={id} name={name} /> : <code className={styles.unknown}>{id}</code>}{me && <MeBadge />}</>;
}

/** A table row, highlighted when the signed-in user is one of the players named in it. */
function Row({ ids, children }: { ids: string[]; children: React.ReactNode }): React.ReactElement {
    const me = useMe(...ids);
    return <tr className={me ? styles.me : undefined}>{children}</tr>;
}

function Rank({ n }: { n: number }): React.ReactElement {
    const medal = n === 1 ? styles.gold : n === 2 ? styles.silver : n === 3 ? styles.bronze : "";
    return <span className={`${styles.rankBadge} ${medal}`}>{n}</span>;
}

function Rate({ value, side }: { value: number; side: Side }): React.ReactElement {
    return <span className={styles.rateCell}>
        <span>{percent(value)}</span>
        <span className={styles.bar} aria-hidden="true"><span className={`${styles.barFill} ${sideClass[side]}`} style={{ width: `${Math.min(100, value)}%` }} /></span>
    </span>;
}

function plural(n: number, word: string): string { return `${n} ${word}${n === 1 ? "" : "s"}`; }

function Board({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }): React.ReactElement {
    return <section className={styles.card} aria-label={title}>
        <h2>{title}</h2>
        {hint && <p className={styles.cardHint}>{hint}</p>}
        {children}
    </section>;
}

function Empty({ children }: { children: React.ReactNode }): React.ReactElement {
    return <p className={styles.empty}>{children}</p>;
}

function Table({ head, children }: { head: React.ReactNode; children: React.ReactNode }): React.ReactElement {
    return <div className={styles.scroll}><table className={styles.table}><thead><tr>{head}</tr></thead><tbody>{children}</tbody></table></div>;
}

function WinrateBoard({ rows, players, side }: { rows: PlayerWinrate[]; players: Players; side: Side }): React.ReactElement {
    return <Table head={<><th scope="col" className={styles.rank}>#</th><th scope="col">Player</th><th scope="col" className={styles.num}>Wins</th><th scope="col" className={styles.num}>Games</th><th scope="col" className={styles.rate}>Winrate</th></>}>
        {rows.map((r, i) => <Row key={r.userId} ids={[r.userId]}>
            <td className={styles.rank}><Rank n={i + 1} /></td>
            <th scope="row"><Player players={players} id={r.userId} /></th>
            <td className={styles.num}>{r.wins}</td><td className={styles.num}>{r.games}</td><td className={styles.rate}><Rate value={r.winrate} side={side} /></td>
        </Row>)}
    </Table>;
}

function DuoBoard({ rows, players, side }: { rows: DuoWinrate[]; players: Players; side: Side }): React.ReactElement {
    return <Table head={<><th scope="col" className={styles.rank}>#</th><th scope="col">Players</th><th scope="col" className={styles.num}>Wins</th><th scope="col" className={styles.num}>Games</th><th scope="col" className={styles.rate}>Winrate</th></>}>
        {rows.map((r, i) => <Row key={`${r.userId}:${r.teammateId}`} ids={[r.userId, r.teammateId]}>
            <td className={styles.rank}><Rank n={i + 1} /></td>
            <th scope="row"><Pair players={players} a={r.userId} b={r.teammateId} /></th>
            <td className={styles.num}>{r.wins}</td><td className={styles.num}>{r.games}</td><td className={styles.rate}><Rate value={r.winrate} side={side} /></td>
        </Row>)}
    </Table>;
}

/** The headline holders: the top entry of the boards people care about most, as big cards. Only boards with an
 * entry get a card, so a young server may show one or none. */
function Spotlight({ boards, players }: { boards: GuildLeaderboards; players: Players }): React.ReactElement | null {
    const cards: Array<{ label: string; id: string; teammate?: string; value: string; detail: string; side: Side }> = [];
    const most = boards.mostGames[0];
    if (most) cards.push({ label: "Most games", id: most.userId, value: plural(most.games, "game"), detail: "the server's regular", side: "overall" });
    const best = boards.winrate[0];
    if (best) cards.push({ label: "Best winrate", id: best.userId, value: percent(best.winrate), detail: `${best.wins} of ${plural(best.games, "game")}`, side: "overall" });
    const crew = boards.crewmateWinrate[0];
    if (crew) cards.push({ label: "Top crewmate", id: crew.userId, value: percent(crew.winrate), detail: `${crew.wins} of ${plural(crew.games, "crewmate game")}`, side: "crew" });
    const imp = boards.impostorWinrate[0];
    if (imp) cards.push({ label: "Top impostor", id: imp.userId, value: percent(imp.winrate), detail: `${imp.wins} of ${plural(imp.games, "impostor game")}`, side: "impostor" });
    const duo = boards.bestCrewmateDuo[0];
    if (duo) cards.push({ label: "Best duo", id: duo.userId, teammate: duo.teammateId, value: percent(duo.winrate), detail: `${duo.wins} of ${plural(duo.games, "game")} together`, side: "crew" });
    const target = boards.firstTarget[0];
    if (target) cards.push({ label: "First to go", id: target.userId, value: percent(target.rate), detail: `first to die in ${target.firstDeaths} of ${plural(target.crewmateGames, "game")}`, side: "impostor" });
    if (cards.length === 0) return null;
    return <section className={styles.spotlight} aria-label="Hall of fame">
        <h2 className={styles.sectionTitle}>Hall of fame</h2>
        <div className={styles.spotlightGrid}>
            {cards.map((c) => <SpotlightCard key={c.label} ids={c.teammate ? [c.id, c.teammate] : [c.id]} side={c.side}>
                <div className={styles.spotlightLabel}>{c.label}</div>
                <div className={styles.spotlightAvatars}>
                    <Avatar players={players} id={c.id} size={64} />
                    {c.teammate && <Avatar players={players} id={c.teammate} size={64} />}
                </div>
                <div className={styles.spotlightName}><Name players={players} id={c.id} />{c.teammate && <><span className={styles.amp}> & </span><Name players={players} id={c.teammate} /></>}</div>
                <div className={styles.spotlightValue}>{c.value}</div>
                <div className={styles.spotlightDetail}>{c.detail}</div>
            </SpotlightCard>)}
        </div>
    </section>;
}

function SpotlightCard({ ids, side, children }: { ids: string[]; side: Side; children: React.ReactNode }): React.ReactElement {
    const me = useMe(...ids);
    return <div className={`${styles.spotlightCard} ${sideClass[side]} ${me ? styles.spotlightMe : ""}`}>{children}</div>;
}

function Leaderboards({ boards, players }: { boards: GuildLeaderboards; players: Players }): React.ReactElement {
    const min = boards.minGames;
    const needMin = <Empty>No one has played {plural(min, "game")} in this role yet.</Empty>;
    const needDuo = (role: string, games: number) => <Empty>No two players have been {role} together in {plural(games, "game")} yet.</Empty>;
    return <>
        <Spotlight boards={boards} players={players} />
        <h2 className={styles.sectionTitle}>Leaderboards</h2>
        <p className={styles.meta}>Rate boards rank players with at least {plural(min, "game")}; impostor duos need {IMPOSTOR_DUO_MIN_GAMES} games together.</p>
        <div className={styles.grid}>
            <Board title="Overall winrate">
                {boards.winrate.length === 0 ? <Empty>No one has played {plural(min, "game")} yet.</Empty> : <WinrateBoard rows={boards.winrate} players={players} side="overall" />}
            </Board>
            <Board title="Most games">
                {boards.mostGames.length === 0 ? <Empty>No games recorded yet.</Empty> : <Table head={<><th scope="col" className={styles.rank}>#</th><th scope="col">Player</th><th scope="col" className={styles.num}>Games</th></>}>
                    {boards.mostGames.map((r, i) => <Row key={r.userId} ids={[r.userId]}><td className={styles.rank}><Rank n={i + 1} /></td><th scope="row"><Player players={players} id={r.userId} /></th><td className={styles.num}>{r.games}</td></Row>)}
                </Table>}
            </Board>
            <Board title="Crewmate winrate">
                {boards.crewmateWinrate.length === 0 ? needMin : <WinrateBoard rows={boards.crewmateWinrate} players={players} side="crew" />}
            </Board>
            <Board title="Impostor winrate">
                {boards.impostorWinrate.length === 0 ? needMin : <WinrateBoard rows={boards.impostorWinrate} players={players} side="impostor" />}
            </Board>
            <Board title="Best crewmate duos">
                {boards.bestCrewmateDuo.length === 0 ? needDuo("crewmates", min) : <DuoBoard rows={boards.bestCrewmateDuo} players={players} side="crew" />}
            </Board>
            <Board title="Worst crewmate duos">
                {boards.worstCrewmateDuo.length === 0 ? needDuo("crewmates", min) : <DuoBoard rows={boards.worstCrewmateDuo} players={players} side="crew" />}
            </Board>
            <Board title="Best impostor duos">
                {boards.bestImpostorDuo.length === 0 ? needDuo("impostors", IMPOSTOR_DUO_MIN_GAMES) : <DuoBoard rows={boards.bestImpostorDuo} players={players} side="impostor" />}
            </Board>
            <Board title="Worst impostor duos">
                {boards.worstImpostorDuo.length === 0 ? needDuo("impostors", IMPOSTOR_DUO_MIN_GAMES) : <DuoBoard rows={boards.worstImpostorDuo} players={players} side="impostor" />}
            </Board>
            <Board title="First to die" hint="How often a player was the first one killed, out of their games as a crewmate.">
                {boards.firstTarget.length === 0 ? needMin : <Table head={<><th scope="col" className={styles.rank}>#</th><th scope="col">Player</th><th scope="col" className={styles.num}>First deaths</th><th scope="col" className={styles.num}>Crewmate games</th><th scope="col" className={styles.rate}>Rate</th></>}>
                    {boards.firstTarget.map((r, i) => <Row key={r.userId} ids={[r.userId]}>
                        <td className={styles.rank}><Rank n={i + 1} /></td><th scope="row"><Player players={players} id={r.userId} /></th>
                        <td className={styles.num}>{r.firstDeaths}</td><td className={styles.num}>{r.crewmateGames}</td><td className={styles.rate}><Rate value={r.rate} side="impostor" /></td>
                    </Row>)}
                </Table>}
            </Board>
            <Board title="Killed by" hint="How often a crewmate died in games where a given player was an impostor. Among Us doesn't report who made a kill, so a death counts against every impostor in that game.">
                {boards.killedBy.length === 0 ? <Empty>No crewmate and impostor have shared {plural(min, "game")} yet.</Empty> : <Table head={<><th scope="col" className={styles.rank}>#</th><th scope="col">Crewmate</th><th scope="col">Impostor</th><th scope="col" className={styles.num}>Deaths</th><th scope="col" className={styles.num}>Games</th><th scope="col" className={styles.rate}>Rate</th></>}>
                    {boards.killedBy.map((r, i) => <Row key={`${r.userId}:${r.impostorId}`} ids={[r.userId, r.impostorId]}>
                        <td className={styles.rank}><Rank n={i + 1} /></td><th scope="row"><Player players={players} id={r.userId} /></th><td><Player players={players} id={r.impostorId} /></td>
                        <td className={styles.num}>{r.deaths}</td><td className={styles.num}>{r.games}</td><td className={styles.rate}><Rate value={r.rate} side="impostor" /></td>
                    </Row>)}
                </Table>}
            </Board>
        </div>
    </>;
}

function ShareBar({ summary }: { summary: GuildStatsSummary }): React.ReactElement {
    const other = Math.max(0, 100 - summary.crewmateWinrate - summary.impostorWinrate);
    return <>
        <div className={styles.shareBar} role="img" aria-label={`Crewmates won ${percent(summary.crewmateWinrate)} of games, impostors ${percent(summary.impostorWinrate)}`}>
            {summary.crewmateWinrate > 0 && <div className={`${styles.shareSegment} ${styles.crew}`} style={{ width: `${summary.crewmateWinrate}%` }} />}
            {summary.impostorWinrate > 0 && <div className={`${styles.shareSegment} ${styles.impostor}`} style={{ width: `${summary.impostorWinrate}%` }} />}
        </div>
        <ul className={styles.legend}>
            <li><span className={`${styles.swatch} ${styles.crew}`} aria-hidden="true" />Crewmates <strong>{percent(summary.crewmateWinrate)}</strong></li>
            <li><span className={`${styles.swatch} ${styles.impostor}`} aria-hidden="true" />Impostors <strong>{percent(summary.impostorWinrate)}</strong></li>
            {other >= 0.1 && <li><span className={`${styles.swatch} ${styles.none}`} aria-hidden="true" />No result recorded <strong>{percent(Math.round(other * 10) / 10)}</strong></li>}
        </ul>
    </>;
}

/** The premium layout's summary: one strip, so the boards take the page. */
function SummaryStrip({ summary }: { summary: GuildStatsSummary }): React.ReactElement {
    return <section className={`${styles.card} ${styles.strip}`} aria-label="Summary">
        <div className={styles.stripStats}>
            <div className={styles.stripStat}><span className={styles.stripValue}>{summary.gamesPlayed.toLocaleString("en-US")}</span><span className={styles.stripLabel}>games played</span></div>
            <div className={styles.stripStat}><span className={styles.stripValue}>{summary.crewmateWins.toLocaleString("en-US")}</span><span className={styles.stripLabel}><span className={`${styles.swatch} ${styles.crew}`} aria-hidden="true" />crewmate wins</span></div>
            <div className={styles.stripStat}><span className={styles.stripValue}>{summary.impostorWins.toLocaleString("en-US")}</span><span className={styles.stripLabel}><span className={`${styles.swatch} ${styles.impostor}`} aria-hidden="true" />impostor wins</span></div>
        </div>
        {summary.gamesPlayed > 0 && <div className={styles.stripBar}><ShareBar summary={summary} /></div>}
    </section>;
}

/** The premium section as a server without premium sees it: the same hall of fame and boards, filled with made-up
 * entries and blurred, under a prompt that takes them to the premium page with this server preselected. The
 * blurred content is hidden from assistive technology; the prompt says what is there. */
function LockedLeaderboards({ guildId, premiumHref }: { guildId: string; premiumHref: string }): React.ReactElement {
    return <div className={styles.locked}>
        <div className={styles.lockOverlay}>
            <section className={styles.lockCard} aria-label="Leaderboards">
                <h2>Leaderboards are a premium feature</h2>
                <p>See who really wins here: winrates, best and worst duos, who dies first, and more. Servers with AutoMuteUs Premium get every board on this page, and the detailed <code>/stats</code> command.</p>
                <Link href={{ pathname: premiumHref, query: { guild: guildId } }}>Get Premium for this server</Link>
            </section>
        </div>
        <div className={styles.lockedContent} aria-hidden="true">
            <Leaderboards boards={sampleLeaderboards()} players={{}} />
        </div>
    </div>;
}

/** Renders a guild's stats document. Pure: everything shown comes from the document, and unknown names fall
 * back to the user ID rather than a lookup. */
export default function GuildStatsView({ stats, premiumHref = "/premium", currentUserId, preview = false }: Props): React.ReactElement {
    const { summary, leaderboards, players } = stats;
    const generated = new Date(stats.generatedAt * 1000);
    return <div>
        <SummaryStrip summary={summary} />
        {leaderboards ? <MeContext.Provider value={currentUserId}><LinkContext.Provider value={{ guildId: stats.guildId, preview }}><Leaderboards boards={leaderboards} players={players} /></LinkContext.Provider></MeContext.Provider>
            : <LockedLeaderboards guildId={stats.guildId} premiumHref={premiumHref} />}
        <p className={styles.meta}>Updated <time dateTime={generated.toISOString()}>{generated.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>. Stats count games where players were linked to the bot and are refreshed about once a minute.</p>
    </div>;
}
