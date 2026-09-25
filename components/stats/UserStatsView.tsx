import React, { useContext } from "react";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";
// Cards, tables, rate bars, avatars, and the locked-section overlay are shared with the server stats page.
import shared from "./GuildStatsView.module.css";
import styles from "./UserStatsView.module.css";
import { Crewmate } from "./MatchSummaryView";
import { IMPOSTOR_DUO_MIN_GAMES, StatsPlayer, avatarURL, defaultAvatar, percent, playerName } from "./guild-stats";
import { MAP_NAMES, Role } from "./match-summary";
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

/** A <time> for Trans to wrap around an already formatted date, e.g. <first>{{first}}</first>. */
function timeTag(seconds: number): React.ReactElement {
    return <time dateTime={new Date(seconds * 1000).toISOString()} />;
}
function formatDate(seconds: number, language: string, time = false): string {
    return new Date(seconds * 1000).toLocaleString(language, time ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" });
}
function Day({ seconds }: { seconds: number }): React.ReactElement {
    const { i18n } = useTranslation();
    return <time dateTime={new Date(seconds * 1000).toISOString()}>{formatDate(seconds, i18n.language)}</time>;
}

function Avatar({ players, id, size = 28 }: { players: Players; id: string; size?: number }): React.ReactElement {
    const fallback = defaultAvatar(id);
    return <img className={shared.avatar} src={avatarURL(players, id)} alt="" width={size} height={size} style={{ width: size, height: size }} loading="lazy" referrerPolicy="no-referrer"
        onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }} />;
}

/** Another player: picture and name, linking to their own page. */
function Player({ players, id }: { players: Players; id: string }): React.ReactElement {
    const { t } = useTranslation();
    const links = useContext(LinkContext);
    const name = playerName(players, id);
    const label = name ? <span className={shared.name} title={t("shared.userId", { id })}>{name}</span> : <code className={shared.unknown} title={t("shared.unknownPlayer")}>{id}</code>;
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
    const { t, i18n } = useTranslation();
    const { summary, userId, players } = stats;
    const name = playerName(players, userId);
    return <section className={`${shared.card} ${styles.hero}`} aria-label={t("user.hero.label")}>
        <Avatar players={players} id={userId} size={72} />
        <div className={styles.heroText}>
            <h2 className={styles.heroName}>{name ?? <code className={shared.unknown}>{userId}</code>}{me && <span className={shared.meBadge}>{t("shared.you")}</span>}</h2>
            {summary.firstGame !== undefined && summary.lastGame !== undefined
                ? <p className={styles.heroMeta}><Trans t={t} i18nKey="user.hero.since"
                    values={{ first: formatDate(summary.firstGame, i18n.language), last: formatDate(summary.lastGame, i18n.language) }}
                    components={{ first: timeTag(summary.firstGame), last: timeTag(summary.lastGame) }} /></p>
                : <p className={styles.heroMeta}>{t("user.hero.noGames")}</p>}
        </div>
    </section>;
}

function RoleCard({ label, record, side }: { label: string; record: RoleRecord; side: Side }): React.ReactElement {
    const { t } = useTranslation();
    return <div className={`${styles.tile} ${sideClass[side]}`}>
        <div className={styles.tileLabel}><span className={`${shared.swatch} ${sideClass[side]}`} aria-hidden="true" />{label}</div>
        <div className={styles.tileValue}>{record.games > 0 ? percent(record.winrate) : "–"}</div>
        <div className={styles.tileDetail}>{t("user.summary.wonOf", { wins: record.wins, count: record.games })}</div>
    </div>;
}

/** The free summary: games, wins, and the split by role. */
function Summary({ stats }: { stats: UserStats }): React.ReactElement {
    const { t } = useTranslation();
    const { summary } = stats;
    return <div className={styles.tiles}>
        <div className={`${styles.tile} ${shared.overall}`}>
            <div className={styles.tileLabel}>{t("user.summary.gamesPlayed")}</div>
            <div className={styles.tileValue}>{t("shared.number", { value: summary.games })}</div>
            <div className={styles.tileDetail}>{t("user.summary.wins", { count: summary.wins })}</div>
        </div>
        <div className={`${styles.tile} ${shared.overall}`}>
            <div className={styles.tileLabel}>{t("shared.column.winrate")}</div>
            <div className={styles.tileValue}>{summary.games > 0 ? percent(summary.winrate) : "–"}</div>
            <div className={styles.tileDetail}>{t("user.summary.ofEveryGame")}</div>
        </div>
        <RoleCard label={t("user.summary.asCrewmate")} record={summary.crewmate} side="crew" />
        <RoleCard label={t("user.summary.asImpostor")} record={summary.impostor} side="impostor" />
    </div>;
}

