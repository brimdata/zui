import React from "react"
import {createContext, ReactElement, useContext} from "react"
import {Table} from "@tanstack/react-table"

type ZedTableContextValue = {
  table: Table<any>
  headerHeight: number
  ref: React.MutableRefObject<HTMLDivElement | null>
  widths: Record<string, number>
  setWidths: (next: Record<string, number>) => void
}

const ZedTableContext = createContext<ZedTableContextValue | null>(null)

export function useZedTable() {
  const value = useContext(ZedTableContext)
  if (!value) throw new Error("Provide the zed table context value")
  else return value
}

export function Provider(props: {
  value: ZedTableContextValue
  children: ReactElement
}) {
  const {children, value} = props
  return (
    <ZedTableContext.Provider value={value}>
      {children}
    </ZedTableContext.Provider>
  )
}
