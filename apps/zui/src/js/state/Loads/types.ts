import {EntityState} from "@reduxjs/toolkit"

export type LoadReference = {
  id: string
  poolId: string
  progress: number
  files: string[]
  startedAt: string
  finishedAt: string | null
  abortedAt: string | null
  errors: string[]
}

export type LoadsState = EntityState<LoadReference>
