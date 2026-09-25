import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../../components/layout/AppLayout";
import MatchSummaryView from "../../components/stats/MatchSummaryView";
import { MatchSummary, matchNumber, parseMatchSummary, previewFree } from "../../components/stats/match-summary";
// The page shell (heading, server picker, state cards) is shared with the settings and stats pages.
import styles from "../../components/settings/SettingsView.module.css";
import { Guild } from "../../types/Guild";

type Result<T> = { key: string; data?: T; error?: string; login?: boolean; missing?: boolean };

function errorMessage(status: number) {
    if (status === 401) return "Your Discord login has expired. Sign in again to continue.";
    if (status === 403) return "You're not a member of this server, or Discord has not granted the required access.";
    if (status === 429 || status === 503) return "Discord or AutoMuteUs is temporarily busy. Please wait a moment and try again.";
    return "We couldn't load this information. Please try again.";
}

export default function MatchPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = status === "authenticated" && !session.error ? session.user.id : "";
    const selected = typeof router.query.guild === "string" ? router.query.guild : "";
    const matchID = typeof router.query.match === "string" ? matchNumber(router.query.match) : "";
    // ?preview=free shows the match as a server without premium sees it, for checking that layout locally.
    const preview = router.query.preview === "free";
    const [guilds, setGuilds] = useState<Result<Guild[]>>({ key: "" });
    const [match, setMatch] = useState<Result<MatchSummary>>({ key: "" });
    const [input, setInput] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [guildRetry, setGuildRetry] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const list = guilds.key === user ? guilds : { key: user };
    const guild = list.data?.find((g) => g.id === selected);
    const key = `${user}:${selected}:${matchID}:${refresh}`;
    const current = match.key === key ? match : { key };
    const busy = !!guild && !!matchID && !current.data && !current.error;

    // The box follows the address, so a shared link or the back button shows the match being displayed.
    useEffect(() => { setInput(matchID); setInvalid(false); }, [matchID]);

    useEffect(() => {
        if (!user) { setGuilds({ key: "" }); setMatch({ key: "" }); return; }
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
        if (!user || !guild || !matchID) return;
        const controller = new AbortController();
        setMatch({ key });
        fetch(`/api/guild/match?${new URLSearchParams({ guildID: guild.id, matchID })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setMatch({ key, error: errorMessage(res.status), login: res.status === 401, missing: res.status === 404 }); return; }
                const data = parseMatchSummary(await res.json());
                if (!controller.signal.aborted) setMatch({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setMatch({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, matchID, key]);

    function go(query: { guild?: string; match?: string }) {
        const next = { ...(query.guild ? { guild: query.guild } : {}), ...(query.match ? { match: query.match } : {}), ...(preview ? { preview: "free" } : {}) };
        router.replace({ pathname: "/stats/match", query: next }, undefined, { shallow: true });
    }
    function submit(e: FormEvent) {
        e.preventDefault();
        const id = matchNumber(input);
        setInvalid(!id);
        if (!id) return;
        if (id === matchID) setRefresh((n) => n + 1);
        else go({ guild: selected, match: id });
    }

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{result.error}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? "Sign in with Discord" : "Try again"}</button></div>;
    }
    return <AppLayout title="Match summary - AutoMuteUs" metaDesc="Who played, who won, and how an Among Us match played out, from the matches AutoMuteUs records.">
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>Match summary</h1><p className={styles.description}>Look up a match by the ID AutoMuteUs posts when a game ends, like <code>ABCDEFGH:42</code>.</p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">Checking your Discord login...</div> : !user ?
                <div className={styles.state}><h2>See how the match went</h2><p>Sign in with Discord to look up matches from the servers you play in.</p><button className={styles.button} onClick={login}>Sign in with Discord</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">Loading your servers...</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>No servers found</h2><p>You don&apos;t seem to be in any Discord servers. Join one where AutoMuteUs is playing, then refresh your server list.</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>Refresh servers</button></div> : <>
                            <form className={styles.toolbar} onSubmit={submit}>
                                <div className={styles.selector}><label htmlFor="match-guild">Discord server</label><select id="match-guild" value={guild ? selected : ""} onChange={(e) => go({ guild: e.target.value })}><option value="">Select a server</option>{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                                <div className={styles.selector}><label htmlFor="match-id">Match ID</label><input id="match-id" value={input} onChange={(e) => { setInput(e.target.value); setInvalid(false); }} placeholder="ABCDEFGH:42 or 42" autoComplete="off" spellCheck={false} disabled={!guild} aria-invalid={invalid} aria-describedby={invalid ? "match-id-error" : undefined} /></div>
                                <button className={styles.button} type="submit" disabled={!guild || busy}>Look up</button>
                            </form>
                            {invalid && <p id="match-id-error" className={styles.warning} role="alert">That doesn&apos;t look like a match ID. Paste the ID from the bot&apos;s game over message, or just the number after the colon.</p>}
                            {!guild ? <div className={styles.state}><h2>{selected ? "Server unavailable" : "Select your server"}</h2><p>{selected ? "This server isn't one you're a member of. Choose another server above." : "Choose the server the match was played in."}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {!matchID ? <div className={styles.state}><h2>Enter a match ID</h2><p>AutoMuteUs posts the match ID in its game over message. You can also browse this server&apos;s <Link href={{ pathname: "/stats", query: { guild: guild.id, ...(preview ? { preview: "free" } : {}) } }}>stats</Link>.</p></div>
                                    : current.missing ? <div className={styles.state} role="alert"><h2>Match not found</h2><p>{guild.name} has no match {matchID}. Check that the ID is from a game played in this server.</p></div>
                                        : current.error ? problem(current, () => setRefresh((n) => n + 1))
                                            : !current.data ? <div className={styles.state} role="status">Loading match {matchID}...</div>
                                                : <>
                                                    {preview && <p className={styles.notice} role="status">Previewing this match as it would look <strong>without premium</strong>. The timeline is hidden, not missing.</p>}
                                                    <MatchSummaryView match={preview ? previewFree(current.data) : current.data} currentUserId={user} preview={preview} />
                                                </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
