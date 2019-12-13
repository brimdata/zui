/* @flow */
import type {DateTuple} from "../lib/TimeWindow"
import type {Descriptors} from "../types"
import type {RecordData} from "../types/records"
import type {SearchStats, SearchStatus} from "../state/searches/types"
import randomHash from "./randomHash"

type EventNames =
  | "chunk"
  | "stats"
  | "status"
  | "end"
  | "start"
  | "error"
  | number

export default function search(
  program: string,
  span: DateTuple,
  space: string
) {
  let callbacks = new Map<EventNames, Function>()
  let id = randomHash()

  return {
    program,
    span,
    space,
    getId() {
      return id
    },
    id(newId: string) {
      id = newId
      return this
    },
    chan(num: number, func: (RecordData[], Descriptors) => void) {
      callbacks.set(num, func)
      return this
    },
    chunk(func: (RecordData[], Descriptors) => void) {
      callbacks.set("chunk", func)
      return this
    },
    stats(func: (SearchStats) => void) {
      callbacks.set("stats", func)
      return this
    },
    status(func: (SearchStatus) => void) {
      callbacks.set("status", func)
      return this
    },
    end(func: (number) => void) {
      callbacks.set("end", func)
      return this
    },
    start(func: (number) => void) {
      callbacks.set("start", func)
      return this
    },
    error(func: (string) => void) {
      callbacks.set("error", func)
      return this
    },
    emit(event: EventNames, ...data: *) {
      let func = callbacks.get(event)
      if (func) func(...data)
      return this
    }
  }
}
