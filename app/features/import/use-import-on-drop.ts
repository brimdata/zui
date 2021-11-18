import {useBrimApi} from "app/core/context"
import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"

type DragItem = {files: File[]; items: DataTransferItemList}
type DragProps = {isOver: boolean; canDrop: boolean}

export function useImportOnDrop() {
  const api = useBrimApi()
  return useDrop<DragItem, unknown, DragProps>(() => ({
    accept: [NativeTypes.FILE],
    drop: (thing) => {
      const files = thing.files
      if (files && files.length) {
        api.import(files)
      }
    },
    collect: (m) => ({
      isOver: m.isOver(),
      canDrop: m.canDrop()
    })
  }))
}
