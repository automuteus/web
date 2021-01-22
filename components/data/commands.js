import Link from "next/link";

export const commands = [
  {
    command: "help",
    alias: ["", "h"],
    description: "Display bot help message, or see more info about a command",
    arguments: [
      {
        name: "command",
        type: "string",
        description: "An AutoMuteUs command to see more info about",
        level: "optional",
      },
    ],
    example: ".au help",
  },
  {
    command: "new",
    alias: ["start", "n"],
    description: "Start a new game in the current text channel",
    arguments: [],
    example: ".au n ZXLDFT eu",
  },
  {
    command: "end",
    alias: ["stop", "e"],
    description: "End the current game",
    arguments: [],
    example: ".au e",
  },
  {
    command: "refresh",
    alias: ["reload", "ref", "rel", "r"],
    description:
      "Remake the bot's status message entirely, in case it ends up too far up in the chat.",
    arguments: [],
    example: ".au r",
  },
  {
    command: "link",
    alias: ["l"],
    description: "Manually link a discord user to their in-game color",
    arguments: [
      {
        name: "@name",
        type: "string",
        description: [
          "A Discord user mention (requires the",
          <code className="ml-1">@</code>,
          ")",
        ],
        level: "required",
      },
      {
        name: "color",
        type: "string",
        description: "A crewmate color name",
        values: [
          "red",
          "blue",
          "green",
          "pink",
          "orange",
          "yellow",
          "black",
          "white",
          "cyan",
          "lime",
        ],
        level: "required",
      },
    ],
    example: ".au l @Soup cyan",
  },
  {
    command: "unlink",
    alias: ["un", "ul", "u"],
    description: "Manually unlink a Discord User from their in-game player.",
    arguments: [],
    example: ".au unlink @Soup",
  },
  {
    command: "unmuteall",
    alias: ["unmute", "ua"],
    description: "Force the bot to unmute all linked players.",
    arguments: [],
    example: ".au unmuteall",
  },
  {
    command: "map",
    alias: [],
    description:
      "Display an image of an in-game map in the text channel. Two supported versions: simple or detailed",
    arguments: [
      {
        name: "name",
        type: "string",
        description: ["Among Us map name"],
        values: ["skeld", "mira_hq", "polus"],
        level: "required",
      },
      {
        name: "name",
        type: "string",
        description: [
          "Level of map detail (showing vents, sabotages, etc.). ",
          <code>simple</code>,
          " is default, if not provided.",
        ],
        values: ["simple", "detailed"],
        level: "optional",
      },
    ],
    example: ".au map skeld",
  },
  {
    command: "cache",
    alias: ["c"],
    description: "View a player's cached in-game names, and/or clear them",
    arguments: [
      {
        name: "@name",
        type: "string",
        description: [
          "A Discord user mention (requires the",
          <code className="ml-1">@</code>,
          ")",
        ],
        level: "required",
      },
      {
        name: "clear",
        type: "string",
        description: "Will clear the mentioned user's cached names",
        level: "optional",
      },
    ],
    example: ".au cache @Soup",
  },
  {
    command: "privacy",
    alias: ["private", "priv", "gpdr"],
    description: [
      "AutoMuteUs privacy and data collection details. More details ",
      <a
        href="https://github.com/denverquane/automuteus/blob/master/PRIVACY.md"
        target="_blank"
      >
        here.
      </a>,
      " Providing no arguments will show this command's help.",
    ],
    arguments: [
      {
        name: "showme",
        type: "string",
        description: [
          "Shows your current cached names and data collection opt-out/in status.",
        ],
        level: "optional",
      },
      {
        name: "optin",
        type: "string",
        description: ["Opt yourself in for game stats data collection."],
        level: "optional",
      },
      {
        name: "optout",
        type: "string",
        description: ["Opt yourself out of data collection for game stats."],
        level: "optional",
      },
    ],
    example: ".au privacy showme",
  },
  {
    command: "settings",
    alias: ["sett", "set", "s"],
    description: [
      "Adjust the bot settings. See ",
      <a href="#all-settings">All Settings</a>,
      " for more details.",
    ],
    arguments: [
      {
        name: "setting",
        type: "string",
        description: ["Which setting to modify."],
        level: "required",
      },
      {
        name: "value",
        type: "string",
        description: ["What to set the mentioned setting to."],
        level: "required",
      },
      {
        name: " ",
        type: "empty",
        description: ["Provide no arguments to see available settings."],
        level: "optional",
      },
    ],
    example: ".au settings commandPrefix !",
  },
  {
    command: "premium",
    alias: ["donate", "paypal", "prem", "$"],
    description: [
      "View all the features and perks of ",
      <Link href="/premium">Premium AutoMuteUs</Link>,
      " membership.",
    ],
    arguments: [],
    example: ".au premium",
  },
  {
    command: "pause",
    alias: ["unpause", "p"],
    description:
      "Pause the bot so it doesn't automute/deafen. Will unmute/undeafen all players!",
    arguments: [],
    example: ".au pause",
  },
  {
    command: "stats",
    alias: ["stat", "st"],
    description: "View Player and Guild stats",
    arguments: [
      {
        name: "target",
        type: "string",
        description: [
          "Which entity you want stats about. Accepts either an @mention for individual users or ",
          <code>guild</code>,
          " for the whole guild.",
        ],
        values: ["@name", "guild"],
        level: "required",
      },
    ],
    example: ".au stats @Soup",
  },
  {
    command: "info",
    alias: ["info", "inf", "in", "i"],
    description:
      "View info about the bot, like total guild number, active games, etc.",
    arguments: [],
    example: ".au info",
  },
];

export const settings = [
  {
    command: "settings",
    alias: ["sett", "set", "s"],
    description: "Adjust the bot settings.",
    arguments: [
      {
        name: "setting",
        type: "string",
        description: ["Which setting to modify."],
        level: "required",
      },
      {
        name: "value",
        type: "string",
        description: ["What to set the mentioned setting to."],
        level: "required",
      },
      {
        name: " ",
        type: "empty",
        description: ["Provide no arguments to see available settings."],
        level: "optional",
      },
    ],
    example: ".au settings commandPrefix !",
  },
];
