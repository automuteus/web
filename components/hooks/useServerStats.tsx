import { useQuery, UseQueryResult } from "react-query";
import * as api from "../../utils/api";
import { ServerStats } from "../../utils/interfaces";

const useServerStats = (): UseQueryResult<ServerStats, unknown> => {
  return useQuery<ServerStats, unknown>(
    "amus_server_stats",
    api.getServerStats
  );
};

export default useServerStats;
