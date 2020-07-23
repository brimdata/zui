import { LogsPostArgs } from "../types.ts";
import { getDefaultJsonTypeConfig } from "../config/json_types.ts";

export default {
  post({ spaceId, paths, types }: LogsPostArgs) {
    return {
      method: "POST",
      path: `/space/${encodeURIComponent(spaceId)}/log`,
      body: getBody(paths, types),
    };
  },
};

function getBody(paths: string[], types = getDefaultJsonTypeConfig()) {
  return JSON.stringify({ paths, json_type_config: types });
}
