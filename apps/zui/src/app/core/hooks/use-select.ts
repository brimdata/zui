import {useStore} from "react-redux"
import {State} from "src/js/state/types"

/**
 * This is useful when you need to select from the state
 * inside an event handler. The component doesn't need to
 * re-render when the selected state changes, it only
 * needs to grab it once in the event handler.
 */
export default function useSelect() {
  const store = useStore<State>()
  function select<T extends (...args: any) => any>(selector: T): ReturnType<T> {
    return selector(store.getState())
  }
  return select
}
