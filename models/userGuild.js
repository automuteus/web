export default class UserGuild {
  constructor(user_id, guild_id) {
    if (user_id) {
      this.user_id = user_id;
    }
    if (guild_id) {
      this.guild_id = guild_id;
    }
  }
}

export const UserGuildSchema = {
  name: "UserGuild",
  target: UserGuild,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    guild_id: {
      type: "int",
    },
    active: {
      type: "boolean",
    },
    permissions: {
      type: "varchar",
    },
  },
};
