import { Command } from "../types/Command";

// Descriptions are keys in locales/en/commands.json, resolved by components/commands/CommandDescription.tsx.
// Command names, argument names/values and examples are what users type in Discord, so they stay as is.

export const prefix = "/";

export const commands: Command[] = [
    {
        command: "help",
        description: "command.help.description",
        arguments: [
            {
                name: "command",
                description: "command.help.arg.command",
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
                ].sort(),
            },
        ],
        example: "help command:new",
    },
    {
        command: "new",
        description: "command.new.description",
        example: "new",
    },
    {
        command: "refresh",
        description: "command.refresh.description",
        example: "refresh",
    },
    {
        command: "pause",
        description: "command.pause.description",
        example: "pause",
    },
    {
        command: "end",
        description: "command.end.description",
        example: "end",
    },
    {
        command: "link",
        description: "command.link.description",
        arguments: [
            {
                name: "user",
                description: "command.link.arg.user",
                type: "Discord @User",
                level: "required",
            },
            {
                name: "color",
                description: "command.link.arg.color",
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
        description: "command.unlink.description",
        arguments: [
            {
                name: "user",
                description: "command.unlink.arg.user",
                type: "Discord @User",
                level: "required",
            },
        ],
        example: "unlink user:@Yoshirahh",
    },
    {
        command: "settings",
        description: "command.settings.description",
        example: "settings",
    },
    {
        command: "privacy",
        description: "command.privacy.description",
        arguments: [
            {
                name: "command",
                description: "command.privacy.arg.command",
                type: "string",
                level: "optional",
                values: ["info", "show-me", "opt-in", "opt-out"],
            },
        ],
        example: "privacy command:show-me",
    },
    {
        command: "info",
        description: "command.info.description",
        example: "info",
    },
    {
        command: "map",
        description: "command.map.description",
        arguments: [
            {
                name: "map_name",
                description: "command.map.arg.mapName",
                type: "string",
                level: "required",
                values: ["Airship", "Skeld", "Mira", "Polus", "dlekS"],
            },
            {
                name: "detailed",
                description: "command.map.arg.detailed",
                type: "string",
                level: "optional",
                values: ["True", "False"],
            },
        ],
        example: "map map_name:Polus detailed:True",
    },
    {
        command: "stats",
        description: "command.stats.description",
        example: "stats",
    },
    {
        command: "premium",
        description: "command.premium.description",
        subcommands: [
            {
                command: "info",
                description: "command.premium.info.description",
                example: "premium info",
            },
            {
                command: "invites",
                description: "command.premium.invites.description",
                example: "premium invites",
            },
        ],
    },
    {
        command: "debug",
        description: "command.debug.description",
        subcommands: [
            {
                command: "view user",
                description: "command.debug.viewUser.description",
                example: "debug view user user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        level: "required",
                        description: "command.debug.viewUser.arg.user",
                        type: "Discord @User",
                    },
                ],
            },
            {
                command: "clear",
                description: "command.debug.clear.description",
                example: "debug clear user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        level: "required",
                        description: "command.debug.clear.arg.user",
                        type: "Discord @User",
                    },
                ],
            },
            {
                command: "unmute-all",
                description: "command.debug.unmuteAll.description",
                example: "debug unmute-all",
            },
            {
                command: "unmute",
                description: "command.debug.unmute.description",
                example: "debug unmute user:@Yoshirahh",
                arguments: [
                    {
                        name: "user",
                        level: "optional",
                        description: "command.debug.unmute.arg.user",
                        type: "Discord @User",
                    },
                ],
            },
            {
                command: "view game-state",
                description: "command.debug.viewGameState.description",
                example: "debug view game-state",
            },
        ],
    },
];
