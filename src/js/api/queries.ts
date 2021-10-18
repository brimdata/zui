import Queries from "../state/Queries"
import {AppDispatch, State} from "../state/types"
import {Group} from "../state/Queries/types"

export class QueriesApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  public get(name: string): Group {
    return Queries.getGroupById(name)(this.getState())
  }

  public add(lib: Group) {
    // libs are always top/root level of hierarchy
    this.dispatch(Queries.addItem(lib, "root"))
  }

  public remove(libId: string) {
    this.dispatch(Queries.removeItems([libId]))
  }
}
