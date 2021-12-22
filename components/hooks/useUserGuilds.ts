import { useQuery, UseQueryResult } from "react-query";
import { Session } from "next-auth";

import * as AMUS from "../../utils/interfaces";
import * as api from "../../utils/api";

const useUserGuilds = (
  session: Session
): UseQueryResult<AMUS.Guild[], unknown> | false => {
  if (session.user) {
    const uid: string = session.userId as string;
    const guildQuery = useQuery<Array<AMUS.Guild>>(
      ["userGuilds", { user_id: uid }],
      () => api.listUserGuilds(uid)
    );
    return guildQuery;
  } else {
    return false;
  }
};

export default useUserGuilds;
