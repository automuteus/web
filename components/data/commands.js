import Link from "next/link";

export const commands = [
  {
    command: "help",
    alias: ["", "h"],
    description: ["Display bot help message, or see more info about a command"],
    arguments: [
      {
        name: "command",
        type: "string",
        description: ["An AutoMuteUs command to see more info about"],
        level: "optional",
      },
    ],
    example: ".au help",
    image: true,
  },
  {
    command: "new",
    alias: ["start", "n"],
    description: ["Start a new game in the current text channel"],
    arguments: [],
    example: ".au n",
    image: true,
  },
  {
    command: "end",
    alias: ["stop", "e"],
    description: ["End the current game"],
    arguments: [],
    example: ".au e",
    image: false,
  },
  {
    command: "refresh",
    alias: ["reload", "ref", "rel", "r"],
    description: [
      "Remake the bot's status message entirely, in case it ends up too far up in the chat.",
    ],
    arguments: [],
    example: ".au r",
    image: false,
  },
  {
    command: "link",
    alias: ["l"],
    description: ["Manually link a discord user to their in-game color"],
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
        description: ["A crewmate color name"],
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
    example: ".au l @Yoshirahh cyan",
    image: false,
  },
  {
    command: "unlink",
    alias: ["un", "ul", "u"],
    description: ["Manually unlink a Discord User from their in-game player."],
    arguments: [],
    example: ".au unlink @Yoshirahh",
    image: false,
  },
  {
    command: "unmuteall",
    alias: ["unmute", "ua"],
    description: ["Force the bot to unmute all linked players."],
    arguments: [],
    example: ".au unmuteall",
    image: false,
  },
  {
    command: "map",
    alias: [],
    description: [
      "Display an image of an in-game map in the text channel. Two supported versions: simple or detailed",
    ],
    arguments: [
      {
        name: "name",
        type: "string",
        description: ["Among Us map name"],
        values: ["skeld", "mira_hq", "polus"],
        level: "required",
      },
      {
        name: "detail",
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
    image: true,
  },
  {
    command: "cache",
    alias: ["c"],
    description: ["View a player's cached in-game names, and/or clear them"],
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
        description: ["Will clear the mentioned user's cached names"],
        level: "optional",
      },
    ],
    example: ".au cache @Yoshirahh",
    image: true,
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
    image: true,
  },
  {
    command: "settings",
    alias: ["sett", "set", "s"],
    description: [
      "Adjust the bot settings. See ",
      <a href="#settings-list">Settings</a>,
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
    image: true,
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
    image: true,
  },
  {
    command: "pause",
    alias: ["unpause", "p"],
    description: [
      "Pause the bot so it doesn't automute/deafen. Will unmute/undeafen all players!",
    ],
    arguments: [],
    example: ".au pause",
    image: true,
  },
  {
    command: "stats",
    alias: ["stat", "st"],
    description: ["View Player and Guild stats"],
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
    example: ".au stats @Yoshirahh",
    image: true,
  },
  {
    command: "info",
    alias: ["info", "inf", "in", "i"],
    description: [
      "View info about the bot, like total guild number, active games, etc.",
    ],
    arguments: [],
    example: ".au info",
    image: true,
  },
];

export const settings = [
  {
    command: "commandPrefix",
    alias: ["prefix", "pref", "cp"],
    description: ["Change the prefix that the bot uses to detect commands."],
    arguments: [
      {
        name: "prefix",
        type: "string",
        description: ["The desired command prefix."],
        level: "required",
      },
    ],
    example: ".au settings commandPrefix !",
    image: false,
  },
  {
    command: "language",
    alias: ["local", "lang", "l"],
    description: ["Change the bot messages language."],
    arguments: [
      {
        name: "language",
        type: "string",
        description: ["The language code to change to."],
        level: "required",
      },
      {
        name: "'reload'",
        type: "exact",
        description: ["Reloads current language settings."],
        level: "optional",
      },
    ],
    example: ".au settings language ru",
    image: false,
  },
  {
    command: "adminUserIDs",
    alias: ["admins", "admin", "auid", "aui", "a"],
    description: ["Specify which individual users have admin bot permissions."],
    arguments: [
      {
        name: "@names",
        type: "[string]",
        description: [
          "A space separated list of at least one Discord user mentions (requires the",
          <code className="ml-1">@</code>,
          ")",
        ],
        level: "required",
      },
    ],
    example: ".au settings adminUserIDs @Soup @Bob",
    image: false,
  },
  {
    command: "operatorRoles",
    alias: ["operators", "operator", "oproles", "roles", "role", "ops", "op"],
    description: ["Specify which roles have permissions to invoke the bot."],
    arguments: [
      {
        name: "@role",
        type: "string",
        description: [
          "A Discord role mention (requires the",
          <code className="ml-1">@</code>,
          ")",
        ],
        level: "required",
      },
      {
        name: "role",
        type: "string",
        description: ["A AutoMuteUs user role"],
        values: ["Admins", "Mods"],
        level: "required",
      },
    ],
    example: ".au settings operatorRoles @Bot Admins @Bot Mods",
    image: false,
  },
  {
    command: "unmuteDeadDuringTasks",
    alias: ["unmutedead", "unmute", "uddt", "ud"],
    description: [
      "Specify if the bot should immediately unmute players when they die. ",
      <strong className="text-danger">CAUTION: Leaks information!</strong>,
    ],
    arguments: [
      {
        name: "setting",
        type: "boolean",
        description: ["Whether or not dead are unmuted during tasks."],
        level: "required",
        values: ["true", "false"],
      },
    ],
    example: ".au settings unmuteDeadDuringTasks false",
    image: false,
  },
  {
    command: "delays",
    alias: ["delays", "d"],
    description: [
      "Specify the delays for automute/deafen between stages of the game, like lobby->tasks.",
    ],
    arguments: [
      {
        name: "start_phase",
        type: "string",
        description: ["Which phase triggers this delay stage."],
        level: "required",
        values: ["lobby", "tasks", "discussion", "menu", "gameover"],
      },
      {
        name: "end_phase",
        type: "string",
        description: ["Which phase ends this delay stage."],
        level: "required",
        values: ["lobby", "tasks", "discussion", "menu", "gameover"],
      },
      {
        name: "delay",
        type: "string",
        description: ["Time of delay in seconds."],
        level: "required",
      },
    ],
    example: ".au settings delays lobby tasks 5",
    image: false,
  },
  {
    command: "voiceRules",
    alias: ["voice", "vr"],
    description: [
      "Specify mute/deafen rules for the game, depending on the stage and the alive/deadness of players. Example given would mute dead players during the tasks stage.",
    ],
    arguments: [
      {
        name: "rule",
        type: "string",
        description: ["Which voice rule to modify."],
        level: "required",
        values: ["mute", "deaf"],
      },
      {
        name: "game_phase",
        type: "string",
        description: ["Which phase to invoke this voice rule in."],
        level: "required",
        values: ["lobby", "tasks", "discussion", "menu", "gameover"],
      },
      {
        name: "liveness",
        type: "string",
        description: [
          "Whether the player needs to be alive or dead for this rule.",
        ],
        level: "required",
        values: ["dead", "alive"],
      },
      {
        name: "enabled",
        type: "boolean",
        description: ["Whether this voice rule is in effect."],
        level: "required",
        values: ["true", "false"],
      },
    ],
    example: ".au settings voiceRules mute tasks dead true",
    image: false,
  },
  {
    command: "mapVersion",
    alias: ["map"],
    description: [
      "Specify the default map version (simple, detailed) used by 'map' command.",
    ],
    arguments: [
      {
        name: "version",
        type: "string",
        description: ["Which version of the map to display by default."],
        level: "required",
        values: ["simple", "detailed"],
      },
    ],
    example: ".au settings mapVersion detailed",
    image: false,
  },
  {
    command: "show",
    alias: [],
    description: ["Output a JSON of all current bot settings."],
    arguments: [],
    example: ".au settings show",
    image: false,
  },
  {
    command: "reset",
    alias: [],
    description: [
      "Reset all bot settings. ",
      <strong className="text-danger">
        CAUTION: this will take effect immediately, without confirmation.
      </strong>,
    ],
    arguments: [],
    example: ".au settings reset",
    image: false,
  },
];

export const premiumSettings = [
  {
    command: "matchSummary",
    isPremium: true,
    alias: ["matchsumm", "matchsum", "summary", "match", "summ", "sum"],
    description: [
      "Specify minutes before the match summary message is deleted. 0 for instant deletion, -1 for never delete.",
    ],
    arguments: [
      {
        name: "minutes",
        type: "number",
        description: ["How long before match summary message is deleted."],
        level: "required",
        values: ["0 (instant)", "-1 (never)", "# > 0"],
      },
    ],
    example: ".au settings matchSummary 5",
    image: false,
  },
  {
    command: "matchSummaryChannel",
    isPremium: true,
    alias: [
      "matchsummchan",
      "matchsumchan",
      "summarychannel",
      "matchchannel",
      "summchan",
      "sumchan",
    ],
    description: [
      "Specify the text channel name where Match Summaries should be posted.",
    ],
    arguments: [
      {
        name: "channel",
        type: "string",
        description: ["Text channel name."],
        level: "required",
      },
    ],
    example: ".au settings matchSummaryChannel general",
    image: false,
  },
  {
    command: "autoRefresh",
    isPremium: true,
    alias: ["refresh", "auto", "ar"],
    description: [
      "Specify if the bot should auto-refresh the status message after a match ends.",
    ],
    arguments: [
      {
        name: "setting",
        type: "boolean",
        description: [
          "Whether or not the bot auto-refreshes the status message.",
        ],
        level: "required",
        values: ["true", "false"],
      },
    ],
    example: ".au settings autoRefresh true",
    image: false,
  },
  {
    command: "leaderboardMention",
    isPremium: true,
    alias: ["lboardmention", "leadermention", "mention", "ment"],
    description: [
      "If players should be mentioned with @ on the leaderboard. ",
      <strong className="text-warning">Disable this for large servers!</strong>,
    ],
    arguments: [
      {
        name: "setting",
        type: "boolean",
        description: ["Whether players are @ mentioned on the leaderboard."],
        level: "required",
        values: ["true", "false"],
      },
    ],
    example: ".au settings leaderboardMention true",
    image: false,
  },
  {
    command: "leaderboardSize",
    isPremium: true,
    alias: ["lboardsize", "boardsize", "leadersize", "size"],
    description: ["Specify the size of the player leaderboard."],
    arguments: [
      {
        name: "size",
        type: "number",
        description: ["Size of the player leaderboard."],
        level: "required",
      },
    ],
    example: ".au settings leaderboardSize 5",
    image: false,
  },
  {
    command: "leaderboardMin",
    isPremium: true,
    alias: ["lboardmin", "boardmin", "leadermin", "min"],
    description: [
      "Minimum amount of games before a player is displayed on the leaderboard.",
    ],
    arguments: [
      {
        name: "value",
        type: "number",
        description: ["The minimum number of games required."],
        level: "required",
      },
    ],
    example: ".au settings leaderboardMin 3",
    image: false,
  },
  {
    command: "muteSpectators",
    isPremium: true,
    alias: ["mutespectator", "mutespec", "spectators", "spectator", "spec"],
    description: [
      "Whether or not the bot should treat spectators like dead players (respecting your voice rules). ",
      <strong className="text-warning">
        Note, this can cause delays or slowdowns when not self-hosting, or using
        a Premium worker bot!
      </strong>,
    ],
    arguments: [
      {
        name: "setting",
        type: "boolean",
        description: ["Whether to treat spectators like dead players."],
        level: "required",
        values: ["true", "false"],
      },
    ],
    example: ".au settings muteSpectators true",
    image: false,
  },
];
