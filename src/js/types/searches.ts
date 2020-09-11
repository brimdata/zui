export type SearchStatus = "FETCHING" | "SUCCESS" | "ERROR" | "INIT"

export type SearchStats = {
  updateTime: number
  startTime: number
  bytesMatched: number
  bytesRead: number
  tuplesMatched: number
  tuplesRead: number
}
