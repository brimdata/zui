import * as zed from "@brimdata/zed-js"
import ZuiApi from "src/js/api/zui-api"
import {DateTuple} from "src/js/lib/TimeWindow"
import Editor from "src/js/state/Editor"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import Pools from "src/js/state/Pools"
import submitSearch from "../query-home/flows/submit-search"
import {createCommand} from "./command"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"

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

export const createFrom = createCommand<[value?: string]>(
  "pins.createFrom",
  ({dispatch, api}, value = "") => {
    dispatch(Editor.addPin({type: "from", value}))
    if (value.length === 0) {
      dispatch(Editor.editPin(api.editor.pins.length - 1))
    } else {
      dispatch(submitSearch())
    }
  }
)

export const updateFrom = createCommand(
  "pins.updateFrom",
  ({dispatch}, value: string) => {
    dispatch(Editor.setFrom(value))
    dispatch(submitSearch())
  }
)

function defaultFrom(now: Date) {
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  )
}

function defaultTo(now: Date) {
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
  )
}

async function defaultRange(api: ZuiApi): Promise<DateTuple> {
  const range = await api.dispatch(Pools.getTimeRange(api.current.poolName))
  const now = new Date()
  const from = (range && range[0]) || defaultFrom(now)
  const to = (range && range[1]) || defaultTo(now)
  return [from, to]
}

export const createTimeRange = createCommand(
  "pins.createTimeRange",
  async ({dispatch, api, getState}) => {
    const pins = Editor.getPins(getState())
    const [from, to] = await defaultRange(api)
    const poolId = Current.getPoolFromQuery(getState())?.id
    const {timeField} = PoolSettings.findWithDefaults(getState(), poolId)
    dispatch(
      Editor.addPin({
        type: "time-range",
        field: timeField,
        from: from.toISOString(),
        to: to.toISOString(),
      })
    )
    dispatch(Editor.editPin(pins.length))
  }
)

function currentRange(api: ZuiApi) {
  const pin = api.editor.pins.find(
    (p) => p.type === "time-range"
  ) as TimeRangeQueryPin
  if (pin) return [new Date(pin.from), new Date(pin.to)] as const
  else return null
}

export const setTimeRangeFrom = createCommand(
  "pins.setTimeRangeFrom",
  async ({api}, value: zed.Any) => {
    if (!(value instanceof zed.Time)) return
    const current = currentRange(api)
    const defaults = await defaultRange(api)
    const from = value.toDate()
    const to = current ? current[1] : defaults[1]
    api.dispatch(Editor.setTimeRange({from, to}))
    api.dispatch(submitSearch())
  }
)

export const setTimeRangeTo = createCommand(
  "pins.setTimeRangeFrom",
  async ({api}, value: zed.Any) => {
    if (!(value instanceof zed.Time)) return
    const current = currentRange(api)
    const defaults = await defaultRange(api)
    const from = current ? current[0] : defaults[0]
    const to = value.toDate()
    api.dispatch(Editor.setTimeRange({from, to}))
    api.dispatch(submitSearch())
  }
)
