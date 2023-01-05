import {useState} from "react"
import {createZedTable} from "./create-zed-table"
import {ZedTableProps} from "./types"

export function useReactZedTable(opts: ZedTableProps) {
  const [api] = useState(() => ({
    current: createZedTable(opts),
  }))

  return api.current
}

// 1. Provide the state
// 2. Listen for when the state changes
// 3. Handle the appropriate state changes
// 4. Changes redux, re-renders the table
