import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import {plusOne} from "src/util/plus-one"
import {submitSearch} from "./submit-search"
import {ZedAst} from "src/app/core/models/zed-ast"

export const editQuery = createHandler("session.editQuery", ({dispatch}) => {
  dispatch(Layout.showTitleForm())
})

export const updateQuery = createHandler(
  "session.updateQuery",
  ({select, oldApi}) => {
    const snapshot = select(Editor.getSnapshot)
    const active = select(Current.getActiveQuery)
    const id = active.query.id
    oldApi.queries.addVersion(id, snapshot)
    oldApi.queries.open(id, {history: "replace"})
  }
)

export const runQuery = createHandler("session.runQuery", () => {
  submitSearch()
})

export const saveAsNewQuery = createHandler(
  "session.saveAsNewQuery",
  async ({select, oldApi, dispatch}) => {
    const name = select(Current.getActiveQuery).name()
    const attrs = select(Editor.getSnapshot)
    const newName = plusOne(name)
    const query = await oldApi.queries.create({
      name: newName,
      versions: [attrs],
    })
    oldApi.queries.open(query.id)
    setTimeout(() => {
      dispatch(Layout.showTitleForm())
    })
  }
)

export const resetQuery = createHandler(
  "session.resetQuery",
  ({select, oldApi}) => {
    const snapshot = select(Editor.getSnapshot)
    oldApi.queries.open(snapshot)
  }
)

const fetchAst = createHandler(async ({invoke}, string) => {
  let tree
  try {
    tree = await invoke("editor.parse", string)
  } catch (error) {
    tree = error
  }
  return tree
})

export const fetchQueryInfo = createHandler(async (_, query: string) => {
  const tree = await fetchAst(query)
  const ast = new ZedAst(tree, tree.error)
  return {
    isSummarized: ast.isSummarized,
    poolName: ast.poolName,
    sorts: ast.sorts,
    error: ast.error,
    groupByKeys: ast.groupByKeys,
  }
})
