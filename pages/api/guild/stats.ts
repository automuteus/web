import { createAPIReadHandler } from "../../../utils/server/api-proxy";
import { parseGuildStats } from "../../../components/stats/guild-stats";

/** Forwards GET /guild/stats. The upstream document is validated and trimmed to the fields the stats page
 * reads; anything else is answered with 502 rather than a partial document. */
export default createAPIReadHandler("/guild/stats", (body) => parseGuildStats(body));
