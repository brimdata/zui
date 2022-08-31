import {endOfDay, startOfDay} from "date-fns"
import Editor from "src/js/state/Editor"
import Pools from "src/js/state/Pools"
import {createCommand} from "./command"

export const createTimeRange = createCommand(
  {id: "pins.createTimeRange"},
  async ({dispatch, api, getState}) => {
    const pins = Editor.getPins(getState())
    const range = await dispatch(Pools.getTimeRange(api.current.poolName))
    const from = (range && range[0]) || endOfDay(new Date())
    const to = (range && range[1]) || startOfDay(new Date())
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
