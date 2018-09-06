export const changeSearchBarInput = value => ({
  type: "SEARCH_BAR_INPUT_CHANGE",
  value
})

export const pinSearchBar = () => ({
  type: "SEARCH_BAR_PIN"
})

export const editSearchBarPin = index => ({
  type: "SEARCH_BAR_PIN_EDIT",
  index
})

export const removeSearchBarPin = index => ({
  type: "SEARCH_BAR_PIN_REMOVE",
  index
})

export const setSearchBarPins = pinned => ({
  type: "SEARCH_BAR_PINS_SET",
  pinned
})

export const appendQueryInclude = (name, value) => ({
  type: "QUERY_INCLUDE_APPEND",
  name,
  value
})

export const appendQueryExclude = (name, value) => ({
  type: "QUERY_EXCLUDE_APPEND",
  name,
  value
})

export const appendQueryCountBy = name => ({
  type: "QUERY_COUNT_BY_APPEND",
  name
})
