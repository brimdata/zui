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

  open(id: string, options: Partial<OpenQueryOptions> = {}) {
    const opts = openQueryOptions(options)
    const lakeId = Current.getLakeId(this.getState())
    const query = Current.getQueryById(id)(this.getState())
    const version = opts.version || query.latestVersionId()
    const url = lakeQueryPath(id, lakeId, version)

    this.dispatch(Tabs.activateQuerySession(url))
    if (opts.history) {
      this.dispatch(SessionHistories.push(id, version))
    }
  }
}

const openQueryOptions = (
  user: Partial<OpenQueryOptions>
): OpenQueryOptions => ({
  history: true,
  version: null,
  ...user,
})
