import React, {ReactElement, useContext, useEffect} from "react"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {Provider} from "react-redux"
import ZuiApi from "src/js/api/zui-api"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {Store} from "src/js/state/types"
import theme from "src/js/style-theme"
import {ThemeProvider} from "styled-components"

const ApiContext = React.createContext<ZuiApi | null>(null)

export function useZuiApi() {
  const value = useContext(ApiContext)
  if (!value) throw new Error("No Api Provided")
  return value
}

export function AppProvider(props: {
  store: Store
  api: ZuiApi
  children: ReactElement
}) {
  useEffect(() => {
    global.firstMount = true
  }, [])
  return (
    <AppErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <ApiContext.Provider value={props.api}>
          <Provider store={props.store}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
          </Provider>
        </ApiContext.Provider>
      </DndProvider>
    </AppErrorBoundary>
  )
}
