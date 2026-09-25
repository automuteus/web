import { Command } from "../types/Command";

export const prefix = "/";

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
    {
        command: "settings",
        description: [
            "Get a link to the ",
            <a href="/settings">settings page</a>,
            ", where the bot's settings for this server are managed",
        ],
        example: "settings",
    },
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
        description: [
            "Get a link to the ",
            <a href="/stats">stats page</a>,
            ", where stats for this server are shown and reset",
        ],
        example: "stats",
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
                command: "unmute",
                description: ["Unmute myself, or a specific user"],
                example: "debug unmute user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        level: "optional",
                        description: ["User who should be unmuted/undeafened"],
                        type: "Discord @User",
                    },
                ],
            },
            {
                command: "view game-state",
                description: ["Print out the current game state"],
                example: "debug view game-state",
            },
        ],
    },
    {
        command: "download",
        description: ["Download AutoMuteUs data"],
        isPremium: true,
        arguments: [
            {
                name: "category",
                description: ["Data to download"],
                type: "string",
                level: "required",
                values: [
                    "guild",
                    "users",
                    "users_games",
                    "games",
                    "game_events",
                ].sort(),
            },
        ],
        example: "download category:games",
    },
];
