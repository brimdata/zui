import Queries from "../../../../js/state/Queries"
import {
  deleteRemoteQueries,
  setRemoteQueries,
} from "src/js/state/RemoteQueries/flows/remote-queries"
import {nanoid} from "@reduxjs/toolkit"
import {toast} from "react-hot-toast"
import {lakeQueryPath} from "../../../router/utils/paths"
import Tabs from "src/js/state/Tabs"
import Current from "src/js/state/Current"
import {Query} from "src/js/state/Queries/types"
import {getQuerySource} from "src/js/state/Queries/flows/get-query-source"
import QueryVersions from "src/js/state/QueryVersions"
import {last} from "lodash"

const getQueryHeaderMenu =
  ({handleRename}: {handleRename: () => void}) =>
  (dispatch, getState) => {
    const state = getState()
    const active = Current.getActiveQuery(state)
    const querySource = dispatch(getQuerySource(active.id()))
    const lakeId = Current.getLakeId(state)

    return [
      {
        enabled: active.isSaved(),
        label: active.isReadOnly() ? "Unlock Query" : "Lock Query",
        click: () => {
          const updates: Query = {
            ...active.query.serialize(),
            isReadOnly: !active.isReadOnly(),
          }
          if (querySource === "local") {
            dispatch(Queries.editItem(updates, active.id()))
          } else {
            dispatch(
              setRemoteQueries([{...updates, ...active.query.latestVersion()}])
            )
          }
        },
      },
      {
        label: `Move to ${querySource === "local" ? "Remote" : "Local"}`,
        enabled: active.isSaved() && !active.isReadOnly(),
        click: () => {
          if (querySource === "local") {
            const q = active.query.serialize()
            const queriesCopy = active.query.versions.map((v) => ({...q, ...v}))
            dispatch(setRemoteQueries(queriesCopy))
            dispatch(Queries.removeItems([active.id()]))
          } else {
            dispatch(Queries.addItem(active.query.serialize(), "root"))
            dispatch(deleteRemoteQueries([active.id()]))
          }
        },
      },
      {
        label: `Copy to ${querySource === "local" ? "Remote" : "Local"}`,
        click: () => {
          try {
            const q = {...active.query.serialize(), id: nanoid()}
            const versionsCopy = active.query.versions.map((v) => ({
              ...v,
              version: nanoid(),
            }))
            if (querySource === "local") {
              const queriesCopy = versionsCopy.map((v) => ({...q, ...v}))
              dispatch(setRemoteQueries(queriesCopy))
            } else {
              dispatch(Queries.addItem(q, "root"))
              dispatch(QueryVersions.at(q.id).sync(versionsCopy))
            }
            toast.success("Query Copied")
          } catch (e) {
            toast.error(`Copy Failed: ${e}`)
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
        click: () => {
          const q = {
            ...active.query.serialize(),
            id: nanoid(),
            name: active.name + " (copy)",
          }
          const versionsCopy = active.query.versions.map((v) => ({
            ...v,
            version: nanoid(),
          }))
          if (querySource === "local") {
            dispatch(Queries.addItem(q, "root"))
            dispatch(QueryVersions.at(q.id).sync(versionsCopy))
            dispatch(
              Tabs.create(
                lakeQueryPath(q.id, lakeId, last(versionsCopy).version)
              )
            )
          }
          if (querySource === "remote") {
            const queriesCopy = versionsCopy.map((v) => ({...q, ...v}))
            dispatch(setRemoteQueries(queriesCopy)).then(() => {
              dispatch(
                Tabs.create(
                  lakeQueryPath(q.id, lakeId, last(queriesCopy).version)
                )
              )
            })
          }
        },
      },
      {
        label: "Delete",
        enabled: !active.isReadOnly(),
        click: () => {
          dispatch(QueryVersions.at(active.id()).deleteAll())
          if (querySource === "local")
            dispatch(Queries.removeItems([active.id()]))
          else dispatch(deleteRemoteQueries([active.id()]))
        },
      },
    ]
  }

export default getQueryHeaderMenu
