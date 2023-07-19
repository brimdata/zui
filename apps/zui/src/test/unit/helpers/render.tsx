import {render as rtlRender} from "@testing-library/react"
import React, {ComponentType, ReactElement} from "react"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {AppProvider} from "src/app/core/context"

export function render(ui: ReactElement, {store, api}) {
  function Wrapper({children}) {
    return (
      <AppProvider store={store} api={api}>
        <>
          {children}
          <HTMLContextMenu />
        </>
      </AppProvider>
    )
  }

  return rtlRender(ui, {
    wrapper: Wrapper as ComponentType<React.PropsWithChildren<unknown>>,
  })
}
