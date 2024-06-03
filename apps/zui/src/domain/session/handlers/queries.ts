import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {Marker} from "src/js/state/Editor/types"
import Layout from "src/js/state/Layout"
import {plusOne} from "src/util/plus-one"
import {submitSearch} from "./submit-search"
import {Active} from "src/models/active"
import {create} from "src/domain/named-queries/handlers"
import {QueryModel, SourceSet} from "src/js/models/query-model"

export const editQuery = createHandler("session.editQuery", ({dispatch}) => {
  dispatch(Layout.showTitleForm())
})

export const runQuery = createHandler("session.runQuery", () => {
  submitSearch()
})

export const saveAsNewQuery = createHandler(
  "session.saveAsNewQuery",
  async ({select, dispatch}) => {
    const name = select(Current.getActiveQuery).name()
    const newName = plusOne(name)
    await create(newName)
    setTimeout(() => {
      dispatch(Layout.showTitleForm())
    })
  }
)

export const resetQuery = createHandler("session.resetQuery", () => {
  const {session} = Active
  session.navigate(session.snapshot)
})

export const fetchQueryInfo = createHandler(
  ({invoke}, query: string, pool?: string) =>
    invoke("editor.describe", query, pool)
)

export const validateQuery = createHandler(
  "session.validateQuery",
  async ({invoke, select, dispatch}, signal?: AbortSignal) => {
    // 1. get the current query along with associated pins.
    const set = QueryModel.versionToSourceSet(select(Editor.getSnapshot))
    const res = await invoke("editor.describe", set.contents)
    if (signal.aborted) {
      console.log("was aborted", res)
      return
    }
    let errors = res?.error?.info
    // If we do not have sourced errors just ignore error for now. This will
    // get caught when the query is ran.
    let errs = [] as Marker[]
    if (errors) {
      errs = errors.map((err: any) => formatError(set, err))
    }
    console.log("setMarkers", errs)
    dispatch(Editor.setMarkers(errs))
  }
)

const formatError = (set: SourceSet, error: any): Marker => {
  const s = set.sourceOf(error.pos)
  const start = s.position(error.pos)
  let end = {lineNumber:start.lineNumber, column: start.column+1}
  if (error.end >= 0) {
    end = s.position(error.end)
  }
  return {
    message: error.error,
    startLineNumber: start.lineNumber,
    startColumn: start.column,
    endLineNumber: end.lineNumber,
    endColumn: end.column,
  } as Marker
}
