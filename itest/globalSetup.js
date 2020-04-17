/* @flow */

// $FlowFixMe
import "regenerator-runtime/runtime"

import {LOGDIR} from "./lib/log"
import {remove} from "fs-extra"

module.exports = async () => {
  return await remove(LOGDIR)
}
