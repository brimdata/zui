import {$Column} from "../state/Columns/models/column"

const EXCLUDED = ["ts", "_td", "event_type"]

export default (cols: $Column[]) => {
  let orderedCols = cols.filter(({name}) => !EXCLUDED.includes(name))
  const ts = cols.find(({name}) => name === "ts")
  const eventType = cols.find(({name}) => name === "event_type")

  if (eventType) orderedCols = [eventType, ...orderedCols]
  if (ts) orderedCols = [ts, ...orderedCols]
  return orderedCols
}
