import {EntityState} from "@reduxjs/toolkit"

export type LoadReference = {
  id: string
  poolId: string
  progress: number
}

export type LoadsState = EntityState<LoadReference>
