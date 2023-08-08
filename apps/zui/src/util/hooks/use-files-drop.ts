import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"

type DragItem = {files: File[]; items: DataTransferItemList}
type DragProps = {isOver: boolean; canDrop: boolean}

type Props = {
  onDrop: (files: File[]) => void
}

export function useFilesDrop({onDrop}: Props) {
  return useDrop<DragItem, unknown, DragProps>(
    () => ({
      accept: [NativeTypes.FILE],
      drop: ({files}) => {
        if (files && files.length) onDrop(files)
      },
      collect: (m) => ({
        isOver: m.isOver(),
        canDrop: m.canDrop(),
      }),
    }),
    [onDrop]
  )
}
