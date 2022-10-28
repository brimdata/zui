import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"
import {DragItem, DragProps} from "src/app/features/import/use-import-on-drop"
import {useBrimApi} from "src/app/core/context"

export const useQueryImportOnDrop = () => {
  const api = useBrimApi()
  return useDrop<DragItem, unknown, DragProps>(() => ({
    accept: [NativeTypes.FILE],
    drop: ({files}) => {
      if (files && files[0]) {
        api.queries.import(files[0])
      }
    },
    collect: (m) => ({
      isOver: m.isOver(),
      canDrop: m.canDrop(),
    }),
  }))
}
