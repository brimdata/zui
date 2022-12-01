import React from "react"
import {createContext, ReactElement, useContext} from "react"
import {TableInstance} from "react-table"

type ZedTableContextValue = {
  table: TableInstance
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
