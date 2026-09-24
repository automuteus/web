/** Pure helpers for editing a guild settings document in the browser: which fields the site may change, how to
 * update the nested voice-rule and delay tables, what to send in a PATCH, and the same range checks the Go API
 * applies (pkg/settings/validate.go) so most mistakes are caught before a round trip. */

export type Settings = Record<string, unknown>;

export const PHASES = ["LOBBY", "TASKS", "DISCUSSION"] as const;
export const LIVES = ["alive", "dead"] as const;
export const RULE_KINDS = ["MuteRules", "DeafRules"] as const;
export const MAP_VERSIONS = ["simple", "detailed"] as const;
export const ROOM_CODE_OPTIONS = ["always", "spoiler", "never"] as const;
export const DELAY_RANGE = { min: 0, max: 10 } as const;
/** -1 keeps summaries forever, 0 deletes them immediately, otherwise minutes. */
export const SUMMARY_RANGE = { min: -1, max: 60 } as const;

/** The bot's installed translations (locales/active.<code>.toml in the Go repo) with display names and a flag.
 * A language is not a country, so the flags are the conventional choice for each translation, not a claim about
 * where it is spoken. The API validates codes against its embedded set, so a stale entry here is rejected with a
 * field error rather than saved. */
export const LANGUAGES: readonly { code: string; name: string; native: string; flag: string }[] = [
    { code: "en", name: "English", native: "English", flag: "\u{1F1FA}\u{1F1F8}" },
    { code: "de", name: "German", native: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
    { code: "es", name: "Spanish", native: "Espa\u00f1ol", flag: "\u{1F1EA}\u{1F1F8}" },
    { code: "fr", name: "French", native: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}" },
    { code: "it", name: "Italian", native: "Italiano", flag: "\u{1F1EE}\u{1F1F9}" },
    { code: "ja", name: "Japanese", native: "\u65e5\u672c\u8a9e", flag: "\u{1F1EF}\u{1F1F5}" },
    { code: "no", name: "Norwegian", native: "Norsk", flag: "\u{1F1F3}\u{1F1F4}" },
    { code: "pl", name: "Polish", native: "Polski", flag: "\u{1F1F5}\u{1F1F1}" },
    { code: "pt", name: "Portuguese", native: "Portugu\u00eas", flag: "\u{1F1F5}\u{1F1F9}" },
    { code: "ro", name: "Romanian", native: "Rom\u00e2n\u0103", flag: "\u{1F1F7}\u{1F1F4}" },
    { code: "ru", name: "Russian", native: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", flag: "\u{1F1F7}\u{1F1FA}" },
    { code: "sv", name: "Swedish", native: "Svenska", flag: "\u{1F1F8}\u{1F1EA}" },
    { code: "uk", name: "Ukrainian", native: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", flag: "\u{1F1FA}\u{1F1E6}" },
    { code: "zh", name: "Chinese", native: "\u4e2d\u6587", flag: "\u{1F1E8}\u{1F1F3}" },
];
export function languageOf(code: unknown) {
    return typeof code === "string" ? LANGUAGES.find((language) => language.code === code) : undefined;
}

export const SNOWFLAKE = /^[0-9]{17,20}$/;

/** The API caps each ID list at this many entries (pkg/settings MaxPermissionRoleIDs). */
export const MAX_ROLE_IDS = 100;

/** Fields this site may change. Bot admin user IDs and leaderboard options are being retired. */
export const EDITABLE = ["language", "voiceRules", "delays", "unmuteDeadDuringTasks", "muteSpectator", "mapVersion", "displayRoomCode", "autoRefresh", "deleteGameSummary", "matchSummaryChannelID", "permissionRoleIDs"] as const;
export type EditableKey = typeof EDITABLE[number];
export function isEditable(key: string): key is EditableKey {
    return (EDITABLE as readonly string[]).includes(key);
}

export interface FieldError {
    field: string;
    message: string;
}

/** A guild role as /api/guild/roles reports it: Discord's integer colour (0 for none) and display position. */
export interface GuildRole {
    id: string;
    name: string;
    color: number;
    position: number;
    managed: boolean;
}
/** A guild channel as /api/guild/channels reports it: text (0) or announcement (5), its category name (empty at the
 * top level), and the bot's verdict as a summary destination. The list arrives in Discord's display order. */
export interface GuildChannel {
    id: string;
    name: string;
    type: number;
    category: string;
    ok: boolean;
    problems: string[];
}
/** CSS colour for a role swatch; Discord shows uncoloured roles in its default grey. */
export function roleColor(role: Pick<GuildRole, "color">): string {
    return role.color > 0 ? `#${role.color.toString(16).padStart(6, "0")}` : "#99aab5";
}
/** IDs in the list that are not roles of the guild. Empty when the role list is unknown. */
export function unknownRoleIDs(ids: unknown, roles: readonly GuildRole[] | undefined): string[] {
    if (!roles || !Array.isArray(ids)) return [];
    const known = new Set(roles.map((role) => role.id));
    return ids.filter((id): id is string => typeof id === "string" && !known.has(id));
}

/** Structural equality for JSON values, so documents compare regardless of key order. */
export function same(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object" || Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((key) =>
        Object.prototype.hasOwnProperty.call(b, key) && same((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}

export function nested(value: unknown, ...keys: string[]): unknown {
    for (const key of keys) {
        if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
        value = (value as Record<string, unknown>)[key];
    }
    return value;
}

function table(value: unknown): Record<string, Record<string, unknown>> {
    const out: Record<string, Record<string, unknown>> = {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return out;
    for (const [row, cells] of Object.entries(value as Record<string, unknown>)) {
        out[row] = cells && typeof cells === "object" && !Array.isArray(cells) ? { ...(cells as Record<string, unknown>) } : {};
    }
    return out;
}

export function setField(draft: Settings, key: EditableKey, value: unknown): Settings {
    return { ...draft, [key]: value };
}

/** Returns a new document with one voice rule changed. Rows are copied whole because the API replaces them whole. */
export function setVoiceRule(draft: Settings, kind: typeof RULE_KINDS[number], phase: string, life: string, value: boolean): Settings {
    const rules = draft.voiceRules && typeof draft.voiceRules === "object" && !Array.isArray(draft.voiceRules) ? { ...(draft.voiceRules as Record<string, unknown>) } : {};
    const kindTable = table(rules[kind]);
    kindTable[phase] = { ...(kindTable[phase] ?? {}), [life]: value };
    rules[kind] = kindTable;
    return { ...draft, voiceRules: rules };
}

/** Returns a new document with one transition delay changed. NaN is kept so validation can flag an empty box. */
export function setDelay(draft: Settings, from: string, to: string, seconds: number): Settings {
    const delays = draft.delays && typeof draft.delays === "object" && !Array.isArray(draft.delays) ? { ...(draft.delays as Record<string, unknown>) } : {};
    const rows = table(delays.delays);
    rows[from] = { ...(rows[from] ?? {}), [to]: seconds };
    delays.delays = rows;
    return { ...draft, delays };
}

function roleList(draft: Settings): string[] {
    return Array.isArray(draft.permissionRoleIDs) ? draft.permissionRoleIDs.filter((id): id is string => typeof id === "string") : [];
}
/** Returns a new document with a role ID appended, ignoring duplicates. The ID is not checked against the server. */
export function addRoleID(draft: Settings, id: string): Settings {
    const roles = roleList(draft);
    return roles.includes(id) ? draft : { ...draft, permissionRoleIDs: [...roles, id] };
}
export function removeRoleID(draft: Settings, id: string): Settings {
    return { ...draft, permissionRoleIDs: roleList(draft).filter((role) => role !== id) };
}

/** The PATCH body: only editable fields whose value differs from what was loaded. Voice rules and delays are sent
 * as whole documents because the API replaces their rows whole. An empty object means nothing to save. */
export function patchBody(saved: Settings, draft: Settings): Partial<Record<EditableKey, unknown>> {
    const body: Partial<Record<EditableKey, unknown>> = {};
    for (const key of EDITABLE) {
        if (!same(saved[key], draft[key])) body[key] = draft[key];
    }
    return body;
}

/** How many individual settings differ, counting each voice-rule cell and delay cell separately. */
export function countChanges(saved: Settings, draft: Settings): number {
    let count = 0;
    for (const key of EDITABLE) {
        if (key === "voiceRules") {
            for (const kind of RULE_KINDS) for (const phase of PHASES) for (const life of LIVES) {
                if (!same(nested(saved.voiceRules, kind, phase, life), nested(draft.voiceRules, kind, phase, life))) count++;
            }
        } else if (key === "delays") {
            for (const from of PHASES) for (const to of PHASES) {
                if (!same(nested(saved.delays, "delays", from, to), nested(draft.delays, "delays", from, to))) count++;
            }
        } else if (!same(saved[key], draft[key])) {
            count++;
        }
    }
    return count;
}

function integerIn(value: unknown, min: number, max: number): boolean {
    return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

/** The API's own range checks, applied to the given fields of a document. Field paths match the API's
 * (for example "delays.delays.LOBBY.TASKS") so server and local errors land on the same control. */
export function validateDraft(draft: Settings, keys: readonly string[] = EDITABLE): FieldError[] {
    const errors: FieldError[] = [];
    for (const key of keys) {
        switch (key) {
            case "language":
                if (!languageOf(draft[key])) errors.push({ field: key, message: `must be one of the installed languages: ${LANGUAGES.map((l) => l.code).join(", ")}` });
                break;
            case "voiceRules":
                for (const kind of RULE_KINDS) for (const phase of PHASES) for (const life of LIVES) {
                    if (typeof nested(draft.voiceRules, kind, phase, life) !== "boolean") {
                        errors.push({ field: `voiceRules.${kind}.${phase}.${life}`, message: "must be on or off" });
                    }
                }
                break;
            case "delays":
                for (const from of PHASES) for (const to of PHASES) {
                    if (!integerIn(nested(draft.delays, "delays", from, to), DELAY_RANGE.min, DELAY_RANGE.max)) {
                        errors.push({ field: `delays.delays.${from}.${to}`, message: `must be a whole number of seconds from ${DELAY_RANGE.min} to ${DELAY_RANGE.max}` });
                    }
                }
                break;
            case "unmuteDeadDuringTasks":
            case "muteSpectator":
            case "autoRefresh":
                if (typeof draft[key] !== "boolean") errors.push({ field: key, message: "must be on or off" });
                break;
            case "mapVersion":
                if (!(MAP_VERSIONS as readonly unknown[]).includes(draft[key])) errors.push({ field: key, message: `must be ${MAP_VERSIONS.join(" or ")}` });
                break;
            case "displayRoomCode":
                if (!(ROOM_CODE_OPTIONS as readonly unknown[]).includes(draft[key])) errors.push({ field: key, message: `must be one of ${ROOM_CODE_OPTIONS.join(", ")}` });
                break;
            case "permissionRoleIDs": {
                const roles = draft[key];
                if (!Array.isArray(roles)) { errors.push({ field: key, message: "must be a list of role IDs" }); break; }
                if (roles.length > MAX_ROLE_IDS) errors.push({ field: key, message: `has ${roles.length} entries, at most ${MAX_ROLE_IDS} are allowed` });
                const seen = new Map<string, number>();
                roles.forEach((role, i) => {
                    if (typeof role !== "string" || !SNOWFLAKE.test(role)) errors.push({ field: `${key}[${i}]`, message: "is not a Discord role ID" });
                    else if (seen.has(role)) errors.push({ field: `${key}[${i}]`, message: `duplicates entry ${seen.get(role)! + 1}` });
                    else seen.set(role, i);
                });
                break;
            }
            case "matchSummaryChannelID":
                if (draft[key] !== "" && (typeof draft[key] !== "string" || !SNOWFLAKE.test(draft[key] as string))) {
                    errors.push({ field: key, message: "must be a Discord channel ID (17 to 20 digits), or empty for none" });
                }
                break;
            case "deleteGameSummary":
                if (!integerIn(draft[key], SUMMARY_RANGE.min, SUMMARY_RANGE.max)) {
                    errors.push({ field: key, message: `must be a whole number of minutes from 1 to ${SUMMARY_RANGE.max}, 0 to delete immediately, or -1 to keep forever` });
                }
                break;
            default:
                errors.push({ field: key, message: "cannot be changed here" });
        }
    }
    return errors;
}

export function errorMap(errors: readonly FieldError[]): Record<string, string> {
    const map: Record<string, string> = {};
    for (const error of errors) if (!(error.field in map)) map[error.field] = error.message;
    return map;
}
