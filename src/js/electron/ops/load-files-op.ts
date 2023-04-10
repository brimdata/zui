import {createOperation} from "../operations"

export const loadFilesOp = createOperation(
  "loadOperation" as const,
  (_, id: string) => {
    return id
  }
)

export type LoadFilesOp = typeof loadFilesOp
