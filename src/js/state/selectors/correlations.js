/* @flow */

import {createSelector} from "reselect"
import get from "lodash/get"

import type {State} from "../state/reducers/types"
import {buildLogDetail} from "./logDetails"
import {getCorrelations} from "../state/reducers/correlations"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getDescriptors} from "../state/reducers/descriptors"
import {toFront} from "../lib/Array"
import Log from "../models/Log"

export const getLogCorrelations = createSelector<State, void, *, *, *, *, *>(
  buildLogDetail,
  getCorrelations,
  getDescriptors,
  getCurrentSpaceName,
  (log, correlations, descriptors, space) => {
    if (!log) return {}
    const rels = get(correlations, log.id(), {})

    return {
      uid: uidOrder(Log.buildAll(get(rels, "uid", []), descriptors, space)),
      md5: Log.build(get(rels, "md5", {tuples: []})),
      tx: Log.build(get(rels, "tx", {tuples: []})),
      rx: Log.build(get(rels, "rx", {tuples: []})),
      filenames: Log.build(get(rels, "filenames", {tuples: []}))
    }
  }
)

const uidOrder = (logs: Log[]) => {
  const findConn = (log) => log.get("_path") === "conn"
  return toFront(Log.sort(logs, "ts"), findConn)
}
