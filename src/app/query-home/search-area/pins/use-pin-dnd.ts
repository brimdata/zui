import {useDrag, useDrop} from "react-dnd"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"

export default function usePinDnd(index: number) {
  const dispatch = useDispatch()
  const [_, drag] = useDrag({
    type: "PIN",
    item: {index}
  })
  const [_c, drop] = useDrop<{index: number}, unknown, unknown>({
    accept: "PIN",
    hover: (item, monitor) => {
      dispatch(Editor.hoverOverPin(index))
    },
    drop: (item) => {
      dispatch(Editor.dropPin(item.index))
    }
  })
  return (n) => drag(drop(n))
}
