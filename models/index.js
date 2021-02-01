// To make importing them easier, you can export all models from single file
import User, { UserSchema } from "./user"
import Guild, { GuildSchema } from "./guild"
import UserGuild, { UserGuildSchema } from "./userGuild"

export default {
  User: {
    model: User,
    schema: UserSchema,
  },
  Guild: {
    model: Guild,
    schema: GuildSchema,
  },
  UserGuild: {
    model: UserGuild,
    schema: UserGuildSchema,
  },
}