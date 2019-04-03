/* @flow */

import type {ResultsTabEnum} from "../reducers/view"
import type {Space} from "../lib/Space"
import {analyticsMenu} from "./analyticsMenu"
import {logsMenu} from "./logsMenu"

export default function viewerMenu(
  program: string,
  space: Space,
  tab: ResultsTabEnum
) {
  if (tab === "analytics") {
    return analyticsMenu(program)
  } else {
    return logsMenu(program, space)
  }
}
