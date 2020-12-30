export default class Guild {
  constructor(guild_id, name, icon) {
    if (guild_id) {
      this.guild_id = guild_id;
    }
    if (name) {
      this.name = name;
    }
    if (icon) {
      this.icon = icon;
    }
  }
}

export const GuildSchema = {
  name: "Guild",
  target: Guild,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    guild_id: {
      type: "varchar",
      nullable: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    icon: {
      type: "varchar",
      nullable: true,
    },
  },
};
