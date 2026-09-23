import React, { useId } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faHeadphones, faSlash, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./SettingsView.module.css";

export type Settings = Record<string, unknown>;
const phases = [["LOBBY", "Lobby"], ["TASKS", "Tasks"], ["DISCUSSION", "Discussion"]];
const unknown = "Not available";
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
function ids(value: unknown): string {
    return Array.isArray(value) && value.every((id) => typeof id === "string")
        ? value.length ? value.join(", ") : "None configured" : unknown;
}
function nested(value: unknown, ...keys: string[]): unknown {
    for (const key of keys) {
        if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
        value = (value as Record<string, unknown>)[key];
    }
    return value;
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

function Group({ title, description, rows }: { title: string; description?: string; rows: [string, string][] }) {
    return <section className={styles.card}>
        <h2>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        <dl className={styles.values}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>;
}

export default function SettingsView({ settings: s }: { settings: Settings }) {
    const room = text(s.displayRoomCode);
    return <div className={styles.grid}>
        <section className={`${styles.card} ${styles.wide}`}>
            <h2 className={styles.voiceHeading}>
                Voice rules
                <VoiceHint label="About voice rules" description="Each row is a game phase. The columns show the configured microphone and hearing rules for alive and dead players. These are bot settings, not a live view of anyone's Discord audio state.">
                    <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
                </VoiceHint>
            </h2>
            <p className={styles.description}>Microphone icons show speaking rules; headphones show hearing rules. A slash means blocked. Hover or focus a label for details.</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">Configured voice rules by phase and player status</caption>
                <thead><tr><th scope="col">Phase</th><th scope="col">Alive players</th><th scope="col">Dead players</th></tr></thead>
                <tbody>{phases.map(([phase, label]) => <tr key={phase}><th scope="row">{label}</th>{["alive", "dead"].map((life) => <td key={life}><VoiceState mute={nested(s.voiceRules, "MuteRules", phase, life)} deaf={nested(s.voiceRules, "DeafRules", phase, life)} /></td>)}</tr>)}</tbody>
            </table></div>
            <dl className={styles.values}>
                <div><dt>{settingLabel("Unmute dead players during tasks", "When enabled, dead players can speak during tasks. This can reveal impostors to alive players if they are not prevented from hearing dead players.")}</dt><dd>{enabled(s.unmuteDeadDuringTasks)}</dd></div>
                <div><dt>{settingLabel("Mute spectators", "When enabled, spectators are muted like dead players. Servers with music bots often leave this disabled so spectators can continue hearing the music.")}</dt><dd>{enabled(s.muteSpectator)}</dd></div>
            </dl>
            {s.unmuteDeadDuringTasks === true && nested(s.voiceRules, "DeafRules", "TASKS", "alive") === false && <p className={`${styles.warning} ${styles.wideWarning}`} role="alert"><strong>Potentially unsafe combination:</strong> dead players are unmuted during tasks while alive players are not deafened. Dead players may be able to tell alive players who the impostors are.</p>}
            <p className={styles.premiumNote}>Unmuting dead players during tasks and muting spectators can require many additional Discord voice requests. They are not recommended for non-premium servers, where requests may be slower or delayed.</p>
        </section>
        <section className={styles.card}>
            <h2>Transition delays</h2>
            <p className={styles.description}>Seconds to wait before applying voice changes. Rows are the current phase; columns are the next phase.</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">Voice transition delays in seconds</caption>
                <thead><tr><th scope="col">From / to</th>{phases.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead>
                <tbody>{phases.map(([from, label]) => <tr key={from}><th scope="row">{label}</th>{phases.map(([to]) => <td key={to} className={from === to ? styles.notApplicable : undefined} aria-label={from === to ? "Not applicable: the bot only delays changes between phases" : undefined}>{transitionDelay(from, to, nested(s.delays, "delays", from, to))}</td>)}</tr>)}</tbody>
            </table></div>
        </section>
        <Group title="Display & language" rows={[
            ["Bot language", text(s.language)],
            ["Map style", text(s.mapVersion)],
            ["Room code visibility", new Map([["always", "Always visible"], ["never", "Hidden"], ["spoiler", "Behind a spoiler"]]).get(room) ?? room],
            ["Refresh game message automatically", enabled(s.autoRefresh)],
        ]} />
        <Group title="Match summaries & leaderboard" rows={[
            ["Match summary retention", retention(s.deleteGameSummary)],
            ["Summary channel ID", s.matchSummaryChannelID === "" ? "None configured" : text(s.matchSummaryChannelID)],
            ["Mention leaderboard players", enabled(s.leaderboardMention)],
            ["Leaderboard size", number(s.leaderboardSize, " players")],
            ["Minimum games for leaderboard", number(s.leaderboardMin)],
        ]} />
        <Group title="Bot access" description="These are the bot's configured users and roles. Discord names are not available here yet." rows={[
            ["Bot admin user IDs", ids(s.adminIDs)],
            ["Operator role IDs", ids(s.permissionRoleIDs)],
        ]} />
    </div>;
}
