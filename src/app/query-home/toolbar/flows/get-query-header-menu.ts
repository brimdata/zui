import Queries from "../../../../js/state/Queries"
import {setRemoteQueries} from "../../../features/sidebar/flows/remote-queries"
import {refreshRemoteQueries} from "../../../../js/components/LeftPane/remote-queries"
import {nanoid} from "@reduxjs/toolkit"
import {toast} from "react-hot-toast"
import Tabs from "../../../../js/state/Tabs"
import {lakeQueryPath} from "../../../router/utils/paths"
import Current from "src/js/state/Current"
import {getQuerySource} from "../../flows/get-query-source"

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
          query.toggleLock()
          if (querySource === "local") {
            dispatch(Queries.editItem(query.serialize(), query.id))
          } else {
            dispatch(setRemoteQueries([query.serialize()]))
          }
        },
      },
      {
        label: `Move to ${querySource === "local" ? "Remote" : "Local"}`,
        enabled: !query.isReadOnly,
        click: () => {
          if (querySource === "local") {
            dispatch(setRemoteQueries([query.serialize()])).then(() => {
              dispatch(refreshRemoteQueries())
            })
            dispatch(Queries.removeItems([query.id]))
          } else {
            dispatch(Queries.addItem(query.serialize(), "root"))
            dispatch(setRemoteQueries([query.serialize()], true))
          }
        },
      },
      {
        label: `Copy to ${querySource === "local" ? "Remote" : "Local"}`,
        click: () => {
          try {
            const queryCopy = query.serialize()
            queryCopy.id = nanoid()
            if (querySource === "local") {
              dispatch(setRemoteQueries([queryCopy]))
            } else {
              dispatch(Queries.addItem(queryCopy, "root"))
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
          const dupeQ = query.serialize()
          dupeQ.id = nanoid()
          dupeQ.name += " (copy)"
          if (querySource === "local") {
            dispatch(Queries.addItem(dupeQ, "root"))
            dispatch(Tabs.new(lakeQueryPath(dupeQ.id, lakeId)))
          }
          if (querySource === "remote") {
            dispatch(setRemoteQueries([dupeQ])).then(() => {
              dispatch(Tabs.new(lakeQueryPath(dupeQ.id, lakeId)))
            })
          }
        },
      },
      {
        label: "Delete",
        enabled: !query.isReadOnly,
        click: () => {
          if (querySource === "local")
            return dispatch(Queries.removeItems([query.id]))
          if (querySource === "remote")
            return dispatch(setRemoteQueries([query.serialize()], true))
        },
      },
    ]
  }

export default getQueryHeaderMenu
