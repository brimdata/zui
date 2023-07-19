export type SessionHistoryEntry = {
  queryId: string
  version: string
}

export type SessionHistoriesState = {
  [sessionId: string]: SessionHistoryEntry[]
}
