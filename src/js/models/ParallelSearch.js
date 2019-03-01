/* @flow */

import {Handler} from "boom-js-client"

import type {Api, Dispatch, GetState} from "../reducers/types"

type SearchFunc = (Dispatch, GetState, Api) => Handler

export default class ParallelSearch {
  dispatch: Dispatch
  searches: SearchFunc[]
  handlers: Handler[]
  pending: number
  onDone: Function
  onError: Function

  constructor(dispatch: Dispatch, searches: SearchFunc[]) {
    this.dispatch = dispatch
    this.searches = searches
    this.pending = searches.length
    this.handlers = []
    this.onDone = () => {}
    this.onError = () => {}
  }

  send() {
    this.handlers = this.searches.map(this.dispatch)
    this.handlers.forEach(h => h.done(this.onEachDone).error(this.onEachError))
    return this
  }

  abort() {
    this.handlers.map(handler => handler.abortRequest())
  }

  done(cb: Function) {
    this.onDone = cb
    return this
  }

  error(cb: Function) {
    this.onError = cb
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
