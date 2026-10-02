import React, { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faHeadphones, faSlash, faCircleInfo, faCrown } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
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

export type { Settings } from "./settings-edit";
export { same } from "./settings-edit";

type T = TFunction<"settings">;

/** Settings the API applies only on premium servers. This mirrors PremiumSnapshot in the Go settings package;
 * the leaderboard options are premium-gated there too but are no longer shown here. */
export const PREMIUM_ONLY: ReadonlySet<string> = new Set(["deleteGameSummary", "matchSummaryChannelID", "autoRefresh", "muteSpectator", "displayRoomCode"]);

export function text(value: unknown, t: T): string {
    return typeof value === "string" && value ? value : t("settings:value.unknown");
}
export function enabled(value: unknown, t: T): string {
    return value === true ? t("settings:value.enabled") : value === false ? t("settings:value.disabled") : t("settings:value.unknown");
}
export function retention(value: unknown, t: T): string {
    if (value === -1) return t("settings:retention.forever");
    if (value === 0) return t("settings:retention.immediately");
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? t("settings:retention.after", { count: value }) : t("settings:value.unknown");
}
function seconds(value: unknown, t: T) {
    return typeof value === "number" && Number.isFinite(value) ? t("settings:value.seconds", { value }) : t("settings:value.unknown");
}
function transitionDelay(from: string, to: string, value: unknown, t: T) {
    return from === to ? t("settings:value.notApplicable") : seconds(value, t);
}
function channel(value: unknown, t: T): string {
    return value === "" ? t("settings:value.none") : text(value, t);
}
function roleIDs(value: unknown, t: T, roles?: readonly GuildRole[]): string {
    if (!Array.isArray(value) || !value.every((id) => typeof id === "string")) return t("settings:value.unknown");
    return value.length ? value.map((id) => roles?.find((role) => role.id === id)?.name ?? id).join(", ") : t("settings:value.none");
}
/** The language's name in the UI language. Keys are per code (settings:languageName.*). */
function languageName(code: string, t: T) {
    return t(`settings:languageName.${code}`);
}
function languageLabel(value: unknown, t: T): string {
    const language = languageOf(value);
    return language ? t("settings:languageFormat.short", { flag: language.flag, name: languageName(language.code, t) }) : text(value, t);
}
function labelled(value: unknown, labels: Map<string, string>, t: T): string {
    const label = text(value, t);
    return labels.get(label) ?? label;
}

function VoiceHint({ label, description, children, className = "" }: {
    label: string;
    description: string;
    children: React.ReactNode;
    className?: string;
}) {
    const id = useId();
    const { t } = useTranslation("settings");
    return (
        <OverlayTrigger
            placement="top"
            trigger={["hover", "focus"]}
            overlay={<Tooltip id={id}>{description}</Tooltip>}
        >
            <span tabIndex={0} className={`${styles.voiceHint} ${className}`} aria-label={t("hint", { label, description })}>
                {children}
            </span>
        </OverlayTrigger>
    );
}

/** Small pill next to a setting: gold for premium-only, blue when the stored value differs from the bot default.
 * Unsaved edits are not a pill; they are an amber highlight on the row or cell, see Rows and the grids. */
