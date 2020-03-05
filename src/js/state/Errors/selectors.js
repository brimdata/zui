/* @flow */
import {map} from "lodash"
import type {State} from "../types"
import ErrorFactory from "../../models/ErrorFactory"

export default {
  getErrors(state: State) {
    return map(state.errors, (err) => ErrorFactory.create(err))
  }
}
