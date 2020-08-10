import { FetchArgs } from "../fetcher/fetcher.ts";
import { SubspaceCreateArgs } from "../types.ts";

export function create({ name, logs, spaceId }: SubspaceCreateArgs): FetchArgs {
  return {
    method: "POST",
    path: `/space/${spaceId}/subspace`,
    body: JSON.stringify({
      name,
      open_options: {
        log_filter: logs,
      },
    }),
  };
}
