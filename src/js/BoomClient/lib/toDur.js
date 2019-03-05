/* @flow */

import {msToTs} from "./time"

export default ([from, to]: [Date, Date]) => {
  return msToTs(to - from)
}
