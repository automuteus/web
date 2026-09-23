import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AppLayout from "../components/layout/AppLayout";
import SettingsView, { ChannelCheckState } from "../components/settings/SettingsView";
import { Settings, FieldError, GuildRole, SNOWFLAKE, countChanges, errorMap, patchBody, same, unknownRoleIDs, validateDraft } from "../components/settings/settings-edit";
import type { ChannelCheck } from "./api/guild/channel";
import styles from "../components/settings/SettingsView.module.css";
import { Guild, canManageGuild } from "../types/Guild";
import type { BotPresence } from "./api/guild/bot";

/** Generic invite used when the API could not supply a server-specific one. */
const GENERIC_INVITE = "https://add.automute.us";

type Result<T> = { key: string; data?: T; error?: string; login?: boolean };
/** A loaded settings document plus the version tag the API wants back on a write. */
interface Loaded { settings: Settings; etag?: string }
interface SaveState { key: string; saving?: boolean; ok?: boolean; message?: string; fields?: FieldError[]; conflict?: boolean; login?: boolean }

function errorMessage(status: number) {
    if (status === 401) return "Your Discord login has expired. Sign in again to continue.";
    if (status === 403) return "You no longer have access to this server, or Discord has not granted the required access.";
    if (status === 404) return "Settings could not be found for this server.";
    if (status === 429 || status === 503) return "Discord or AutoMuteUs is temporarily busy. Please wait a moment and try again.";
    return "We couldn't load this information. Please try again.";
}
function isSettings(data: unknown): data is Settings {
    return !!data && typeof data === "object" && !Array.isArray(data) && typeof (data as Settings).language === "string";
}
/** Mirrors premium.IsExpired in Go: the free tier, or a day count that ran out (-9999 means no expiry). */
function premiumExpired(record: unknown): boolean | undefined {
    if (!record || typeof record !== "object") return undefined;
    const { tier, days } = record as { tier?: unknown; days?: unknown };
    if (typeof tier !== "number" || typeof days !== "number") return undefined;
    return tier === 0 || (days !== -9999 && days < 1);
}

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = status === "authenticated" && !session.error ? session.user.id : "";
    const selected = typeof router.query.guild === "string" ? router.query.guild : "";
    const [guilds, setGuilds] = useState<Result<Guild[]>>({ key: "" });
    const [settings, setSettings] = useState<Result<Loaded>>({ key: "" });
    const [presence, setPresence] = useState<Result<BotPresence>>({ key: "" });
    const [premium, setPremium] = useState<Result<boolean>>({ key: "" });
    // Bot defaults, for marking customised values. Optional: without them the page simply shows no markers.
    const [defaults, setDefaults] = useState<Settings | undefined>();
    // The user's edits, keyed like the loaded document so a reload or server switch always starts clean.
    const [draft, setDraft] = useState<{ key: string; settings?: Settings }>({ key: "" });
    const [save, setSave] = useState<SaveState>({ key: "" });
    const [channelCheck, setChannelCheck] = useState<ChannelCheckState & { key: string }>();
    // The guild's roles, for the operator picker. Optional: a failure just means IDs are typed and shown raw.
    const [roles, setRoles] = useState<Result<GuildRole[]>>({ key: "" });
    const [guildRetry, setGuildRetry] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const list = guilds.key === user ? guilds : { key: user };
    const guild = list.data?.find((g) => g.id === selected);
    const key = `${user}:${selected}:${refresh}`;
    // What the page is showing right now, for async work started under an earlier key to check before it writes.
    const activeKey = useRef(key);
    activeKey.current = key;
    const current = settings.key === key ? settings : { key };
    const bot = presence.key === key ? presence : { key };
    const premiumState = premium.key === key ? premium : { key };
    const saveState = save.key === key ? save : { key };
    // Settings are requested only after the bot check answers. Both requests share the same Discord permission
    // verification upstream, so racing them let settings render and then vanish behind the invite prompt.
    const checkSettings = bot.data?.present === true || !!bot.error;
    const busy = !!guild && (!bot.data && !bot.error || (checkSettings && !current.data && !current.error));
    const saved = current.data?.settings;
    const working = (draft.key === key ? draft.settings : undefined) ?? saved;
    const changes = saved && working ? countChanges(saved, working) : 0;
    const localErrors = working && changes > 0 ? validateDraft(working) : [];
    const fieldErrors = localErrors.length ? localErrors : saveState.fields ?? [];
    // A newly typed summary channel is checked with the bot's credentials before Save is allowed, so a typo or a
    // channel the bot cannot post in never burns a write. The API repeats the check on save regardless.
    const channelValue = typeof working?.matchSummaryChannelID === "string" ? working.matchSummaryChannelID : "";
    const savedChannel = typeof saved?.matchSummaryChannelID === "string" ? saved.matchSummaryChannelID : "";
    const channelPending = channelValue !== "" && channelValue !== savedChannel && SNOWFLAKE.test(channelValue);
    const currentCheck = channelCheck && channelCheck.key === key && channelCheck.id === channelValue ? channelCheck : undefined;
    const channelBlocked = channelPending && (!currentCheck || currentCheck.state === "checking" || currentCheck.state === "problem");
    const guildRoles = roles.key === key ? roles.data : undefined;
    const rolesBlocked = !!working && unknownRoleIDs(working.permissionRoleIDs, guildRoles).length > 0 && !same(working.permissionRoleIDs, saved?.permissionRoleIDs);

    useEffect(() => {
        if (!user) { setGuilds({ key: "" }); setSettings({ key: "" }); setPresence({ key: "" }); setPremium({ key: "" }); return; }
        const controller = new AbortController();
        setGuilds({ key: user });
        fetch("/api/guilds", { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setGuilds({ key: user, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = await res.json();
                if (!Array.isArray(data) || !data.every((g) => g && typeof g.id === "string" && typeof g.name === "string")) throw new Error("Invalid guild list");
                // Only servers the user can change: the Go API's write policy is owner or Administrator.
                if (!controller.signal.aborted) setGuilds({ key: user, data: data.filter(canManageGuild) });
            }).catch(() => { if (!controller.signal.aborted) setGuilds({ key: user, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guildRetry]);

    useEffect(() => {
        if (!user || !guild || !checkSettings) return;
        const controller = new AbortController();
        setSettings({ key });
        fetch(`/api/guild/settings?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setSettings({ key, error: errorMessage(res.status), login: res.status === 401 }); return; }
                const data = await res.json();
                if (!isSettings(data)) throw new Error("Invalid settings");
                if (!controller.signal.aborted) setSettings({ key, data: { settings: data, etag: res.headers.get("etag") ?? undefined } });
            }).catch(() => { if (!controller.signal.aborted) setSettings({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, key, checkSettings]);

    useEffect(() => {
        if (!user || !guild || !checkSettings) return;
        const controller = new AbortController();
        setPremium({ key });
        fetch(`/api/guild/premium?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setPremium({ key, error: errorMessage(res.status) }); return; }
                const expired = premiumExpired(await res.json());
                if (!controller.signal.aborted) setPremium(expired === undefined ? { key, error: errorMessage(502) } : { key, data: expired });
            }).catch(() => { if (!controller.signal.aborted) setPremium({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, key, checkSettings]);

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
        if (!user) return;
        const controller = new AbortController();
        fetch("/api/settings/defaults", { signal: controller.signal })
            .then(async (res) => {
                if (!res.ok) return;
                const data = await res.json();
                if (!controller.signal.aborted && isSettings(data)) setDefaults(data);
            }).catch(() => undefined);
        return () => controller.abort();
    }, [user]);

    useEffect(() => {
        if (!user || !guild || !checkSettings) return;
        const controller = new AbortController();
        setRoles({ key });
        fetch(`/api/guild/roles?${new URLSearchParams({ guildID: guild.id })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setRoles({ key, error: errorMessage(res.status) }); return; }
                const data: unknown = await res.json();
                if (!Array.isArray(data) || !data.every((r) => r && typeof r.id === "string" && typeof r.name === "string" && typeof r.color === "number")) throw new Error("Invalid roles");
                if (!controller.signal.aborted) setRoles({ key, data: data as GuildRole[] });
            }).catch(() => { if (!controller.signal.aborted) setRoles({ key, error: errorMessage(502) }); });
        return () => controller.abort();
    }, [user, guild?.id, key, checkSettings]);

    useEffect(() => {
        if (!guild || !channelPending) return;
        const controller = new AbortController();
        const timer = setTimeout(() => {
            setChannelCheck({ key, id: channelValue, state: "checking" });
            fetch(`/api/guild/channel?${new URLSearchParams({ guildID: guild.id, channelID: channelValue })}`, { signal: controller.signal, cache: "no-store" })
                .then(async (res) => {
                    if (controller.signal.aborted) return;
                    if (!res.ok) { setChannelCheck({ key, id: channelValue, state: "unavailable" }); return; }
                    const data: unknown = await res.json();
                    const check = data as ChannelCheck;
                    if (!check || typeof check !== "object" || typeof check.ok !== "boolean" || !Array.isArray(check.problems)) throw new Error("Invalid channel check");
                    setChannelCheck({ key, id: channelValue, state: check.ok ? "ok" : "problem", name: typeof check.name === "string" ? check.name : undefined,
                        problems: check.problems.filter((p): p is string => typeof p === "string") });
                }).catch(() => { if (!controller.signal.aborted) setChannelCheck({ key, id: channelValue, state: "unavailable" }); });
        }, 400);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [guild?.id, key, channelValue, channelPending]);

    // Unsaved edits survive a stray click on a link only if the browser asks first.
    useEffect(() => {
        if (changes === 0) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [changes]);

    // Header links navigate client-side, which never fires beforeunload, so ask there too. Moving between servers
    // stays on this page and is already confirmed by the server picker, so it is let through.
    useEffect(() => {
        if (changes === 0) return;
        const guard = (url: string) => {
            if (url.split("?")[0] === router.pathname) return;
            if (window.confirm("You have unsaved changes. Leave this page and discard them?")) return;
            router.events.emit("routeChangeError", new Error("Navigation cancelled: unsaved changes"), url, { shallow: false });
            // Next's pages router cancels a navigation only when the routeChangeStart handler throws.
            throw "Navigation cancelled: unsaved changes";
        };
        router.events.on("routeChangeStart", guard);
        return () => router.events.off("routeChangeStart", guard);
    }, [changes, router]);

    const login = () => signIn("discord", { callbackUrl: router.asPath });
    function reload() {
        if (changes > 0 && !window.confirm("Discard your unsaved changes and reload this server's settings?")) return;
        setRefresh((n) => n + 1);
    }
    async function saveChanges() {
        if (!guild || !current.data || !working || saveState.saving) return;
        const body = patchBody(current.data.settings, working);
        const problems = validateDraft(working);
        if (problems.length) { setSave({ key, message: "Fix the highlighted settings first.", fields: problems }); return; }
        if (Object.keys(body).length === 0) return;
        setSave({ key, saving: true });
        try {
            const res = await fetch(`/api/guild/settings?${new URLSearchParams({ guildID: guild.id })}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...(current.data.etag ? { "If-Match": current.data.etag } : {}) },
                body: JSON.stringify(body),
                cache: "no-store",
            });
            const data: unknown = await res.json().catch(() => undefined);
            // Switching and reloading are disabled while saving, but a late response must still never overwrite
            // whatever the page moved on to.
            if (activeKey.current !== key) return;
            if (res.ok && isSettings(data)) {
                setSettings({ key, data: { settings: data, etag: res.headers.get("etag") ?? undefined } });
                setDraft({ key, settings: data });
                setSave({ key, ok: true, message: "Settings saved. The bot uses them from the next game." });
                return;
            }
            const reply = data && typeof data === "object" ? data as { error?: unknown; fields?: unknown } : {};
            const message = typeof reply.error === "string" ? reply.error : errorMessage(res.status);
            const fields = Array.isArray(reply.fields) ? reply.fields.filter((f): f is FieldError => !!f && typeof f === "object" && typeof (f as FieldError).field === "string" && typeof (f as FieldError).message === "string") : undefined;
            setSave({ key, message, fields, conflict: res.status === 409 || res.status === 412, login: res.status === 401 });
        } catch {
            if (activeKey.current === key) setSave({ key, message: "We couldn't reach AutoMuteUs to save. Check your connection and try again." });
        }
    }
    function problem(result: Result<unknown>, retry: () => void) {
        return <div className={styles.state} role="alert"><p>{result.error}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? "Sign in with Discord" : "Try again"}</button></div>;
    }
    return <AppLayout title="Server settings - AutoMuteUs" metaDesc="View and change AutoMuteUs voice rules, delays, and settings for the Discord servers you manage.">
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>Server settings</h1><p className={styles.description}>Your server&apos;s voice rules, timing, and preferences in one place.</p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">Checking your Discord login...</div> : !user ?
                <div className={styles.state}><h2>Choose how your crew plays</h2><p>Sign in with Discord to manage settings for the servers you own or administer.</p><button className={styles.button} onClick={login}>Sign in with Discord</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">Loading your servers...</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>No servers you can manage</h2><p>Only servers where you are the owner or have the Administrator permission are shown here. If you were just given that role, refresh your server list.</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>Refresh servers</button></div> : <>
                            <div className={styles.toolbar}><div className={styles.selector}><label htmlFor="settings-guild">Discord server</label><select id="settings-guild" value={guild ? selected : ""} disabled={saveState.saving} onChange={(e) => { if (changes > 0 && !window.confirm("Discard your unsaved changes and switch servers?")) return; router.replace({ pathname: "/settings", query: e.target.value ? { guild: e.target.value } : {} }, undefined, { shallow: true }); }}><option value="">Select a server</option>{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div><button className={styles.button} disabled={busy || saveState.saving} onClick={reload}>Reload settings</button></div>
                            <p className={styles.notice}>Changes apply to the bot when you press <strong>Save changes</strong>. Servers that never saved settings start from the defaults. Values that differ from the bot&apos;s defaults are marked <strong>Custom</strong>, and edits you haven&apos;t saved yet are highlighted in amber; <strong>Premium</strong> marks settings the bot applies only on premium servers.</p>
                            {!guild ? <div className={styles.state}><h2>{selected ? "Server unavailable" : "Select your server"}</h2><p>{selected ? "This server isn't one you own or administer. Choose another server above." : "Choose a server to see and change its configuration."}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {!bot.data && !bot.error ? <div className={styles.state} role="status">Checking for AutoMuteUs in this server...</div> : bot.data?.present === false ?
                                    <div className={styles.state}>
                                        <h2>AutoMuteUs isn&apos;t in this server yet</h2>
                                        <p>Invite the bot to {guild.name} to use it there. Once it has joined, come back and reload to see its settings.</p>
                                        <a className={styles.button} href={bot.data.invite ?? GENERIC_INVITE} target="_blank" rel="noopener noreferrer">Invite AutoMuteUs</a>
                                        <button className={styles.button} onClick={() => setRefresh((n) => n + 1)}>I&apos;ve added it</button>
                                    </div> : <>
                                        {bot.error && <p className={styles.warning} role="status">We couldn&apos;t confirm that AutoMuteUs is in this server. If the bot hasn&apos;t joined, <a href={GENERIC_INVITE} target="_blank" rel="noopener noreferrer">invite it</a> and these settings will apply once it does.</p>}
                                        {current.error ? problem(current, () => setRefresh((n) => n + 1)) : !current.data || !working ? <div className={styles.state} role="status">Loading settings...</div> : <>
                                            {premiumState.data === true && <p className={styles.notice}>This server doesn&apos;t have AutoMuteUs premium, so settings marked <strong>Premium</strong> are shown but locked.</p>}
                                            <SettingsView settings={working} saved={saved} defaults={defaults} disabled={saveState.saving} errors={errorMap(fieldErrors)} premiumLocked={premiumState.data === true} channelCheck={currentCheck} roles={guildRoles}
                                                onChange={(next) => { setDraft({ key, settings: next }); if (saveState.message && !saveState.saving) setSave({ key }); }} />
                                            <div className={styles.saveBar} role="region" aria-label="Save changes">
                                                <span className={styles.saveStatus} aria-live="polite">{changes === 0 ? "No unsaved changes" : `${changes} unsaved change${changes === 1 ? "" : "s"}`}</span>
                                                {saveState.message && <span className={saveState.ok ? styles.saveOk : styles.saveError} role={saveState.ok ? "status" : "alert"}>{saveState.message}</span>}
                                                <span className={styles.saveActions}>
                                                    {saveState.conflict && <button type="button" className={styles.button} onClick={() => setRefresh((n) => n + 1)}>Reload</button>}
                                                    {saveState.login && <button type="button" className={styles.button} onClick={login}>Sign in with Discord</button>}
                                                    <button type="button" className={styles.button} disabled={changes === 0 || saveState.saving} onClick={() => { setDraft({ key, settings: saved }); setSave({ key }); }}>Discard</button>
                                                    <button type="button" className={`${styles.button} ${styles.primary}`} disabled={changes === 0 || saveState.saving || localErrors.length > 0 || channelBlocked || rolesBlocked} onClick={saveChanges}>{saveState.saving ? "Saving..." : "Save changes"}</button>
                                                </span>
                                            </div>
                                            {fieldErrors.length > 0 && <ul className={styles.errorList} aria-label="Settings that need attention">{fieldErrors.map((f) => <li key={f.field}><code>{f.field}</code> {f.message}</li>)}</ul>}
                                        </>}
                                    </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
