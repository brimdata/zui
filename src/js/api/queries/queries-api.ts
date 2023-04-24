import {nanoid} from "@reduxjs/toolkit"
import tabHistory from "src/app/router/tab-history"
import {lakeQueryPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {
  deleteRemoteQueries,
  isRemoteLib,
  appendRemoteQueries,
} from "src/js/state/RemoteQueries/flows/remote-queries"
import SessionHistories from "src/js/state/SessionHistories"
import Tabs from "src/js/state/Tabs"
import {AppDispatch, GetState} from "../../state/types"
import {queriesImport} from "./import"
import {CreateQueryParams, OpenQueryOptions, QueryParams} from "./types"
import {Query} from "src/js/state/Queries/types"
import RemoteQueries from "src/js/state/RemoteQueries"
import SessionQueries from "src/js/state/SessionQueries"

export class QueriesApi {
  constructor(private dispatch: AppDispatch, private getState: GetState) {}

  get allLocal() {
    return Queries.raw(this.getState()).items
  }

  import(file: File) {
    return this.dispatch(queriesImport(file))
  }

  export(groupId: string, filePath: string) {
    return global.zui.invoke("exportQueries", groupId, filePath)
  }

  find(id: string) {
    return Queries.build(this.getState(), id)
  }

  async create(params: CreateQueryParams) {
    const type = params.type ?? "local"
    const query = {id: params.id ?? nanoid(), name: params.name ?? ""}
    const versions = params.versions ?? [QueryVersions.initial()]

    if (type === "local") {
      this.dispatch(Queries.addItem(query, params.parentId))
      versions.forEach((version) => this.addVersion(query.id, version))
      return this.find(query.id)
    } else if (type === "remote") {
      const records = versions.map((version) => ({...query, ...version}))
      await this.dispatch(appendRemoteQueries(records))
      return this.find(query.id)
    }
  }

  createGroup(name: string, parentId: string) {
    const item = {name, id: nanoid(), items: []}
    this.dispatch(Queries.addItem(item, parentId))
    return item
  }

  async update(args: {id: string; changes: Partial<Query>}) {
    switch (this.getSource(args.id)) {
      case "local":
        this.dispatch(Queries.editItem(args))
        return true
      case "remote":
        var query = Queries.build(this.getState(), args.id)
        if (!query) return false
        var serialized = query.serialize()
        var version = query.latestVersion()
        var insert = {
          ...serialized,
          ...args.changes,
          ...version,
          ts: new Date().toISOString(),
        }
        await this.dispatch(appendRemoteQueries([insert]))
        return true
    }
  }

  async delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    await Promise.all(
      ids.map(async (id) => {
        this.dispatch(QueryVersions.at(id).deleteAll())
        if (this.dispatch(isRemoteLib([id]))) {
          await this.dispatch(deleteRemoteQueries([id]))
        } else {
          this.dispatch(Queries.removeItems([id]))
        }
      })
    )
  }

  rename(id: string, name: string) {
    this.update({id, changes: {name}})
  }

  addVersion(queryId: string, params: QueryVersion | QueryParams) {
    const ts = new Date().toISOString()
    const id = nanoid()
    const version = {ts, version: id, ...params}
    this.dispatch(QueryVersions.at(queryId).create(version))
    return version
  }

  getSource(id: string) {
    if (SessionQueries.find(this.getState(), id)) return "session"
    if (Queries.find(this.getState(), id)) return "local"
    if (RemoteQueries.find(this.getState(), id)) return "remote"
    return null
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
   * This is a candidate for a refactor
   *
   * TODO: This should be a command, not part of the api like this
   */
  open(id: string | QueryParams, options: Partial<OpenQueryOptions> = {}) {
    const opts = openQueryOptions(options)
    const lakeId = this.select(Current.getLakeId)
    const tab = this.select(Tabs.findFirstQuerySession)
    const tabId = tab ? tab.id : nanoid()

    let queryId: string, versionId: string
    if (typeof id === "string") {
      const q = this.select((state) => Queries.build(state, id))

      queryId = id
      versionId = opts.version || q?.latestVersionId() || "0"
    } else {
      queryId = tabId
      versionId = nanoid()
      this.addVersion(queryId, {
        ...id,
        version: versionId,
        ts: new Date().toISOString(),
      })
    }
    const url = lakeQueryPath(queryId, lakeId, versionId)
    if (tab) {
      this.dispatch(Tabs.activate(tabId))
    } else {
      this.dispatch(Tabs.create(url, tabId))
    }

    const history = this.select(Current.getHistory)
    if (history.location.pathname === url) {
      this.dispatch(tabHistory.reload())
    } else {
      if (opts.history === "replace") {
        this.dispatch(tabHistory.replace(url))
        this.dispatch(SessionHistories.replace(queryId, versionId))
      } else if (opts.history) {
        this.dispatch(tabHistory.push(url))
        this.dispatch(SessionHistories.push(queryId, versionId))
      } else {
        this.dispatch(tabHistory.push(url))
      }
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
  ...user,
})