function Marker({ kind, detail }: { kind: "premium" | "custom"; detail: string }) {
    const { t } = useTranslation("settings");
    const label = kind === "premium" ? t("marker.premium") : t("marker.custom");
    return <VoiceHint label={label} description={detail} className={kind === "premium" ? styles.premiumBadge : styles.customBadge}>
        {kind === "premium" && <FontAwesomeIcon icon={faCrown} aria-hidden="true" />}
        {label}
    </VoiceHint>;
}
/** Card header tally: how many settings are custom (differ from default) and how many edits are unsaved. */
function Counts({ custom, unsaved }: { custom: number; unsaved: number }) {
    const { t } = useTranslation("settings");
    if (custom === 0 && unsaved === 0) return null;
    return <span className={styles.counts}>
        {custom > 0 && <span className={styles.customCount}>{t("counts.custom", { count: custom })}</span>}
        {custom > 0 && unsaved > 0 && <span aria-hidden="true">·</span>}
        {unsaved > 0 && <span className={styles.unsavedCount}>{t("counts.unsaved", { count: unsaved })}</span>}
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
    const { t } = useTranslation("settings");
    if (typeof mute !== "boolean" || typeof deaf !== "boolean") return <>{t("value.unknown")}</>;
    // Label, restricted, kind, icon, the state in a sentence, and the state a click switches to.
    const pills: [string, boolean, "MuteRules" | "DeafRules", React.ReactNode, string, string][] = [
        [mute ? t("voice.state.muted") : t("voice.state.unmuted"), mute, "MuteRules", <FontAwesomeIcon key="mic" icon={mute ? faMicrophoneSlash : faMicrophone} fixedWidth aria-hidden="true" />,
            mute ? t("voice.inSentence.muted") : t("voice.inSentence.unmuted"), mute ? t("voice.inSentence.unmuted") : t("voice.inSentence.muted")],
        [deaf ? t("voice.state.deafened") : t("voice.state.undeafened"), deaf, "DeafRules", <span key="ear" className={styles.headphoneIcon} aria-hidden="true">
            <FontAwesomeIcon icon={faHeadphones} fixedWidth />
            {deaf && <FontAwesomeIcon icon={faSlash} className={styles.iconSlash} />}
        </span>, deaf ? t("voice.inSentence.deafened") : t("voice.inSentence.undeafened"), deaf ? t("voice.inSentence.undeafened") : t("voice.inSentence.deafened")],
    ];
    return (
        <span className={styles.voiceStates}>
            {pills.map(([label, restricted, kind, icon, state, next]) => {
                const className = `${styles.voiceBadge} ${restricted ? styles.voiceRestricted : styles.voiceAllowed}`;
                if (!onToggle) return <span key={kind} className={className} aria-label={label}>{icon}<span>{label}</span></span>;
                return <button key={kind} type="button" className={`${className} ${styles.voiceToggle}`} aria-pressed={restricted} disabled={disabled}
                    aria-label={t("voice.toggle", { context, state })} title={t("voice.switchTo", { state: next })}
                    onClick={() => onToggle(kind, !restricted)}>{icon}<span>{label}</span></button>;
            })}
        </span>
    );
}
function settingLabel(label: string, about: string, description: string) {
    return <span className={styles.settingLabel}>
        {label}
        <VoiceHint label={about} description={description}>
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
    const { t } = useTranslation("settings");
    return <dl className={styles.values}>{rows.map((row) => <div key={row.key} className={classes(row.error && styles.rowError, row.dirty && styles.dirty)}>
        <dt>{row.label}{row.premium && <Marker kind="premium" detail={t("marker.premiumDetail")} />}</dt>
        <dd className={row.custom ? styles.customValue : undefined}>
            {row.control ?? row.value}
            {row.custom && <Marker kind="custom" detail={t("marker.customDefault", { value: row.custom })} />}
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
    const { t } = useTranslation("settings");
    const unknown = t("value.unknown");
    const phaseLabels: Record<string, string> = { LOBBY: t("phase.LOBBY"), TASKS: t("phase.TASKS"), DISCUSSION: t("phase.DISCUSSION") };
    /** Phase names as they read mid-sentence ("during tasks"), which is lower case in English. */
    const phaseInSentence: Record<string, string> = { LOBBY: t("phase.inSentence.LOBBY"), TASKS: t("phase.inSentence.TASKS"), DISCUSSION: t("phase.inSentence.DISCUSSION") };
    const phases = PHASES.map((phase) => [phase, phaseLabels[phase]] as const);
    const roomLabels = new Map<string, string>([["always", t("roomCode.always")], ["never", t("roomCode.never")], ["spoiler", t("roomCode.spoiler")]]);
    const mapLabels = new Map<string, string>([["simple", t("mapVersion.simple")], ["detailed", t("mapVersion.detailed")]]);
    const channelHelp = t("channel.help");
    const formatEnabled = (value: unknown) => enabled(value, t);
    const editing = !!onChange;
    const change = onChange ?? (() => undefined);
    const [pendingRole, setPendingRole] = useState("");
    // The picker cannot name a thread, so the ID box stays one click away even when the channel list is known.
    const [typeChannelID, setTypeChannelID] = useState(false);
    const lockedFor = (key: string) => !!disabled || (!!premiumLocked && PREMIUM_ONLY.has(key));
    const premiumHint = (key: string) => premiumLocked && PREMIUM_ONLY.has(key) ? t("premiumHint") : undefined;

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
            <span>{enabled(s[key], t)}</span>
        </label>;
    }
    function languageSelect() {
        const value = typeof s.language === "string" ? s.language : "";
        return <select className={styles.control} value={value} disabled={lockedFor("language")} aria-label={t("display.language")} onChange={(e) => change(setField(s, "language", e.target.value))}>
            {!languageOf(value) && <option value={value}>{value || unknown}</option>}
            {LANGUAGES.map((language) => {
                const name = languageName(language.code, t);
                return <option key={language.code} value={language.code}>{language.native !== name
                    ? t("languageFormat.withNative", { flag: language.flag, name, native: language.native })
                    : t("languageFormat.short", { flag: language.flag, name })}</option>;
            })}
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
                    aria-label={t("channel.idLabel")} placeholder={t("channel.idPlaceholder")} maxLength={20}
                    onChange={(e) => change(setField(s, "matchSummaryChannelID", e.target.value.trim()))} />
                <button type="button" className={styles.smallButton} disabled={locked || value === ""} onClick={() => change(setField(s, "matchSummaryChannelID", ""))}>{t("channel.clear")}</button>
                {channels && <button type="button" className={styles.smallButton} disabled={locked} onClick={() => setTypeChannelID(false)}>{t("channel.pick")}</button>}
            </span>;
        }
        // Options in the list's order: top-level channels first, then one group per category. A value the list
        // does not carry (a thread, or a channel the bot has since lost) stays selectable so it is not silently lost.
        const options: React.ReactNode[] = [];
        let group: { label: string; items: React.ReactNode[] } | undefined;
        const flush = () => { if (group) { options.push(<optgroup key={`group:${group.label}`} label={group.label}>{group.items}</optgroup>); group = undefined; } };
        for (const ch of channels) {
            const option = <option key={ch.id} value={ch.id} disabled={!ch.ok} title={ch.ok ? undefined : ch.problems.join("; ")}>{ch.ok ? t("channel.option", { name: ch.name }) : t("channel.optionBlocked", { name: ch.name })}</option>;
            if (ch.category === "") { flush(); options.push(option); continue; }
            if (!group || group.label !== ch.category) { flush(); group = { label: ch.category, items: [] }; }
            group.items.push(option);
        }
        flush();
        return <span className={classes(styles.controlGroup, styles.pickGroup)}>
            <select className={styles.control} value={value} disabled={locked} aria-label={t("channel.label")} onChange={(e) => change(setField(s, "matchSummaryChannelID", e.target.value))}>
                <option value="">{t("channel.none")}</option>
                {value !== "" && !channels.some((ch) => ch.id === value) && <option value={value}>{t("channel.notListed", { id: value })}</option>}
                {options}
            </select>
            <button type="button" className={styles.smallButton} disabled={locked} onClick={() => setTypeChannelID(true)}>{t("channel.enterID")}</button>
        </span>;
    }
    /** What to say under the channel control: the list's verdict for a picked channel, the live check for a typed
     * ID, else how to choose. */
    function channelStatus(): Pick<Row, "ok" | "hint" | "error"> {
        const value = typeof s.matchSummaryChannelID === "string" ? s.matchSummaryChannelID : "";
        const savedValue = typeof saved?.matchSummaryChannelID === "string" ? saved.matchSummaryChannelID : undefined;
        const help = channels && !typeChannelID ? t("channel.pickHelp") : channelHelp;
        if (!editing || value === "" || !SNOWFLAKE.test(value) || value === savedValue) return { hint: editing ? help : undefined };
        const listed = channels?.find((ch) => ch.id === value);
        if (listed) return listed.ok ? { ok: t("channel.ok", { name: listed.name }) } : { error: listed.problems.join("; ") || t("channel.cantPost") };
        const check = channelCheck && channelCheck.id === value ? channelCheck : undefined;
        if (!check) return { hint: channelHelp };
        switch (check.state) {
            case "checking": return { hint: t("channel.checking") };
            case "ok": return { ok: t("channel.ok", { name: check.name ?? value }) };
            case "problem": return { error: (check.problems ?? []).join("; ") || t("channel.cantPost") };
            default: return { hint: t("channel.unchecked") };
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
                    title={missing ? t("roles.notInServer") : undefined}>
                    {role ? <><span className={styles.swatch} style={{ background: roleColor(role) }} aria-hidden="true" /><span>{role.name}</span></> : <code>{id}</code>}
                    <button type="button" className={styles.chipRemove} disabled={locked} aria-label={t("roles.remove", { name: role?.name ?? id })} onClick={() => change(removeRoleID(s, id))}>&times;</button>
                </span>;
            })}
            <span className={styles.controlGroup}>
                {roles ?
                    <select className={styles.control} value={pendingRole} disabled={locked || available.length === 0} aria-label={t("roles.pickLabel")} onChange={(e) => setPendingRole(e.target.value)}>
                        <option value="">{available.length ? t("roles.choose") : t("roles.allListed")}</option>
                        {available.map((role) => <option key={role.id} value={role.id}>{role.managed ? t("roles.managed", { name: role.name }) : role.name}</option>)}
                    </select> :
                    <input type="text" inputMode="numeric" autoComplete="off" spellCheck={false} className={`${styles.control} ${styles.idInput}`} value={pendingRole} disabled={locked}
                        aria-label={t("roles.idLabel")} placeholder={t("roles.idPlaceholder")} maxLength={20}
                        onChange={(e) => setPendingRole(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />}
                <button type="button" className={styles.smallButton} disabled={!canAdd} onClick={add}>{t("roles.add")}</button>
            </span>
        </span>;
    }
    /** Under the operator list: the picker note, or which typed IDs the server does not know. */
    function roleStatus(): Pick<Row, "hint" | "error"> {
        const missing = unknownRoleIDs(s.permissionRoleIDs, roles);
        if (missing.length) return { error: t("roles.unknown", { count: missing.length, ids: missing.join(", ") }) };
        return { hint: roles ? t("roles.pickHelp") : t("roles.help") };
    }
    function summaryRetention() {
        const value = s.deleteGameSummary;
        const mode = value === -1 ? "forever" : value === 0 ? "immediately" : "after";
        const minutes = typeof value === "number" && value > 0 ? value : "";
        const locked = lockedFor("deleteGameSummary");
        return <span className={styles.controlGroup}>
            <select className={styles.control} value={mode} disabled={locked} aria-label={t("summaries.retention")}
                onChange={(e) => change(setField(s, "deleteGameSummary", e.target.value === "forever" ? -1 : e.target.value === "immediately" ? 0 : 5))}>
                <option value="forever">{t("retention.forever")}</option>
                <option value="immediately">{t("retention.immediately")}</option>
                <option value="after">{t("retention.afterOption")}</option>
            </select>
            {mode === "after" && <label className={styles.inline}>
                <input type="number" className={styles.control} min={1} max={SUMMARY_RANGE.max} step={1} value={minutes} disabled={locked} aria-label={t("retention.minutesLabel")}
                    onChange={(e) => change(setField(s, "deleteGameSummary", e.target.value === "" ? NaN : Number(e.target.value)))} />
                <span>{t("retention.minutes")}</span>
            </label>}
        </span>;
    }

    const voiceCells = PHASES.flatMap((phase) => LIVES.map((life) => {
        const mute = cellDefault("voiceRules", "MuteRules", phase, life);
        const deaf = cellDefault("voiceRules", "DeafRules", phase, life);
        const defaultMute = mute ?? nested(s.voiceRules, "MuteRules", phase, life);
        const defaultDeaf = deaf ?? nested(s.voiceRules, "DeafRules", phase, life);
        const custom = (mute !== undefined || deaf !== undefined) && typeof defaultMute === "boolean" && typeof defaultDeaf === "boolean";
        const dirty = dirtyAt("voiceRules", "MuteRules", phase, life) || dirtyAt("voiceRules", "DeafRules", phase, life);
        const error = errors[`voiceRules.MuteRules.${phase}.${life}`] ?? errors[`voiceRules.DeafRules.${phase}.${life}`];
        return { phase, life, custom, dirty, error,
            context: life === "alive" ? t("voice.context.alive", { phase: phaseInSentence[phase] }) : t("voice.context.dead", { phase: phaseInSentence[phase] }),
            detail: t("voice.customDefault", { mute: defaultMute ? t("voice.inSentence.muted") : t("voice.inSentence.unmuted"), deaf: defaultDeaf ? t("voice.inSentence.deafened") : t("voice.inSentence.undeafened") }) };
    }));
    const voiceRows = [
        row("unmuteDeadDuringTasks", settingLabel(t("voice.unmuteDead.label"), t("voice.unmuteDead.about"), t("voice.unmuteDead.description")), formatEnabled,
            toggle("unmuteDeadDuringTasks", t("voice.unmuteDead.label"))),
        row("muteSpectator", settingLabel(t("voice.muteSpectator.label"), t("voice.muteSpectator.about"), t("voice.muteSpectator.description")), formatEnabled,
            toggle("muteSpectator", t("voice.muteSpectator.label"))),
    ];
    const delayCells = PHASES.flatMap((from) => PHASES.map((to) => {
        const initial = from === to ? undefined : cellDefault("delays", "delays", from, to);
        return { from, to, custom: typeof initial === "number" && Number.isFinite(initial), dirty: from !== to && dirtyAt("delays", "delays", from, to),
            error: from === to ? undefined : errors[`delays.delays.${from}.${to}`],
            label: t("delays.cellLabel", { from: phaseInSentence[from], to: phaseInSentence[to] }), detail: t("marker.customDefault", { value: seconds(initial, t) }) };
    }));

    return <div className={styles.grid}>
        <section className={`${styles.card} ${styles.wide}`}>
            <h2 className={`${styles.voiceHeading} ${styles.cardHeading}`}>
                {t("voice.heading")}
                <VoiceHint label={t("voice.about")} description={t("voice.aboutDescription")}>
                    <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
                </VoiceHint>
                <Counts custom={voiceCells.filter((cell) => cell.custom).length + voiceRows.filter((r) => r.custom).length}
                    unsaved={voiceCells.filter((cell) => cell.dirty).length + voiceRows.filter((r) => r.dirty).length} />
            </h2>
            <p className={styles.description}>{editing ? t("voice.descriptionEditing") : t("voice.description")}</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">{t("voice.caption")}</caption>
                <thead><tr><th scope="col">{t("voice.column.phase")}</th><th scope="col">{t("voice.column.alive")}</th><th scope="col">{t("voice.column.dead")}</th></tr></thead>
                <tbody>{phases.map(([phase, label]) => <tr key={phase}><th scope="row">{label}</th>{voiceCells.filter((cell) => cell.phase === phase).map((cell) => <td key={cell.life} className={classes(cell.custom && styles.customCell, cell.dirty && styles.dirtyCell, cell.error && styles.errorCell)}>
                    <VoiceState mute={nested(s.voiceRules, "MuteRules", phase, cell.life)} deaf={nested(s.voiceRules, "DeafRules", phase, cell.life)} context={cell.context} disabled={disabled}
                        onToggle={editing ? (kind, value) => change(setVoiceRule(s, kind, phase, cell.life, value)) : undefined} />
                    {cell.custom && <Marker kind="custom" detail={cell.detail} />}
                    {cell.error && <span className={styles.fieldError} role="alert">{cell.error}</span>}
                </td>)}</tr>)}</tbody>
            </table></div>
            <Rows rows={voiceRows} />
            {s.unmuteDeadDuringTasks === true && nested(s.voiceRules, "DeafRules", "TASKS", "alive") === false && <p className={`${styles.warning} ${styles.wideWarning}`} role="alert"><Trans t={t} i18nKey="voice.unsafe" components={{ strong: <strong /> }} /></p>}
            <p className={styles.premiumNote}>{t("voice.premiumNote")}</p>
        </section>
        <section className={styles.card}>
            <h2 className={styles.cardHeading}>{t("delays.heading")}<Counts custom={delayCells.filter((cell) => cell.custom).length} unsaved={delayCells.filter((cell) => cell.dirty).length} /></h2>
            <p className={styles.description}>{editing ? t("delays.descriptionEditing", { min: DELAY_RANGE.min, max: DELAY_RANGE.max }) : t("delays.description")}</p>
            <div className={styles.scroll}><table className={styles.table}>
                <caption className="visually-hidden">{t("delays.caption")}</caption>
                <thead><tr><th scope="col">{t("delays.corner")}</th>{phases.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead>
                <tbody>{phases.map(([from, label]) => <tr key={from}><th scope="row">{label}</th>{delayCells.filter((cell) => cell.from === from).map((cell) => {
                    const value = nested(s.delays, "delays", from, cell.to);
                    return <td key={cell.to} className={from === cell.to ? styles.notApplicable : classes(cell.custom && styles.customCell, cell.dirty && styles.dirtyCell, cell.error && styles.errorCell)} aria-label={from === cell.to ? t("delays.notApplicable") : undefined}>
                        {editing && from !== cell.to ?
                            <input type="number" className={`${styles.control} ${styles.delayInput}`} min={DELAY_RANGE.min} max={DELAY_RANGE.max} step={1} disabled={disabled} aria-label={cell.label}
                                value={typeof value === "number" && Number.isFinite(value) ? value : ""}
                                onChange={(e) => change(setDelay(s, from, cell.to, e.target.value === "" ? NaN : Number(e.target.value)))} /> :
                            transitionDelay(from, cell.to, value, t)}
                        {cell.custom && <Marker kind="custom" detail={cell.detail} />}
                        {cell.error && <span className={styles.fieldError} role="alert">{cell.error}</span>}
                    </td>;
                })}</tr>)}</tbody>
            </table></div>
        </section>
        <Group title={t("display.heading")} rows={[
            row("language", t("display.language"), (value) => languageLabel(value, t), languageSelect()),
            row("mapVersion", t("display.mapVersion"), (value) => labelled(value, mapLabels, t), select("mapVersion", t("display.mapVersion"), MAP_VERSIONS, mapLabels)),
            row("displayRoomCode", t("display.roomCode"), (value) => labelled(value, roomLabels, t), select("displayRoomCode", t("display.roomCode"), ROOM_CODE_OPTIONS, roomLabels)),
            row("autoRefresh", t("display.autoRefresh"), formatEnabled, toggle("autoRefresh", t("display.autoRefresh"))),
        ]} />
        {/* Leaderboard options and bot admin user IDs are intentionally not shown: stats are moving to this UI and
            those settings are slated for removal, so the page should not invite anyone to rely on them. */}
        <Group title={t("summaries.heading")} rows={[
            row("deleteGameSummary", t("summaries.retention"), (value) => retention(value, t), summaryRetention()),
            { ...row("matchSummaryChannelID", t("channel.label"), (value) => channel(value, t), channelField()), ...channelStatus() },
        ]} />
        {/* Mirrors commandAccess in bot/slash_commands.go: operator roles control /new, /pause, /end, /link, and
            /unlink; the guild owner and members with Administrator or Manage Server always pass, and only they may
            change settings (here or with /settings). */}
        <Group title={t("roles.heading")} description={t("roles.description")} rows={[
            (() => { const base = row("permissionRoleIDs", roles ? t("roles.label") : t("roles.idsLabel"), (value) => roleIDs(value, t, roles), roleField()); return editing ? { ...base, ...roleStatus(), error: base.error ?? roleStatus().error } : base; })(),
        ]} />
    </div>;
}
