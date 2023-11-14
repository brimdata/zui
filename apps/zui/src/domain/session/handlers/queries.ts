import submitSearch from "src/app/query-home/flows/submit-search"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"

export const editQuery = createHandler(({dispatch}) => {
  dispatch(Layout.showTitleForm())
})

export const updateQuery = createHandler(({select, oldApi}) => {
  const snapshot = select(Editor.getSnapshot)
  const active = select(Current.getActiveQuery)
  const id = active.query.id
  oldApi.queries.addVersion(id, snapshot)
  oldApi.queries.open(id, {history: "replace"})
})

export const runQuery = createHandler(({dispatch}) => {
  dispatch(submitSearch())
})
