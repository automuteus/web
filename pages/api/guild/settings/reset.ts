import { createResetHandler } from "../../../../utils/server/reset-proxy";

/** POST /guild/settings/reset. Puts the server's settings back to their defaults. Go checks who may. */
export default createResetHandler("/guild/settings/reset");
