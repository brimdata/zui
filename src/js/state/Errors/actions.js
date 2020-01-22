/* @flow */

import type {ERRORS_CLEAR, ERROR_CREATE} from "./types"
import ErrorFactory from "../../models/ErrorFactory"

export default {
  createError(raw: any): ERROR_CREATE {
    return {type: "ERROR_CREATE", error: ErrorFactory.create(raw)}
  },

  clearErrors(): ERRORS_CLEAR {
    return {type: "ERRORS_CLEAR"}
  }
}
