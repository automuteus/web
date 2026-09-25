import React, { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faHeadphones, faSlash, faCircleInfo, faCrown } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./SettingsView.module.css";
import {
    Settings, PHASES, LIVES, MAP_VERSIONS, ROOM_CODE_OPTIONS, DELAY_RANGE, SUMMARY_RANGE,
    LANGUAGES, SNOWFLAKE, MAX_ROLE_IDS, GuildRole, GuildChannel, languageOf, roleColor, unknownRoleIDs, same, nested, setField, setVoiceRule, setDelay, addRoleID, removeRoleID,
} from "./settings-edit";

/** Result of asking the API whether the bot can post into the channel currently typed in. */
export interface ChannelCheckState {
    id: string;
    state: "checking" | "ok" | "problem" | "unavailable";
    name?: string;
    problems?: string[];
}
const CHANNEL_HELP = "In Discord, turn on Developer Mode under Settings, Advanced, then right-click the channel and choose Copy Channel ID.";
const CHANNEL_PICK_HELP = "Channels are listed as the bot sees them in this server; ones it can't post in are greyed out. Enter an ID to use a thread.";
const ROLE_HELP = "Role IDs are saved as typed and not checked against the server. In Discord, open Server Settings, Roles, then right-click a role and choose Copy Role ID (Developer Mode).";
const ROLE_PICK_HELP = "Roles are listed as the bot sees them in this server.";

export type { Settings } from "./settings-edit";
export { same } from "./settings-edit";

