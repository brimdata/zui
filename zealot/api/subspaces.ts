import {FetchArgs} from "../fetcher/fetcher"
import {SubspaceCreateArgs} from "../types"

export function create({name, logs, spaceId}: SubspaceCreateArgs): FetchArgs {
  return {
    method: "POST",
    path: `/space/${spaceId}/subspace`,
    body: JSON.stringify({
      name,
      open_options: {
        log_filter: logs
      }
    })
  }
}
