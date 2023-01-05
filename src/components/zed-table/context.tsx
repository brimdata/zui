import React from "react"
import {createContext, ReactElement, useContext} from "react"
import {ZedTableApi} from "./zed-table-api"

const ZedTableContext = createContext<ZedTableApi | null>(null)

export function useZedTable() {
  const value = useContext(ZedTableContext)
  if (!value) throw new Error("Provide the zed table context value")
  else return value
}

export function Provider(props: {value: ZedTableApi; children: ReactElement}) {
  const {children, value} = props
  return (
    <ZedTableContext.Provider value={value}>
      {children}
    </ZedTableContext.Provider>
  )
}
