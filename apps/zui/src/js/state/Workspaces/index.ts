import {entitySlice} from "src/modules/every-reducer"
import {State} from "../types"

export type WorkspaceEntity = {
  path: string
  id: string
  openedAt: string
}

export default entitySlice<WorkspaceEntity>({
  name: "$workspaces",
  sort: (a, b) => (a.openedAt > b.openedAt ? -1 : 1),
  id: (t) => t.id,
  select: (state: State) => state.workspaces,
})
