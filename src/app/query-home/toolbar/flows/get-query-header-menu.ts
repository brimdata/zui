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
    const query = Current.getQuery(state)
    const querySource = dispatch(getQuerySource(query?.id))
    const lakeId = Current.getLakeId(state)

    return [
      {
        label: query.isReadOnly ? "Unlock Query" : "Lock Query",
        click: () => {
          const q: Query = {
            ...query.serialize(),
            isReadOnly: !query.isReadOnly,
          }
          if (querySource === "local") {
            dispatch(Queries.editItem(q, query.id))
          } else {
            dispatch(setRemoteQueries([{...q, ...query.latestVersion()}]))
          }
        },
      },
      {
        label: `Move to ${querySource === "local" ? "Remote" : "Local"}`,
        enabled: !query.isReadOnly,
        click: () => {
          if (querySource === "local") {
            const q = query.serialize()
            const queriesCopy = query.versions.map((v) => ({...q, ...v}))
            dispatch(setRemoteQueries(queriesCopy))
            dispatch(Queries.removeItems([query.id]))
          } else {
            dispatch(Queries.addItem(query.serialize(), "root"))
            dispatch(deleteRemoteQueries([query.id]))
          }
        },
      },
      {
        label: `Copy to ${querySource === "local" ? "Remote" : "Local"}`,
        click: () => {
          try {
            const q = {...query.serialize(), id: nanoid()}
            const versionsCopy = query.versions.map((v) => ({
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
        enabled: !query.isReadOnly,
        click: () => handleRename(),
      },
      {
        label: "Duplicate",
        click: () => {
          const q = {
            ...query.serialize(),
            id: nanoid(),
            name: query.name + " (copy)",
          }
          const versionsCopy = query.versions.map((v) => ({
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
        enabled: !query.isReadOnly,
        click: () => {
          dispatch(QueryVersions.at(query.id).deleteAll())
          if (querySource === "local") dispatch(Queries.removeItems([query.id]))
          else dispatch(deleteRemoteQueries([query.id]))
        },
      },
    ]
  }

export default getQueryHeaderMenu
