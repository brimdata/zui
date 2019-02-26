/* @flow */

import statsReceiver from "../receivers/statsReceiver"
import {completeMainSearch, requestMainSearch} from "../actions/mainSearch"
import type {DateTuple} from "../lib/TimeWindow"
import Client, {Handler} from "boom-js-client"
import {addNotification} from "../actions/notifications"
import ErrorFactory from "./ErrorFactory"

type Options = {
  space: string,
  program: string,
  timeWindow: DateTuple,
  callbacks: (request: Handler) => void
}

export default class Search {
  dispatch: Function
  api: Client
  options: Options

  constructor(dispatch: Function, api: Client, options: Options) {
    this.dispatch = dispatch
    this.api = api
    this.options = options
  }

  send() {
    this.dispatch(requestMainSearch())
    const {space, program, timeWindow, callbacks} = this.options
    this.api.setOptions({
      searchSpan: timeWindow,
      searchSpace: space
    })

    const request = this.api.search(program)
    callbacks(request)
    return request
      .each(statsReceiver(this.dispatch))
      .done(() => this.dispatch(completeMainSearch()))
      .error(error => {
        const context = {space, program, timeWindow}
        this.dispatch(completeMainSearch())
        this.dispatch(addNotification(ErrorFactory.create(error, context)))
      })
  }
}
