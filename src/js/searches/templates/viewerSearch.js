/* @flow */

import {PER_PAGE} from "../../state/reducers/logViewer"
import type {SearchTemplate} from "../types"
import type {Span} from "../../BoomClient/types"
import {addHeadProc} from "../../lib/Program"
import viewerHandler from "../handlers/viewerHandler"

export function createViewerSearch(
  program: string,
  span: Span
): SearchTemplate {
  return {
    name: "ViewerSearch",
    tag: "viewer",
    program: addHeadProc(program, PER_PAGE),
    span,
    handlers: [viewerHandler]
  }
}
