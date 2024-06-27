import {useEffect, useMemo} from "react"
import Slice from "src/js/state/Table"
import {useResultsPaneContext} from "./context"
import useSelect from "src/util/hooks/use-select"

export function useScrollPosition(table) {
  const ctx = useResultsPaneContext()
  const select = useSelect()
  useEffect(() => {
    const pos = select(Slice.getScrollPosition)
    table?.scrollTo(pos)
  }, [ctx.key])

  return useMemo(() => select(Slice.getScrollPosition), [])
}
