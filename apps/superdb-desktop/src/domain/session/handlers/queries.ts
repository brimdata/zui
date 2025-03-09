import {createHandler} from "src/core/handlers"
import Layout from "src/js/state/Layout"
import {submitSearch} from "./submit-search"

export const editQuery = createHandler("session.editQuery", ({dispatch}) => {
  dispatch(Layout.showTitleForm())
})

export const runQuery = createHandler("session.runQuery", () => {
  submitSearch()
})

export const fetchQueryInfo = createHandler(
  ({invoke}, query: string, pool?: string) =>
    invoke("editor.describe", query, pool)
)
