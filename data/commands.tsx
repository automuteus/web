import { Command } from "../types/Command";

export const prefix = "/";
export const sprefix = "settings ";

export const commands: Command[] = [
    {
        command: "help",
        description: ["View available commands"],
        arguments: [
            {
                name: "command",
                description: ["Name of command to view more details about"],
                type: "string",
                level: "optional",
                values: [
                    "new",
                    "refresh",
                    "pause",
                    "end",
                    "link",
                    "unlink",
                    "settings",
                    "privacy",
                    "info",
                    "map",
                    "stats",
                    "premium",
                    "debug",
                    "download",
                ].sort(),
            },
        ],
        example: "help command:new",
    },
    {
        command: "new",
        description: ["Start a new game"],
        example: "new",
    },
    {
        command: "refresh",
        description: ["Refresh the game message"],
        example: "refresh",
    },
    {
        command: "pause",
        description: ["Pause the current game"],
        example: "pause",
    },
    {
        command: "end",
        description: ["End a game"],
        example: "end",
    },
    {
        command: "link",
        description: ["Link a Discord User to their in-game color"],
        arguments: [
            {
                name: "user",
                description: ["User to link"],
                type: "Discord @User",
                level: "required",
            },
            {
                name: "color",
                description: ["In-game color"],
                type: "string",
                level: "required",
                values: [
                    "red",
                    "blue",
                    "green",
                    "pink",
                    "orange",
                    "yellow",
                    "black",
                    "white",
                    "purple",
                    "brown",
                    "cyan",
                    "lime",
                    "maroon",
                    "rose",
                    "banana",
                    "gray",
                    "tan",
                    "coral",
                ].sort(),
            },
        ],
        example: "link user:@Yoshirahh color:green",
    },
    {
        command: "unlink",
        description: ["Unlink a Discord User from their in-game color"],
        arguments: [
            {
                name: "user",
                description: ["User to link"],
                type: "Discord @User",
                level: "required",
            },
        ],
        example: "unlink user:@Yoshirahh",
    },
    // {
    //     command: "settings",
    //     description: [
    //         "View or change ",
    //         <a href="#settings-list" className="bg-premium">
    //             AutoMuteUs settings
    //         </a>,
    //     ],
    // },
    {
        command: "privacy",
        description: ["View AMU privacy info"],
        arguments: [
            {
                name: "command",
                description: ["Name of privacy command"],
                type: "string",
                level: "optional",
                values: ["info", "show-me", "opt-in", "opt-out"],
            },
        ],
        example: "privacy command:show-me",
    },
    {
        command: "info",
        description: ["AutoMuteUs info"],
        example: "info",
    },
    {
        command: "map",
        description: ["View Among Us game maps"],
        arguments: [
            {
                name: "map_name",
                description: ["Map to display"],
                type: "string",
                level: "required",
                values: ["Airship", "Skeld", "Mira", "Polus", "dlekS"],
            },
            {
                name: "detailed",
                description: ["View detailed map?"],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
        example: "map map_name:Polus detailed:True",
    },
    {
        command: "stats",
        description: ["View or clear stats from games played with AutoMuteUs"],
        subcommands: [
            {
                command: "view user",
                description: ["User stats"],
                arguments: [
                    {
                        name: "user",
                        level: "required",
                        description: ["User to pull stats for"],
                        type: "Discord @User",
                    },
                ],
                example: "stats view user user:@Yoshirahh",
            },
            {
                command: "clear user",
                description: ["Clear a user's stats"],
                arguments: [
                    {
                        name: "user",
                        level: "required",
                        description: ["User to clear stats for"],
                        type: "Discord @User",
                    },
                ],
                example: "stats clear user user:@Yoshirahh",
            },
            {
                command: "view match",
                description: ["Match stats"],
                arguments: [
                    {
                        name: "match",
                        level: "required",
                        description: ["Match to pull stats for"],
                        type: "Match ID",
                        values: ["Example: '1A2B3C4D:12345'"],
                    },
                ],
                example: "stats view match match:1A2B3C4D:12345",
            },
            {
                command: "view guild",
                description: ["Guild stats"],
                example: "stats view guild",
            },
            {
                command: "clear guild",
                description: ["Reset this guild's stats"],
                example: "stats clear guild",
            },
        ],
    },
    {
        command: "premium",
        description: ["View information about AutoMuteUs Premium"],
        subcommands: [
            {
                command: "info",
                description: ["View AutoMuteUs Premium information"],
                example: "premium info",
            },
            {
                command: "invites",
                description: ["Invite AutoMuteUs premium workers"],
                example: "premium invites",
            },
        ],
    },
    {
        command: "debug",
        description: ["View and clear debug information for AutoMuteUs"],
        subcommands: [
            {
                command: "view user",
                description: ["User cached names"],
                example: "debug view user user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        level: "required",
                        description: ["User to pull cache for"],
                        type: "Discord @User",
                    },
                ],
            },
            {
                command: "clear",
                description: ["Clear cached user names"],
                example: "debug clear user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        level: "required",
                        description: ["User to clear cache for"],
                        type: "Discord @User",
                    },
                ],
            },
            {
                command: "unmute-all",
                description: ["Unmute all players"],
                example: "debug unmute-all",
            },
            {
                command: "view game-state",
                description: ["Print out the current game state"],
                example: "debug view game-state",
            },
        ],
    },
];

