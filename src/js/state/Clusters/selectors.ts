

import { State } from "../types";

export default {
  id: (id: string) => (state: State) => state.clusters[id],
  all: (state: State) => Object.values(state.clusters),
  raw: (state: State) => state.clusters
};