import {useEffect, useLayoutEffect, useRef, useState} from "react"
import {useLocation} from "react-router"
import {useLocationState} from "src/js/components/hooks/use-location-state"
import {useUnmount} from "src/js/components/hooks/use-unmount"
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
    const container = api.container
    if (container) {
      const ids = getUnmeasuredIds()
      if (ids.length === 0) return
      const sizes = getMaxCellSizes(container, ids)
      api.setColumnWidths(sizes)
    }
  }

  useEffect(() => {
    measure()
  }, [end, api])

  return {
    setEnd,
  }
}
