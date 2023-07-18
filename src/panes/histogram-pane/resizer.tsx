import DragAnchor from "src/js/components/DragAnchor"
import Layout from "src/js/state/Layout"
import {useRef} from "react"
import {useDispatch} from "react-redux"

export function Resizer(props: {element: HTMLElement}) {
  const dispatch = useDispatch()
  const start = useRef<number>(0)

  const onStart = () => {
    start.current = props.element.getBoundingClientRect().height
  }

  const onDrag = (e, {dy}) => {
    dispatch(Layout.setChartHeight(start.current + dy))
  }

  return <DragAnchor onStart={onStart} onDrag={onDrag} position="bottom" />
}