const phaseLabels: Record<string, string> = { LOBBY: "Lobby", TASKS: "Tasks", DISCUSSION: "Discussion" };
const phases = PHASES.map((phase) => [phase, phaseLabels[phase]] as const);
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
function roleIDs(value: unknown, roles?: readonly GuildRole[]): string {
    if (!Array.isArray(value) || !value.every((id) => typeof id === "string")) return unknown;
    return value.length ? value.map((id) => roles?.find((role) => role.id === id)?.name ?? id).join(", ") : "None configured";
}
const roomLabels = new Map<string, string>([["always", "Always visible"], ["never", "Hidden"], ["spoiler", "Behind a spoiler"]]);
function roomCode(value: unknown): string {
    const room = text(value);
    return roomLabels.get(room) ?? room;
}
function languageLabel(value: unknown): string {
    const language = languageOf(value);
    return language ? `${language.flag} ${language.name}` : text(value);
}
const mapLabels = new Map<string, string>([["simple", "Simple"], ["detailed", "Detailed"]]);
function mapStyle(value: unknown): string {
    const map = text(value);
    return mapLabels.get(map) ?? map;
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

/** Small pill next to a setting: gold for premium-only, blue when the stored value differs from the bot default.
 * Unsaved edits are not a pill; they are an amber highlight on the row or cell, see Rows and the grids. */
function Marker({ kind, detail }: { kind: "premium" | "custom"; detail: string }) {
    const label = kind === "premium" ? "Premium" : "Custom";
    return <VoiceHint label={label} description={detail} className={kind === "premium" ? styles.premiumBadge : styles.customBadge}>
        {kind === "premium" && <FontAwesomeIcon icon={faCrown} aria-hidden="true" />}
        {label}
    </VoiceHint>;
}
/** Card header tally: how many settings are custom (differ from default) and how many edits are unsaved. */
function Counts({ custom, unsaved }: { custom: number; unsaved: number }) {
    if (custom === 0 && unsaved === 0) return null;
    return <span className={styles.counts}>
        {custom > 0 && <span className={styles.customCount}>{custom} custom</span>}
        {custom > 0 && unsaved > 0 && <span aria-hidden="true">·</span>}
        {unsaved > 0 && <span className={styles.unsavedCount}>{unsaved} unsaved</span>}
    </span>;
}

/** One voice cell: two pills for speaking and hearing. With onToggle they become buttons that flip the rule. */
function VoiceState({ mute, deaf, context, onToggle, disabled }: {
    mute: unknown;
    deaf: unknown;
    context: string;
    onToggle?: (kind: "MuteRules" | "DeafRules", value: boolean) => void;
    disabled?: boolean;
}) {
    if (typeof mute !== "boolean" || typeof deaf !== "boolean") return <>{unknown}</>;
    const pills: [string, boolean, "MuteRules" | "DeafRules", React.ReactNode][] = [
        [mute ? "Muted" : "Unmuted", mute, "MuteRules", <FontAwesomeIcon key="mic" icon={mute ? faMicrophoneSlash : faMicrophone} fixedWidth aria-hidden="true" />],
        [deaf ? "Deafened" : "Undeafened", deaf, "DeafRules", <span key="ear" className={styles.headphoneIcon} aria-hidden="true">
            <FontAwesomeIcon icon={faHeadphones} fixedWidth />
            {deaf && <FontAwesomeIcon icon={faSlash} className={styles.iconSlash} />}
        </span>],
    ];
    return (
        <span className={styles.voiceStates}>
            {pills.map(([label, restricted, kind, icon]) => {
                const className = `${styles.voiceBadge} ${restricted ? styles.voiceRestricted : styles.voiceAllowed}`;
                if (!onToggle) return <span key={kind} className={className} aria-label={label}>{icon}<span>{label}</span></span>;
                return <button key={kind} type="button" className={`${className} ${styles.voiceToggle}`} aria-pressed={restricted} disabled={disabled}
                    aria-label={`${context}: ${label.toLowerCase()}`} title={`Switch to ${restricted ? (kind === "MuteRules" ? "unmuted" : "undeafened") : (kind === "MuteRules" ? "muted" : "deafened")}`}
                    onClick={() => onToggle(kind, !restricted)}>{icon}<span>{label}</span></button>;
            })}
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
    custom?: string;
    /** The value differs from the last loaded or saved document. */
    dirty?: boolean;
    /** Editing control shown instead of the value text. */
    control?: React.ReactNode;
    error?: string;
    hint?: React.ReactNode;
    /** Positive confirmation shown in green, such as a resolved channel name. */
    ok?: string;
}
function classes(...names: (string | false | undefined)[]): string | undefined {
    const list = names.filter((name): name is string => !!name);
    return list.length ? list.join(" ") : undefined;
}
function Rows({ rows }: { rows: Row[] }) {
    return <dl className={styles.values}>{rows.map((row) => <div key={row.key} className={classes(row.error && styles.rowError, row.dirty && styles.dirty)}>
        <dt>{row.label}{row.premium && <Marker kind="premium" detail={PREMIUM_DETAIL} />}</dt>
        <dd className={row.custom ? styles.customValue : undefined}>
            {row.control ?? row.value}
            {row.custom && <Marker kind="custom" detail={`Custom value; the bot default is ${row.custom}.`} />}
            {row.ok && <span className={styles.fieldOk} role="status">{row.ok}</span>}
            {row.hint && <span className={styles.fieldHint}>{row.hint}</span>}
            {row.error && <span className={styles.fieldError} role="alert">{row.error}</span>}
        </dd>
    </div>)}</dl>;
}
function Group({ title, description, rows }: { title: string; description?: string; rows: Row[] }) {
    return <section className={styles.card}>
        <h2 className={styles.cardHeading}>{title}<Counts custom={rows.filter((row) => row.custom).length} unsaved={rows.filter((row) => row.dirty).length} /></h2>
        {description && <p className={styles.description}>{description}</p>}
        <Rows rows={rows} />
    </section>;
}

export interface SettingsViewProps {
    /** The document to show; while editing this is the draft. */
    settings: Settings;
    /** Bot defaults for "Custom" markers. Optional. */
    defaults?: Settings;
    /** The last loaded or saved document, for unsaved-edit highlights. Optional. */
    saved?: Settings;
    /** Present when the user may edit. Receives the whole updated document. */
    onChange?: (next: Settings) => void;
    /** Disables every control, for example while saving. */
    disabled?: boolean;
    /** Field path (API form, such as "delays.delays.LOBBY.TASKS") to message. */
    errors?: Record<string, string>;
    /** The server has no premium, so premium-only controls are locked. */
    premiumLocked?: boolean;
    /** Live check of the typed summary channel, keyed by its ID so a stale answer is never shown. */
    channelCheck?: ChannelCheckState;
    /** The guild's roles, for names, colours, and a picker. Optional: without them IDs are shown and typed raw. */
    roles?: readonly GuildRole[];
    /** The guild's text channels with the bot's verdict on each, for the summary channel picker. Optional: without
     * them the channel is typed as an ID. */
    channels?: readonly GuildChannel[];
}

export default function SettingsView({ settings: s, defaults, saved, onChange, disabled, errors = {}, premiumLocked, channelCheck, roles, channels }: SettingsViewProps) {
    const editing = !!onChange;
    const change = onChange ?? (() => undefined);
    const [pendingRole, setPendingRole] = useState("");
    // The picker cannot name a thread, so the ID box stays one click away even when the channel list is known.
    const [typeChannelID, setTypeChannelID] = useState(false);
    const lockedFor = (key: string) => !!disabled || (!!premiumLocked && PREMIUM_ONLY.has(key));
    const premiumHint = (key: string) => premiumLocked && PREMIUM_ONLY.has(key) ? "Requires premium to change." : undefined;

    // A value is "custom" only when both documents carry it and the guild's value is displayable. A missing or
    // malformed guild value reads as unavailable, never as a customisation. "Dirty" compares against what was
    // loaded or last saved, so it clears on save or discard.
    const dirtyAt = (key: string, ...path: string[]) => !!saved && !same(nested(s[key], ...path), nested(saved[key], ...path));
    function row(key: string, label: React.ReactNode, format: (value: unknown) => string, control?: React.ReactNode, hint?: React.ReactNode): Row {
        const value = format(s[key]);
        const custom = defaults && key in defaults && key in s && value !== unknown && !same(s[key], defaults[key]) ? format(defaults[key]) : undefined;
        // List fields get indexed error paths from the API ("permissionRoleIDs[2]"); surface the first on the row.
        const error = errors[key] ?? Object.entries(errors).find(([path]) => path.startsWith(key + "["))?.[1];
        return { key, label, value, premium: PREMIUM_ONLY.has(key), custom, dirty: dirtyAt(key), control: editing ? control : undefined, error, hint: editing ? hint ?? premiumHint(key) : undefined };
    }
    function cellDefault(key: string, ...path: string[]): unknown {
        if (!defaults) return undefined;
        const current = nested(s[key], ...path);
        const initial = nested(defaults[key], ...path);
        return current !== undefined && initial !== undefined && !same(current, initial) ? initial : undefined;
    }

    function toggle(key: "unmuteDeadDuringTasks" | "muteSpectator" | "autoRefresh", label: string) {
        return <label className={styles.switch}>
            <input type="checkbox" role="switch" checked={s[key] === true} disabled={lockedFor(key)} aria-label={label}
                onChange={(e) => change(setField(s, key, e.target.checked))} />
            <span>{enabled(s[key])}</span>
        </label>;
    }
    function languageSelect() {
        const value = typeof s.language === "string" ? s.language : "";
        return <select className={styles.control} value={value} disabled={lockedFor("language")} aria-label="Bot language" onChange={(e) => change(setField(s, "language", e.target.value))}>
            {!languageOf(value) && <option value={value}>{value || unknown}</option>}
            {LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.flag} {language.name}{language.native !== language.name ? ` (${language.native})` : ""}</option>)}
        </select>;
    }
    function select(key: "mapVersion" | "displayRoomCode", label: string, options: readonly string[], labels: Map<string, string>) {
        const value = typeof s[key] === "string" ? (s[key] as string) : "";
        return <select className={styles.control} value={value} disabled={lockedFor(key)} aria-label={label} onChange={(e) => change(setField(s, key, e.target.value))}>
            {!options.includes(value) && <option value={value}>{value || unknown}</option>}
            {options.map((option) => <option key={option} value={option}>{labels.get(option) ?? option}</option>)}
        </select>;
    }
    function channelField() {
        const value = typeof s.matchSummaryChannelID === "string" ? s.matchSummaryChannelID : "";
        const locked = lockedFor("matchSummaryChannelID");
        if (!channels || typeChannelID) {
            return <span className={classes(styles.controlGroup, styles.pickGroup)}>
                <input type="text" inputMode="numeric" autoComplete="off" spellCheck={false} className={`${styles.control} ${styles.idInput}`} value={value} disabled={locked}
                    aria-label="Summary channel ID" placeholder="Channel ID, or empty for none" maxLength={20}
                    onChange={(e) => change(setField(s, "matchSummaryChannelID", e.target.value.trim()))} />
                <button type="button" className={styles.smallButton} disabled={locked || value === ""} onClick={() => change(setField(s, "matchSummaryChannelID", ""))}>Clear</button>
                {channels && <button type="button" className={styles.smallButton} disabled={locked} onClick={() => setTypeChannelID(false)}>Pick from a list</button>}
            </span>;
        }
        // Options in the list's order: top-level channels first, then one group per category. A value the list
        // does not carry (a thread, or a channel the bot has since lost) stays selectable so it is not silently lost.
        const options: React.ReactNode[] = [];
        let group: { label: string; items: React.ReactNode[] } | undefined;
        const flush = () => { if (group) { options.push(<optgroup key={`group:${group.label}`} label={group.label}>{group.items}</optgroup>); group = undefined; } };
        for (const ch of channels) {
            const option = <option key={ch.id} value={ch.id} disabled={!ch.ok} title={ch.ok ? undefined : ch.problems.join("; ")}>#{ch.name}{ch.ok ? "" : " (bot can't post here)"}</option>;
            if (ch.category === "") { flush(); options.push(option); continue; }
            if (!group || group.label !== ch.category) { flush(); group = { label: ch.category, items: [] }; }
            group.items.push(option);
        }
        flush();
        return <span className={classes(styles.controlGroup, styles.pickGroup)}>
            <select className={styles.control} value={value} disabled={locked} aria-label="Summary channel" onChange={(e) => change(setField(s, "matchSummaryChannelID", e.target.value))}>
                <option value="">None</option>
                {value !== "" && !channels.some((ch) => ch.id === value) && <option value={value}>{value} (not in the list)</option>}
                {options}
            </select>
            <button type="button" className={styles.smallButton} disabled={locked} onClick={() => setTypeChannelID(true)}>Enter an ID</button>
        </span>;
    }
    /** What to say under the channel control: the list's verdict for a picked channel, the live check for a typed
     * ID, else how to choose. */
    function channelStatus(): Pick<Row, "ok" | "hint" | "error"> {
        const value = typeof s.matchSummaryChannelID === "string" ? s.matchSummaryChannelID : "";
        const savedValue = typeof saved?.matchSummaryChannelID === "string" ? saved.matchSummaryChannelID : undefined;
        const help = channels && !typeChannelID ? CHANNEL_PICK_HELP : CHANNEL_HELP;
        if (!editing || value === "" || !SNOWFLAKE.test(value) || value === savedValue) return { hint: editing ? help : undefined };
        const listed = channels?.find((ch) => ch.id === value);
        if (listed) return listed.ok ? { ok: `#${listed.name}: the bot can post match summaries here.` } : { error: listed.problems.join("; ") || "The bot can't post in this channel." };
        const check = channelCheck && channelCheck.id === value ? channelCheck : undefined;
        if (!check) return { hint: CHANNEL_HELP };
        switch (check.state) {
            case "checking": return { hint: "Checking that the bot can post in this channel..." };
            case "ok": return { ok: `#${check.name ?? value}: the bot can post match summaries here.` };
            case "problem": return { error: (check.problems ?? []).join("; ") || "The bot can't post in this channel." };
            default: return { hint: "Couldn't check this channel right now. It will be verified when you save." };
        }
    }
    function roleField() {
        const ids = Array.isArray(s.permissionRoleIDs) ? s.permissionRoleIDs.filter((id): id is string => typeof id === "string") : [];
        const locked = lockedFor("permissionRoleIDs");
        const candidate = pendingRole.trim();
        const known = roles?.find((role) => role.id === candidate);
        const canAdd = !locked && SNOWFLAKE.test(candidate) && !ids.includes(candidate) && ids.length < MAX_ROLE_IDS && (!roles || !!known);
        const add = () => { if (canAdd) { change(addRoleID(s, candidate)); setPendingRole(""); } };
        const available = roles?.filter((role) => !ids.includes(role.id)) ?? [];
        return <span className={styles.roleList}>
            {ids.map((id, i) => {
                const role = roles?.find((r) => r.id === id);
                const missing = !!roles && !role;
                return <span key={id} className={classes(styles.chip, errors[`permissionRoleIDs[${i}]`] && styles.chipError, missing && styles.chipUnknown)}
                    title={missing ? "Not a role in this server" : undefined}>
                    {role ? <><span className={styles.swatch} style={{ background: roleColor(role) }} aria-hidden="true" /><span>{role.name}</span></> : <code>{id}</code>}
                    <button type="button" className={styles.chipRemove} disabled={locked} aria-label={`Remove role ${role?.name ?? id}`} onClick={() => change(removeRoleID(s, id))}>&times;</button>
                </span>;
            })}
            <span className={styles.controlGroup}>
                {roles ?
                    <select className={styles.control} value={pendingRole} disabled={locked || available.length === 0} aria-label="Role to add" onChange={(e) => setPendingRole(e.target.value)}>
                        <option value="">{available.length ? "Choose a role..." : "Every role is already listed"}</option>
                        {available.map((role) => <option key={role.id} value={role.id}>{role.name}{role.managed ? " (bot or integration)" : ""}</option>)}
                    </select> :
                    <input type="text" inputMode="numeric" autoComplete="off" spellCheck={false} className={`${styles.control} ${styles.idInput}`} value={pendingRole} disabled={locked}
                        aria-label="Role ID to add" placeholder="Role ID" maxLength={20}
                        onChange={(e) => setPendingRole(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />}
                <button type="button" className={styles.smallButton} disabled={!canAdd} onClick={add}>Add</button>
            </span>
        </span>;
    }
    /** Under the operator list: the picker note, or which typed IDs the server does not know. */
    function roleStatus(): Pick<Row, "hint" | "error"> {
        const missing = unknownRoleIDs(s.permissionRoleIDs, roles);
        if (missing.length) return { error: `Not ${missing.length === 1 ? "a role" : "roles"} in this server: ${missing.join(", ")}. Remove ${missing.length === 1 ? "it" : "them"} to save.` };
        return { hint: roles ? ROLE_PICK_HELP : ROLE_HELP };
    }
    function summaryRetention() {
        const value = s.deleteGameSummary;
        const mode = value === -1 ? "forever" : value === 0 ? "immediately" : "after";
        const minutes = typeof value === "number" && value > 0 ? value : "";
        const locked = lockedFor("deleteGameSummary");
        return <span className={styles.controlGroup}>
            <select className={styles.control} value={mode} disabled={locked} aria-label="Match summary retention"
                onChange={(e) => change(setField(s, "deleteGameSummary", e.target.value === "forever" ? -1 : e.target.value === "immediately" ? 0 : 5))}>
                <option value="forever">Keep forever</option>
                <option value="immediately">Delete immediately</option>
                <option value="after">Delete after...</option>
            </select>
            {mode === "after" && <label className={styles.inline}>
                <input type="number" className={styles.control} min={1} max={SUMMARY_RANGE.max} step={1} value={minutes} disabled={locked} aria-label="Minutes before the summary is deleted"
                    onChange={(e) => change(setField(s, "deleteGameSummary", e.target.value === "" ? NaN : Number(e.target.value)))} />
                <span>minutes</span>
            </label>}
        </span>;
    }

    const voiceCells = phases.flatMap(([phase, phaseLabel]) => LIVES.map((life) => {
        const mute = cellDefault("voiceRules", "MuteRules", phase, life);
        const deaf = cellDefault("voiceRules", "DeafRules", phase, life);
        const defaultMute = mute ?? nested(s.voiceRules, "MuteRules", phase, life);
        const defaultDeaf = deaf ?? nested(s.voiceRules, "DeafRules", phase, life);
        const custom = (mute !== undefined || deaf !== undefined) && typeof defaultMute === "boolean" && typeof defaultDeaf === "boolean";
        const dirty = dirtyAt("voiceRules", "MuteRules", phase, life) || dirtyAt("voiceRules", "DeafRules", phase, life);
        const error = errors[`voiceRules.MuteRules.${phase}.${life}`] ?? errors[`voiceRules.DeafRules.${phase}.${life}`];
        return { phase, life, custom, dirty, error, context: `${life === "alive" ? "Alive" : "Dead"} players during ${phaseLabel.toLowerCase()}`,
            detail: `Custom value; the bot default is ${defaultMute ? "muted" : "unmuted"} and ${defaultDeaf ? "deafened" : "undeafened"}.` };
    }));
    const voiceRows = [
        row("unmuteDeadDuringTasks", settingLabel("Unmute dead players during tasks", "When enabled, dead players can speak during tasks. This can reveal impostors to alive players if they are not prevented from hearing dead players."), enabled,
            toggle("unmuteDeadDuringTasks", "Unmute dead players during tasks")),
        row("muteSpectator", settingLabel("Mute spectators", "When enabled, spectators are muted like dead players. Servers with music bots often leave this disabled so spectators can continue hearing the music."), enabled,
            toggle("muteSpectator", "Mute spectators")),
    ];
    const delayCells = phases.flatMap(([from, fromLabel]) => phases.map(([to, toLabel]) => {
        const initial = from === to ? undefined : cellDefault("delays", "delays", from, to);
        return { from, to, custom: initial !== undefined && number(initial) !== unknown, dirty: from !== to && dirtyAt("delays", "delays", from, to),
            error: from === to ? undefined : errors[`delays.delays.${from}.${to}`],
            label: `Delay from ${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} in seconds`, detail: `Custom value; the bot default is ${number(initial, " s")}.` };
    }));

    return <div className={styles.grid}>
        <section className={`${styles.card} ${styles.wide}`}>
            <h2 className={`${styles.voiceHeading} ${styles.cardHeading}`}>
                Voice rules
                <VoiceHint label="About voice rules" description="Each row is a game phase. The columns show the configured microphone and hearing rules for alive and dead players. These are bot settings, not a live view of anyone's Discord audio state.">
                    <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
                </VoiceHint>
                <Counts custom={voiceCells.filter((cell) => cell.custom).length + voiceRows.filter((r) => r.custom).length}
                    unsaved={voiceCells.filter((cell) => cell.dirty).length + voiceRows.filter((r) => r.dirty).length} />
            </h2>
            <p className={styles.description}>Microphone icons show speaking rules; headphones show hearing rules. A slash means blocked. {editing ? "Select a pill to flip that rule." : "Hover or focus a label for details."}</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">Configured voice rules by phase and player status</caption>
                <thead><tr><th scope="col">Phase</th><th scope="col">Alive players</th><th scope="col">Dead players</th></tr></thead>
                <tbody>{phases.map(([phase, label]) => <tr key={phase}><th scope="row">{label}</th>{voiceCells.filter((cell) => cell.phase === phase).map((cell) => <td key={cell.life} className={classes(cell.custom && styles.customCell, cell.dirty && styles.dirtyCell, cell.error && styles.errorCell)}>
                    <VoiceState mute={nested(s.voiceRules, "MuteRules", phase, cell.life)} deaf={nested(s.voiceRules, "DeafRules", phase, cell.life)} context={cell.context} disabled={disabled}
                        onToggle={editing ? (kind, value) => change(setVoiceRule(s, kind, phase, cell.life, value)) : undefined} />
                    {cell.custom && <Marker kind="custom" detail={cell.detail} />}
                    {cell.error && <span className={styles.fieldError} role="alert">{cell.error}</span>}
                </td>)}</tr>)}</tbody>
            </table></div>
            <Rows rows={voiceRows} />
            {s.unmuteDeadDuringTasks === true && nested(s.voiceRules, "DeafRules", "TASKS", "alive") === false && <p className={`${styles.warning} ${styles.wideWarning}`} role="alert"><strong>Potentially unsafe combination:</strong> dead players are unmuted during tasks while alive players are not deafened. Dead players may be able to tell alive players who the impostors are.</p>}
            <p className={styles.premiumNote}>Unmuting dead players during tasks and muting spectators can require many additional Discord voice requests. They are not recommended for non-premium servers, where requests may be slower or delayed.</p>
        </section>
        <section className={styles.card}>
            <h2 className={styles.cardHeading}>Transition delays<Counts custom={delayCells.filter((cell) => cell.custom).length} unsaved={delayCells.filter((cell) => cell.dirty).length} /></h2>
            <p className={styles.description}>Seconds to wait before applying voice changes. Rows are the current phase; columns are the next phase.{editing && ` Whole seconds from ${DELAY_RANGE.min} to ${DELAY_RANGE.max}.`}</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">Voice transition delays in seconds</caption>
                <thead><tr><th scope="col">From / to</th>{phases.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead>
                <tbody>{phases.map(([from, label]) => <tr key={from}><th scope="row">{label}</th>{delayCells.filter((cell) => cell.from === from).map((cell) => {
                    const value = nested(s.delays, "delays", from, cell.to);
                    return <td key={cell.to} className={from === cell.to ? styles.notApplicable : classes(cell.custom && styles.customCell, cell.dirty && styles.dirtyCell, cell.error && styles.errorCell)} aria-label={from === cell.to ? "Not applicable: the bot only delays changes between phases" : undefined}>
                        {editing && from !== cell.to ?
                            <input type="number" className={`${styles.control} ${styles.delayInput}`} min={DELAY_RANGE.min} max={DELAY_RANGE.max} step={1} disabled={disabled} aria-label={cell.label}
                                value={typeof value === "number" && Number.isFinite(value) ? value : ""}
                                onChange={(e) => change(setDelay(s, from, cell.to, e.target.value === "" ? NaN : Number(e.target.value)))} /> :
                            transitionDelay(from, cell.to, value)}
                        {cell.custom && <Marker kind="custom" detail={cell.detail} />}
                        {cell.error && <span className={styles.fieldError} role="alert">{cell.error}</span>}
                    </td>;
                })}</tr>)}</tbody>
            </table></div>
        </section>
        <Group title="Display & language" rows={[
            row("language", "Bot language", languageLabel, languageSelect()),
            row("mapVersion", "Map style", mapStyle, select("mapVersion", "Map style", MAP_VERSIONS, mapLabels)),
            row("displayRoomCode", "Room code visibility", roomCode, select("displayRoomCode", "Room code visibility", ROOM_CODE_OPTIONS, roomLabels)),
            row("autoRefresh", "Refresh game message automatically", enabled, toggle("autoRefresh", "Refresh game message automatically")),
        ]} />
        {/* Leaderboard options and bot admin user IDs are intentionally not shown: stats are moving to this UI and
            those settings are slated for removal, so the page should not invite anyone to rely on them. */}
        <Group title="Match summaries" rows={[
            row("deleteGameSummary", "Match summary retention", retention, summaryRetention()),
            { ...row("matchSummaryChannelID", "Summary channel", channel, channelField()), ...channelStatus() },
        ]} />
        {/* Mirrors commandAccess in bot/slash_commands.go: operator roles control /new, /pause, /end, /link, and
            /unlink; the guild owner and members with Administrator or Manage Server always pass, and only they may
            change settings (here or with /settings). */}
        <Group title="Bot operators" description="Members with any of these roles can start, pause, end, link, and unlink games. With no roles listed, everyone can. Once a role is added, members without one of these roles can no longer control games. The server owner and members with the Administrator or Manage Server permission always can, and they are the only ones who can change these settings, here or with /settings." rows={[
            (() => { const base = row("permissionRoleIDs", roles ? "Operator roles" : "Operator role IDs", (value) => roleIDs(value, roles), roleField()); return editing ? { ...base, ...roleStatus(), error: base.error ?? roleStatus().error } : base; })(),
        ]} />
    </div>;
}
