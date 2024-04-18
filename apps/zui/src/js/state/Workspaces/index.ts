import {createEntitySlice} from "src/modules/every-reducer/entity"
import {State} from "../types"

export type WorkspaceEntity = {
  path: string
  id: string
  name: string
  openedAt: string
}

export default createEntitySlice<WorkspaceEntity>({
  name: "$workspaces",
  sort: (a, b) => (a.openedAt > b.openedAt ? -1 : 1),
  select: (state: State) => state.workspaces,
  id: (t) => t.id,
})
