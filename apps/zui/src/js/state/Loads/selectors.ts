import {createSelector} from "@reduxjs/toolkit"
import {isEmpty, isNumber, sum} from "lodash"
import {State} from "../types"
import {slice} from "./slice"

export const wherePoolId = createSelector(
  slice.all,
  (_: State, poolId: string) => poolId,
  (loads, poolId) => loads.filter((load) => load.poolId === poolId)
)

export const getPoolProgress = createSelector(wherePoolId, (loads) => {
  const progresses = loads.map((l) => l.progress).filter((p) => isNumber(p))
  if (isEmpty(progresses)) return null
  // Not really accurate
  return sum(progresses) / progresses.length
})
