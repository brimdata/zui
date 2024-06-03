import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"
import {plusOne} from "src/util/plus-one"
import {submitSearch} from "./submit-search"
import {Active} from "src/models/active"
import {create} from "src/domain/named-queries/handlers"

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
