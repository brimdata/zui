import Editor from "src/js/state/Editor"
import Pools from "src/js/state/Pools"
import submitSearch from "../query-home/flows/submit-search"
import {createCommand} from "./command"

export const createFromEditor = createCommand(
  "pins.createFromEditor",
  ({dispatch, api}) => {
    if (api.editor.value.trim() === "") return
    dispatch(Editor.pinValue())
    dispatch(submitSearch())
  }
)

export const createGeneric = createCommand(
  "pins.createGeneric",
  ({dispatch, api}) => {
    dispatch(Editor.addPin({type: "generic", value: ""}))
    dispatch(Editor.editPin(api.editor.pins.length - 1))
  }
)

export const createFrom = createCommand(
  "pins.createFrom",
  ({dispatch, api}) => {
    dispatch(Editor.addPin({type: "from", value: ""}))
    dispatch(Editor.editPin(api.editor.pins.length - 1))
  }
)

export const createTimeRange = createCommand(
  "pins.createTimeRange",
  async ({dispatch, api, getState}) => {
    const pins = Editor.getPins(getState())
    const range = await dispatch(Pools.getTimeRange(api.current.poolName))
    const now = new Date()
    const defaultFrom = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    )
    const defaultTo = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
    )
    const from = (range && range[0]) || defaultFrom
    const to = (range && range[1]) || defaultTo
    dispatch(
      Editor.addPin({
        type: "time-range",
        field: "ts",
        from: from.toISOString(),
        to: to.toISOString(),
      })
    )
    dispatch(Editor.editPin(pins.length))
  }
)
