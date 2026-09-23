import React, { useId } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faHeadphones, faSlash, faCircleInfo, faCrown } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./SettingsView.module.css";

export type Settings = Record<string, unknown>;
const phases = [["LOBBY", "Lobby"], ["TASKS", "Tasks"], ["DISCUSSION", "Discussion"]];
const unknown = "Not available";

/** Settings the API applies only on premium servers. This mirrors PremiumSnapshot in the Go settings package;
 * the leaderboard options are premium-gated there too but are no longer shown here. */
export const PREMIUM_ONLY: ReadonlySet<string> = new Set(["deleteGameSummary", "matchSummaryChannelID", "autoRefresh", "muteSpectator", "displayRoomCode"]);
const PREMIUM_DETAIL = "Premium-only setting. AutoMuteUs applies it only on servers with premium.";

export function text(value: unknown): string {
    return typeof value === "string" && value ? value : unknown;
}
export function enabled(value: unknown): string {
    return value === true ? "Enabled" : value === false ? "Disabled" : unknown;
}
export function retention(value: unknown): string {
    if (value === -1) return "Keep forever";
    if (value === 0) return "Delete immediately";
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? `Delete after ${value} ${value === 1 ? "minute" : "minutes"}` : unknown;
}
function number(value: unknown, unit = "") {
    return typeof value === "number" && Number.isFinite(value) ? `${value}${unit}` : unknown;
}
function transitionDelay(from: string, to: string, value: unknown) {
    return from === to ? "N/A" : number(value, " s");
}
function channel(value: unknown): string {
    return value === "" ? "None configured" : text(value);
}
function roomCode(value: unknown): string {
    const room = text(value);
    return new Map([["always", "Always visible"], ["never", "Hidden"], ["spoiler", "Behind a spoiler"]]).get(room) ?? room;
}
function nested(value: unknown, ...keys: string[]): unknown {
    for (const key of keys) {
        if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
        value = (value as Record<string, unknown>)[key];
    }
    return value;
}
/** Structural equality for JSON values, so a guild document and the defaults compare regardless of key order. */
export function same(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object" || Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((key) =>
        Object.prototype.hasOwnProperty.call(b, key) && same((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}

function VoiceHint({ label, description, children, className = "" }: {
    label: string;
    description: string;
    children: React.ReactNode;
    className?: string;
}) {
    const id = useId();
    return (
        <OverlayTrigger
            placement="top"
            trigger={["hover", "focus"]}
            overlay={<Tooltip id={id}>{description}</Tooltip>}
        >
            <span tabIndex={0} className={`${styles.voiceHint} ${className}`} aria-label={`${label}. ${description}`}>
                {children}
            </span>
        </OverlayTrigger>
    );
}

/** Small pill next to a setting: gold for premium-only, blue when the value differs from the bot default. */
function Marker({ kind, detail }: { kind: "premium" | "changed"; detail: string }) {
    const label = kind === "premium" ? "Premium" : "Changed";
    return <VoiceHint label={label} description={detail} className={kind === "premium" ? styles.premiumBadge : styles.changedBadge}>
        {kind === "premium" && <FontAwesomeIcon icon={faCrown} aria-hidden="true" />}
        {label}
    </VoiceHint>;
}
function ChangedCount({ count }: { count: number }) {
    return count > 0 ? <span className={styles.changedCount}>{count} changed</span> : null;
}

function VoiceState({ mute, deaf }: { mute: unknown; deaf: unknown }) {
    if (typeof mute !== "boolean" || typeof deaf !== "boolean") return <>{unknown}</>;
    return (
        <span className={styles.voiceStates}>
            <span
                className={`${styles.voiceBadge} ${mute ? styles.voiceRestricted : styles.voiceAllowed}`}
                aria-label={mute ? "Muted" : "Unmuted"}
            >
                <FontAwesomeIcon icon={mute ? faMicrophoneSlash : faMicrophone} fixedWidth aria-hidden="true" />
                <span>{mute ? "Muted" : "Unmuted"}</span>
            </span>
            <span
                className={`${styles.voiceBadge} ${deaf ? styles.voiceRestricted : styles.voiceAllowed}`}
                aria-label={deaf ? "Deafened" : "Undeafened"}
            >
                <span className={styles.headphoneIcon} aria-hidden="true">
                    <FontAwesomeIcon icon={faHeadphones} fixedWidth />
                    {deaf && <FontAwesomeIcon icon={faSlash} className={styles.iconSlash} />}
                </span>
                <span>{deaf ? "Deafened" : "Undeafened"}</span>
            </span>
        </span>
    );
}
function settingLabel(label: string, description: string) {
    return <span className={styles.settingLabel}>
        {label}
        <VoiceHint label={`About ${label.toLowerCase()}`} description={description}>
            <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
        </VoiceHint>
    </span>;
}

interface Row {
    key: string;
    label: React.ReactNode;
    value: string;
    premium: boolean;
    /** Formatted default value when the guild's value differs from it. */
    changed?: string;
}
function Rows({ rows }: { rows: Row[] }) {
    return <dl className={styles.values}>{rows.map((row) => <div key={row.key}>
        <dt>{row.label}{row.premium && <Marker kind="premium" detail={PREMIUM_DETAIL} />}</dt>
        <dd className={row.changed ? styles.changedValue : undefined}>
            {row.value}
            {row.changed && <Marker kind="changed" detail={`Changed from the bot default of ${row.changed}.`} />}
        </dd>
    </div>)}</dl>;
}
function Group({ title, description, rows }: { title: string; description?: string; rows: Row[] }) {
    return <section className={styles.card}>
        <h2 className={styles.cardHeading}>{title}<ChangedCount count={rows.filter((row) => row.changed).length} /></h2>
        {description && <p className={styles.description}>{description}</p>}
        <Rows rows={rows} />
    </section>;
}

export default function SettingsView({ settings: s, defaults }: { settings: Settings; defaults?: Settings }) {
    // A value is "changed" only when both documents carry it and the guild's value is displayable. A missing or
    // malformed guild value reads as unavailable, never as a customisation.
    function row(key: string, label: React.ReactNode, format: (value: unknown) => string): Row {
        const value = format(s[key]);
        const changed = defaults && key in defaults && key in s && value !== unknown && !same(s[key], defaults[key]) ? format(defaults[key]) : undefined;
        return { key, label, value, premium: PREMIUM_ONLY.has(key), changed };
    }
    function cellDefault(key: string, ...path: string[]): unknown {
        if (!defaults) return undefined;
        const current = nested(s[key], ...path);
        const initial = nested(defaults[key], ...path);
        return current !== undefined && initial !== undefined && !same(current, initial) ? initial : undefined;
    }
    const voiceCells = phases.flatMap(([phase]) => ["alive", "dead"].map((life) => {
        const mute = cellDefault("voiceRules", "MuteRules", phase, life);
        const deaf = cellDefault("voiceRules", "DeafRules", phase, life);
        const defaultMute = mute ?? nested(s.voiceRules, "MuteRules", phase, life);
        const defaultDeaf = deaf ?? nested(s.voiceRules, "DeafRules", phase, life);
        const changed = (mute !== undefined || deaf !== undefined) && typeof defaultMute === "boolean" && typeof defaultDeaf === "boolean";
        return { phase, life, changed, detail: `Changed from the bot default of ${defaultMute ? "muted" : "unmuted"} and ${defaultDeaf ? "deafened" : "undeafened"}.` };
    }));
    const voiceRows = [
        row("unmuteDeadDuringTasks", settingLabel("Unmute dead players during tasks", "When enabled, dead players can speak during tasks. This can reveal impostors to alive players if they are not prevented from hearing dead players."), enabled),
        row("muteSpectator", settingLabel("Mute spectators", "When enabled, spectators are muted like dead players. Servers with music bots often leave this disabled so spectators can continue hearing the music."), enabled),
    ];
    const delayCells = phases.flatMap(([from]) => phases.map(([to]) => {
        const initial = from === to ? undefined : cellDefault("delays", "delays", from, to);
        return { from, to, changed: initial !== undefined && number(initial) !== unknown, detail: `Changed from the bot default of ${number(initial, " s")}.` };
    }));

    return <div className={styles.grid}>
        <section className={`${styles.card} ${styles.wide}`}>
            <h2 className={`${styles.voiceHeading} ${styles.cardHeading}`}>
                Voice rules
                <VoiceHint label="About voice rules" description="Each row is a game phase. The columns show the configured microphone and hearing rules for alive and dead players. These are bot settings, not a live view of anyone's Discord audio state.">
                    <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
                </VoiceHint>
                <ChangedCount count={voiceCells.filter((cell) => cell.changed).length + voiceRows.filter((r) => r.changed).length} />
            </h2>
            <p className={styles.description}>Microphone icons show speaking rules; headphones show hearing rules. A slash means blocked. Hover or focus a label for details.</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">Configured voice rules by phase and player status</caption>
                <thead><tr><th scope="col">Phase</th><th scope="col">Alive players</th><th scope="col">Dead players</th></tr></thead>
                <tbody>{phases.map(([phase, label]) => <tr key={phase}><th scope="row">{label}</th>{voiceCells.filter((cell) => cell.phase === phase).map((cell) => <td key={cell.life} className={cell.changed ? styles.changedCell : undefined}>
                    <VoiceState mute={nested(s.voiceRules, "MuteRules", phase, cell.life)} deaf={nested(s.voiceRules, "DeafRules", phase, cell.life)} />
                    {cell.changed && <Marker kind="changed" detail={cell.detail} />}
                </td>)}</tr>)}</tbody>
            </table></div>
            <Rows rows={voiceRows} />
            {s.unmuteDeadDuringTasks === true && nested(s.voiceRules, "DeafRules", "TASKS", "alive") === false && <p className={`${styles.warning} ${styles.wideWarning}`} role="alert"><strong>Potentially unsafe combination:</strong> dead players are unmuted during tasks while alive players are not deafened. Dead players may be able to tell alive players who the impostors are.</p>}
            <p className={styles.premiumNote}>Unmuting dead players during tasks and muting spectators can require many additional Discord voice requests. They are not recommended for non-premium servers, where requests may be slower or delayed.</p>
        </section>
        <section className={styles.card}>
            <h2 className={styles.cardHeading}>Transition delays<ChangedCount count={delayCells.filter((cell) => cell.changed).length} /></h2>
            <p className={styles.description}>Seconds to wait before applying voice changes. Rows are the current phase; columns are the next phase.</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">Voice transition delays in seconds</caption>
                <thead><tr><th scope="col">From / to</th>{phases.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead>
                <tbody>{phases.map(([from, label]) => <tr key={from}><th scope="row">{label}</th>{delayCells.filter((cell) => cell.from === from).map((cell) => <td key={cell.to} className={from === cell.to ? styles.notApplicable : cell.changed ? styles.changedCell : undefined} aria-label={from === cell.to ? "Not applicable: the bot only delays changes between phases" : undefined}>
                    {transitionDelay(from, cell.to, nested(s.delays, "delays", from, cell.to))}
                    {cell.changed && <Marker kind="changed" detail={cell.detail} />}
                </td>)}</tr>)}</tbody>
            </table></div>
        </section>
        <Group title="Display & language" rows={[
            row("language", "Bot language", text),
            row("mapVersion", "Map style", text),
            row("displayRoomCode", "Room code visibility", roomCode),
            row("autoRefresh", "Refresh game message automatically", enabled),
        ]} />
        {/* Leaderboard options and bot admin/operator IDs are intentionally not shown: stats are moving to this UI
            and those settings are slated for removal, so the page should not invite anyone to rely on them. */}
        <Group title="Match summaries" rows={[
            row("deleteGameSummary", "Match summary retention", retention),
            row("matchSummaryChannelID", "Summary channel ID", channel),
        ]} />
    </div>;
}
