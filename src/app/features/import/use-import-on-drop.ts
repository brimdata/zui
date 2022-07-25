import {useBrimApi} from "src/app/core/context"
import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"

export type DragItem = {files: File[]; items: DataTransferItemList}
export type DragProps = {isOver: boolean; canDrop: boolean}

export function useImportOnDrop() {
  const api = useBrimApi()
  return useDrop<DragItem, unknown, DragProps>(() => ({
    accept: [NativeTypes.FILE],
    drop: ({files}) => {
      if (files && files.length) {
        api.pools.load(files)
      }
    },
    collect: (m) => ({
      isOver: m.isOver(),
      canDrop: m.canDrop(),
    }),
  }))
}