/** The latest results as dots, oldest on the left so the run reads toward today. An unknown result is grey. */
function Form({ matches }: { matches: UserMatch[] }): React.ReactElement {
    const { t } = useTranslation();
    const ordered = [...matches].reverse();
    const known = ordered.filter((m) => m.result !== "unknown");
    const wins = known.filter((m) => m.won).length;
    return <div className={styles.form}>
        <span className={styles.formLabel}>{t("user.form.label")}</span>
        <ol className={styles.dots} aria-label={t("user.form.summary", { wins, count: known.length })}>
            {ordered.map((m) => {
                const state = m.result === "unknown" ? styles.dotUnknown : m.won ? styles.dotWin : styles.dotLoss;
                const title = m.result === "unknown" ? t("user.form.dotNoResult", { id: m.matchId }) : m.won ? t("user.form.dotWon", { id: m.matchId }) : t("user.form.dotLost", { id: m.matchId });
                return <li key={m.matchId} className={`${styles.dot} ${state}`} title={title} />;
            })}
        </ol>
    </div>;
}

function RecentMatches({ stats, preview }: { stats: UserStats; preview: boolean }): React.ReactElement {
    const { t } = useTranslation();
    const matches = stats.recentMatches;
    return <Card title={t("user.recent.title")}>
        {matches.length === 0 ? <Empty>{t("user.recent.empty")}</Empty> : <>
            <Form matches={matches} />
            <ul className={styles.matches}>
                {matches.map((m) => <li key={m.matchId}>
                    <Link className={styles.matchRow} href={matchHref(stats.guildId, m.matchId, preview)}>
                        <Crewmate color={m.color} size={30} />
                        <span className={styles.matchWho}>
                            <span className={styles.matchName}>{m.name || <em>{t("shared.unnamed")}</em>}</span>
                            <span className={styles.matchSub}>{t("user.recent.matchLine", { id: m.matchId, map: m.map ? MAP_NAMES[m.map] : t("shared.mapNotRecorded") })}</span>
                        </span>
                        <span className={`${styles.roleTag} ${sideClass[roleSide[m.role]]}`}>{m.role === "impostor" ? t("shared.role.impostor") : t("shared.role.crewmate")}</span>
                        <span className={`${styles.outcome} ${m.result === "unknown" ? styles.dotUnknown : m.won ? styles.dotWin : styles.dotLoss}`} title={t(`shared.result.${m.result}`)}>
                            {m.result === "unknown" ? t("shared.outcome.none") : m.won ? t("shared.outcome.won") : t("shared.outcome.lost")}
                        </span>
                        <span className={styles.matchDate}><Day seconds={m.startTime} /></span>
                    </Link>
                </li>)}
            </ul>
        </>}
    </Card>;
}

function RankLine({ label, rank }: { label: string; rank?: BoardRank }): React.ReactElement {
    const { t } = useTranslation();
    return <div className={styles.rankLine}>
        <dt>{label}</dt>
        <dd>{rank ? <Trans t={t} i18nKey="user.ranks.position" values={{ position: rank.position }} count={rank.players} components={{ strong: <strong />, span: <span /> }} />
            : <span className={styles.unranked}>{t("user.ranks.notRanked")}</span>}</dd>
    </div>;
}

function StreakValue({ current }: { current: number }): React.ReactElement {
    const { t } = useTranslation();
    if (current === 0) return <>–</>;
    return <span className={current > 0 ? styles.streakWin : styles.streakLoss}>{current > 0 ? t("user.streak.win", { n: current }) : t("user.streak.loss", { n: -current })}</span>;
}

