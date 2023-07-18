import DragAnchor from "src/js/components/DragAnchor"
import Layout from "src/js/state/Layout"
import {useRef} from "react"
import useSelect from "src/app/core/hooks/use-select"
import {useDispatch} from "react-redux"

export function Resizer() {
  const dispatch = useDispatch()
  const select = useSelect()
  const start = useRef<number>(0)

  const onStart = () => {
    start.current = select(Layout.getChartHeight)
  }

  const onDrag = (e, {dy}) => {
    dispatch(Layout.setChartHeight(start.current + dy))
  }

  return <DragAnchor onStart={onStart} onDrag={onDrag} position="bottom" />
}
