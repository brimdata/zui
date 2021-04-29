export type BrimErrorType =
  | "PCAPIngestError"
  | "NetworkError"
  | "LogsIngestError"
  | "PoolDeletedError"

export type BrimError = {
  type: BrimErrorType
  message: string
  details?: string[]
}
