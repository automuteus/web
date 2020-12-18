export default class Guild {
  constructor(gid, name, icon) {
    if (gid) {
      this.gid = gid;
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
    gid: {
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
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
};