/** How often something happened to the player in a role, and whether their side won anyway. */
function FateRow({ label, fate, role }: { label: string; fate: Fate; role: Role }): React.ReactElement {
    const { t } = useTranslation();
    const detail = role === "crewmate" ? t("user.fates.ofCrewmateGames", { times: fate.times, count: fate.games }) : t("user.fates.ofImpostorGames", { times: fate.times, count: fate.games });
    return <li className={styles.fateRow}>
        <div className={styles.fateHead}><span>{label}</span><strong>{fate.games > 0 ? percent(fate.rate) : "–"}</strong></div>
        <div className={styles.fateDetail}>{fate.times > 0 ? t("user.fates.detailStillWon", { detail, rate: percent(fate.winrate) }) : detail}</div>
    </li>;
}

function Activity({ details }: { details: UserStatsDetails }): React.ReactElement {
    const { t } = useTranslation();
    const weeks = details.activity.weeks;
    const max = Math.max(1, ...weeks);
    const total = weeks.reduce((a, b) => a + b, 0);
    return <Card title={t("user.activity.title")} hint={t("user.activity.hint", { games: t("shared.games", { count: total }), weeks: t("user.activity.lastWeeks", { count: weeks.length }) })}>
        <ol className={styles.activity} aria-label={t("user.activity.label")}>
            {weeks.map((n, i) => {
                const ago = weeks.length - 1 - i;
                return <li key={i} title={ago === 0 ? t("user.activity.barThisWeek", { count: n }) : t("user.activity.barEarlier", { games: t("shared.games", { count: n }), weeks: t("user.activity.weeksBefore", { count: ago }) })}>
                    <span className={styles.activityBar} style={{ height: `${n === 0 ? 0 : Math.max(6, (n / max) * 100)}%` }} />
                </li>;
            })}
        </ol>
        <div className={styles.activityAxis}><span>{t("user.activity.weeksAgo", { count: weeks.length })}</span><span>{t("user.activity.thisWeek")}</span></div>
    </Card>;
}

function TeammateTable({ rows, players, side }: { rows: Teammate[]; players: Players; side: Side }): React.ReactElement {
    const { t } = useTranslation();
    return <Table head={<><th scope="col">{t("shared.column.teammate")}</th><th scope="col" className={shared.num}>{t("shared.column.wins")}</th><th scope="col" className={shared.num}>{t("shared.column.games")}</th><th scope="col" className={shared.rate}>{t("shared.column.winrate")}</th></>}>
        {rows.map((r) => <tr key={r.userId}>
            <th scope="row"><Player players={players} id={r.userId} /></th>
            <td className={shared.num}>{r.wins}</td><td className={shared.num}>{r.games}</td><td className={shared.rate}><Rate value={r.winrate} side={side} /></td>
        </tr>)}
    </Table>;
}

function KilledByTable({ rows, players }: { rows: DiedWith[]; players: Players }): React.ReactElement {
    const { t } = useTranslation();
    return <Table head={<><th scope="col">{t("shared.column.impostor")}</th><th scope="col" className={shared.num}>{t("shared.column.deaths")}</th><th scope="col" className={shared.num}>{t("shared.column.games")}</th><th scope="col" className={shared.rate}>{t("shared.column.rate")}</th></>}>
        {rows.map((r) => <tr key={r.impostorId}>
            <th scope="row"><Player players={players} id={r.impostorId} /></th>
            <td className={shared.num}>{r.deaths}</td><td className={shared.num}>{r.games}</td><td className={shared.rate}><Rate value={r.rate} side="impostor" /></td>
        </tr>)}
    </Table>;
}

