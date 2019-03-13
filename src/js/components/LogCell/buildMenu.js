/* @flow */

import type {ResultsTabEnum} from "../../reducers/view"
import type {Space} from "../../lib/Space"
import Field from "../../models/Field"
import Log from "../../models/Log"
import buildAnalyticRightClickMenu from "./buildAnalyticRightClickMenu"
import buildLogRightClickMenu from "./buildLogRightClickMenu"

type Args = {
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
