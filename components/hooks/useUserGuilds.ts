import { useQuery, UseQueryResult } from "react-query";
import { Session } from "next-auth";

import * as AMUS from "../../utils/interfaces";
import * as api from "../../utils/api";

const useUserGuilds = (
  session: Session
): UseQueryResult<AMUS.PrismaGuilds[], unknown> => {
  const uid = session.user["id"] as string;
  const guildQuery = useQuery<Array<AMUS.PrismaGuilds>>(
    ["userGuilds", { user_id: session.user.id }],
    () => api.listUserGuilds(uid)
  );
  return guildQuery;
};

export default useUserGuilds;
