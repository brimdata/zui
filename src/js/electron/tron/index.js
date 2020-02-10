/* @flow */

import type {ReturnType} from "../../types"
import window from "./window"
import windowManager from "./windowManager"
import windowState from "./windowState"

export default {
  window,
  windowManager,
  windowState
}

export type $WindowManager = ReturnType<typeof windowManager>
