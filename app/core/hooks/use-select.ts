import {useCallback} from "react"
import {useStore} from "react-redux"

export default function useSelect() {
  const store = useStore()
  const select = useCallback((selector) => selector(store.getState()), [store])
  return select
}
