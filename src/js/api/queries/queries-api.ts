import tabHistory from "src/app/router/tab-history"
import {lakeQueryPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Queries from "src/js/state/Queries"
import {updateQuery} from "src/js/state/Queries/flows/update-query"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import SessionHistories from "src/js/state/SessionHistories"
import Tabs from "src/js/state/Tabs"
import {JSONGroup} from "../../state/Queries/parsers"
import {AppDispatch, GetState} from "../../state/types"
import {queriesExport} from "./export"
import {queriesImport} from "./import"
import {OpenQueryOptions} from "./types"

export class QueriesApi {
  constructor(private dispatch: AppDispatch, private getState: GetState) {}

  import(file: File) {
    return this.dispatch(queriesImport(file))
  }

  export(groupId: string): JSONGroup {
    return this.dispatch(queriesExport(groupId))
  }

  create(name: string) {
    const attrs = Editor.getSnapshot(this.getState())
    return this.dispatch(Queries.create({name, ...attrs}))
  }

  rename(id: string, name: string) {
    const query = Current.getQueryById(id)(this.getState())
    if (query) {
      this.dispatch(updateQuery(query, {name}))
    } else {
      console.error("Could not find query with id: " + id)
    }
  }

  addVersion(queryId: string, version: QueryVersion) {
    return this.dispatch(QueryVersions.add({queryId, version}))
  }

  /**
   * When you open a query, find the nearest query session tab.
   * If one doesn't exist, create it. Next, check the history
   * location.pathname for that tab. If it's the same
   * as the url you are about to open, reload it. Don't push
   * to the session history or the tab history.
   *
   * If it's not the same, push that url to the tab history
   * and optionally to the session history.
   */
  open(id: string, options: Partial<OpenQueryOptions> = {}) {
    const opts = openQueryOptions(options)
    const lakeId = this.select(Current.getLakeId)
    const query = this.select(Current.getQueryById(id))
    const version = opts.version || query.latestVersionId()
    const url = lakeQueryPath(id, lakeId, version)
    const tab = this.select(Tabs.findFirstQuerySession)
    if (tab) {
      this.dispatch(Tabs.activate(tab.id))
      const history = this.select(Current.getHistory)
      if (history.location.pathname === url) {
        this.dispatch(tabHistory.reload())
      } else {
        this.dispatch(tabHistory.push(url))
        if (opts.history) this.dispatch(SessionHistories.push(id, version))
      }
    } else {
      this.dispatch(Tabs.create(url))
      if (opts.history) this.dispatch(SessionHistories.push(id, version))
    }
  }

  private select<T extends (...args: any) => any>(selector: T) {
    return selector(this.getState())
  }
}

const openQueryOptions = (
  user: Partial<OpenQueryOptions>
): OpenQueryOptions => ({
  history: true,
  version: null,
  ...user,
})
