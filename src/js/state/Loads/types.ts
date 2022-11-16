import {EntityState} from "@reduxjs/toolkit"

export type LoadReference = {
  id: string
  poolId: string
  progress: number
  warnings: string[]
}

export type LoadsState = EntityState<LoadReference>
