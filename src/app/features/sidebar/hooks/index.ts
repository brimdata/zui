import useResizeObserver from "use-resize-observer"
import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"
import {DragItem, DragProps} from "src/app/features/import/use-import-on-drop"
import {useBrimApi} from "src/app/core/context"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "src/js/brim"
import Investigation from "src/js/state/Investigation"

export const useSectionTreeDefaults = () => {
  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>()
  return {
    resizeRef: ref,
    defaults: {
      indent: 16,
      getChildren: "items",
      isOpen: "isOpen",
      rowHeight: 28,
      width: width,
      height: height,
      hideRoot: true,
      disableDrag: true,
      disableDrop: true,
      openByDefault: true,
    },
  }
}

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

export const useSearchHistory = () => {
  const historyEntries = useSelector(Investigation.getCurrentHistory)

  return useMemo(() => {
    return [...historyEntries].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [historyEntries])
}
