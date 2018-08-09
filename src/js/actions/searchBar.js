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
