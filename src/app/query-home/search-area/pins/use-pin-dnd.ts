import {rectangularSelection} from "@codemirror/rectangular-selection"
import {useRef} from "react"
import {useDrag, useDrop} from "react-dnd"
import {useDispatch} from "src/app/core/state"
import mergeRefs from "src/app/core/utils/merge-refs"
import Editor from "src/js/state/Editor"

export function usePinContainerDnd() {
  const [_, ref] = useDrop({accept: "PIN"})
  return ref
}

export default function usePinDnd(index: number) {
  const dispatch = useDispatch()
  const ref = useRef<HTMLElement>()
  const [_, drag] = useDrag({
    type: "PIN",
    end: () => {
      dispatch(Editor.dropPin(index))
    }
  })
  const [_c, drop] = useDrop<null, unknown, unknown>({
    accept: "PIN",
    hover: (_item, monitor) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const offset = monitor.getClientOffset()
      const x = offset.x - rect.x
      const y = offset.y - rect.y
      const toLeft = x < rect.width / 2
      const hoverIndex = toLeft ? index : index + 1
      dispatch(Editor.hoverOverPin(hoverIndex))
    }
  })
  return mergeRefs(drag, drop, ref)
}
