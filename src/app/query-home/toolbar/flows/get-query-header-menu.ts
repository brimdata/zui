import {nanoid} from "@reduxjs/toolkit"
import Current from "src/js/state/Current"
import {getQuerySource} from "src/js/state/Queries/flows/get-query-source"
import {Thunk} from "src/js/state/types"

const getQueryHeaderMenu =
  ({handleRename}: {handleRename: () => void}): Thunk =>
  (dispatch, getState, {api}) => {
    const state = getState()
    const active = Current.getActiveQuery(state)
    const querySource = dispatch(getQuerySource(active.id()))

    return [
      {
        enabled: active.isSaved(),
        label: active.isReadOnly() ? "Unlock Query" : "Lock Query",
        click: () => {
          api.queries.update({
            id: active.id(),
            changes: {isReadOnly: !active.isReadOnly()},
          })
        },
      },
      {
        label: `Move to ${querySource === "local" ? "Remote" : "Local"}`,
        enabled: active.isSaved() && !active.isReadOnly(),
        click: async () => {
          const query = active.query
          await api.queries.delete(query.id)
          await api.queries.create({
            type: querySource === "local" ? "remote" : "local",
            ...query.serialize(),
            versions: query.versions,
          })
        },
      },
      {
        label: `Copy to ${querySource === "local" ? "Remote" : "Local"}`,
        click: async () => {
          try {
            const query = active.query
            await api.queries.create({
              ...query.serialize(),
              type: querySource === "local" ? "remote" : "local",
              versions: query.versions,
            })
            api.toast.success("Query Copied")
          } catch (e) {
            api.toast.error(`Copy Failed: ${e}`)
          }
        },
      },
      {
        label: "Rename",
        enabled: !active.isReadOnly(),
        click: () => handleRename(),
      },
      {
        label: "Duplicate",
        click: async () => {
          const query = active.query
          const dup = await api.queries.create({
            ...query.serialize(),
            name: query.name + "( copy)",
            versions: query.versions.map((v) => ({...v, version: nanoid()})),
            type: querySource,
          })
          api.queries.open(dup.id)
        },
      },
      {
        label: "Delete",
        enabled: !active.isReadOnly(),
        click: async () => {
          await api.queries.delete(active.id())
        },
      },
    ]
  }

export default getQueryHeaderMenu
