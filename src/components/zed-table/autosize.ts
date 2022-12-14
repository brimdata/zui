import {useEffect, useLayoutEffect, useState} from "react"
import {useZedTable} from "./context"
import {getMaxCellSizes} from "./utils"

type Sizes = Record<string, number>

export function useAutosize() {
  const api = useZedTable()
  let [end, setEndState] = useState<number>(-1)
  const setEnd = (index: number) => index > end && setEndState(index)

  const getUnmeasuredIds = () => {
    const sliced = api.columns.slice(0, end + 1)
    return sliced
      .filter((col) => !api.state.columnWidths.has(col.id))
      .map((col) => col.id)
  }

  const measure = () => {
    if (end <= 0) return
    const container = api.container
    if (container) {
      const ids = getUnmeasuredIds()
      if (ids.length === 0) return
      const sizes = getMaxCellSizes(container, ids)
      api.setColumnWidths(sizes)
      console.log(end, sizes)
    }
  }

  useLayoutEffect(() => {
    measure()
  }, [end, api])

  return {
    setEnd,
  }
}
