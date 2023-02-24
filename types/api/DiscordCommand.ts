/** @see {DiscordCommand} ts-auto-guard:type-guard */
export type DiscordCommand = {
    name: string;
    description: string;
    
    id?: string; // not returned by API but Discord required
    application_id?: string; // not returned by API but Discord required
    version?: string; // not returned by API but Discord required

    type?: DiscordCommandType;
    guild_id?: string;
    name_localizations?: Record<DiscordLocale, string>;
    description_localizations?: Record<DiscordLocale, string>;
    options?: DiscordCommandOption[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    default_permission?: boolean;
    nsfw?: boolean;
};

enum DiscordCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

type DiscordCommandOption = {
    type: DiscordCommandOptionType;
    name: string;
    name_localizations?: Record<DiscordLocale, string>;
    description: string;
    description_localizations?: Record<DiscordLocale, string>;
    required?: boolean;
    choices?: DiscordCommandOptionChoice[];
    options?: DiscordCommandOption[];
    channel_types?: DiscordChannelType[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
};

type DiscordCommandOptionChoice = {
    name: string;
    name_localizations?: Record<DiscordLocale, string>;
    value: string | number;
};

enum DiscordCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

enum DiscordChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
}

type DiscordLocale =
    | "id"
    | "da"
    | "de"
    | "en-GB"
    | "en-US"
    | "es-ES"
    | "fr"
    | "hr"
    | "it"
    | "lt"
    | "hu"
    | "nl"
    | "no"
    | "pl"
    | "pt-BR"
    | "ro"
    | "fi"
    | "sv-SE"
    | "vi"
    | "tr"
    | "cs"
    | "el"
    | "bg"
    | "ru"
    | "uk"
    | "hi"
    | "th"
    | "zh-CN"
    | "ja"
    | "zh-TW"
    | "ko";
