import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import AppLayout from "../../components/layout/AppLayout";
import ResetPanel from "../../components/layout/ResetPanel";
import UserStatsView from "../../components/stats/UserStatsView";
import { UserStats, parseUserStats, previewFree, userStatsHref } from "../../components/stats/user-stats";
// The page shell (heading, server picker, state cards) is shared with the settings and stats pages.
import styles from "../../components/settings/SettingsView.module.css";
import { playerName } from "../../components/stats/guild-stats";
import { fetchWhileBuilding } from "../../components/stats/building-fetch";
import { adminGuild, Guild, canManageGuild, hasStatsPage } from "../../types/Guild";

/** building is set while the API has said the document is not ready yet and the page is waiting to ask again.
 * error is the HTTP status (502 when the request failed), put into words at render so it follows the language. */
type Result<T> = { key: string; data?: T; error?: number; login?: boolean; building?: boolean };

function errorMessage(status: number, t: TFunction) {
    if (status === 401) return t("common:guildPage.error.expired");
    if (status === 403) return t("common:guildPage.error.forbidden");
    if (status === 503) return t("common:guildPage.error.preparing");
    if (status === 429) return t("common:guildPage.error.busy");
    return t("common:guildPage.error.generic");
}

export default function UserStatsPage() {
    const { t } = useTranslation(["stats", "common"]);
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = status === "authenticated" && !session.error ? session.user.id : "";
    const selected = typeof router.query.guild === "string" ? router.query.guild : "";
    // Any member may look up any player; without ?user= the page shows the signed-in user.
    const requested = typeof router.query.user === "string" && /^[0-9]{17,20}$/.test(router.query.user) ? router.query.user : "";
    const target = requested || user;
    // ?preview=free shows the page as a server without premium sees it, for checking that layout locally.
    const preview = router.query.preview === "free";
    const [guilds, setGuilds] = useState<Result<Guild[]>>({ key: "" });
    const [stats, setStats] = useState<Result<UserStats>>({ key: "" });
    const [guildRetry, setGuildRetry] = useState(0);
    const [refresh, setRefresh] = useState(0);
    // Set for the reload a reset starts, so it shows once over the emptied stats and goes on the next reload.
    const [resetNotice, setResetNotice] = useState<{ key: string; games?: number }>();
    const list = guilds.key === user ? guilds : { key: user };
    const admin = status === "authenticated" && !session.error && session.user.admin === true;
    const listed = list.data?.find((g) => g.id === selected);
    // Operators may open any server by ID; the API routes then use the admin credential instead of membership.
    const guild = listed ?? (admin && list.data ? adminGuild(selected, t("page.adminServerName", { id: selected })) : undefined);
    const key = `${user}:${selected}:${target}:${refresh}`;
    const current = stats.key === key ? stats : { key };
    const busy = !!guild && !current.data && !current.error;

    useEffect(() => {
        if (!user) { setGuilds({ key: "" }); setStats({ key: "" }); return; }
        const controller = new AbortController();
        setGuilds({ key: user });
        fetch("/api/guilds", { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setGuilds({ key: user, error: res.status, login: res.status === 401 }); return; }
                const data = await res.json();
                if (!Array.isArray(data) || !data.every((g) => g && typeof g.id === "string" && typeof g.name === "string")) throw new Error("Invalid guild list");
                // Servers with games recorded, or the bot there to record them. Any member may see a server's stats.
                if (!controller.signal.aborted) setGuilds({ key: user, data: data.filter(hasStatsPage) });
            }).catch(() => { if (!controller.signal.aborted) setGuilds({ key: user, error: 502 }); });
        return () => controller.abort();
    }, [user, guildRetry]);

    useEffect(() => {
        if (!user || !guild || !target) return;
        const controller = new AbortController();
        setStats({ key });
        fetchWhileBuilding(`/api/guild/user?${new URLSearchParams({ guildID: guild.id, userID: target })}`, { signal: controller.signal, onWaiting: () => { if (!controller.signal.aborted) setStats({ key, building: true }); } })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setStats({ key, error: res.status, login: res.status === 401 }); return; }
                const data = parseUserStats(await res.json());
                if (!controller.signal.aborted) setStats({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setStats({ key, error: 502 }); });
        return () => controller.abort();
    }, [user, guild?.id, target, key]);

    function selectGuild(id: string) {
        const query = { ...(id ? { guild: id } : {}), ...(requested ? { user: requested } : {}), ...(preview ? { preview: "free" } : {}) };
        router.replace({ pathname: "/stats/user", query }, undefined, { shallow: true });
    }

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{errorMessage(result.error ?? 502, t)}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? t("common:guildPage.signIn") : t("common:guildPage.tryAgain")}</button></div>;
    }
    const serverStats = { pathname: "/stats", query: { ...(guild ? { guild: guild.id } : {}), ...(preview ? { preview: "free" } : {}) } };
    return <AppLayout title={t("page.user.title")} metaDesc={t("page.user.metaDesc")}>
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>{t("page.user.heading")}</h1><p className={styles.description}>{t("page.user.description")}</p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">{t("common:guildPage.checkingLogin")}</div> : !user ?
                <div className={styles.state}><h2>{t("page.user.signedOut.heading")}</h2><p>{t("page.user.signedOut.body")}</p><button className={styles.button} onClick={login}>{t("common:guildPage.signIn")}</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">{t("common:guildPage.loadingServers")}</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>{t("common:guildPage.noServers.heading")}</h2><p>{t("page.noServers")}</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>{t("common:guildPage.noServers.refresh")}</button></div> : <>
                            <div className={styles.toolbar}>
                                <div className={styles.selector}><label htmlFor="user-guild">{t("common:guildPage.serverLabel")}</label><select id="user-guild" value={guild ? selected : ""} onChange={(e) => selectGuild(e.target.value)}><option value="">{t("common:guildPage.selectServer")}</option>{guild && !listed && <option value={guild.id}>{guild.name}</option>}{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                                <button className={styles.button} disabled={!guild || busy} onClick={() => setRefresh((n) => n + 1)}>{t("page.reloadStats")}</button>
                                <Link className={styles.button} href={serverStats}>{t("page.server.heading")}</Link>
                                {guild && target !== user && <Link className={styles.button} href={userStatsHref(guild.id, user, preview)}>{t("page.myStats")}</Link>}
                            </div>
                            {!guild ? <div className={styles.state}><h2>{selected ? t("common:guildPage.serverUnavailable") : t("page.selectServer")}</h2><p>{selected ? t("page.notMember") : t("page.user.chooseServer")}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {admin && <p className={styles.notice} role="status">{listed ? t("page.admin") : t("page.adminUnlisted")}</p>}
                                {current.error ? problem(current, () => setRefresh((n) => n + 1)) : !current.data ? <div className={styles.state} role="status">{current.building ? t("page.user.building") : t("page.user.loading")}</div> : <>
                                    {preview && <p className={styles.notice} role="status"><Trans t={t} i18nKey="page.user.preview" components={{ strong: <strong /> }} /></p>}
                                    {resetNotice?.key === key && <p className={styles.notice} role="status">{resetNotice.games === undefined ? t("page.user.resetDone") : t("page.user.resetDoneGames", { count: resetNotice.games })}</p>}
                                    <UserStatsView stats={preview ? previewFree(current.data) : current.data} currentUserId={user} preview={preview} />
                                    {(target === user || canManageGuild(guild)) && <ResetPanel key={`${guild.id}/${target}`} title={target === user ? t("page.user.reset.selfTitle") : t("page.user.reset.otherTitle")}
                                        action={target === user ? t("page.user.reset.selfAction") : t("page.user.reset.otherAction")} disabled={current.data.summary.games === 0}
                                        url={`/api/guild/user/reset?${new URLSearchParams({ guildID: guild.id, userID: target })}`}
                                        confirm={target === user ? <Trans t={t} i18nKey="page.user.reset.selfConfirm" values={{ guild: guild.name }} components={{ strong: <strong /> }} />
                                            : <Trans t={t} i18nKey="page.user.reset.otherConfirm" values={{ player: playerName(current.data.players, target) ?? target, guild: guild.name }} components={{ strong: <strong /> }} />}
                                        onReset={(body) => {
                                            const games = (body as { games?: unknown } | undefined)?.games;
                                            setResetNotice({ key: `${user}:${selected}:${target}:${refresh + 1}`, games: typeof games === "number" ? games : undefined });
                                            setRefresh((n) => n + 1);
                                        }}>
                                        {target === user ?
                                            <p>{t("page.user.reset.selfBody")}</p> :
                                            <p>{t("page.user.reset.otherBody")}</p>}
                                    </ResetPanel>}
                                </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
