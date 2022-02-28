import {render as rtlRender} from "@testing-library/react"
import AppTabsRouter from "src/app/router/app-tabs-router"
import WindowRouter from "src/app/router/app-window-router"
import React, {ComponentType, ReactElement} from "react"
import {Provider} from "react-redux"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import theme from "src/js/style-theme"
import {ThemeProvider} from "styled-components"

function getRouter() {
  if (global.windowName === "detail") return WindowRouter
  if (global.windowName === "search") return AppTabsRouter
  return NoRouter
}

function NoRouter({children}) {
  return children
}

export function render(ui: ReactElement, {store}) {
  function Wrapper({children}) {
    const Router = getRouter()
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>{children}</Router>
          <HTMLContextMenu />
        </ThemeProvider>
      </Provider>
    )
  }

  return rtlRender(ui, {wrapper: Wrapper as ComponentType})
}
