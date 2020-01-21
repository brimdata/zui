/* @flow */

import type {Descriptor, Tuple} from "../../types"
import type {
  LOG_DETAIL_BACK,
  LOG_DETAIL_FORWARD,
  LOG_DETAIL_PUSH
} from "./types"

export default {
  pushLogDetail: ({
    tuple,
    descriptor
  }: {
    tuple: Tuple,
    descriptor: Descriptor
  }): LOG_DETAIL_PUSH => ({
    type: "LOG_DETAIL_PUSH",
    tuple,
    descriptor
  }),

  backLogDetail: (): LOG_DETAIL_BACK => ({
    type: "LOG_DETAIL_BACK"
  }),

  forwardLogDetail: (): LOG_DETAIL_FORWARD => ({
    type: "LOG_DETAIL_FORWARD"
  })
}
