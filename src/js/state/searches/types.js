/* @flow */
import type {Descriptors, Tuples} from "../../types"
import Handler from "../../BoomClient/lib/Handler"

export type SearchesState = {[string]: Search}

export type SearchStatus = "FETCHING" | "SUCCESS" | "ERROR" | "ABORTED"

export type SearchTag = "viewer" | "detail"

export type SearchStats = {
  updateTime: number,
  startTime: number,
  bytesMatched: number,
  bytesRead: number,
  tuplesMatched: number,
  tuplesRead: number
}

export type SearchResults = {
  tuples: {[string]: Tuples},
  descriptors: Descriptors
}

export type Search = {
  name: string,
  status: SearchStatus,
  handler: Handler,
  stats: SearchStats,
  tag: SearchTag,
  results: SearchResults
}

export type SEARCH_REGISTER = {
  type: "SEARCH_REGISTER",
  search: Search
}

export type SEARCH_STATUS = {
  type: "SEARCH_STATUS",
  name: string,
  status: SearchStatus
}

export type SEARCH_STATS = {
  type: "SEARCH_STATS",
  name: string,
  stats: SearchStats
}

export type SEARCH_RESULTS = {
  type: "SEARCH_RESULTS",
  name: string,
  results: SearchResults
}

export type SEARCHES_CLEAR = {
  type: "SEARCHES_CLEAR",
  tag?: SearchTag
}
