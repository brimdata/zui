import React, {ReactNode, useContext} from "react"
import {ActiveQuery} from "src/app/core/models/active-query"

const TitleBarContext = React.createContext<ActiveQuery | null>(null)

export function useActiveQuery() {
  const ctx = useContext(TitleBarContext)
  if (ctx === null) {
    throw new Error("Need to provide title bar context a value")
  } else {
    return ctx
  }
}

type Props = {
  activeQuery: ActiveQuery
  children: ReactNode
}

export function TitleBarProvider(props: Props) {
  return (
    <TitleBarContext.Provider value={props.activeQuery}>
      {props.children}
    </TitleBarContext.Provider>
  )
}
