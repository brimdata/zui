import {map} from "lodash"

import {BrimError} from "../../errors/types"
import {State} from "../types"
import ErrorFactory from "../../models/ErrorFactory"

export default {
  getErrors(state: State): BrimError[] {
    return map(state.errors, (err) => ErrorFactory.create(err))
  }
}
