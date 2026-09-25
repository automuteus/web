import { createAPIReadHandler } from "../../../utils/server/api-proxy";
import { parseMatchSummary } from "../../../components/stats/match-summary";

/** Forwards GET /guild/match with the guild and match ID. The upstream document is validated and trimmed to the
 * fields the match page reads; anything else is answered with 502 rather than a partial document. */
export default createAPIReadHandler("/guild/match", (body) => parseMatchSummary(body));
