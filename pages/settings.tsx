import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AppLayout from "../components/layout/AppLayout";
import SettingsView, { Settings } from "../components/settings/SettingsView";
import styles from "../components/settings/SettingsView.module.css";
import { Guild } from "../types/Guild";

type Result<T> = { key: string; data?: T; error?: string; login?: boolean };
function errorMessage(status: number) {
    if (status === 401) return "Your Discord login has expired. Sign in again to continue.";
    if (status === 403) return "You no longer have access to this server, or Discord has not granted the required access.";
    if (status === 404) return "Settings could not be found for this server.";
    if (status === 429 || status === 503) return "Discord or AutoMuteUs is temporarily busy. Please wait a moment and try again.";
    return "We couldn't load this information. Please try again.";
}

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = status === "authenticated" && !session.error ? session.user.id : "";
    const selected = typeof router.query.guild === "string" ? router.query.guild : "";
    const [guilds, setGuilds] = useState<Result<Guild[]>>({ key: "" });
    const [settings, setSettings] = useState<Result<Settings>>({ key: "" });
    const [guildRetry, setGuildRetry] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const list = guilds.key === user ? guilds : { key: user };
    const guild = list.data?.find((g) => g.id === selected);
    const key = `${user}:${selected}:${refresh}`;
    const current = settings.key === key ? settings : { key };

    useEffect(() => {
        if (!user) { setGuilds({ key: "" }); setSettings({ key: "" }); return; }
        const controller = new AbortController();
        setGuilds({ key: user });
        fetch("/api/guilds", { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setGuilds({ key: user, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = await res.json();
                if (!Array.isArray(data) || !data.every((g) => g && typeof g.id === "string" && typeof g.name === "string")) throw new Error("Invalid guild list");
                if (!controller.signal.aborted) setGuilds({ key: user, data });
            }).catch(() => { if (!controller.signal.aborted) setGuilds({ key: user, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guildRetry]);

    useEffect(() => {
        if (!user || !guild) return;
        const controller = new AbortController();
        setSettings({ key });
        fetch(`/api/guild/settings?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setSettings({ key, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = await res.json();
                if (!data || typeof data !== "object" || Array.isArray(data) || typeof data.language !== "string") throw new Error("Invalid settings");
                if (!controller.signal.aborted) setSettings({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setSettings({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, key]);

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{result.error}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? "Sign in with Discord" : "Try again"}</button></div>;
    }
    return <AppLayout title="Server settings - AutoMuteUs" metaDesc="View your server's AutoMuteUs voice rules, delays, and settings.">
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>Server settings</h1><p className={styles.description}>Your server's voice rules, timing, and preferences in one place.</p></div><span className={styles.badge}>View only</span></div>
            {status === "loading" ? <div className={styles.state} role="status">Checking your Discord login...</div> : !user ?
                <div className={styles.state}><h2>Choose how your crew plays</h2><p>Sign in with Discord to view settings for your servers.</p><button className={styles.button} onClick={login}>Sign in with Discord</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">Loading your servers...</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>No servers found</h2><p>Join a Discord server, then refresh your server list.</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>Refresh servers</button></div> : <>
                            <div className={styles.toolbar}><div className={styles.selector}><label htmlFor="settings-guild">Discord server</label><select id="settings-guild" value={guild ? selected : ""} onChange={(e) => router.replace({ pathname: "/settings", query: e.target.value ? { guild: e.target.value } : {} }, undefined, { shallow: true })}><option value="">Select a server</option>{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div><button className={styles.button} disabled={!guild || (!current.data && !current.error)} onClick={() => setRefresh((n) => n + 1)}>Refresh settings</button></div>
                            <p className={styles.notice}>You can view settings here now. To make changes, use <code>/settings</code> in Discord for the time being. Servers without saved settings show the defaults.</p>
                            {!guild ? <div className={styles.state}><h2>{selected ? "Server unavailable" : "Select your server"}</h2><p>{selected ? "This server isn't in your Discord server list. Choose another server above." : "Choose a server to see its current configuration."}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {current.error ? problem(current, () => setRefresh((n) => n + 1)) : !current.data ? <div className={styles.state} role="status">Loading settings...</div> : <SettingsView settings={current.data} />}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
