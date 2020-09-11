import {SearchBarAction, SearchBarState} from "./types"
import {indexInBounds} from "../../lib/Array"
import {onlyWhitespace} from "../../lib/Str"

const init: SearchBarState = {
  current: "",
  previous: "",
  pinned: [],
  editing: null,
  error: null,
  target: "events"
}

export default function reducer(
  state: SearchBarState = init,
  action: SearchBarAction
): SearchBarState {
  switch (action.type) {
    case "SEARCH_BAR_CLEAR":
      return {...init}

    case "SEARCH_BAR_RESTORE":
      return {
        ...state,
        ...action.value
      }

    case "SEARCH_BAR_TARGET_SET":
      return {
        ...state,
        target: action.target
      }

    case "SEARCH_BAR_INPUT_CHANGE":
      if (state.editing === null) {
        return {
          ...state,
          current: action.value
        }
      } else {
        const newPins = [...state.pinned]
        newPins[state.editing] = action.value
        return {
          ...state,
          current: action.value,
          pinned: newPins
        }
      }

    case "SEARCH_BAR_PIN":
      if (onlyWhitespace(state.current)) return state
      else
        return {
          ...state,
          pinned: [...state.pinned, state.current],
          current: "",
          previous: "",
          editing: null
        }

    case "SEARCH_BAR_PIN_EDIT":
      if (action.index === null) {
        return {
          ...state,
          current: state.previous,
          editing: null
        }
      }

      if (indexInBounds(action.index, state.pinned)) {
        return {
          ...state,
          current: state.pinned[action.index],
          editing: action.index
        }
      } else {
        throw new Error(
          `Trying to edit a pin that does not exist: ${action.index}`
        )
      }

    case "SEARCH_BAR_PIN_REMOVE":
      var removeIndex = action.index

      if (indexInBounds(removeIndex, state.pinned)) {
        return {
          ...state,
          pinned: state.pinned.filter((_e, i) => i != removeIndex),
          editing: null
        }
      } else if (action.index === null) {
        return {
          ...state,
          current: "",
          editing: null,
          previous: ""
        }
      } else {
        throw new Error(
          `Trying to remove a pin that does not exist: ${action.index}`
        )
      }

    case "SEARCH_BAR_PIN_REMOVE_ALL":
      return {
        ...state,
        editing: null,
        pinned: [],
        previous: ""
      }

    case "SEARCH_BAR_SUBMIT":
      if (state.editing === null) {
        return {
          ...state,
          previous: state.current,
          pinned: state.pinned.filter((s) => !onlyWhitespace(s)),
          error: null
        }
      } else {
        if (state.pinned.some(onlyWhitespace)) {
          return {
            ...state,
            editing: null,
            current: state.previous,
            pinned: state.pinned.filter((s) => !onlyWhitespace(s)),
            error: null
          }
        }
        return {
          ...state,
          error: null
        }
      }

    case "SEARCH_BAR_PINS_SET":
      return {
        ...state,
        pinned: [...action.pinned],
        previous: "",
        editing: null,
        current: ""
      }

    case "SEARCH_BAR_PARSE_ERROR":
      return {
        ...state,
        error: action.error
      }

    default:
      return state
  }
}
