import {MutableRefObject, useEffect} from "react"
import {InspectorProps} from "../types"

export function useInitialScrollPosition(
  ref: MutableRefObject<HTMLDivElement>,
  props: InspectorProps
) {
  useEffect(() => {
    const pos = props.initialScrollPosition
    const el = ref.current
    let id
    if (pos && el) {
      el.scrollTop = pos.top
      // First scroll down so that the rows can render, then scroll to the right
      id = setTimeout(() => {
        el.scrollLeft = pos.left
      })
    }
    return () => clearTimeout(id)
  }, [])
}
