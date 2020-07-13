import { LogsPostArgs } from "../types.ts";

export default {
  post({ spaceId, paths, types }: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log`,
      body: JSON.stringify({ paths }),
    };
  },
};