/** The premium sections. */
function Details({ details, players }: { details: UserStatsDetails; players: Players }): React.ReactElement {
    const { t } = useTranslation();
    const { ranks, streaks, survival, fates, firstTarget } = details;
    const min = details.minGames;
    const noCrewmateTeammate = <Empty>{t("user.teammates.emptyCrewmate", { count: min })}</Empty>;
    const noImpostorTeammate = <Empty>{t("user.teammates.emptyImpostor", { count: IMPOSTOR_DUO_MIN_GAMES })}</Empty>;
    return <>
        <h2 className={shared.sectionTitle}>{t("user.details.title")}</h2>
        <div className={styles.tiles}>
            <div className={`${styles.tile} ${shared.overall}`}>
                <div className={styles.tileLabel}>{t("user.streak.current")}</div>
                <div className={styles.tileValue}><StreakValue current={streaks.current} /></div>
                <div className={styles.tileDetail}>{t("user.streak.best", { win: streaks.bestWin, loss: streaks.bestLoss })}</div>
            </div>
            <div className={`${styles.tile} ${shared.crew}`}>
                <div className={styles.tileLabel}>{t("user.survival.label")}</div>
                <div className={styles.tileValue}>{survival.games > 0 ? percent(survival.rate) : "–"}</div>
                <div className={styles.tileDetail}>{t("user.survival.detail", { survived: survival.survived, count: survival.games })}</div>
            </div>
            <div className={`${styles.tile} ${shared.impostor}`}>
                <div className={styles.tileLabel}>{t("user.firstTarget.label")}</div>
                <div className={styles.tileValue}>{firstTarget.crewmateGames > 0 ? percent(firstTarget.rate) : "–"}</div>
                <div className={styles.tileDetail}>{t("user.firstTarget.detail", { deaths: firstTarget.firstDeaths, count: firstTarget.crewmateGames })}</div>
            </div>
            <div className={`${styles.tile} ${shared.overall}`}>
                <div className={styles.tileLabel}>{t("user.ranks.serverRank")}</div>
                <div className={styles.tileValue}>{ranks.games ? t("user.ranks.hash", { position: ranks.games.position }) : "–"}</div>
                <div className={styles.tileDetail}>{ranks.games ? t("user.ranks.byGames", { count: ranks.games.players }) : t("user.ranks.noGames")}</div>
            </div>
        </div>
        <div className={shared.grid}>
            <Card title={t("user.ranks.title")} hint={t("user.ranks.hint", { count: min })}>
                <dl className={styles.ranks}>
                    <RankLine label={t("user.summary.gamesPlayed")} rank={ranks.games} />
                    <RankLine label={t("user.ranks.overallWinrate")} rank={ranks.winrate} />
                    <RankLine label={t("user.ranks.crewmateWinrate")} rank={ranks.crewmateWinrate} />
                    <RankLine label={t("user.ranks.impostorWinrate")} rank={ranks.impostorWinrate} />
                </dl>
            </Card>
            <Card title={t("user.fates.title")} hint={t("user.fates.hint")}>
                <ul className={styles.fates}>
                    <FateRow label={t("user.fates.killedAsCrewmate")} fate={fates.killedAsCrewmate} role="crewmate" />
                    <FateRow label={t("user.fates.votedOutAsCrewmate")} fate={fates.votedOutAsCrewmate} role="crewmate" />
                    <FateRow label={t("user.fates.votedOutAsImpostor")} fate={fates.votedOutAsImpostor} role="impostor" />
                </ul>
            </Card>
            <Activity details={details} />
            <Card title={t("user.maps.title")}>
                {details.maps.length === 0 ? <Empty>{t("user.maps.empty")}</Empty> : <Table head={<><th scope="col">{t("shared.column.map")}</th><th scope="col" className={shared.num}>{t("shared.column.wins")}</th><th scope="col" className={shared.num}>{t("shared.column.games")}</th><th scope="col" className={shared.rate}>{t("shared.column.winrate")}</th></>}>
                    {details.maps.map((m) => <tr key={m.map}><th scope="row">{MAP_NAMES[m.map]}</th><td className={shared.num}>{m.wins}</td><td className={shared.num}>{m.games}</td><td className={shared.rate}><Rate value={m.winrate} side="overall" /></td></tr>)}
                </Table>}
            </Card>
            <Card title={t("user.colors.title")}>
                {details.colors.length === 0 ? <Empty>{t("user.colors.empty")}</Empty> : <ul className={styles.shares}>
                    {details.colors.map((c) => <li key={c.color}><Crewmate color={c.color} size={28} /><span className={`${styles.shareName} ${styles.colorName}`}>{t(`shared.color.${c.color}`)}</span><span className={styles.shareValue}>{percent(c.share)}</span><span className={styles.shareGames}>{t("shared.games", { count: c.games })}</span></li>)}
                </ul>}
            </Card>
            <Card title={t("user.names.title")}>
                {details.names.length === 0 ? <Empty>{t("user.names.empty")}</Empty> : <ul className={styles.shares}>
                    {details.names.map((n) => <li key={n.name}><span className={styles.shareName}>{n.name || <em>{t("shared.unnamed")}</em>}</span><span className={styles.shareValue}>{percent(n.share)}</span><span className={styles.shareGames}>{t("shared.games", { count: n.games })}</span></li>)}
                </ul>}
            </Card>
            <Card title={t("user.playedWith.title")}>
                {details.playedWith.length === 0 ? <Empty>{t("user.playedWith.empty")}</Empty> : <Table head={<><th scope="col">{t("shared.column.player")}</th><th scope="col" className={shared.num}>{t("shared.column.games")}</th><th scope="col" className={shared.rate}>{t("user.playedWith.share")}</th></>}>
                    {details.playedWith.map((r) => <tr key={r.userId}><th scope="row"><Player players={players} id={r.userId} /></th><td className={shared.num}>{r.games}</td><td className={shared.rate}><Rate value={r.share} side="overall" /></td></tr>)}
                </Table>}
            </Card>
            <Card title={t("user.killedBy.title")} hint={t("user.killedBy.hint")}>
                {details.killedBy.length === 0 ? <Empty>{t("user.killedBy.empty", { count: min })}</Empty> : <KilledByTable rows={details.killedBy} players={players} />}
            </Card>
            <Card title={t("user.teammates.bestCrewmate")}>
                {details.bestCrewmateTeammates.length === 0 ? noCrewmateTeammate : <TeammateTable rows={details.bestCrewmateTeammates} players={players} side="crew" />}
            </Card>
            <Card title={t("user.teammates.worstCrewmate")}>
                {details.worstCrewmateTeammates.length === 0 ? noCrewmateTeammate : <TeammateTable rows={details.worstCrewmateTeammates} players={players} side="crew" />}
            </Card>
            <Card title={t("user.teammates.bestImpostor")}>
                {details.bestImpostorTeammates.length === 0 ? noImpostorTeammate : <TeammateTable rows={details.bestImpostorTeammates} players={players} side="impostor" />}
            </Card>
            <Card title={t("user.teammates.worstImpostor")}>
                {details.worstImpostorTeammates.length === 0 ? noImpostorTeammate : <TeammateTable rows={details.worstImpostorTeammates} players={players} side="impostor" />}
            </Card>
        </div>
    </>;
}

