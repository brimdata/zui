import {createReducer} from "@reduxjs/toolkit"
import {indexInBounds} from "../../lib/Array"
import {onlyWhitespace} from "../../lib/Str"
import {
  SearchBarState,
  SEARCH_BAR_INPUT_CHANGE,
  SEARCH_BAR_PARSE_ERROR,
  SEARCH_BAR_PINS_SET,
  SEARCH_BAR_PIN_EDIT,
  SEARCH_BAR_PIN_REMOVE,
  SEARCH_BAR_RESTORE,
} from "./types"

const init: SearchBarState = {
  current: null,
  pinned: [],
  error: null,
}

const reducer = createReducer(init, (builder) => {
  builder.addCase("SEARCH_BAR_CLEAR", (_) => {
    return {...init}
  })

  builder.addCase("SEARCH_BAR_RESTORE", (state, action: SEARCH_BAR_RESTORE) => {
    return {...state, ...action.value}
  })

  builder.addCase(
    "SEARCH_BAR_INPUT_CHANGE",
    (state, action: SEARCH_BAR_INPUT_CHANGE) => {
      state.current = action.value
    }
  )

  builder.addCase(
    "SEARCH_BAR_PIN_EDIT",
    (state, {index, value}: SEARCH_BAR_PIN_EDIT) => {
      if (indexInBounds(index, state.pinned)) {
        if (value.trim() === "") {
          state.pinned.splice(index, 1)
        } else {
          state.pinned[index] = value
        }
      }
    }
  )

  builder.addCase("SEARCH_BAR_PIN", (state) => {
    if (onlyWhitespace(state.current)) return
    state.pinned.push(state.current)
    state.current = ""
  })

  builder.addCase(
    "SEARCH_BAR_PIN_REMOVE",
    (state, action: SEARCH_BAR_PIN_REMOVE) => {
      state.pinned.splice(action.index, 1)
    }
  )

  builder.addCase("SEARCH_BAR_PIN_REMOVE_ALL", (state) => {
    state.pinned = []
  })

  builder.addCase(
    "SEARCH_BAR_PINS_SET",
    (state, {pinned}: SEARCH_BAR_PINS_SET) => {
      state.pinned = pinned
    }
  )

  builder.addCase(
    "SEARCH_BAR_PARSE_ERROR",
    (state, {error}: SEARCH_BAR_PARSE_ERROR) => {
      state.error = error
    }
  )
})

export default reducer
