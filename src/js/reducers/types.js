/* @flow */

import type {Notices} from "./notices"
import type {CountByTime} from "./countByTime"

export type State = {
  notices: Notices,
  countByTime: CountByTime
}
