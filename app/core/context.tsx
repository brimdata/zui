import React, {ReactElement, useContext} from "react"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {Provider} from "react-redux"
import BrimApi from "src/js/api"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {Store} from "src/js/state/types"
import theme from "src/js/style-theme"
import {ThemeProvider} from "styled-components"

const BrimApiContext = React.createContext<BrimApi | null>(null)

export function useBrimApi() {
  const value = useContext(BrimApiContext)
  if (!value) throw new Error("No Brim Api Provided")
  return value
}

export function BrimProvider(props: {
  store: Store
  api: BrimApi
  children: ReactElement
}) {
  return (
    <AppErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <BrimApiContext.Provider value={props.api}>
          <Provider store={props.store}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
          </Provider>
        </BrimApiContext.Provider>
      </DndProvider>
    </AppErrorBoundary>
  )
}