/** The premium sections as a server without premium sees them: made-up values, blurred, under a prompt that
 * takes them to the premium page with this server preselected. */
function LockedDetails({ guildId, until, premiumHref }: { guildId: string; until: number; premiumHref: string }): React.ReactElement {
    const { t } = useTranslation();
    return <div className={shared.locked}>
        <div className={shared.lockOverlay}>
            <section className={shared.lockCard} aria-label={t("user.locked.label")}>
                <h2>{t("user.locked.title")}</h2>
                <p>{t("user.locked.body")}</p>
                <Link href={{ pathname: premiumHref, query: { guild: guildId } }}>{t("user.locked.cta")}</Link>
            </section>
        </div>
        <div className={shared.lockedContent} aria-hidden="true"><Details details={sampleDetails(until)} players={{}} /></div>
    </div>;
}

/** Renders one player's stats in one server. Pure: everything shown comes from the document. */
export default function UserStatsView({ stats, premiumHref = "/premium", currentUserId, preview = false }: Props): React.ReactElement {
    const { t, i18n } = useTranslation();
    const me = !!currentUserId && currentUserId === stats.userId;
    const played = stats.summary.games > 0;
    return <div>
        <Hero stats={stats} me={me} />
        {!played ? <p className={shared.meta}>{me ? t("user.noGames.self") : t("user.noGames.other")}</p> : <>
            <Summary stats={stats} />
            <RecentMatches stats={stats} preview={preview} />
            {stats.details ? <LinkContext.Provider value={{ guildId: stats.guildId, preview }}><Details details={stats.details} players={stats.players} /></LinkContext.Provider>
                : <LockedDetails guildId={stats.guildId} until={stats.generatedAt} premiumHref={premiumHref} />}
        </>}
        <p className={shared.meta}><Trans t={t} i18nKey="user.updated" values={{ when: formatDate(stats.generatedAt, i18n.language, true) }} components={{ time: timeTag(stats.generatedAt) }} /></p>
    </div>;
}
