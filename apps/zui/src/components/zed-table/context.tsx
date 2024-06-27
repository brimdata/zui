import React from "react"
import {createContext, ReactElement, useContext} from "react"
import {TableViewApi} from "src/zui-kit/core/table-view/table-view-api"

const ZedTableContext = createContext<TableViewApi | null>(null)

export function useZedTable() {
  const value = useContext(ZedTableContext)
  if (!value) throw new Error("Provide the zed table context value")
  else return value
}

export function Provider(props: {value: TableViewApi; children: ReactElement}) {
  const {children, value} = props
  return (
    <ZedTableContext.Provider value={value}>
      {children}
    </ZedTableContext.Provider>
  )
}
