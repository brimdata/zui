import workspace from "src/js/brim/workspace"
import {State} from "../types"

export default {
  id: (id: string) => (state: State) => workspace(state.workspaces[id]),
  all: (state: State) => Object.values(state.workspaces),
  raw: (state: State) => state.workspaces
}
