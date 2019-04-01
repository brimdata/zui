/* @flow */

import {deaggregate} from "./Program"
import Log from "../models/Log"

export default (program: string, log: Log) => {
  return deaggregate(program, log)
}
