import {nanoid} from "@reduxjs/toolkit"
import Queries from "src/js/state/Queries"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {
  deleteRemoteQueries,
  isRemoteLib,
  appendRemoteQueries,
} from "src/js/state/RemoteQueries/flows/remote-queries"
import {AppDispatch, GetState} from "../../state/types"
import {queriesImport} from "./import"
import {CreateQueryParams, QueryParams} from "./types"
import {Query} from "src/js/state/Queries/types"
import RemoteQueries from "src/js/state/RemoteQueries"
import SessionQueries from "src/js/state/SessionQueries"
import {invoke} from "src/core/invoke"

export class QueriesApi {
  constructor(private dispatch: AppDispatch, private getState: GetState) {}

  get allLocal() {
    return Queries.raw(this.getState()).items
  }

  import(file: File) {
    return this.dispatch(queriesImport(file))
  }

  export(groupId: string, filePath: string) {
    return invoke("exportQueries", groupId, filePath)
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
      versions.forEach((version) =>
        this.createEditorSnapshot(query.id, version)
      )
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

  createEditorSnapshot(queryId: string, params: QueryVersion | QueryParams) {
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
}
