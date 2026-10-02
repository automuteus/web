import React, { useContext } from "react";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    return <span className={styles.meBadge}>{t("shared.you")}</span>;
}

/** Where player names link. Only the real boards provide it: the blurred sample has no links, so nothing hidden
 * from view can be reached with the keyboard. */
const LinkContext = React.createContext<{ guildId: string; preview: boolean } | undefined>(undefined);

/** A known player's name, linking to their player page when the boards are real. */
function NameText({ id, name }: { id: string; name: string }): React.ReactElement {
    const { t } = useTranslation();
    const links = useContext(LinkContext);
    const text = <span className={styles.name} title={t("shared.userId", { id })}>{name}</span>;
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
    const { t } = useTranslation();
    const name = playerName(players, id);
    const me = useMe(id);
    return <span className={styles.player}>
        <Avatar players={players} id={id} />
        {name ? <NameText id={id} name={name} /> : <code className={styles.unknown} title={t("shared.unknownPlayer")}>{id}</code>}
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
    const { t } = useTranslation();
    return <Table head={<><th scope="col" className={styles.rank}>{t("guild.column.rank")}</th><th scope="col">{t("shared.column.player")}</th><th scope="col" className={styles.num}>{t("shared.column.wins")}</th><th scope="col" className={styles.num}>{t("shared.column.games")}</th><th scope="col" className={styles.rate}>{t("shared.column.winrate")}</th></>}>
        {rows.map((r, i) => <Row key={r.userId} ids={[r.userId]}>
            <td className={styles.rank}><Rank n={i + 1} /></td>
            <th scope="row"><Player players={players} id={r.userId} /></th>
            <td className={styles.num}>{r.wins}</td><td className={styles.num}>{r.games}</td><td className={styles.rate}><Rate value={r.winrate} side={side} /></td>
        </Row>)}
    </Table>;
}

