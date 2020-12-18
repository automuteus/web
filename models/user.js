import Adapters from "next-auth/adapters";

// Extend the built-in models using class inheritance
export default class User extends Adapters.TypeORM.Models.User.model {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(name, email, image, emailVerified, accessToken) {
    super(name, email, image, emailVerified);
    if (accessToken) {
      this.accessToken = accessToken;
    }
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    accessToken: {
      type: "varchar",
      nullable: true,
    },
  },
};
