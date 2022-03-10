import {MutableRefObject} from "react"
import useListener from "src/js/components/hooks/useListener"
import {InspectorProps} from "../types"

export function useOnScroll(
  ref: MutableRefObject<HTMLDivElement>,
  props: InspectorProps
) {
  const onScroll = () => {
    if (props.onScroll && ref.current) {
      const top = ref.current.scrollTop
      const left = ref.current.scrollLeft
      props.onScroll({top, left})
    }
  }

  useListener(ref.current, "scroll", onScroll)
}
