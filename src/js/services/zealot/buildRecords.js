/* @flow */
import nestedRecord from "../../brim/flatRecordsBuffer/nestedRecord"

export default function buildRecords(input: *[]) {
  let types = {}

  let records = input.map((r) => {
    if (r.type) types[r.id] = r.type
    return nestedRecord(r.values, types[r.id]).flatten()
  })

  return {records, types}
}
