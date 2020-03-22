/* @flow */

export type SearchBarState = {
  current: string,
  previous: string,
  pinned: string[],
  editing: null | number,
  error: null | string
}
export type SearchBarAction =
  | SEARCH_BAR_CLEAR
  | SEARCH_BAR_RESTORE
  | SEARCH_BAR_INPUT_CHANGE
  | SEARCH_BAR_PIN
  | SEARCH_BAR_PIN_EDIT
  | SEARCH_BAR_PIN_REMOVE
  | SEARCH_BAR_PIN_REMOVE_ALL
  | SEARCH_BAR_PINS_SET
  | SEARCH_BAR_PARSE_ERROR
  | SEARCH_BAR_SUBMIT

export type SEARCH_BAR_CLEAR = {
  type: "SEARCH_BAR_CLEAR"
}

export type SEARCH_BAR_RESTORE = {
  type: "SEARCH_BAR_RESTORE",
  value: SearchBarState
}

export type SEARCH_BAR_INPUT_CHANGE = {
  type: "SEARCH_BAR_INPUT_CHANGE",
  value: string
}

export type SEARCH_BAR_PIN = {
  type: "SEARCH_BAR_PIN"
}

export type SEARCH_BAR_PIN_EDIT = {
  type: "SEARCH_BAR_PIN_EDIT",
  index: number | null
}

export type SEARCH_BAR_PIN_REMOVE = {
  type: "SEARCH_BAR_PIN_REMOVE",
  index: number
}

export type SEARCH_BAR_PIN_REMOVE_ALL = {
  type: "SEARCH_BAR_PIN_REMOVE_ALL"
}

export type SEARCH_BAR_PINS_SET = {
  type: "SEARCH_BAR_PINS_SET",
  pinned: string[]
}

export type SEARCH_BAR_PARSE_ERROR = {
  type: "SEARCH_BAR_PARSE_ERROR",
  error: string
}

export type SEARCH_BAR_SUBMIT = {
  type: "SEARCH_BAR_SUBMIT",
  ts: number
}
