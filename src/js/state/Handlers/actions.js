/* @flow */

import type {
  HANDLERS_ABORT,
  HANDLERS_ABORT_ALL,
  HANDLERS_REGISTER,
  HANDLERS_REMOVE
} from "./types"
import BoomRequest from "../../services/BoomClient/lib/BoomRequest"

export default {
  register(id: string, handler: BoomRequest): HANDLERS_REGISTER {
    return {type: "HANDLERS_REGISTER", id, handler}
  },

  abort(id: string, emit: boolean = true): HANDLERS_ABORT {
    return {type: "HANDLERS_ABORT", id, emit}
  },

  remove(id: string): HANDLERS_REMOVE {
    return {type: "HANDLERS_REMOVE", id}
  },

  abortAll(emit: boolean = true): HANDLERS_ABORT_ALL {
    return {type: "HANDLERS_ABORT_ALL", emit}
  }
}
