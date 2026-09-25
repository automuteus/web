import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../components/layout/AppLayout";
import ResetPanel from "../components/layout/ResetPanel";
import GuildStatsView from "../components/stats/GuildStatsView";
import { GuildStats, parseGuildStats, previewFree } from "../components/stats/guild-stats";
import { userStatsHref } from "../components/stats/user-stats";
// The page shell (heading, server picker, state cards) is shared with the settings page so the two look alike.
import styles from "../components/settings/SettingsView.module.css";
import { Guild, canManageGuild, hasStatsPage } from "../types/Guild";
import type { BotPresence } from "./api/guild/bot";

/** Generic invite used when the API could not supply a server-specific one. */
const GENERIC_INVITE = "https://add.automute.us";

type Result<T> = { key: string; data?: T; error?: string; login?: boolean };

function errorMessage(status: number) {
    if (status === 401) return "Your Discord login has expired. Sign in again to continue.";
    if (status === 403) return "You're not a member of this server, or Discord has not granted the required access.";
    if (status === 429 || status === 503) return "Discord or AutoMuteUs is temporarily busy. Please wait a moment and try again.";
    return "We couldn't load this information. Please try again.";
}

export default function StatsPage() {
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
    const [resetNotice, setResetNotice] = useState<{ key: string; message: string }>();
    const list = guilds.key === user ? guilds : { key: user };
    const guild = list.data?.find((g) => g.id === selected);
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
                if (!res.ok) { if (!controller.signal.aborted) setGuilds({ key: user, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = await res.json();
                if (!Array.isArray(data) || !data.every((g) => g && typeof g.id === "string" && typeof g.name === "string")) throw new Error("Invalid guild list");
                // Servers with games recorded, or the bot there to record them. Any member may see a server's stats.
                if (!controller.signal.aborted) setGuilds({ key: user, data: data.filter(hasStatsPage) });
            }).catch(() => { if (!controller.signal.aborted) setGuilds({ key: user, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guildRetry]);

    useEffect(() => {
        if (!user || !guild) return;
        const controller = new AbortController();
        setPresence({ key });
        fetch(`/api/guild/bot?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setPresence({ key, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = await res.json();
                if (!data || typeof data !== "object" || typeof data.present !== "boolean" ||
                    (data.invite !== undefined && (typeof data.invite !== "string" || !data.invite.startsWith("https://discord.com/oauth2/authorize?")))) {
                    throw new Error("Invalid bot presence");
                }
                if (!controller.signal.aborted) setPresence({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setPresence({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, key]);

    useEffect(() => {
        if (!user || !guild || !checkStats) return;
        const controller = new AbortController();
        setStats({ key });
        fetch(`/api/guild/stats?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setStats({ key, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = parseGuildStats(await res.json());
                if (!controller.signal.aborted) setStats({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setStats({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, key, checkStats]);

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{result.error}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? "Sign in with Discord" : "Try again"}</button></div>;
    }
    return <AppLayout title="Server stats - AutoMuteUs" metaDesc="Games played, winrates, and leaderboards for the Discord servers you play Among Us in with AutoMuteUs.">
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>Server stats</h1><p className={styles.description}>How your crew has fared: games played, which side wins, and who leads the boards.</p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">Checking your Discord login...</div> : !user ?
                <div className={styles.state}><h2>See how your crew plays</h2><p>Sign in with Discord to see stats for the servers you play in.</p><button className={styles.button} onClick={login}>Sign in with Discord</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">Loading your servers...</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>No servers found</h2><p>You don&apos;t seem to be in any Discord servers. Join one where AutoMuteUs is playing, then refresh your server list.</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>Refresh servers</button></div> : <>
                            <div className={styles.toolbar}><div className={styles.selector}><label htmlFor="stats-guild">Discord server</label><select id="stats-guild" value={guild ? selected : ""} onChange={(e) => router.replace({ pathname: "/stats", query: { ...(e.target.value ? { guild: e.target.value } : {}), ...(preview ? { preview: "free" } : {}) } }, undefined, { shallow: true })}><option value="">Select a server</option>{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div><button className={styles.button} disabled={busy} onClick={() => setRefresh((n) => n + 1)}>Reload stats</button><Link className={styles.button} href={{ pathname: "/stats/match", query: { ...(guild ? { guild: guild.id } : {}), ...(preview ? { preview: "free" } : {}) } }}>Look up a match</Link>{guild && <Link className={styles.button} href={userStatsHref(guild.id, user, preview)}>My stats</Link>}</div>
                            {!guild ? <div className={styles.state}><h2>{selected ? "Server unavailable" : "Select your server"}</h2><p>{selected ? "This server isn't one you're a member of. Choose another server above." : "Choose a server to see its stats."}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {!bot.data && !bot.error ? <div className={styles.state} role="status">Checking for AutoMuteUs in this server...</div> : bot.data?.present === false ?
                                    <div className={styles.state}>
                                        <h2>AutoMuteUs isn&apos;t in this server yet</h2>
                                        <p>Invite the bot to {guild.name} and play a few games; stats will appear here once matches have been recorded.</p>
                                        <a className={styles.button} href={bot.data.invite ?? GENERIC_INVITE} target="_blank" rel="noopener noreferrer">Invite AutoMuteUs</a>
                                        <button className={styles.button} onClick={() => setRefresh((n) => n + 1)}>I&apos;ve added it</button>
                                    </div> : <>
                                        {bot.error && <p className={styles.warning} role="status">We couldn&apos;t confirm that AutoMuteUs is in this server. If the bot hasn&apos;t joined, <a href={GENERIC_INVITE} target="_blank" rel="noopener noreferrer">invite it</a> to start recording games.</p>}
                                        {current.error ? problem(current, () => setRefresh((n) => n + 1)) : !current.data ? <div className={styles.state} role="status">Loading stats...</div> :
                                            <>
                                                {preview && <p className={styles.notice} role="status">Previewing this server as it would look <strong>without premium</strong>. The leaderboards are hidden, not missing.</p>}
                                                {resetNotice?.key === key && <p className={styles.notice} role="status">{resetNotice.message}</p>}
                                                <GuildStatsView stats={preview ? previewFree(current.data) : current.data} currentUserId={user} preview={preview} />
                                                {canManageGuild(guild) && <ResetPanel key={guild.id} title="Reset server stats" action="Reset server stats" typed="reset"
                                                    url={`/api/guild/stats/reset?${new URLSearchParams({ guildID: guild.id })}`}
                                                    confirm={<>Every recorded game in <strong>{guild.name}</strong> will be deleted, for every player.</>}
                                                    onReset={(body) => {
                                                        const games = (body as { games?: unknown } | undefined)?.games;
                                                        setResetNotice({ key: `${user}:${selected}:${refresh + 1}`, message: `Server stats reset.${typeof games === "number" ? ` ${games} game${games === 1 ? "" : "s"} deleted.` : ""}` });
                                                        setRefresh((n) => n + 1);
                                                    }}>
                                                    <p>Delete every game AutoMuteUs has recorded in this server and start the stats over. Settings are kept. Only the server owner and members with Administrator or Manage Server see this.</p>
                                                </ResetPanel>}
                                            </>}
                                    </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
