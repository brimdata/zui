import {useCallback} from "react"
import {useStore} from "react-redux"

/**
 * This is useful when you need to select from the state
 * inside an event handler. The component doesn't need to
 * re-render when the selected state changes, it only
 * needs to grab it once in the event handler.
 */
export default function useSelect() {
  const store = useStore()
  const select = useCallback((selector) => selector(store.getState()), [store])
  return select
}
