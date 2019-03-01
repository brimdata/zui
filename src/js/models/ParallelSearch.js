/* @flow */

import {Handler} from "boom-js-client"

import type {Api, Dispatch, GetState} from "../reducers/types"

type SearchFunc = (Dispatch, GetState, Api) => Handler

export default class ParallelSearch {
  dispatch: Dispatch
  searches: SearchFunc[]
  handlers: Handler[]

  constructor(dispatch: Dispatch, searches: SearchFunc[]) {
    this.dispatch = dispatch
    this.searches = searches
    this.handlers = []
  }

  send() {
    this.handlers = this.searches.map(this.dispatch)
  }

  abortRequest() {
    this.handlers.map(handler => handler.abortRequest())
  }
}
