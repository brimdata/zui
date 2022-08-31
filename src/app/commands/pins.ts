import Editor from "src/js/state/Editor"
import Pools from "src/js/state/Pools"
import {createCommand} from "./command"

export const createTimeRange = createCommand(
  {id: "pins.createTimeRange"},
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
