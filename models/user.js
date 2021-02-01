export default class User {
  constructor(name, email, image, accessToken) {
    if (name) {
      this.name = name;
    }
    if (email) {
      this.email = email;
    }
    if (image) {
      this.image = image;
    }
    if (accessToken) {
      this.accessToken = accessToken;
    }
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: true,
    },
    accessToken: {
      type: "varchar",
      nullable: true,
    },
    image: {
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
