/* @flow */
import {map} from "lodash"

import type {BrimError} from "../../errors/types"
import type {State} from "../types"
import ErrorFactory from "../../models/ErrorFactory"

export default {
  getErrors(state: State): BrimError[] {
    return map(state.errors, (err) => ErrorFactory.create(err))
  }
}
