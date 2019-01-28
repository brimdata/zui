/* @flow */

import {type ErrorMessage} from "../types"
import LookytalkVersionErrorMessage from "./LookytalkVersionErrorMessage"
import DefaultErrorMessage from "./DefaultErrorMessage"

export default (message: ErrorMessage) => {
  switch (message.type) {
    case "LookytalkVersionError":
      return LookytalkVersionErrorMessage
    default:
      return DefaultErrorMessage
  }
}
