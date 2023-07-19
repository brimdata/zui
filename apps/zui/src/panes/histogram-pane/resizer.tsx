import DragAnchor from "src/js/components/DragAnchor"
import Layout from "src/js/state/Layout"
import {MutableRefObject, useRef} from "react"
import {useDispatch} from "react-redux"

export function Resizer(props: {outerRef: MutableRefObject<HTMLDivElement>}) {
  const dispatch = useDispatch()
  const start = useRef<number>(0)

  const onStart = () => {
    const element = props.outerRef.current
    if (element) {
      start.current = element.getBoundingClientRect().height
    } else {
      start.current = null
    }
  }

  const onDrag = (e, {dy}) => {
    if (start.current === null) return
    dispatch(Layout.setChartHeight(start.current + dy))
  }

  return <DragAnchor onStart={onStart} onDrag={onDrag} position="bottom" />
}
