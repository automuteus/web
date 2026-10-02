import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import AppLayout from "../../components/layout/AppLayout";
import MatchSummaryView from "../../components/stats/MatchSummaryView";
import { MatchSummary, matchNumber, parseMatchSummary, previewFree } from "../../components/stats/match-summary";
import { fetchWhileBuilding } from "../../components/stats/building-fetch";
// The page shell (heading, server picker, state cards) is shared with the settings and stats pages.
import styles from "../../components/settings/SettingsView.module.css";
import { adminGuild, Guild } from "../../types/Guild";

/** building is set while the API has said the document is not ready yet and the page is waiting to ask again.
 * error is the HTTP status (502 when the request failed), put into words at render so it follows the language. */
type Result<T> = { key: string; data?: T; error?: number; login?: boolean; missing?: boolean; building?: boolean };

function errorMessage(status: number, t: TFunction) {
    if (status === 401) return t("common:guildPage.error.expired");
    if (status === 403) return t("common:guildPage.error.forbidden");
    if (status === 503) return t("common:guildPage.error.preparing");
    if (status === 429) return t("common:guildPage.error.busy");
    return t("common:guildPage.error.generic");
}

export default function MatchPage() {
    const { t } = useTranslation(["stats", "common"]);
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
    const admin = status === "authenticated" && !session.error && session.user.admin === true;
    const listed = list.data?.find((g) => g.id === selected);
    // Operators may open any server by ID; the API routes then use the admin credential instead of membership.
    const guild = listed ?? (admin && list.data ? adminGuild(selected, t("page.adminServerName", { id: selected })) : undefined);
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
                if (!res.ok) { if (!controller.signal.aborted) setGuilds({ key: user, error: res.status, login: res.status === 401 }); return; }
                const data = await res.json();
                if (!Array.isArray(data) || !data.every((g) => g && typeof g.id === "string" && typeof g.name === "string")) throw new Error("Invalid guild list");
                if (!controller.signal.aborted) setGuilds({ key: user, data });
            }).catch(() => { if (!controller.signal.aborted) setGuilds({ key: user, error: 502 }); });
        return () => controller.abort();
    }, [user, guildRetry]);

    useEffect(() => {
        if (!user || !guild || !matchID) return;
        const controller = new AbortController();
        setMatch({ key });
        fetchWhileBuilding(`/api/guild/match?${new URLSearchParams({ guildID: guild.id, matchID })}`, { signal: controller.signal, onWaiting: () => { if (!controller.signal.aborted) setMatch({ key, building: true }); } })
            .then(async (res) => {
                if (!res.ok) { if (!controller.signal.aborted) setMatch({ key, error: res.status, login: res.status === 401, missing: res.status === 404 }); return; }
                const data = parseMatchSummary(await res.json());
                if (!controller.signal.aborted) setMatch({ key, data });
            }).catch(() => { if (!controller.signal.aborted) setMatch({ key, error: 502 }); });
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
        return <div className={styles.state} role="alert"><p>{errorMessage(result.error ?? 502, t)}</p><button className={styles.button} onClick={result.login ? login : retry}>{result.login ? t("common:guildPage.signIn") : t("common:guildPage.tryAgain")}</button></div>;
    }
    return <AppLayout title={t("page.match.title")} metaDesc={t("page.match.metaDesc")}>
        <div className={styles.page}>
            <div className={styles.intro}><div><h1>{t("page.match.heading")}</h1><p className={styles.description}><Trans t={t} i18nKey="page.match.description" components={{ code: <code /> }} /></p></div></div>
            {status === "loading" ? <div className={styles.state} role="status">{t("common:guildPage.checkingLogin")}</div> : !user ?
                <div className={styles.state}><h2>{t("page.match.signedOut.heading")}</h2><p>{t("page.match.signedOut.body")}</p><button className={styles.button} onClick={login}>{t("common:guildPage.signIn")}</button></div> :
                <>
                    {list.error ? problem(list, () => setGuildRetry((n) => n + 1)) : !list.data ? <div className={styles.state} role="status">{t("common:guildPage.loadingServers")}</div> : list.data.length === 0 ?
                        <div className={styles.state}><h2>{t("common:guildPage.noServers.heading")}</h2><p>{t("page.noServers")}</p><button className={styles.button} onClick={() => setGuildRetry((n) => n + 1)}>{t("common:guildPage.noServers.refresh")}</button></div> : <>
                            <form className={styles.toolbar} onSubmit={submit}>
                                <div className={styles.selector}><label htmlFor="match-guild">{t("common:guildPage.serverLabel")}</label><select id="match-guild" value={guild ? selected : ""} onChange={(e) => go({ guild: e.target.value })}><option value="">{t("common:guildPage.selectServer")}</option>{guild && !listed && <option value={guild.id}>{guild.name}</option>}{[...list.data].sort((a, b) => a.name.localeCompare(b.name)).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                                <div className={styles.selector}><label htmlFor="match-id">{t("page.match.idLabel")}</label><input id="match-id" value={input} onChange={(e) => { setInput(e.target.value); setInvalid(false); }} placeholder={t("page.match.idPlaceholder")} autoComplete="off" spellCheck={false} disabled={!guild} aria-invalid={invalid} aria-describedby={invalid ? "match-id-error" : undefined} /></div>
                                <button className={styles.button} type="submit" disabled={!guild || busy}>{t("page.match.lookUp")}</button>
                            </form>
                            {invalid && <p id="match-id-error" className={styles.warning} role="alert">{t("page.match.invalidId")}</p>}
                            {!guild ? <div className={styles.state}><h2>{selected ? t("common:guildPage.serverUnavailable") : t("page.selectServer")}</h2><p>{selected ? t("page.notMember") : t("page.match.chooseServer")}</p></div> : <>
                                <h2 className={styles.selected}>{guild.name}</h2>
                                {admin && <p className={styles.notice} role="status">{listed ? t("page.admin") : t("page.adminUnlisted")}</p>}
                                {!matchID ? <div className={styles.state}><h2>{t("page.match.noId.heading")}</h2><p><Trans t={t} i18nKey="page.match.noId.body" components={{ stats: <Link href={{ pathname: "/stats", query: { guild: guild.id, ...(preview ? { preview: "free" } : {}) } }} /> }} /></p></div>
                                    : current.missing ? <div className={styles.state} role="alert"><h2>{t("page.match.notFound.heading")}</h2><p>{t("page.match.notFound.body", { guild: guild.name, id: matchID })}</p></div>
                                        : current.error ? problem(current, () => setRefresh((n) => n + 1))
                                            : !current.data ? <div className={styles.state} role="status">{current.building ? t("page.match.building", { id: matchID }) : t("page.match.loading", { id: matchID })}</div>
                                                : <>
                                                    {preview && <p className={styles.notice} role="status"><Trans t={t} i18nKey="page.match.preview" components={{ strong: <strong /> }} /></p>}
                                                    <MatchSummaryView match={preview ? previewFree(current.data) : current.data} currentUserId={user} preview={preview} />
                                                </>}
                            </>}
                        </>}
                </>}
        </div>
    </AppLayout>;
}
