/* @flow */

import type {$Column} from "../state/Columns/models/column"

const EXCLUDED = ["ts", "_td"]

export default (cols: $Column[]) => {
  // $FlowFixMe
  const orderedCols = cols.filter(({name}) => !EXCLUDED.includes(name))
  const ts = cols.find(({name}) => name === "ts")
  if (ts) {
    return [ts, ...orderedCols]
  } else {
    return orderedCols
  }
}
