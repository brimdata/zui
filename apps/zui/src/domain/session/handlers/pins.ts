import * as zed from "@brimdata/zed-js"
import {DateTuple} from "src/js/lib/TimeWindow"
import Editor from "src/js/state/Editor"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import Pools from "src/js/state/Pools"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import {submitSearch} from "src/domain/session/handlers"
import {createHandler} from "src/core/handlers"
import ZuiApi from "src/js/api/zui-api"
import Selection from "src/js/state/Selection"
import {Session} from "src/models/session"
import {Active} from "src/models/active"

export const createPinFromEditor = createHandler(
  "session.createPinFromEditor",
  ({dispatch, oldApi}) => {
    if (oldApi.editor.value.trim() === "") return
    dispatch(Editor.pinValue())
    submitSearch()
  }
)

export const createPin = createHandler(
  "session.createPin",
  ({dispatch, oldApi}) => {
    dispatch(Editor.addPin({type: "generic", value: ""}))
    dispatch(Editor.editPin(oldApi.editor.pins.length - 1))
  }
)

export const createFromPin = createHandler(
  "session.createFromPin",
  ({dispatch, oldApi}, value = "") => {
    dispatch(Editor.addPin({type: "from", value}))
    if (value.length === 0) {
      dispatch(Editor.editPin(oldApi.editor.pins.length - 1))
    } else {
      submitSearch()
    }
  }
)

export const setFromPin = createHandler(
  "session.setFromPin",
  ({dispatch}, value: string) => {
    Session.activateLastFocused()
    dispatch(Editor.setFrom(value))
    Active.querySession.navigate(Active.editorState)
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

async function defaultRange(oldApi: ZuiApi): Promise<DateTuple> {
  const range = await oldApi.dispatch(
    Pools.getTimeRange(oldApi.current.poolName)
  )
  const now = new Date()
  const from = (range && range[0]) || defaultFrom(now)
  const to = (range && range[1]) || defaultTo(now)
  return [from, to]
}

export const createTimeRangePin = createHandler(
  "session.createTimeRangePin",
  async ({dispatch, oldApi, select}) => {
    const pins = select(Editor.getPins)
    const [from, to] = await defaultRange(oldApi)
    const poolId = select(Current.getPoolFromQuery)?.id
    const {timeField} = select((s) => PoolSettings.findWithDefaults(s, poolId))
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

function currentRange(oldApi: ZuiApi) {
  const pin = oldApi.editor.pins.find(
    (p) => p.type === "time-range"
  ) as TimeRangeQueryPin
  if (pin) return [new Date(pin.from), new Date(pin.to)] as const
  else return null
}

export const setTimeRangeFrom = createHandler(
  "session.setTimeRangeFrom",
  async ({oldApi, select}) => {
    const value = select(Selection.getValue)
    if (!(value instanceof zed.Time)) return
    const current = currentRange(oldApi)
    const defaults = await defaultRange(oldApi)
    const from = value.toDate()
    const to = current ? current[1] : defaults[1]
    oldApi.dispatch(Editor.setTimeRange({from, to}))
    submitSearch()
  }
)

export const setTimeRangeTo = createHandler(
  "session.setTimeRangeTo",
  async ({oldApi, select}) => {
    const value = select(Selection.getValue)
    if (!(value instanceof zed.Time)) return
    const current = currentRange(oldApi)
    const defaults = await defaultRange(oldApi)
    const from = current ? current[0] : defaults[0]
    const to = value.toDate()
    oldApi.dispatch(Editor.setTimeRange({from, to}))
    submitSearch()
  }
)

export const disablePin = createHandler(({dispatch}, index: number) => {
  dispatch(Editor.disablePin(index))
  submitSearch()
})

export const disableOthers = createHandler(({dispatch}, index: number) => {
  dispatch(Editor.disableOtherPins(index))
  submitSearch()
})

export const enablePin = createHandler(({dispatch}, index: number) => {
  dispatch(Editor.enablePin(index))
  submitSearch()
})

export const enableOthers = createHandler(({dispatch}, index: number) => {
  dispatch(Editor.enableOtherPins(index))
  submitSearch()
})

export const deletePin = createHandler(({dispatch}, index: number) => {
  dispatch(Editor.deletePin(index))
  submitSearch()
})

export const deleteToTheRight = createHandler(({dispatch}, index: number) => {
  dispatch(Editor.deletePinsToTheRight(index))
  submitSearch()
})

export const deleteAll = createHandler(({dispatch}) => {
  dispatch(Editor.deleteAllPins())
  submitSearch()
})
