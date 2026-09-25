import { createResetHandler } from "../../../../utils/server/reset-proxy";

/** POST /guild/user/reset. Removes one player from the server's recorded games. Go checks who may. */
export default createResetHandler("/guild/user/reset");
