// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import React from "react";

export interface PrismaGuilds {
  active: boolean;
  guilds: Guild;
  permissions: string;
  user_id: number;
}

export interface Guild {
  name: string;
  icon: string | null;
  premium: number;
  txn_time_unix: number | null;
  guild_id: string;
  last_updated: Date | null;
}

export interface ServerStats {
  activeConnections: number;
  activeGames: number;
  commit: string;
  totalGames: number;
  totalGuilds: number;
  totalUsers: number;
  version: string;
}

export interface Command {
  command: string;
  alias: Array<string>;
  description: Array<string | React.ReactFragment>;
  arguments: Array<CommandArg>;
  example: string;
  image: boolean;
  isPremium?: boolean;
}

export interface CommandArg {
  name: string;
  type: string;
  description: Array<string | React.ReactFragment>;
  values?: Array<any>;
  level: "required" | "optional";
}
