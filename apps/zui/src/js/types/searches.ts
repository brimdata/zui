export type SearchStatus = "FETCHING" | "SUCCESS" | "ERROR" | "INIT" | "ABORTED"

export type SearchStats = {
  updateTime: number
  startTime: number
  bytesMatched: number
  bytesRead: number
  tuplesMatched: number
  tuplesRead: number
}
