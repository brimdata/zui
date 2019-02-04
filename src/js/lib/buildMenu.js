/* @flow */

import type {Space} from "../lib/Space"
import Log from "../models/Log"
import Field from "../models/Field"
import {type ResultsTabEnum} from "../reducers/view"
import buildLogRightClickMenu from "./buildLogRightClickMenu"
import buildAnalyticRightClickMenu from "./buildAnalyticRightClickMenu"

type Args = {
  dispatch: Function,
  field: Field,
  log: Log,
  space: Space,
  resultType: ResultsTabEnum
}

export default (args: Args) => {
  if (args.resultType === "logs") {
    return buildLogRightClickMenu(args)
  } else {
    return buildAnalyticRightClickMenu(args)
  }
}
