/* @flow */

import type {SearchStatsPayload} from "../../services/BoomClient/types"
import type {State, Thunk} from "../types"
import {bytes} from "../../lib/fmt"
import BoomRequest from "../../services/BoomClient/lib/BoomRequest"
import brim, {type Ts} from "../../brim"

type TASKS_CREATE = {
  type: "TASKS_CREATE",
  tid: number,
  name: string,
  program: string
}

type TASKS_UPDATE = {
  type: "TASKS_UPDATE",
  tid: number,
  updates: TaskUpdates
}

type Actions = TASKS_CREATE | TASKS_UPDATE

type Task = {|
  tid: number,
  name: string,
  program: string,
  status: "running" | "success" | "error",
  startTs: Ts,
  elapsed: number,
  speed: string,
  matched: number,
  error: ?string
|}

type TaskUpdates = $Shape<Task>

let actions = {
  create: (tid: number, name: string, program: string): TASKS_CREATE => ({
    type: "TASKS_CREATE",
    tid,
    name,
    program
  }),
  update: (tid: number, updates: TaskUpdates) => ({
    type: "TASKS_UPDATE",
    tid,
    updates
  })
}

let thunks = {
  register: (name: string, program: string, handler: BoomRequest): Thunk => (
    dispatch
  ) => {
    let tid = -1
    handler.stream((payload) => {
      switch (payload.type) {
        case "TaskStart":
          tid = payload.task_id
          dispatch(actions.create(tid, name, program))
          break
        case "SearchStats":
          dispatch(actions.update(tid, updatesFromStats(payload)))
          break
        case "SearchEnd":
          dispatch(actions.update(tid, {status: "success"}))
          break
        case "TaskEnd":
          if (payload.error) {
            dispatch(
              actions.update(tid, {status: "error", error: payload.error})
            )
            break
          }
      }
    })
  }
}

function updatesFromStats(stats: SearchStatsPayload) {
  let start = brim.time(stats.start_time).toFracSec()
  let update = brim.time(stats.update_time).toFracSec()
  let elapsed = update - start
  return {
    elapsed,
    startTs: stats.start_time,
    speed: bytes(stats.bytes_read / elapsed) + "/s",
    matched: stats.records_matched
  }
}

let selectors = {
  get: (state: State) => {
    return state.tasks
  }
}

export type TasksState = {[number]: Task}

function reducer(state: TasksState = {}, action: Actions) {
  switch (action.type) {
    case "TASKS_CREATE":
      return {
        ...state,
        [action.tid]: {
          tid: action.tid,
          name: action.name,
          program: action.program,
          status: "running",
          elapsed: 0,
          speed: "0 / Bs",
          matched: 0,
          startTs: 0,
          error: null
        }
      }
    case "TASKS_UPDATE":
      var newState = {
        ...state,
        [action.tid]: {
          ...state[action.tid],
          ...action.updates
        }
      }
      return newState
    default:
      return state
  }
}

export default {
  ...actions,
  ...thunks,
  ...selectors,
  reducer
}