export const settings: Command[] = [
    {
        command: "list",
        description: ["List all settings"],
        example: "list",
    },
    {
        command: "language",
        description: ["Bot language"],
        example: "language",
        arguments: [
            {
                name: "language-code",
                description: ["Two character language code"],
                type: "string",
                level: "optional",
                values: [
                    "en",
                    "af",
                    "ar",
                    "ca",
                    "cs",
                    "da",
                    "de",
                    "el",
                    "es",
                    "fi",
                    "fr",
                    "he",
                    "hu",
                    "it",
                    "ja",
                    "ko",
                    "nl",
                    "no",
                    "pl",
                    "pt",
                    "ro",
                    "ru",
                    "sr",
                    "sv",
                    "tr",
                    "uk",
                    "vi",
                    "zh",
                ].sort(),
            },
        ],
    },
    {
        command: "voice-rules",
        description: ["Bot round behavior"],
        example:
            "voice-rules deaf-or-muted:deafened phase:TASKS alive:alive value:True ",
        arguments: [
            {
                name: "deaf-or-muted",
                description: ["Targeted rule effect"],
                type: "string",
                level: "required",
                values: ["deafened", "muted"],
            },
            {
                name: "phase",
                description: ["Targeted game phase"],
                type: "string",
                level: "required",
                values: ["LOBBY", "TASKS", "DISCUSSION"],
            },
            {
                name: "alive",
                description: ["Targeted player liveness state"],
                type: "string",
                level: "required",
                values: ["alive", "dead"],
            },
            {
                name: "value",
                description: ["Target value"],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
    },
    {
        command: "admin-user-ids",
        description: ["Bot admins"],
        subcommands: [
            {
                command: "view",
                description: ["View Admins"],
                example: "admin-user-ids view",
            },
            {
                command: "clear",
                description: ["Clear Admins"],
                example: "admin-user-ids clear",
            },
            {
                command: "user",
                description: ["Set Discord user as an Admin"],
                example: "admin-user-ids user user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        description: ["User to elevate"],
                        type: "Discord @User",
                        level: "required",
                    },
                ],
            },
        ],
    },
    {
        command: "operator-roles",
        description: ["Bot operators"],
        subcommands: [
            {
                command: "view",
                description: ["View Operators"],
                example: "operator-roles view",
            },
            {
                command: "clear",
                description: ["Clear Operators"],
                example: "operator-roles clear",
            },
            {
                command: "role",
                description: ["Set Discord role as an Operator"],
                example: "operator-roles role role:@operators",
                arguments: [
                    {
                        name: "role",
                        description: ["Role to elevate"],
                        type: "Discord @Role",
                        level: "required",
                    },
                ],
            },
        ],
    },
    {
        command: "unmute-dead",
        description: ["Bot unmutes deaths immediately"],
        example: "unmute-dead unmute:True",
        arguments: [
            {
                name: "unmute",
                description: [
                    "Whether dead players should be unmuted immediately",
                ],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
    },
    {
        command: "map-version",
        description: ["Map version"],
        example: "map-version detailed:True",
        arguments: [
            {
                name: "detailed",
                description: ["Is the detailed version of the game map used?"],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
    },
    {
        command: "delays",
        description: [
            "Game transition mute delays (between start and end phases)",
        ],
        example: "delays start-phase:LOBBY end-phase:TASKS delay:10",
        arguments: [
            {
                name: "start-phase",
                description: ["Starting game phase of desired mute delay"],
                type: "string",
                level: "required",
                values: ["LOBBY", "TASKS", "DISCUSSION"],
            },
            {
                name: "end-phase",
                description: ["Ending game phase of desired mute delay"],
                type: "string",
                level: "required",
                values: ["LOBBY", "TASKS", "DISCUSSION"],
            },
            {
                name: "delay",
                description: ["Delay in seconds"],
                type: "number",
                level: "optional",
            },
        ],
    },
    {
        command: "show",
        description: ["Show all current settings as JSON"],
        example: "show",
    },
    {
        command: "reset",
        description: ["Reset bot settings to default values"],
        example: "reset",
    },
];

export const premiumSettings: Command[] = [
    {
        command: "match-summary-duration",
        description: ["How long the match summary message lasts"],
        isPremium: true,
        example: "match-summary-duration minutes-duration:10",
        arguments: [
            {
                name: "minutes-duration",
                description: [
                    "Time in minutes before summary message is deleted",
                ],
                type: "number",
                level: "optional",
            },
        ],
    },
    {
        command: "match-summary-channel",
        description: ["Channel for match summary messages"],
        isPremium: true,
        example: "match-summary-channel channel:#general",
        arguments: [
            {
                name: "channel",
                description: [
                    "Discord channel callout where match summary messages will be posted",
                ],
                type: "Discord #Channel",
                level: "optional",
            },
        ],
    },
    {
        command: "auto-refresh",
        description: ["Auto refresh status message"],
        isPremium: true,
        example: "auto-refresh autorefresh:True",
        arguments: [
            {
                name: "autorefresh",
                description: [
                    "Whether or not the match status message should be refreshed automatically",
                ],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
    },
    {
        command: "leaderboard-mention",
        description: ["Mention players in leaderboard"],
        isPremium: true,
        example: "leaderboard-mention use-mention:True",
        arguments: [
            {
                name: "use-mention",
                description: [
                    "Whether or not tag users in the leaderboard (vs plain text names)",
                ],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
    },
    {
        command: "leaderboard-size",
        description: ["Size of player leaderboard"],
        isPremium: true,
        example: "leaderboard-size size:10",
        arguments: [
            {
                name: "size",
                description: ["Number of users on leaderboard"],
                type: "number",
                level: "optional",
            },
        ],
    },
    {
        command: "leaderboard-min",
        description: ["Minimum games to be listed on player leaderboard"],
        isPremium: true,
        example: "leaderboard-min minimum:10",
        arguments: [
            {
                name: "minimum",
                description: ["Number of games required to be on leaderboard"],
                type: "number",
                level: "optional",
            },
        ],
    },
    {
        command: "mute-spectators",
        description: ["Treat spectators like dead players"],
        isPremium: true,
        example: "mute-spectators mute:True",
        arguments: [
            {
                name: "mute",
                description: [
                    "Whether to mute spectators in the game voice channel",
                ],
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
    },
    {
        command: "display-room-code",
        description: ["Visibility of Among Us ROOM CODE"],
        isPremium: true,
        example: "display-room-code visibility:spoiler",
        arguments: [
            {
                name: "visibility",
                description: [
                    "Level of visibility of the room code in the game status message",
                ],
                type: "string",
                level: "optional",
                values: ["always", "spoiler", "never"],
            },
        ],
    },
];
