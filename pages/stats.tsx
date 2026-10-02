import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import ResetPanel from "../components/layout/ResetPanel";
import GuildStatsView from "../components/stats/GuildStatsView";
import { GuildStats, parseGuildStats, previewFree } from "../components/stats/guild-stats";
import { fetchWhileBuilding } from "../components/stats/building-fetch";
import { userStatsHref } from "../components/stats/user-stats";
// The page shell (heading, server picker, state cards) is shared with the settings page so the two look alike.
import styles from "../components/settings/SettingsView.module.css";
import { adminGuild, Guild, canManageGuild, hasStatsPage } from "../types/Guild";
import type { BotPresence } from "./api/guild/bot";

/** Generic invite used when the API could not supply a server-specific one. */
const GENERIC_INVITE = "https://add.automute.us";

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

export default function StatsPage() {
    const { t } = useTranslation(["stats", "common"]);
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = status === "authenticated" && !session.error ? session.user.id : "";
    const selected = typeof router.query.guild === "string" ? router.query.guild : "";
    // ?preview=free shows the page as a server without premium sees it, for checking that layout locally.
    const preview = router.query.preview === "free";
    const [guilds, setGuilds] = useState<Result<Guild[]>>({ key: "" });
    const [presence, setPresence] = useState<Result<BotPresence>>({ key: "" });
    const [stats, setStats] = useState<Result<GuildStats>>({ key: "" });
    const [guildRetry, setGuildRetry] = useState(0);
    const [refresh, setRefresh] = useState(0);
    // Set for the reload a reset starts, so it shows once over the emptied stats and goes on the next reload.
    const [resetNotice, setResetNotice] = useState<{ key: string; games?: number }>();
    const list = guilds.key === user ? guilds : { key: user };
    const admin = status === "authenticated" && !session.error && session.user.admin === true;
    const listed = list.data?.find((g) => g.id === selected);
    // Operators may open any server by ID; the API routes then use the admin credential instead of membership.
    const guild = listed ?? (admin && list.data ? adminGuild(selected, t("page.adminServerName", { id: selected })) : undefined);
    const key = `${user}:${selected}:${refresh}`;
    const bot = presence.key === key ? presence : { key };
    const current = stats.key === key ? stats : { key };
    // Stats are requested only after the bot check answers. Both requests share the same Discord membership
    // verification upstream, so racing them would let stats render and then vanish behind the invite prompt.
    const checkStats = bot.data?.present === true || !!bot.error;
    const busy = !!guild && (!bot.data && !bot.error || (checkStats && !current.data && !current.error));

    useEffect(() => {
        if (!user) { setGuilds({ key: "" }); setPresence({ key: "" }); setStats({ key: "" }); return; }
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
        if (!user || !guild) return;
        const controller = new AbortController();
        setPresence({ key });
        fetch(`/api/guild/bot?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setPresence({ key, error: res.status, login: res.status === 401 }); return; }
                const data = await res.json();
                if (!data || typeof data !== "object" || typeof data.present !== "boolean" ||
                    (data.invite !== undefined && (typeof data.invite !== "string" || !data.invite.startsWith("https://discord.com/oauth2/authorize?")))) {
                    throw new Error("Invalid bot presence");
                }
                if (!controller.signal.aborted) setPresence({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setPresence({ key, error: 502 }); });
        return () => controller.abort();
    }, [user, guild?.id, key]);

    useEffect(() => {
        if (!user || !guild || !checkStats) return;
        const controller = new AbortController();
        setStats({ key });
        fetchWhileBuilding(`/api/guild/stats?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, onWaiting: () => { if (!controller.signal.aborted) setStats({ key, building: true }); } })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setStats({ key, error: res.status, login: res.status === 401 }); return; }
                const data = parseGuildStats(await res.json());
                if (!controller.signal.aborted) setStats({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setStats({ key, error: 502 }); });
        return () => controller.abort();
    }, [user, guild?.id, key, checkStats]);

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{errorMessage(result.error ?? 502, t)}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? t("common:guildPage.signIn") : t("common:guildPage.tryAgain")}</button></div>;
    }
    return <AppLayout title={t("page.server.title")} metaDesc={t("page.server.metaDesc")}>
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>{t("page.server.heading")}</h1><p className={styles.description}>{t("page.server.description")}</p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">{t("common:guildPage.checkingLogin")}</div> : !user ?
                <div className={styles.state}><h2>{t("page.server.signedOut.heading")}</h2><p>{t("page.server.signedOut.body")}</p><button className={styles.button} onClick={login}>{t("common:guildPage.signIn")}</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">{t("common:guildPage.loadingServers")}</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>{t("common:guildPage.noServers.heading")}</h2><p>{t("page.noServers")}</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>{t("common:guildPage.noServers.refresh")}</button></div> : <>
                            <div className={styles.toolbar}><div className={styles.selector}><label htmlFor="stats-guild">{t("common:guildPage.serverLabel")}</label><select id="stats-guild" value={guild ? selected : ""} onChange={(e) => router.replace({ pathname: "/stats", query: { ...(e.target.value ? { guild: e.target.value } : {}), ...(preview ? { preview: "free" } : {}) } }, undefined, { shallow: true })}><option value="">{t("common:guildPage.selectServer")}</option>{guild && !listed && <option value={guild.id}>{guild.name}</option>}{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div><button className={styles.button} disabled={busy} onClick={() => setRefresh((n) => n + 1)}>{t("page.reloadStats")}</button><Link className={styles.button} href={{ pathname: "/stats/match", query: { ...(guild ? { guild: guild.id } : {}), ...(preview ? { preview: "free" } : {}) } }}>{t("page.server.lookUpMatch")}</Link>{guild && <Link className={styles.button} href={userStatsHref(guild.id, user, preview)}>{t("page.myStats")}</Link>}</div>
                            {!guild ? <div className={styles.state}><h2>{selected ? t("common:guildPage.serverUnavailable") : t("page.selectServer")}</h2><p>{selected ? t("page.notMember") : t("page.server.chooseServer")}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {admin && <p className={styles.notice} role="status">{listed ? t("page.server.admin") : t("page.server.adminUnlisted")}</p>}
                                {!bot.data && !bot.error ? <div className={styles.state} role="status">{t("common:guildPage.checkingBot")}</div> : bot.data?.present === false ?
                                    <div className={styles.state}>
                                        <h2>{t("common:guildPage.botAbsent.heading")}</h2>
                                        <p>{t("page.server.inviteBot", { guild: guild.name })}</p>
                                        <a className={styles.button} href={bot.data.invite ?? GENERIC_INVITE} target="_blank" rel="noopener noreferrer">{t("common:guildPage.botAbsent.invite")}</a>
                                        <button className={styles.button} onClick={() => setRefresh((n) => n + 1)}>{t("common:guildPage.botAbsent.added")}</button>
                                    </div> : <>
                                        {bot.error && <p className={styles.warning} role="status"><Trans t={t} i18nKey="page.server.botUnknown" components={{ invite: <a href={GENERIC_INVITE} target="_blank" rel="noopener noreferrer" /> }} /></p>}
                                        {current.error ? problem(current, () => setRefresh((n) => n + 1)) : !current.data ? <div className={styles.state} role="status">{current.building ? t("page.server.building") : t("page.server.loading")}</div> :
                                            <>
                                                {preview && <p className={styles.notice} role="status"><Trans t={t} i18nKey="page.server.preview" components={{ strong: <strong /> }} /></p>}
                                                {resetNotice?.key === key && <p className={styles.notice} role="status">{resetNotice.games === undefined ? t("page.server.resetDone") : t("page.server.resetDoneGames", { count: resetNotice.games })}</p>}
                                                <GuildStatsView stats={preview ? previewFree(current.data) : current.data} currentUserId={user} preview={preview} />
                                                {canManageGuild(guild) && <ResetPanel key={guild.id} title={t("page.server.reset.title")} action={t("page.server.reset.action")} typed="reset"
                                                    url={`/api/guild/stats/reset?${new URLSearchParams({ guildID: guild.id })}`}
                                                    confirm={<Trans t={t} i18nKey="page.server.reset.confirm" values={{ guild: guild.name }} components={{ strong: <strong /> }} />}
                                                    onReset={(body) => {
                                                        const games = (body as { games?: unknown } | undefined)?.games;
                                                        setResetNotice({ key: `${user}:${selected}:${refresh + 1}`, games: typeof games === "number" ? games : undefined });
                                                        setRefresh((n) => n + 1);
                                                    }}>
                                                    <p>{t("page.server.reset.body")}</p>
                                                </ResetPanel>}
                                            </>}
                                    </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
