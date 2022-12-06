import {useEffect, useLayoutEffect, useRef, useState} from "react"
import {useLocation} from "react-router"
import {useLocationState} from "src/js/components/hooks/use-location-state"
import {useUnmount} from "src/js/components/hooks/use-unmount"
import {useZedTable} from "./context"
import {getMaxCellSizes} from "./utils"

type Sizes = Record<string, number>

export function useAutosize() {
  const {table, ref, widths, setWidths} = useZedTable()
  const updateTable = (sizes: Sizes) => {
    table.setColumnSizing((prev) => ({...prev, ...sizes}))
  }

  const cache = useRef<Sizes>(widths)
  useUnmount(() => {
    setWidths(cache.current)
  })

  const updateCache = (sizes: Sizes) => {
    cache.current = {...cache.current, ...sizes}
  }
  const clearCache = () => {
    cache.current = {}
  }

  let [end, setEndState] = useState<number>(0)
  const setEnd = (index: number) => {
    if (index > end) setEndState(index)
  }

  const getUnmeasuredIds = () => {
    return table
      .getAllColumns()
      .slice(0, end)
      .filter((col) => !(col.id in cache.current))
      .map((col) => col.id)
  }

  const measure = () => {
    const container = ref.current
    if (container) {
      const ids = getUnmeasuredIds()
      if (ids.length === 0) return
      const sizes = getMaxCellSizes(container, ids)
      updateCache(sizes)
      updateTable(sizes)
    }
  }

  useEffect(() => {
    measure()
  }, [end])

  useLayoutEffect(() => {
    clearCache()
    measure()
  }, [table.getAllColumns()])

  return {
    setEnd,
  }
}
