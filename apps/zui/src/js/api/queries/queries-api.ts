import {nanoid} from "@reduxjs/toolkit"
import Queries from "src/js/state/Queries"
import {AppDispatch, GetState} from "../../state/types"
import {queriesImport} from "./import"
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

  createGroup(name: string, parentId: string) {
    const item = {name, id: nanoid(), items: []}
    this.dispatch(Queries.addItem(item, parentId))
    return item
  }

  async delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    await Promise.all(
      ids.map(async (id) => {
        this.dispatch(Queries.removeItems([id]))
      })
    )
  }
}