function DuoBoard({ rows, players, side }: { rows: DuoWinrate[]; players: Players; side: Side }): React.ReactElement {
    const { t } = useTranslation();
    return <Table head={<><th scope="col" className={styles.rank}>{t("guild.column.rank")}</th><th scope="col">{t("guild.column.players")}</th><th scope="col" className={styles.num}>{t("shared.column.wins")}</th><th scope="col" className={styles.num}>{t("shared.column.games")}</th><th scope="col" className={styles.rate}>{t("shared.column.winrate")}</th></>}>
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
    const { t } = useTranslation();
    // key keeps React's list keys stable whatever the language.
    const cards: Array<{ key: string; label: string; id: string; teammate?: string; value: string; detail: string; side: Side }> = [];
    const most = boards.mostGames[0];
    if (most) cards.push({ key: "mostGames", label: t("guild.board.mostGames"), id: most.userId, value: t("guild.games", { count: most.games }), detail: t("guild.spotlight.regular"), side: "overall" });
    const best = boards.winrate[0];
    if (best) cards.push({ key: "bestWinrate", label: t("guild.spotlight.bestWinrate"), id: best.userId, value: percent(best.winrate), detail: t("guild.spotlight.winsOf", { wins: best.wins, count: best.games }), side: "overall" });
    const crew = boards.crewmateWinrate[0];
    if (crew) cards.push({ key: "topCrewmate", label: t("guild.spotlight.topCrewmate"), id: crew.userId, value: percent(crew.winrate), detail: t("guild.spotlight.winsOfCrewmate", { wins: crew.wins, count: crew.games }), side: "crew" });
    const imp = boards.impostorWinrate[0];
    if (imp) cards.push({ key: "topImpostor", label: t("guild.spotlight.topImpostor"), id: imp.userId, value: percent(imp.winrate), detail: t("guild.spotlight.winsOfImpostor", { wins: imp.wins, count: imp.games }), side: "impostor" });
    const duo = boards.bestCrewmateDuo[0];
    if (duo) cards.push({ key: "bestDuo", label: t("guild.spotlight.bestDuo"), id: duo.userId, teammate: duo.teammateId, value: percent(duo.winrate), detail: t("guild.spotlight.winsTogether", { wins: duo.wins, count: duo.games }), side: "crew" });
    const target = boards.firstTarget[0];
    if (target) cards.push({ key: "firstToGo", label: t("guild.spotlight.firstToGo"), id: target.userId, value: percent(target.rate), detail: t("guild.spotlight.firstToDie", { deaths: target.firstDeaths, count: target.crewmateGames }), side: "impostor" });
    if (cards.length === 0) return null;
    return <section className={styles.spotlight} aria-label={t("guild.spotlight.title")}>
        <h2 className={styles.sectionTitle}>{t("guild.spotlight.title")}</h2>
        <div className={styles.spotlightGrid}>
            {cards.map((c) => <SpotlightCard key={c.key} ids={c.teammate ? [c.id, c.teammate] : [c.id]} side={c.side}>
                <div className={styles.spotlightLabel}>{c.label}</div>
                <div className={styles.spotlightAvatars}>
                    <Avatar players={players} id={c.id} size={64} />
                    {c.teammate && <Avatar players={players} id={c.teammate} size={64} />}
                </div>
                <div className={styles.spotlightName}><Name players={players} id={c.id} />{c.teammate && <><span className={styles.amp}>{t("guild.spotlight.and")}</span><Name players={players} id={c.teammate} /></>}</div>
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
    const { t } = useTranslation();
    const min = boards.minGames;
    const needMin = <Empty>{t("guild.empty.roleGames", { count: min })}</Empty>;
    const needCrewmateDuo = <Empty>{t("guild.empty.crewmateDuo", { count: min })}</Empty>;
    const needImpostorDuo = <Empty>{t("guild.empty.impostorDuo", { count: IMPOSTOR_DUO_MIN_GAMES })}</Empty>;
    return <>
        <Spotlight boards={boards} players={players} />
        <h2 className={styles.sectionTitle}>{t("guild.leaderboards.title")}</h2>
        <p className={styles.meta}>{t("guild.leaderboards.minimums", { games: t("guild.games", { count: min }), duoGames: t("guild.games", { count: IMPOSTOR_DUO_MIN_GAMES }) })}</p>
        <div className={styles.grid}>
            <Board title={t("guild.board.overallWinrate")}>
                {boards.winrate.length === 0 ? <Empty>{t("guild.empty.games", { count: min })}</Empty> : <WinrateBoard rows={boards.winrate} players={players} side="overall" />}
            </Board>
            <Board title={t("guild.board.mostGames")}>
                {boards.mostGames.length === 0 ? <Empty>{t("guild.empty.noGames")}</Empty> : <Table head={<><th scope="col" className={styles.rank}>{t("guild.column.rank")}</th><th scope="col">{t("shared.column.player")}</th><th scope="col" className={styles.num}>{t("shared.column.games")}</th></>}>
                    {boards.mostGames.map((r, i) => <Row key={r.userId} ids={[r.userId]}><td className={styles.rank}><Rank n={i + 1} /></td><th scope="row"><Player players={players} id={r.userId} /></th><td className={styles.num}>{r.games}</td></Row>)}
                </Table>}
            </Board>
            <Board title={t("guild.board.crewmateWinrate")}>
                {boards.crewmateWinrate.length === 0 ? needMin : <WinrateBoard rows={boards.crewmateWinrate} players={players} side="crew" />}
            </Board>
            <Board title={t("guild.board.impostorWinrate")}>
                {boards.impostorWinrate.length === 0 ? needMin : <WinrateBoard rows={boards.impostorWinrate} players={players} side="impostor" />}
            </Board>
            <Board title={t("guild.board.bestCrewmateDuos")}>
                {boards.bestCrewmateDuo.length === 0 ? needCrewmateDuo : <DuoBoard rows={boards.bestCrewmateDuo} players={players} side="crew" />}
            </Board>
            <Board title={t("guild.board.worstCrewmateDuos")}>
                {boards.worstCrewmateDuo.length === 0 ? needCrewmateDuo : <DuoBoard rows={boards.worstCrewmateDuo} players={players} side="crew" />}
            </Board>
            <Board title={t("guild.board.bestImpostorDuos")}>
                {boards.bestImpostorDuo.length === 0 ? needImpostorDuo : <DuoBoard rows={boards.bestImpostorDuo} players={players} side="impostor" />}
            </Board>
            <Board title={t("guild.board.worstImpostorDuos")}>
                {boards.worstImpostorDuo.length === 0 ? needImpostorDuo : <DuoBoard rows={boards.worstImpostorDuo} players={players} side="impostor" />}
            </Board>
            <Board title={t("guild.board.firstToDie")} hint={t("guild.board.firstToDieHint")}>
                {boards.firstTarget.length === 0 ? needMin : <Table head={<><th scope="col" className={styles.rank}>{t("guild.column.rank")}</th><th scope="col">{t("shared.column.player")}</th><th scope="col" className={styles.num}>{t("guild.column.firstDeaths")}</th><th scope="col" className={styles.num}>{t("guild.column.crewmateGames")}</th><th scope="col" className={styles.rate}>{t("shared.column.rate")}</th></>}>
                    {boards.firstTarget.map((r, i) => <Row key={r.userId} ids={[r.userId]}>
                        <td className={styles.rank}><Rank n={i + 1} /></td><th scope="row"><Player players={players} id={r.userId} /></th>
                        <td className={styles.num}>{r.firstDeaths}</td><td className={styles.num}>{r.crewmateGames}</td><td className={styles.rate}><Rate value={r.rate} side="impostor" /></td>
                    </Row>)}
                </Table>}
            </Board>
            <Board title={t("guild.board.killedBy")} hint={t("guild.board.killedByHint")}>
                {boards.killedBy.length === 0 ? <Empty>{t("guild.empty.killedBy", { count: min })}</Empty> : <Table head={<><th scope="col" className={styles.rank}>{t("guild.column.rank")}</th><th scope="col">{t("shared.role.crewmate")}</th><th scope="col">{t("shared.column.impostor")}</th><th scope="col" className={styles.num}>{t("shared.column.deaths")}</th><th scope="col" className={styles.num}>{t("shared.column.games")}</th><th scope="col" className={styles.rate}>{t("shared.column.rate")}</th></>}>
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
    const { t } = useTranslation();
    const other = Math.max(0, 100 - summary.crewmateWinrate - summary.impostorWinrate);
    const strong = { strong: <strong /> };
    return <>
        <div className={styles.shareBar} role="img" aria-label={t("guild.share.label", { crewmates: percent(summary.crewmateWinrate), impostors: percent(summary.impostorWinrate) })}>
            {summary.crewmateWinrate > 0 && <div className={`${styles.shareSegment} ${styles.crew}`} style={{ width: `${summary.crewmateWinrate}%` }} />}
            {summary.impostorWinrate > 0 && <div className={`${styles.shareSegment} ${styles.impostor}`} style={{ width: `${summary.impostorWinrate}%` }} />}
        </div>
        <ul className={styles.legend}>
            <li><span className={`${styles.swatch} ${styles.crew}`} aria-hidden="true" /><Trans t={t} i18nKey="guild.share.crewmates" values={{ rate: percent(summary.crewmateWinrate) }} components={strong} /></li>
            <li><span className={`${styles.swatch} ${styles.impostor}`} aria-hidden="true" /><Trans t={t} i18nKey="guild.share.impostors" values={{ rate: percent(summary.impostorWinrate) }} components={strong} /></li>
            {other >= 0.1 && <li><span className={`${styles.swatch} ${styles.none}`} aria-hidden="true" /><Trans t={t} i18nKey="guild.share.none" values={{ rate: percent(Math.round(other * 10) / 10) }} components={strong} /></li>}
        </ul>
    </>;
}

/** The premium layout's summary: one strip, so the boards take the page. */
function SummaryStrip({ summary }: { summary: GuildStatsSummary }): React.ReactElement {
    const { t } = useTranslation();
    return <section className={`${styles.card} ${styles.strip}`} aria-label={t("guild.strip.label")}>
        <div className={styles.stripStats}>
            <div className={styles.stripStat}><span className={styles.stripValue}>{t("shared.number", { value: summary.gamesPlayed })}</span><span className={styles.stripLabel}>{t("guild.strip.gamesPlayed")}</span></div>
            <div className={styles.stripStat}><span className={styles.stripValue}>{t("shared.number", { value: summary.crewmateWins })}</span><span className={styles.stripLabel}><span className={`${styles.swatch} ${styles.crew}`} aria-hidden="true" />{t("guild.strip.crewmateWins")}</span></div>
            <div className={styles.stripStat}><span className={styles.stripValue}>{t("shared.number", { value: summary.impostorWins })}</span><span className={styles.stripLabel}><span className={`${styles.swatch} ${styles.impostor}`} aria-hidden="true" />{t("guild.strip.impostorWins")}</span></div>
        </div>
        {summary.gamesPlayed > 0 && <div className={styles.stripBar}><ShareBar summary={summary} /></div>}
    </section>;
}

/** The premium section as a server without premium sees it: the same hall of fame and boards, filled with made-up
 * entries and blurred, under a prompt that takes them to the premium page with this server preselected. The
 * blurred content is hidden from assistive technology; the prompt says what is there. */
function LockedLeaderboards({ guildId, premiumHref }: { guildId: string; premiumHref: string }): React.ReactElement {
    const { t } = useTranslation();
    return <div className={styles.locked}>
        <div className={styles.lockOverlay}>
            <section className={styles.lockCard} aria-label={t("guild.leaderboards.title")}>
                <h2>{t("guild.locked.title")}</h2>
                <p><Trans t={t} i18nKey="guild.locked.body" components={{ code: <code /> }} /></p>
                <Link href={{ pathname: premiumHref, query: { guild: guildId } }}>{t("shared.getPremium")}</Link>
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
    const { t, i18n } = useTranslation();
    const { summary, leaderboards, players } = stats;
    const generated = new Date(stats.generatedAt * 1000);
    return <div>
        <SummaryStrip summary={summary} />
        {leaderboards ? <MeContext.Provider value={currentUserId}><LinkContext.Provider value={{ guildId: stats.guildId, preview }}><Leaderboards boards={leaderboards} players={players} /></LinkContext.Provider></MeContext.Provider>
            : <LockedLeaderboards guildId={stats.guildId} premiumHref={premiumHref} />}
        <p className={styles.meta}><Trans t={t} i18nKey="guild.updated" values={{ when: generated.toLocaleString(i18n.language, { dateStyle: "medium", timeStyle: "short" }) }} components={{ time: <time dateTime={generated.toISOString()} /> }} /></p>
    </div>;
}
