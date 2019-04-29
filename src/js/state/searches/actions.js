/* @flow */
import type {
  SEARCHES_CLEAR,
  SEARCH_REGISTER,
  SEARCH_RESULTS,
  SEARCH_RESULTS_CLEAR,
  SEARCH_STATS,
  SEARCH_STATUS,
  SearchResults,
  SearchStats,
  SearchStatus
} from "./types"
import BoomRequest from "../../BoomClient/lib/BoomRequest"
import createSearchObject from "./createSearchObject"

type RegOpts = {handler: BoomRequest, tag: string}

export function registerSearch(name: string, opts: RegOpts): SEARCH_REGISTER {
  return {
    type: "SEARCH_REGISTER",
    search: createSearchObject(name, opts.tag, opts.handler)
  }
}

export function setSearchStatus(
  name: string,
  status: SearchStatus
): SEARCH_STATUS {
  return {
    type: "SEARCH_STATUS",
    name,
    status
  }
}

export function setSearchStats(name: string, stats: SearchStats): SEARCH_STATS {
  return {
    type: "SEARCH_STATS",
    name,
    stats
  }
}

export function appendSearchResults(
  name: string,
  results: SearchResults
): SEARCH_RESULTS {
  return {
    type: "SEARCH_RESULTS",
    name,
    results
  }
}

export function clearSearches(tag?: string): SEARCHES_CLEAR {
  return {
    type: "SEARCHES_CLEAR",
    tag
  }
}

export function clearSearchResults(name: string): SEARCH_RESULTS_CLEAR {
  return {
    type: "SEARCH_RESULTS_CLEAR",
    name
  }
}
