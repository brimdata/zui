import DragAnchor from "src/components/drag-anchor"
import {useDispatch} from "../core/state"
import Layout from "src/js/state/Layout"
import {useRef} from "react"
import useSelect from "../core/hooks/use-select"

export function EditorResizer() {
  const dispatch = useDispatch()
  const select = useSelect()
  const start = useRef<number>(0)

  const onStart = () => {
    start.current = select(Layout.getEditorHeight)
  }

  const onDrag = (e, {dy}) => {
    dispatch(Layout.setEditorHeight(start.current + dy))
  }

  return <DragAnchor onDrag={onDrag} onStart={onStart} position="bottom" />
}
