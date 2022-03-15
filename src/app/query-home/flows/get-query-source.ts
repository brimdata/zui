import Queries from "src/js/state/Queries"
import RemoteQueries from "src/js/state/RemoteQueries"

export type QuerySource = "local" | "remote" | "draft"
export const getQuerySource = (id?: string) => (_d, getState): QuerySource => {
  if (Queries.getQueryById(id)(getState())) return "local"
  if (RemoteQueries.getQueryById(id)(getState())) return "remote"
  return "draft"
}
