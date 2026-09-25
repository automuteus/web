import { createResetHandler } from "../../../../utils/server/reset-proxy";

/** POST /guild/stats/reset. Deletes every recorded game of the server. Go checks who may. */
export default createResetHandler("/guild/stats/reset");
