import {importQueriesOp} from "src/js/electron/ops/import-queries-op"
import {Thunk} from "src/js/state/types"

export const queriesImport =
  (file: File): Thunk =>
  async (_, __, {api}) => {
    const [error, count] = await importQueriesOp.invoke(file.path)
    if (error) api.toast.error(error)
    else api.toast.success(`Imported ${count} queries`)
  }
