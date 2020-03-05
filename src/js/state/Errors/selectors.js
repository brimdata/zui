/* @flow */
import {map} from "lodash"
import type {State} from "../types"
import ErrorFactory from "../../models/ErrorFactory"
import AppError from "../../models/AppError"

export default {
  getErrors(state: State): AppError[] {
    return map(state.errors, (err) => ErrorFactory.create(err))
  }
}
