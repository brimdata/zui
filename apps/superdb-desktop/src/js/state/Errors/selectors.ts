import {map} from "lodash"

import {ErrorData} from "../../errors/types"
import {State} from "../types"
import ErrorFactory from "../../models/ErrorFactory"

export default {
  getErrors(state: State): ErrorData[] {
    return map(state.errors, (err) => ErrorFactory.create(err))
  },
}
