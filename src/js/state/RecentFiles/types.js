/* @flow */

export type RecentFilesState = {[string]: number}
export type RecentFilesAction = RECENT_FILES_OPEN | RECENT_FILES_REMOVE

export type RECENT_FILES_OPEN = {
  type: "RECENT_FILES_OPEN",
  file: string,
  lastOpened: number
}

export type RECENT_FILES_REMOVE = {
  type: "RECENT_FILES_REMOVE",
  file: string
}
