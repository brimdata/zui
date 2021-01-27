import {combineReducers} from "redux"

import {InvestigationState} from "./Investigation/types"
import {PrefsState} from "./Prefs/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"
import Queries from "./Queries"
import {QueriesState} from "./Queries/types"
import Workspaces from "./Workspaces"
import {WorkspacesState} from "./Workspaces/types"
import Boards from "./Boards"
import {BoardsState} from "./Boards"
import Tiles, {TilesState} from "./Tiles"

export type GlobalState = {
  workspaces: WorkspacesState
  investigation: InvestigationState
  prefs: PrefsState
  queries: QueriesState
  boards: BoardsState
  tiles: TilesState
}

export default combineReducers<any, any>({
  workspaces: Workspaces.reducer,
  investigation: Investigation.reducer,
  prefs: Prefs.reducer,
  queries: Queries.reducer,
  boards: Boards.reducer,
  tiles: Tiles.reducer
})
