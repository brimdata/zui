/* @flow */

import statsReceiver from "../receivers/statsReceiver"
import {completeMainSearch, requestMainSearch} from "../actions/mainSearch"
import {setNoticeError} from "../actions/notices"
import type {DateTuple} from "../lib/TimeWindow"
import Client, {Handler} from "boom-js-client"

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
    const request = this.api.search({space, string: program, timeWindow})
    callbacks(request)
    return request
      .each(statsReceiver(this.dispatch))
      .done(() => this.dispatch(completeMainSearch()))
      .error(_e => {
        this.dispatch(completeMainSearch())
        this.dispatch(
          setNoticeError("There's a problem talking with the server.")
        )
      })
  }
}
