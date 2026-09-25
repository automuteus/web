import { createAPIReadHandler } from "../../../utils/server/api-proxy";
import { parseUserStats } from "../../../components/stats/user-stats";

/** Forwards GET /guild/user with the guild and user ID. The upstream document is validated and trimmed to the
 * fields the player page reads; anything else is answered with 502 rather than a partial document. */
export default createAPIReadHandler("/guild/user", (body) => parseUserStats(body));
