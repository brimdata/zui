/* @flow */

export type BrimErrorType =
  | "PCAPIngestError"
  | "NetworkError"
  | "LogsIngestError"

export type BrimError = {
  type: BrimErrorType,
  message: string,
  details?: string[]
}
