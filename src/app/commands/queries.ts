import {nanoid} from "@reduxjs/toolkit"
import {QuerySource} from "src/js/api/queries/types"
import Appearance from "src/js/state/Appearance"
import {QueriesView} from "src/js/state/Appearance/types"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import {createCommand} from "./command"

export const save = createCommand(
  "queries.save",
  async ({api, getState}, name: string) => {
    const attrs = Editor.getSnapshot(getState())
    const query = await api.queries.create({name, versions: [attrs]})
    api.queries.open(query.id)
  }
)

export const lock = createCommand("queries.lock", ({api, getState}) => {
  const active = Current.getActiveQuery(getState())
  if (!active) return
  return api.queries.update({
    id: active.id(),
    changes: {isReadOnly: true},
  })
})

export const unlock = createCommand("queries.lock", ({api, getState}) => {
  const active = Current.getActiveQuery(getState())
  if (!active) return
  return api.queries.update({
    id: active.id(),
    changes: {isReadOnly: false},
  })
})

export const moveToSource = createCommand(
  "queries.moveToSource",
  async ({api, getState, dispatch}, type: QuerySource) => {
    const active = Current.getActiveQuery(getState())
    if (!active) return
    const query = active.query
    await api.queries.delete(query.id)
    await api.queries.create({
      ...query.serialize(),
      type,
      versions: query.versions,
    })
    dispatch(Appearance.setCurrentSectionName("queries"))
    dispatch(Appearance.setQueriesView(type as QueriesView))
    api.queries.open(query.id)
  }
)

export const copyToSource = createCommand(
  "queries.copyToSource",
  async ({api, getState, dispatch}, type: QueriesView) => {
    const active = Current.getActiveQuery(getState())
    if (!active) return
    try {
      const query = active.query
      const newQuery = await api.queries.create({
        ...query.serialize(),
        id: nanoid(),
        type,
        versions: query.versions,
      })
      dispatch(Appearance.setQueriesView(type))
      api.queries.open(newQuery.id)
      api.toast.success("Query Copied")
    } catch (e) {
      api.toast.error(`Copy Failed: ${e}`)
    }
  }
)

export const duplicate = createCommand(
  "queries.duplicate",
  async ({api, getState}) => {
    const active = Current.getActiveQuery(getState())
    if (!active) return
    const query = active.query
    const dup = await api.queries.create({
      ...query.serialize(),
      id: nanoid(),
      name: query.name + " (copy)",
      versions: query.versions.map((v) => ({...v, version: nanoid()})),
      type: api.queries.getSource(query.id),
    })
    api.queries.open(dup.id)
  }
)

export const deleteCmd = createCommand(
  "queries.delete",
  async ({api, getState}) => {
    const active = Current.getActiveQuery(getState())
    if (!active) return
    await api.queries.delete(active.id())
  }
)

export const rename = createCommand("queries.rename", ({dispatch}) => {
  dispatch(Layout.showTitleForm("update"))
})

export const openLatestVersion = createCommand(
  "queries.openLatestVersion",
  ({api, getState}) => {
    const active = Current.getActiveQuery(getState())
    if (!active) return
    api.queries.open(active.query.id)
  }
)
