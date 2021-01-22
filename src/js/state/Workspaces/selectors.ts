import {State} from "../types"

export default {
  id: (id: string) => (state: State) => state.workspaces[id],
  all: (state: State) => Object.values(state.workspaces),
  raw: (state: State) => state.workspaces
}
