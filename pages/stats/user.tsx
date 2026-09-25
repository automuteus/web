import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../../components/layout/AppLayout";
import ResetPanel from "../../components/layout/ResetPanel";
import UserStatsView from "../../components/stats/UserStatsView";
import { UserStats, parseUserStats, previewFree, userStatsHref } from "../../components/stats/user-stats";
// The page shell (heading, server picker, state cards) is shared with the settings and stats pages.
import styles from "../../components/settings/SettingsView.module.css";
import { playerName } from "../../components/stats/guild-stats";
import { Guild, canManageGuild, hasStatsPage } from "../../types/Guild";

type Result<T> = { key: string; data?: T; error?: string; login?: boolean };

function errorMessage(status: number) {
    if (status === 401) return "Your Discord login has expired. Sign in again to continue.";
    if (status === 403) return "You're not a member of this server, or Discord has not granted the required access.";
    if (status === 429 || status === 503) return "Discord or AutoMuteUs is temporarily busy. Please wait a moment and try again.";
    return "We couldn't load this information. Please try again.";
}

export default function UserStatsPage() {
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
    const [resetNotice, setResetNotice] = useState<{ key: string; message: string }>();
    const list = guilds.key === user ? guilds : { key: user };
    const guild = list.data?.find((g) => g.id === selected);
    const key = `${user}:${selected}:${target}:${refresh}`;
    const current = stats.key === key ? stats : { key };
    const busy = !!guild && !current.data && !current.error;

    useEffect(() => {
        if (!user) { setGuilds({ key: "" }); setStats({ key: "" }); return; }
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
        if (!user || !guild || !target) return;
        const controller = new AbortController();
        setStats({ key });
        fetch(`/api/guild/user?${new URLSearchParams({ guildID: guild.id, userID: target })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setStats({ key, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = parseUserStats(await res.json());
                if (!controller.signal.aborted) setStats({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setStats({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, target, key]);

    function selectGuild(id: string) {
        const query = { ...(id ? { guild: id } : {}), ...(requested ? { user: requested } : {}), ...(preview ? { preview: "free" } : {}) };
        router.replace({ pathname: "/stats/user", query }, undefined, { shallow: true });
    }

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{result.error}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? "Sign in with Discord" : "Try again"}</button></div>;
    }
    const serverStats = { pathname: "/stats", query: { ...(guild ? { guild: guild.id } : {}), ...(preview ? { preview: "free" } : {}) } };
    return <AppLayout title="Player stats - AutoMuteUs" metaDesc="Winrates, recent matches, streaks, and teammates for an Among Us player in a server that plays with AutoMuteUs.">
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>Player stats</h1><p className={styles.description}>How a player has done in a server: wins by role, recent matches, and who they play best with.</p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">Checking your Discord login...</div> : !user ?
                <div className={styles.state}><h2>See how you play</h2><p>Sign in with Discord to see player stats for the servers you play in.</p><button className={styles.button} onClick={login}>Sign in with Discord</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">Loading your servers...</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>No servers found</h2><p>You don&apos;t seem to be in any Discord servers. Join one where AutoMuteUs is playing, then refresh your server list.</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>Refresh servers</button></div> : <>
                            <div className={styles.toolbar}>
                                <div className={styles.selector}><label htmlFor="user-guild">Discord server</label><select id="user-guild" value={guild ? selected : ""} onChange={(e) => selectGuild(e.target.value)}><option value="">Select a server</option>{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                                <button className={styles.button} disabled={!guild || busy} onClick={() => setRefresh((n) => n + 1)}>Reload stats</button>
                                <Link className={styles.button} href={serverStats}>Server stats</Link>
                                {guild && target !== user && <Link className={styles.button} href={userStatsHref(guild.id, user, preview)}>My stats</Link>}
                            </div>
                            {!guild ? <div className={styles.state}><h2>{selected ? "Server unavailable" : "Select your server"}</h2><p>{selected ? "This server isn't one you're a member of. Choose another server above." : "Choose the server to see stats from."}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {current.error ? problem(current, () => setRefresh((n) => n + 1)) : !current.data ? <div className={styles.state} role="status">Loading player stats...</div> : <>
                                    {preview && <p className={styles.notice} role="status">Previewing this player as they would look <strong>without premium</strong>. The detailed sections are hidden, not missing.</p>}
                                    {resetNotice?.key === key && <p className={styles.notice} role="status">{resetNotice.message}</p>}
                                    <UserStatsView stats={preview ? previewFree(current.data) : current.data} currentUserId={user} preview={preview} />
                                    {(target === user || canManageGuild(guild)) && <ResetPanel key={`${guild.id}/${target}`} title={target === user ? "Reset your stats" : "Reset this player's stats"}
                                        action={target === user ? "Reset my stats" : "Reset player stats"} disabled={current.data.summary.games === 0}
                                        url={`/api/guild/user/reset?${new URLSearchParams({ guildID: guild.id, userID: target })}`}
                                        confirm={<>{target === user ? "You" : <strong>{playerName(current.data.players, target) ?? target}</strong>} will be removed from every recorded game in <strong>{guild.name}</strong>.</>}
                                        onReset={(body) => {
                                            const games = (body as { games?: unknown } | undefined)?.games;
                                            setResetNotice({ key: `${user}:${selected}:${target}:${refresh + 1}`, message: `Player stats reset.${typeof games === "number" ? ` Removed from ${games} game${games === 1 ? "" : "s"}.` : ""}` });
                                            setRefresh((n) => n + 1);
                                        }}>
                                        {target === user ?
                                            <p>Remove yourself from every game recorded in this server and start your stats here over. The games stay, so everyone else&apos;s stats are unchanged, and your stats in other servers are kept.</p> :
                                            <p>Remove this player from every game recorded in this server. The games stay, so everyone else&apos;s stats are unchanged, and their stats in other servers are kept. Only the server owner and members with Administrator or Manage Server see this.</p>}
                                    </ResetPanel>}
                                </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
