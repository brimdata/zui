import Queries from "../state/Queries"
import {AppDispatch, State} from "../state/types"
import {Group, Item} from "../state/Queries/types"
import QueryVersions, {
  QueryVersion,
  VersionsState,
} from "../state/QueryVersions"
import {forEach} from "lodash"

export class QueriesApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  public getGroup(groupId: string): Group {
    return Queries.getGroupById(groupId)(this.getState())
  }

  public add(lib: Item) {
    // libs are always top/root level of hierarchy
    this.dispatch(Queries.addItem(lib, "root"))
  }

  public remove(libId: string) {
    this.dispatch(Queries.removeItems([libId]))
  }
}
