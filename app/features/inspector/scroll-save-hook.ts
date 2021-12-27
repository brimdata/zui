import {throttle} from "lodash"
import {useCallback} from "react"
import activeTabSelect from "src/js/state/Tab/activeTabSelect"
import Slice from "src/js/state/Inspector"
import {useDispatch, useStore} from "react-redux"

const useSelect = (fn) => {
  const store = useStore()
  return fn(store.getState())
}

const getScrollTop = activeTabSelect((tab) => tab.inspector.scrollTop)

export function useScrollSave() {
  const dispatch = useDispatch()

  const onScroll = useCallback(
    throttle((args) => dispatch(Slice.setScrollTop(args.scrollOffset)), 1000, {
      leading: false
    }),
    []
  )

  const scrollTop = useSelect(getScrollTop)

  return [scrollTop, onScroll]
}
