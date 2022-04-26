import {State} from "../types"

export default {
  id: (id: string) => (state: State) => state.lakes[id],
  all: (state: State) => Object.values(state.lakes),
  raw: (state: State) => state.lakes,
}
