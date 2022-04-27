import {
  FINDING_DELETE,
  INVESTIGATION_CLEAR,
  INVESTIGATION_PUSH,
  INVESTIGATION_LAKE_CLEAR,
} from "./types"
import {SearchRecord} from "../../types"
import {isArray} from "../../lib/is"
import brim, {Ts} from "../../brim"

export default {
  push: (
    lakeId: string,
    poolId: string,
    record: SearchRecord,
    ts: Ts = brim.time().toTs()
  ): INVESTIGATION_PUSH => ({
    type: "$INVESTIGATION_PUSH",
    lakeId,
    poolId,
    entry: record,
    ts: ts,
  }),

  deleteFindingByTs: (
    lakeId: string,
    poolId: string,
    ts: Ts[] | Ts
  ): FINDING_DELETE => ({
    type: "$FINDING_DELETE",
    lakeId,
    poolId,
    ts: isArray(ts) ? ts : [ts],
  }),

  clearPoolInvestigation: (
    lakeId: string,
    poolId: string
  ): INVESTIGATION_CLEAR => ({
    type: "$INVESTIGATION_CLEAR",
    lakeId,
    poolId,
  }),

  clearLakeInvestigation: (lakeId: string): INVESTIGATION_LAKE_CLEAR => ({
    type: "$INVESTIGATION_LAKE_CLEAR",
    lakeId,
  }),
}
