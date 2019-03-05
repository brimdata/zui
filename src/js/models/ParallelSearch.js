/* @flow */

import type {Api, Dispatch, GetState} from "../reducers/types"
import {Handler} from "../BoomClient"

type SearchFunc = (Dispatch, GetState, Api) => Handler

export default class ParallelSearch {
  dispatch: Dispatch
  searches: SearchFunc[]
  handlers: Handler[]
  pending: number
  onDone: Function
  onError: Function
  onAbort: Function

  constructor(dispatch: Dispatch, searches: SearchFunc[]) {
    this.dispatch = dispatch
    this.searches = searches
    this.pending = searches.length
    this.handlers = []
    this.onDone = () => {}
    this.onError = () => {}
    this.onAbort = () => {}
  }

  send() {
    this.handlers = this.searches.map(this.dispatch)
    this.handlers.forEach(h => h.done(this.onEachDone).error(this.onEachError))
    return this
  }

  kill() {
    this.handlers.map(handler => handler.abortRequest())
    this.onAbort()
  }

  done(cb: Function) {
    this.onDone = cb
    return this
  }

  error(cb: Function) {
    this.onError = cb
    return this
  }

  abort(cb: Function) {
    this.onAbort = cb
    return this
  }

  onEachDone = () => {
    this.pending -= 1
    if (this.pending === 0) this.onDone()
  }

  onEachError = (e: *) => {
    this.onError(e)
  }
}
