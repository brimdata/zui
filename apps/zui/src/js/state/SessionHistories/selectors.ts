import {SessionHistoriesState, SessionHistoryEntry} from "./types"

export const raw = (s): SessionHistoriesState => s.sessionHistories
export const getById =
  (sessionId: string) =>
  (s): SessionHistoryEntry[] =>
    s.sessionHistories[sessionId]
